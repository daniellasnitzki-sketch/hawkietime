# HawkieTime.com

Independent, unofficial fan site for Hawthorn Hawks supporters. v1 is a single
landing page with a live countdown to the upcoming Preliminary Final.

Plain static HTML/CSS/JS — no build step, no framework, no dependencies.

## Update the game details

Edit **`js/config.js`**. It's the single place that holds the opponent,
venue, kickoff date/time, and the post-countdown message. Nothing else
needs to change.

`kickoffISO` must keep an explicit UTC offset (e.g. `+10:00` for AEST,
`+11:00` for AEDT) — that's what makes the countdown show the correct
remaining time for every visitor regardless of their own timezone.

## Run locally

No build step required. Any static file server works, e.g.:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy

Static hosting only — no server, no database. On Vercel:

```bash
npx vercel deploy --prod
```

(Framework preset: "Other" / static — no build command needed.)

Netlify, GitHub Pages, or Cloudflare Pages work the same way: point them
at this folder with no build command.

## Structure

```
index.html          the page
css/styles.css       all styling
js/config.js         game details + kickoff datetime (edit this to update the site)
js/countdown.js      countdown logic + populates match details from config.js
assets/favicon.svg   placeholder favicon
```

## Notes for future expansion

This is intentionally a single page with no framework lock-in. If the
site grows into something bigger (articles, stats, match-day content),
either keep adding static `.html` pages under this same structure, or
migrate to a framework (e.g. Next.js) at that point — none of today's
work is framework-specific, so nothing here needs to be thrown away.

No official club logos or trademarked assets are used or should be
added without confirming you have the rights to use them.
