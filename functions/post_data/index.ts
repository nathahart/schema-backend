// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Adjust this according to your CORS policy
    "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, client_id, client_secret",
  });

  if (req.method === "OPTIONS") {
    // Respond to preflight request
    return new Response('ok', { headers });
  }

  try {
    
    let schemaType: string;
    let contentId: any;
    let contentData: any;

    if (req.method === "POST") {
      console.log("CAME TO POST");
      const data = await req.json();
      schemaType = data.schemaType; 
      contentData = data.contentData; 
    }
    if (req.method === "DELETE") {
      console.log("CAME TO DELETE");
      const data = await req.json();
      schemaType = data.schemaType; 
      contentId = data.contentId; 
    }
  
    console.log("Request method:", req.method);
    if (req.method !== "POST" && req.method !== "DELETE") {
      return new Response("Method not allowed", { status: 405 });
    }

    console.log("SCHEMATYPE->", schemaType);
    const endpointUrl = 
      schemaType ? 
        schemaType === 'Mall' ? "https://bprtest.bpint1040.net/bpr-arc-xp-system-api-dev/api/updateDependentSystems/malls" 
                              : "https://bprtest.bpint1040.net/bpr-arc-xp-system-api-dev/api/updateDependentSystems/stores" 
      : "https://bprtest.bpint1040.net/bpr-arc-xp-system-api-dev/api/updateDependentSystems/malls"
    
    
    if(req.method === 'DELETE'){

      // Create a DELETE request with headers

      console.log("Delete Content ID:", contentId);
      const response = await fetch(endpointUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "client_id": Deno.env.get('CLIENT_ID'),
          "client_secret": Deno.env.get('CLIENT_SECRET'),
        },
        body: JSON.stringify(contentId),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      return new Response(JSON.stringify(responseData), {
        headers: { "Content-Type": "application/json" },
      });

    }

    
    console.log("Endpoint URL:", endpointUrl)

    console.log("UpdatedContent: ", JSON.stringify(contentData));
    console.log("schemaType: ", schemaType);

    // Create a POST request with headers
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client_id": Deno.env.get('CLIENT_ID'),
        "client_secret": Deno.env.get('CLIENT_SECRET'),
      },
      body: JSON.stringify(contentData),
    });

    const responseData = await response.json();
    console.log("API Response:", responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
 
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/post_data' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
