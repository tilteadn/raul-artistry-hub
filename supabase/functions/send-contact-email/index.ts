
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create SMTP client configuration
const client = new SmtpClient({
  connection: {
    hostname: "smtp.gmail.com",
    port: 465,
    tls: true,
    auth: {
      username: "mailsenderwebraul@gmail.com",
      password: "harj zozg ppkc xxwq",
    },
  },
});

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

    // Send email to the artist
    await client.send({
      from: "mailsenderwebraul@gmail.com",
      to: "eduxeiroa@gmail.com",
      subject: `Web Contact: ${subject}`,
      content: `
        <h2>New contact from website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      html: `
        <h2>New contact from website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    // Send confirmation email to the sender
    await client.send({
      from: "mailsenderwebraul@gmail.com",
      to: email,
      subject: "We've received your message - Raúl Álvarez",
      content: `
        <h2>Thank you for your message!</h2>
        <p>Dear ${name},</p>
        <p>This is a confirmation that we have received your message. We will get back to you as soon as possible.</p>
        <p>Best regards,<br>Raúl Álvarez</p>
      `,
      html: `
        <h2>Thank you for your message!</h2>
        <p>Dear ${name},</p>
        <p>This is a confirmation that we have received your message. We will get back to you as soon as possible.</p>
        <p>Best regards,<br>Raúl Álvarez</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
