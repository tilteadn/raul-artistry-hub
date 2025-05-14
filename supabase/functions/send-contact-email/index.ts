
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Check if the API key is set
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set");
}

// Initialize Resend only if API key is available
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-contact-email function");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    // First check if the API key is set
    if (!resendApiKey || !resend) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service is not properly configured", 
          details: "The email service API key is not set. Contact the site administrator." 
        }), 
        {
          status: 503,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const formData: ContactFormData = await req.json();
    const { name, email, subject, message } = formData;
    
    console.log("Form data received:", { name, email, subject });

    // Validate form data
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to the artist with the contact information
    console.log("Sending email to artist...");
    
    const artistEmail = "rauloalvarez@gmail.com";
    console.log("Artist email recipient:", artistEmail);
    
    const { data: artistEmailData, error: artistEmailError } = await resend.emails.send({
      from: "Contacto Web <onboarding@resend.dev>",
      to: [artistEmail],
      subject: `Nuevo mensaje de contacto: ${subject}`,
      reply_to: email,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    if (artistEmailError) {
      console.error("Error sending email to artist:", artistEmailError);
      throw artistEmailError;
    }

    console.log("Email to artist sent successfully:", artistEmailData);

    // Send confirmation email to the user
    console.log("Sending confirmation email to user...");
    const { data: userEmailData, error: userEmailError } = await resend.emails.send({
      from: "Raúl Álvarez <onboarding@resend.dev>",
      to: [email],
      subject: "Hemos recibido tu mensaje",
      html: `
        <h2>Gracias por contactar, ${name}</h2>
        <p>Hemos recibido tu mensaje con asunto "${subject}" y nos pondremos en contacto contigo lo antes posible.</p>
        <p>Atentamente,<br>Raúl Álvarez</p>
      `,
    });

    if (userEmailError) {
      console.error("Error sending confirmation email to user:", userEmailError);
      // We still continue if this fails, since the main email was sent
    } else {
      console.log("Confirmation email to user sent successfully:", userEmailData);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Emails sent successfully to both artist and requester" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
};

serve(handler);
