# Hamba Kahle Roads

*Hamba kahle* means "go well". Drivers type their trip ("Durban to Joburg") and get a route guide of what to look out for, plus live reports from other drivers. They can report potholes and hazards with one tap.

This version runs **free**: the 20 route guides are written into the site, so no AI service is needed.

## What's in this folder

| File | What it does |
|---|---|
| `index.html`, `styles.css`, `app.js` | The website itself |
| `routes.js` | The 20 route guides. Edit this file to change or add guides |
| `config.js` | Where you paste your database address and public key |
| `supabase/schema.sql` | Creates the database tables and security rules |
| `manifest.webmanifest`, `sw.js`, `icons/` | Let people add the site to their phone's home screen like an app |
| `api/briefing.js` | Optional: AI briefings for trips without a guide (off by default, see step 6) |

## What it costs

| Service | What for | Cost |
|---|---|---|
| Supabase | Database, sign-in, live updates | Free plan |
| Vercel | Hosting the site | Free plan (Hobby) |
| Your own domain (optional) | e.g. hambakahleroads.co.za | Roughly R100–R200 a year. You can start on the free `.vercel.app` address |

Vercel's free plan is meant for non-commercial projects. If you later run ads or charge for anything, check their terms; you may need the paid plan or another host. Check each provider's current pricing before you commit.

---

## Step 1: Create accounts

1. **GitHub** (github.com): stores your code. Vercel puts it online from there.
2. **Supabase** (supabase.com): sign up and create a **New project**. Pick the region closest to South Africa that's offered. Save the database password somewhere safe.
3. **Vercel** (vercel.com): sign up using your GitHub account.

## Step 2: Set up the database

1. In Supabase, open **SQL Editor → New query**.
2. Open `supabase/schema.sql`, copy everything, paste it in, and click **Run**. You should see "Success".
3. Go to **Project Settings → API** and copy the **Project URL** and the **anon public** key.
4. Open `config.js` and paste them in place of `https://YOUR-PROJECT.supabase.co` and `YOUR-ANON-KEY`.

The anon key is meant to be public. The security rules in `schema.sql` make sure people can only post as themselves and delete only their own reports.

## Step 3: Turn on email sign-in

1. In Supabase, go to **Authentication → Sign In / Providers** and make sure **Email** is enabled.
2. Go to **Authentication → URL Configuration**:
   - **Site URL**: your live address, e.g. `https://hamba-kahle-roads.vercel.app` (you'll get this in step 4; come back and fill it in).
   - **Redirect URLs**: add the same address.
3. Supabase's built-in email sender only allows a few emails an hour, which is fine for testing. Before launch, connect a free email service under **Authentication → Emails → SMTP Settings** (Resend, Brevo or similar have free plans).

## Step 4: Put it online

1. On GitHub, create a new repository and upload everything in this folder (drag and drop works on github.com).
2. In Vercel, click **Add New → Project**, choose the repository and click **Deploy**. No settings needed.
3. Open your `.vercel.app` address, then finish step 3 with that address.
4. Test it: open a route guide, sign in with your email, and post a quick report.

## Step 5: Add your own domain (optional)

1. Register the domain with any .co.za registrar.
2. In Vercel: **Settings → Domains → Add**, then follow the instructions to point the domain at Vercel.
3. Update the **Site URL** and **Redirect URLs** in Supabase (step 3) to the new domain.

## Step 6 (optional, paid): AI briefings for other trips

Trips without a written guide show a list of guides and the driver reports. If you later want Claude to write a briefing for any trip:

1. Create an account at console.anthropic.com, add billing, set a monthly spending limit and create an API key.
2. In Vercel, **Settings → Environment Variables**, add `ANTHROPIC_API_KEY`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (from Supabase **Project Settings → API → service_role**; keep this one secret and never put it in `config.js`).
3. In `config.js`, change `AI_BRIEFINGS: false` to `AI_BRIEFINGS: true`, then redeploy.

Briefings are saved for 12 hours and each visitor is limited to 10 new briefings an hour, to keep costs down.

---

## Editing the route guides

Open `routes.js`. Each guide has:

- `a` and `b`: the two ends, using the place groups at the top of the file (`HKR_PLACES`). Add nicknames there so "Jozi" or "PE" match.
- `roads` and `places`: used to pull matching driver reports into the guide.
- `before`: the "Before you leave" checklist.
- `legs`: sections of the trip, each named "Town to Town", with items. Each item has a `kind` (`hazard`, `safety`, `roadworks`, `weather`, `lane`, `toll`, `fuel` or `tip`), a short `title` and a one-line `detail`.

Write each guide in one direction only; the site reverses it automatically for the return trip. Word items so they make sense both ways ("steep pass between X and Y" rather than "climb into Y").

**Keep the guides up to date.** They were checked in October 2026 against public sources, but toll plazas, road layouts and closures change. Review them every few months, and when drivers report something that's become permanent, add it to the guide.

## Before you launch publicly

- **Map tiles and road-name lookup** use OpenStreetMap's free servers, which are fine for testing and light use. Once you have real traffic, switch to a provider with a free plan, such as MapTiler, Stadia Maps or Mapbox: change the `L.tileLayer(...)` address in `app.js` and the `nominatim.openstreetmap.org` lookup in `roadAt()`.
- **Moderation:** to remove a bad report, open Supabase **Table Editor → reports**, find the row and delete it.
- **Privacy:** you're collecting email addresses and locations, so add a privacy notice that covers POPIA.
- **Safety message:** the site tells people not to report while driving. Keep it prominent.

## Updating the site

Change a file on GitHub (or upload a new version) and Vercel redeploys within a minute. After changing `styles.css`, `app.js` or `routes.js`, also bump `CACHE` in `sw.js` (e.g. `hkr-shell-v3`) so phones that installed the site pick up the change.

## How the pieces fit

- **Reading** guides and reports needs no account. **Posting and voting** need an email sign-in.
- New reports appear on everyone's screen live, without refreshing.
- "Still there / Gone now" votes are one per person per report. A report fades once more people say it's gone than still there.
- A route guide shows the written "road know-how" plus any driver reports from the last 3 days on that route's roads and towns.
