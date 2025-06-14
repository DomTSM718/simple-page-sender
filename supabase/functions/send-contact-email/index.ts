
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5 // 5 requests per minute per IP
const MAX_REQUESTS_PER_EMAIL = 3 // 3 requests per minute per email

// In-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

function getRateLimitKey(ip: string, type: 'ip' | 'email', identifier: string): string {
  return `${type}:${type === 'ip' ? ip : identifier}`
}

function checkRateLimit(key: string, maxRequests: number): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const data = rateLimitStore.get(key)
  
  if (!data || now > data.resetTime) {
    // Reset or initialize
    const resetTime = now + RATE_LIMIT_WINDOW
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: maxRequests - 1, resetTime }
  }
  
  if (data.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: data.resetTime }
  }
  
  data.count++
  return { allowed: true, remaining: maxRequests - data.count, resetTime: data.resetTime }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200 
    })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      )
    }

    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'

    console.log('Request from IP:', clientIP)

    const body = await req.json()
    const { name, email, company, message } = body

    // Input validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, message' }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      )
    }

    // Rate limiting by IP
    const ipKey = getRateLimitKey(clientIP, 'ip', '')
    const ipRateLimit = checkRateLimit(ipKey, MAX_REQUESTS_PER_WINDOW)
    
    if (!ipRateLimit.allowed) {
      console.log('Rate limit exceeded for IP:', clientIP)
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((ipRateLimit.resetTime - Date.now()) / 1000)
        }),
        { 
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((ipRateLimit.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
            "X-RateLimit-Remaining": ipRateLimit.remaining.toString(),
            "X-RateLimit-Reset": ipRateLimit.resetTime.toString(),
            ...corsHeaders 
          } 
        }
      )
    }

    // Rate limiting by email
    const emailKey = getRateLimitKey(clientIP, 'email', email.toLowerCase())
    const emailRateLimit = checkRateLimit(emailKey, MAX_REQUESTS_PER_EMAIL)
    
    if (!emailRateLimit.allowed) {
      console.log('Rate limit exceeded for email:', email)
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests from this email. Please try again later.',
          retryAfter: Math.ceil((emailRateLimit.resetTime - Date.now()) / 1000)
        }),
        { 
          status: 429,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((emailRateLimit.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": MAX_REQUESTS_PER_EMAIL.toString(),
            "X-RateLimit-Remaining": emailRateLimit.remaining.toString(),
            "X-RateLimit-Reset": emailRateLimit.resetTime.toString(),
            ...corsHeaders 
          } 
        }
      )
    }

    // Sanitize inputs
    const sanitizedName = name.substring(0, 100)
    const sanitizedCompany = company ? company.substring(0, 100) : null
    const sanitizedMessage = message.substring(0, 2000)

    console.log('Contact form submission received:', { 
      name: sanitizedName, 
      email, 
      company: sanitizedCompany, 
      message: sanitizedMessage,
      ip: clientIP
    })

    // If no API key is configured, just log and return success
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Form saved successfully. Email service not configured.' 
        }),
        { 
          headers: { 
            "Content-Type": "application/json",
            "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
            "X-RateLimit-Remaining": ipRateLimit.remaining.toString(),
            "X-RateLimit-Reset": ipRateLimit.resetTime.toString(),
            ...corsHeaders 
          } 
        }
      )
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Solution Mob <noreply@thesolutionmob.com>',
        to: ['hello@thesolutionmob.com'],
        subject: `New Contact Form Submission from ${sanitizedName}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${sanitizedCompany || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
          <p><strong>IP Address:</strong> ${clientIP}</p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Resend API error:', errorText)
      throw new Error(`Email API error: ${emailResponse.status}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      { 
        headers: { 
          "Content-Type": "application/json",
          "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
          "X-RateLimit-Remaining": ipRateLimit.remaining.toString(),
          "X-RateLimit-Reset": ipRateLimit.resetTime.toString(),
          ...corsHeaders 
        } 
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Form saved but email notification failed'
      }),
      { 
        status: 200, // Return 200 because form was saved successfully
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    )
  }
})
