
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
      // Updated EmailJS service configuration with your credentials
      const emailjsServiceId = "service_dbp59e9";
      const emailjsUserId = "chx-roi_Po5TumXx8";
      const emailjsTemplateId = "cutomer.template";
      
      // Send email using the provided template
      // This template is configured to send to the customer and CC the artist
      const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          user_id: emailjsUserId,
          template_id: emailjsTemplateId,
          template_params: {
            to_name: name,
            to_email: email,
            from_name: "Raúl Álvarez",
            subject: `Web Contact: ${subject}`,
            message: message,
            reply_to: "raulalvarezjimenez@hotmail.com",
            user_email: email,
            user_name: name,
            user_subject: subject,
            user_message: message
          }
        })
      });

      if (!emailResponse.ok) {
        const responseText = await emailResponse.text();
        console.error("EmailJS email failed:", responseText);
        throw new Error(`EmailJS email failed: ${responseText}`);
      }
      
      console.log("Email sent successfully");

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
