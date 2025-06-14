
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { name, email, company, message } = await req.json()

  // If no API key is configured, just log and return success
  if (!RESEND_API_KEY) {
    console.log('Contact form submission received:', { name, email, company, message })
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Form saved successfully. Email service not configured.' 
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  }

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com', // You'll need to update this with your verified domain
        to: ['your-email@example.com'], // Update with your actual email
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
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
      { headers: { "Content-Type": "application/json" } }
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
        headers: { "Content-Type": "application/json" } 
      }
    )
  }
})
