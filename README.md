# ECU tuning & vehicle electronics website

A cinematic, production-oriented website for an automotive ECU tuning, diagnostics and repair workshop.
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis, and
React Three Fiber/Drei for an optional WebGL vehicle scene.

> **Business: New Generation Tuner's** (name confirmed from the Google Maps listing). Address, phone,
> WhatsApp, email, full opening hours and vehicle coverage are still **unset** — the short Maps link can't be
> opened from the build environment, and nothing was guessed.
> Fill them in at [`src/config/business.ts`](src/config/business.ts) — see [Before launch](#before-launch).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # typecheck + lint + production build
npm run build && npm start
npm run media        # re-process clips in _source-media/ into public/media/ (needs ffmpeg)
```

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin. Enables canonical URLs, absolute OG images, sitemap entries and `metadataBase`. |
| `ENQUIRY_WEBHOOK_URL` | Where the enquiry form posts JSON (Formspree, Make/Zapier, CRM, own API). While unset, the form validates but tells visitors their enquiry was **not** sent. |
| `ENQUIRY_WEBHOOK_TOKEN` | Optional bearer token for the webhook. |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | Turn on live Google reviews at `/reviews` (Places API “New”). Without them the page links to the Google Maps listing. |
| `GOOGLE_PLACES_LANGUAGE` | Optional review language, default `en`. |

The `/api/enquiry` route needs a Node server (`next start`, Vercel, etc.); the rest of the site is static.

## Where things live

| Path | What it is |
| --- | --- |
| `src/config/business.ts` | **Single source of business facts.** Typed, `null` = unset. `missingBusinessFields()` drives the dev-only setup notice. |
| `src/config/navigation.ts` | Primary nav and the appointment CTA. |
| `src/config/vehicleScene.ts` | Camera keyframes, lighting look and quality tiers for the WebGL scene. |
| `src/content/services.ts` | Copy for the eight confirmed services (what it involves, signs, next step, limits), grouped as performance, diagnostics and programming, keys and security. Old service URLs redirect in `next.config.ts`. |
| `src/content/home.ts` | Hero headline/support copy (proposed, editable) and story chapters. |
| `src/content/media.ts` | Media registry: posters, video sources, alt text, orbit frame sequence. |
| `src/content/dyno.ts` | Verified dyno records for the Performance Lab (empty → labelled demo). |
| `src/content/projects.ts` | Case studies (empty; only `published` + `verified` entries render). |
| `src/content/diagnostics.ts` | Typical diagnostic journey (labelled as typical on the page). |
| `src/components/home/Hero.tsx` | Hero: light-slit → shutter → headline → copy → CTAs (~1.8s). |
| `src/components/home/VehicleStory.tsx` | Sticky scroll story: orbit footage, chapters, CAN-network diagram. |
| `src/components/vehicle/VehicleStage.tsx` | Picks WebGL scene vs frame sequence; handles fallback. |
| `src/components/vehicle/VehicleScene.tsx` | Reusable R3F scene (configurable camera keys, lighting, quality, disposal). |
| `src/components/vehicle/FrameSequence.tsx` | Canvas image-sequence scrubber (lazy, coarse-to-fine loading). |
| `src/components/lab/PerformanceLab.tsx` | SVG power/torque chart with RPM slider; GSAP curve reveal. |
| `src/components/contact/EnquiryForm.tsx`, `src/app/api/enquiry/route.ts`, `src/lib/enquiry.ts` | Enquiry form, server route and shared validation. |
| `src/components/motion/SmoothScroll.tsx`, `src/lib/gsap.ts` | Lenis ↔ ScrollTrigger integration and plugin registration. |
| `scripts/process-media.mjs` | Media pipeline (H.264 web/mobile variants, posters, WebP frame sequence). |

Routes: `/`, `/services`, `/services/[slug]` (8), `/performance`, `/repairs`, `/work`, `/work/[slug]`,
`/about`, `/contact`, `/api/enquiry`, `/sitemap.xml`, `/robots.txt`. In development only,
`/work/template-preview` shows the case-study template with field descriptions (404 in production).

## Architecture notes

**Animation.** GSAP plugins are registered once in `src/lib/gsap.ts`. Every animated component uses
`useGSAP` with a scope and `gsap.matchMedia()`, so timelines and triggers are reverted on unmount and
never duplicate under React Strict Mode (verified: trigger counts stay constant across repeated client
navigation). Lenis runs off the GSAP ticker (`autoRaf: false`, `lenis.on("scroll", ScrollTrigger.update)`,
`lagSmoothing(0)`); touch devices keep native scrolling; ScrollTrigger refreshes after fonts load and on
route change. The story section pins with CSS `position: sticky` instead of a ScrollTrigger pin, so there
is no pin-spacer layout shift.

**Progressive enhancement.** An inline boot script adds `js` / `reduce-motion` classes before paint.
Hidden-until-animated states only apply under `html.js:not(.reduce-motion)`, with a CSS failsafe that
reveals content after 3.5s if scripts fail. Without JS or with reduced motion: the hero shows the still,
there is no smooth scroll or video, and the story renders as stacked chapters with a static diagram.
The mobile menu is a native `<dialog>` (focus containment, Escape, inert background); without JS a
`<noscript>` link points to the footer navigation.

**3D.** `VehicleStage` mounts the WebGL scene only when `business.vehicleModel.src` is set, WebGL is
available, the device isn't low-tier and reduced motion is off. three.js is code-split (`next/dynamic`,
`ssr: false`) and not downloaded otherwise. The scene renders on demand (`frameloop="demand"`; a frame
per progress change), caps DPR per tier, bakes the studio environment once (`Environment frames={1}`),
uses a one-shot contact shadow, disposes cloned materials and cached GLTF resources on unmount, and falls
back to the frame sequence on load errors or context loss. This path was verified with a throwaway test
GLB (render, camera choreography, WebGL-unavailable fallback, 404 fallback), which was then removed.

**Media.** Poster-first: optimised posters (AVIF/WebP via `next/image`) render immediately; video is
fetched only near the viewport, paused offscreen and when the tab is hidden, and never loaded with
reduced motion or Save-Data. Phones get 854px clips; the story uses 48 frames on phones, 96 on desktop.

## Verification (2026-10-24)

- `npm run typecheck` ✔ · `npm run lint` ✔ (0 problems) · `npm run build` ✔ (19 routes)
- Production server: enquiry API → 200 delivered to a test webhook (with bearer token), 422 field
  errors, 400 for honeypot/bad JSON, 503 `not_configured` with no webhook. UI states verified for both.
- Home on a phone viewport (production, localhost): CLS 0, ~220 KB JS, three.js not loaded, one 261 KB clip.
- No horizontal overflow at 320 / 375 px on any route; no text overflowing its column at 768–1920 px.
- Keyboard: skip link, logical tab order, visible focus everywhere; menu Escape/close-on-navigate.
- Reduced motion, JavaScript disabled, WebGL unavailable and model-404 modes all checked.
- Not measured: real-device INP/LCP over a network, Safari/Firefox, screen-reader passes. Run Lighthouse
  and a VoiceOver/NVDA pass against the deployed URL.

## Before launch

### Business information still needed
Set in `src/config/business.ts` (the dev-only "Setup" panel lists what's missing):

- [x] Business name: **New Generation Tuner's** (from the Google Maps listing; listed there as "NEW GENERATION TUNER'S"). Legal name still needed
- [ ] Logo and brand assets
- [ ] Verified address and coordinates
- [x] Google Maps listing: `https://maps.app.goo.gl/FLwH4xRYVwbxjQoaA` (enables "Get directions" and the reviews link)
- [ ] Phone, WhatsApp and email (each enables its contact button)
- [ ] Opening hours
- [ ] Social links
- [ ] Confirmed vehicle makes/coverage
- [ ] Which tuning options are actually offered (stages, packages, hardware) — none are published
- [ ] Whether dyno testing is available — not claimed anywhere
- [ ] Confirmation of the policy statements: proof of ownership for immobiliser and key work, no odometer rollback, airbag systems restored not silenced, road cars kept emissions-legal, and the About page principles
- [ ] The workshop's actual diagnostic process (the page labels the current one as "typical")
- [ ] A privacy notice for enquiry data, and the domain (`NEXT_PUBLIC_SITE_URL`) and enquiry destination (`ENQUIRY_WEBHOOK_URL`)
- [ ] Verified case studies and dyno records, with customer consent

LocalBusiness/Service structured data is emitted automatically once the name and address are set. No
ratings or reviews are ever generated.

### Google reviews (`/reviews`)
Reviews are **not** copied into the site: Google's terms prohibit scraping Maps content and each review belongs to
its author. The page loads them live from the Places API instead, server-side, on every request (Places content may
not be cached), with the attribution Google requires (author photo/name/link, a link to each review on Google Maps,
a report link, “Google Maps” attribution and an ordering notice). Google returns up to five reviews, ordered by relevance.

To switch it on:
1. In Google Cloud, create a project with billing, enable **Places API (New)**, and create an API key restricted to that API.
2. Find the listing's Place ID with Google's [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).
3. Add `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` to the Vercel project's environment variables and redeploy.

Each page view is one billable Place Details request (reviews fall in Google's higher-priced Place Details SKU); check
current Google Maps Platform pricing and set a budget alert. No aggregate rating is emitted as structured data —
Google doesn't allow review markup sourced from third-party sites.

### Missing or provisional assets
- **3D car model: not supplied.** No GLB/glTF/FBX/OBJ was in the project. To add one: export to GLB
  (Draco/Meshopt-compressed, textures ≤2K, ideally <8 MB), place it in `public/models/`, set
  `business.vehicleModel.src`, `licence`, `scale`, `yOffset` and `yaw`, then tune
  `src/config/vehicleScene.ts` camera keys against the real model.
- **All photography and video is illustrative.** The supplied clips carry an AI-generation watermark and
  do not show this workshop, its customers or results. Each is tagged "Illustrative" on the page and the
  footer/About page say so. The vehicle shown resembles a Porsche 911 GT3 RS with the manufacturer crest
  visible; replace it with your own footage (or licensed footage) before launch to avoid implying an
  affiliation. Put new clips in `_source-media/`, update the prefixes in `scripts/process-media.mjs`, run
  `npm run media`, then set `business.media.illustrative = false`.
- Real workshop footage for each service, diagnostic equipment and before/after imagery for case studies.

### Known limitations
- The enquiry rate limiter is in-memory per server instance; use a shared store if you run several.
- The Performance Lab shows a clearly labelled demonstration chart until `dynoRecords` has real data.
- Open Graph images resolve against `localhost` until `NEXT_PUBLIC_SITE_URL` is set (build warns).
- R3F currently logs a `THREE.Clock` deprecation warning from inside the library (not from this code).
