// Fill these in from Supabase > Project Settings > API (see README.md, step 2).
// The anon key is safe to publish: the database's security rules decide what it can do.
window.HKR_CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-ANON-KEY",
  // Trips without a written route guide can get an AI briefing from Claude.
  // Off by default (free). Set to true only after setting up step 6 in README.md.
  AI_BRIEFINGS: false,
  // Where the AI briefing server function lives. Leave as is when hosting on Vercel.
  BRIEFING_ENDPOINT: "/api/briefing"
};
