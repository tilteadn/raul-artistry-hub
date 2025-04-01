
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactFormData = await req.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Log for debugging
    console.log(`Sending email from ${name} (${email}): ${subject}`);

    try {
      const artistEmailHtml = `
        <h2>New contact from website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `;

      const confirmationEmailHtml = `
        <h2>Thank you for your message!</h2>
        <p>Dear ${name},</p>
        <p>This is a confirmation that we have received your message. We will get back to you as soon as possible.</p>
        <p>Best regards,<br>Raúl Álvarez</p>
      `;

      // Use EmailJS service to send emails
      // Replace with your EmailJS service ID, template ID, and user ID
      const emailjsServiceId = "service_kgsdwuo";
      const emailjsUserId = "BcWH57i7s_-f60m_l";
      
      // Send email to artist
      const artistEmailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          user_id: emailjsUserId,
          template_id: "template_8jtolrm", // Template for artist notification
          template_params: {
            to_email: "raulalvarezjimenez@hotmail.com",
            from_name: name,
            from_email: email,
            subject: `Web Contact: ${subject}`,
            message: message,
            reply_to: email
          }
        })
      });

      if (!artistEmailResponse.ok) {
        throw new Error(`EmailJS artist notification failed: ${await artistEmailResponse.text()}`);
      }
      
      console.log("Artist email sent successfully");
      
      // Send confirmation email to contact
      const confirmationEmailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          user_id: emailjsUserId,
          template_id: "template_75q0r4j", // Template for confirmation email
          template_params: {
            to_name: name,
            to_email: email,
            message: "Thank you for contacting me. I will get back to you as soon as possible.",
            subject: "Thank you for contacting Raúl Álvarez",
            reply_to: "raulalvarezjimenez@hotmail.com"
          }
        })
      });

      if (!confirmationEmailResponse.ok) {
        throw new Error(`EmailJS confirmation email failed: ${await confirmationEmailResponse.text()}`);
      }
      
      console.log("Confirmation email sent successfully");

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Contact message received. We'll be in touch soon." 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      throw emailError;
    }
  } catch (error) {
    console.error("Error processing contact request:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process contact request", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
