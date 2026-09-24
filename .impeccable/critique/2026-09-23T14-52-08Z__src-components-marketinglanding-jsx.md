---
target: Marketing landing page (/)
total_score: 8
max_score: 16
na_heuristics: 1,3,5,7,9,10
p0_count: 2
p1_count: 1
target_identity: "file:/Users/annikamore/Desktop/investment-accounts-app/src/components/MarketingLanding.jsx"
target_fingerprint: "sha256:1b720d1c012cfc6b79f28bc4512373ffa3e914439a69fe21020233e713cca2fe"
target_path: /Users/annikamore/Desktop/investment-accounts-app/src/components/MarketingLanding.jsx
timestamp: 2026-09-23T14-52-08Z
slug: src-components-marketinglanding-jsx
---
## Design Health Score

Mode: Persuade. Heuristics 1, 3, 5, 7, 9, 10 marked n/a (static page, no async/forms/errors).

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | n/a | static page, no async/status to show |
| 2 | Match System / Real World | 2/4 | flight-plan metaphor never made legible — hero copy never says "flight," "plane," or "journey" |
| 3 | User Control and Freedom | n/a | no state to escape |
| 4 | Consistency and Standards | 1/4 | Gloock used on 3/3 prose headlines; amber spent decoratively, withheld from CTAs |
| 5 | Error Prevention | n/a | no forms |
| 6 | Recognition Rather Than Recall | 3/4 | value prop + CTA visible without scrolling |
| 7 | Flexibility and Efficiency | n/a | not applicable to Persuade |
| 8 | Aesthetic and Minimalist Design | 2/4 | clean whitespace, but signature motif invisible below 1280px |
| 9 | Error Recovery | n/a | no errors possible |
| 10 | Help and Documentation | n/a | not applicable to Persuade |
| **Total** | | **8/16** | **Acceptable (50%)** |

## Design Specificity Verdict

**LLM assessment:** Reads as a generic dark-hero SaaS landing page with a plane animation grafted onto the hero only. The FEATURES array (lines 48-69) is fungible fintech-onboarding copy that never names or visualizes the five journey legs or any waypoint/rail concept. The plane (`HeroPlaneFlight.jsx`) is the only place the motif appears, is purely decorative, and is `hidden xl:block` (invisible below 1280px). Hero copy never uses the words "flight," "plane," "path," or "journey." The codebase (globals.css, JourneySidebar.jsx) still uses "Trail Waypoint System"/"your trail" language and classes (`hero-trail-draw`, `rail-line-grow`) — the system is still mentally modeled as a hiking trail with a plane painted over just the hero, not rebuilt around "flight plan," a gap between the just-updated surface brief and the code itself.

**Deterministic scan:** `impeccable detect --json` clean (exit 0, zero findings) on MarketingLanding.jsx, HeroPlaneFlight.jsx, and Home.jsx (cross-check). Structural grep filled the gap: `font-display` appears 3 times (lines 90, 126, 156), all on prose headlines; `amber` appears live once (line 92, decorative), never on either CTA (lines 111, 164, both green). The feature-card pattern has structurally diverged from Home's SectionGrid since the prior critique flagged them as near-duplicates (different color tokens, different container strategy) — that finding is resolved, though the cards remain generic.

**Visual overlays:** Unavailable — no browser-automation tool exists in this session. Static source/CSS/grep evidence only.

## Overall Impression

Well-executed craft (the SVG mask/trail-draw technique, sharp reassurance copy) wrapped around a hollow center: the page tells a visitor the product is guided and personalized but never shows it, and the one visual built to show it is invisible to most real traffic.

## What's Working

1. `HeroPlaneFlight.jsx:33-58` — the SVG mask + strokeDasharray/strokeDashoffset technique to draw a trail behind a moving plane is genuinely well-crafted, specific engineering-as-design.
2. `Reveal` component (lines 11-42) — lightweight IntersectionObserver scroll-reveal, deliberately avoids framer-motion for one page.
3. Final CTA copy (line 160) — "Takes about 10 minutes. No account needed to start. Sign up later to save your plan." directly answers the two real anxieties at the highest-stakes moment.

## Priority Issues

**[P0] The flight-plan system is demonstrated to almost no one**
- Why it matters: `HeroPlaneFlight.jsx:26` is `hidden xl:block` (>=1280px only) — most visitors render zero animation. The signature motif the whole direction contract is built around is invisible by default.
- Fix: Ship a simplified flight/trail visual for sub-xl viewports; consider an always-visible rail preview reusing JourneySidebar's waypoint markers.
- Suggested command: /impeccable adapt

**[P0] Gloock used on 3/3 prose headlines — direct rule violation**
- Why it matters: `font-display` (-> Gloock) appears at lines 90, 126, 156, all full-sentence headlines, none stat numbers or divider titles. Breaks the type system's core rule 100% of the time it's used on the very first page a visitor sees.
- Fix: Swap `font-display` for ClashGrotesk on all three; reserve Gloock for an actual stat or true divider label.
- Suggested command: /impeccable typeset

**[P1] Amber spent decoratively, withheld from the primary CTAs**
- Why it matters: Line 92 wraps "earning" in amber purely for emphasis, while both CTA buttons (111, 164) are green — inverts the contract's rule (amber reserved for current-position marker and primary actions, never decorative). Implemented amber (#F3B720) is also a yellow-gold, visibly different from the contract's #E8871E-family orange.
- Fix: Move amber onto both CTA buttons (verify contrast); drop the amber/underline treatment from "earning."
- Suggested command: /impeccable colorize

**[P2] Feature grid is generic and doesn't map to the real 5-leg journey**
- Why it matters: The 4 FEATURES cards are parallel to each other but not to the 5 real journey sections the user is about to enter.
- Fix: Replace with a real 5-leg sequence preview reusing journey section icons/labels.
- Suggested command: /impeccable distill

**[P2] Flight motif is entirely invisible to screen readers**
- Why it matters: HeroPlaneFlight is aria-hidden with no textual equivalent — screen-reader users get zero exposure to the core pitch framing.
- Fix: Add a short visually-hidden text equivalent describing the guided 5-step flight plan near the hero.
- Suggested command: /impeccable harden

## Persona Red Flags

**Jordan (First-Timer):** Never sees what the "guided journey" consists of before clicking "Get Started Free"; amber cue meant to mark "the safe action" is spent on a headline word instead.

**Casey (Mobile):** `hidden xl:block` means mobile visitors get none of the signature motif, ever.

**Sam (Accessibility):** Decorative images correctly use alt=""/aria-hidden, and a global focus-visible outline exists — but the flight-plan metaphor has no textual equivalent at all.

## Minor Observations

- Two different CTA labels ("Get Started Free" vs "Start Your Journey") for the identical /journey destination.
- Footer.jsx uses lucide's SendHorizonal icon rather than the hero's custom paper-airplane artwork — two different plane silhouettes for one motif.
- The "no bank linking, self-reported data only" differentiator is absent from this page's copy.
- Codebase-wide, class names/comments still use hiking-trail language even though the surface brief now says "flight plan" — a rename pass across globals.css/JourneySidebar.jsx would close that gap.

## Questions to Consider

1. What if the hero literally flew to and labeled all five waypoints before a single word of body copy loaded?
2. What if amber were forced to appear exactly once per viewport — only on the primary CTA?
3. What if "no bank linking — everything is self-reported, by design" became a headline trust statement?
