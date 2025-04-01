
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
      // Create a new SMTP client
      const client = new SmtpClient();
      
      try {
        // Connect to Gmail's SMTP server
        await client.connectTLS({
          hostname: "smtp.gmail.com",
          port: 465,
          username: "mailsenderwebraul@gmail.com",
          password: "harj zozg ppkc xxwq", // App password
        });

        // Email content
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

        // Send email to the artist
        await client.send({
          from: "mailsenderwebraul@gmail.com",
          to: "raulalvarezjimenez@hotmail.com", // Send to the artist's actual email
          subject: `Web Contact: ${subject}`,
          html: artistEmailHtml,
        });

        console.log("Artist email sent successfully");

        // Send confirmation email to the contact
        await client.send({
          from: "mailsenderwebraul@gmail.com",
          to: email,
          subject: "Thank you for contacting Raúl Álvarez",
          html: confirmationEmailHtml,
        });

        console.log("Confirmation email sent successfully");

        // Close the connection
        await client.close();

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
        console.error("SMTP error:", emailError);
        
        // Make sure to close the connection if it was opened
        try {
          await client.close();
        } catch (closeError) {
          console.error("Error closing SMTP connection:", closeError);
        }
        
        throw emailError;
      }
    } catch (smtpError) {
      console.error("SMTP client error:", smtpError);
      throw smtpError;
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
