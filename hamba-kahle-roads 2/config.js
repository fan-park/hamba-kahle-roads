// Fill these in from Supabase > Project Settings > API (see README.md, step 2).
// The anon key is safe to publish: the database's security rules decide what it can do.
window.HKR_CONFIG = {
  SUPABASE_URL: "https://xmgpfxtkhbccuhepjcbl.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZ3BmeHRraGJjY3VoZXBqY2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNzgwMTIsImV4cCI6MjEwNzY1NDAxMn0.w7X9St7OHYWOc9JbOvun0FympwLUcfzIBYTjdMKzhog",

  // Who runs the site. Shown on the privacy and terms pages. Fill these in before inviting people.
  OWNER_NAME: "Superfan",
  CONTACT_EMAIL: "officialsuperfanhq@gmail.com",
  // The "Hamba Kahle Road Watch" WhatsApp Channel (weekly road updates).
  WHATSAPP_CHANNEL: "https://whatsapp.com/channel/0029Vb9aVQIFCCoRCOsyE62f",

  // Trips without a written route guide can get an AI briefing from Claude.
  // Off by default (free). Set to true only after setting up step 6 in README.md.
  AI_BRIEFINGS: false,
  // Where the AI briefing server function lives. Leave as is when hosting on Vercel.
  BRIEFING_ENDPOINT: "/api/briefing"
};
