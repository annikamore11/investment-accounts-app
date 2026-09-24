---
version: 2
slug: "src-app-layout-jsx"
primary_target: "src/app/layout.jsx"
related_targets: ["src/app/globals.css","src/components/Home.jsx","src/components/journey/JourneyFlow.jsx","src/components/MarketingLanding.jsx","src/components/HeroPlaneFlight.jsx"]
---

REVISION NOTE (2026-09-23): v1 described this world in hiking-trail language (elevation-profile rail, "trail blaze" accent). A `/impeccable critique` run on Home surfaced that the codebase had already built a paper-airplane / flight-path motif instead (`HeroPlaneFlight.jsx`, the `hero-trail-draw`/`heroPlaneFly` animations, and a `globals.css` comment noting the amber hue was shifted toward a "golden hour" accent "rather than a trail blaze"). Asked directly, the user confirmed aviation/flight is the real intended direction, not hiking. This revision renames the world and rewrites THESIS/OWN-WORLD/STORY/FIRST VIEWPORT to match what's actually built; the token values (forest/paper/amber/rust, radius, shadow, type rules) are unchanged since those were already correct.

## Direction contract

THESIS: Five sections are five legs of one flight plan — a paper airplane's path across the whole route — always visible, always showing exactly where you stand and how much of the flight remains. Refuses the collapsed-sidebar-you-must-expand-to-recall-your-place arrangement most guided-journey products ship.

OWN-WORLD: Forest green (#1F4D3A structural / #2F6B4F interactive) chrome on a cool paper-green ground (#F7F8F5 — deliberately not cream/parchment); one amber "golden hour" accent (#E8871E-family) reserved for the current-position marker and primary actions only, never decorative; rust (#B4432A) reserved for errors/destructive actions only. ClashGrotesk for all UI/body/data text with enforced tabular numerals; Gloock reserved for hero stat numbers and section-divider titles only, never body copy. Blunt two-tier radius (6px controls, 12px cards, no pill shapes except the flight-path rail itself); warm minimal shadows (ink-tinted, not cool gray); every state (selected, error, complete) carries a shape/label, never color alone. The paper-airplane hero moment — a plane riding a motion path, drawing its line in behind it (`HeroPlaneFlight.jsx`, `hero-trail-draw`) — is the signature motif and should recur wherever progress is shown (hero, footer, journey sidebar rail), not stay a one-off animation confined to the marketing hero.

STORY: A first-time saver arrives, sees the whole flight plan at once — the five waypoints along the route — always knows which leg they're on and how much of the flight remains, and never loses their place switching between sections.

FIRST VIEWPORT: Home: hero stat in Gloock, a flight-path progress rail spanning the width beneath it (the same line-and-plane motif as the marketing hero, not a plain percentage bar), five waypoint markers below the rail (amber = current, forest-filled = complete, outline = ahead), primary CTA in forest-500 directly under the rail. The journey sidebar becomes this same always-visible rail, compacted vertically on mobile.

FORM: Flight Path Waypoint System (renamed 2026-09-23 from "Trail Waypoint System" to match the aviation motif the codebase actually built) — IMPECCABLE'S PICK (model-pick) from the direction round, not the assigned card; seed key ad5c27a1, mode operate, chosen by the user on the decision page.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
