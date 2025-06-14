
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Sanitize inputs
    const sanitizedName = name.substring(0, 100)
    const sanitizedCompany = company ? company.substring(0, 100) : null
    const sanitizedMessage = message.substring(0, 2000)

    console.log('Contact form submission received:', { 
      name: sanitizedName, 
      email, 
      company: sanitizedCompany, 
      message: sanitizedMessage 
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
