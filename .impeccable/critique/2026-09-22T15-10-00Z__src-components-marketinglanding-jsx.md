---
target: / (marketing landing page)
total_score: 10
max_score: 16
na_heuristics: 1,3,5,7,9,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/annikamore/Desktop/investment-accounts-app/src/components/MarketingLanding.jsx"
target_fingerprint: "sha256:97d0e5d2a62d7e4a31d72ca0164a92fb7b36d26bc7c94aac221d688ff0d4f66d"
target_path: /Users/annikamore/Desktop/investment-accounts-app/src/components/MarketingLanding.jsx
timestamp: 2026-09-22T15-10-00Z
slug: src-components-marketinglanding-jsx
---
# Critique: / (MarketingLanding.jsx)

**Method:** dual-agent (A: design-specificity review · B: detector + structural evidence), source-code-only.

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | n/a | static marketing page |
| 2 | Match Real World | 2/4 | trail/waypoint mechanism absent from the page introducing it |
| 3 | User Control and Freedom | n/a | no state to escape |
| 4 | Consistency and Standards | 2/4 | amber/Gloock used against their own contract |
| 5 | Error Prevention | n/a | no forms |
| 6 | Recognition Rather Than Recall | 3/4 | CTA/value prop visible without scrolling |
| 7 | Flexibility and Efficiency | n/a | not applicable to Persuade |
| 8 | Aesthetic and Minimalist Design | 3/4 | clean but templated |
| 9 | Error Recovery | n/a | no errors possible |
| 10 | Help and Documentation | n/a | not applicable to Persuade |
| **Total** | | **10/16** | **Acceptable** |

## Design Specificity Verdict
Palette is real (forest/paper/amber tokens verified in globals.css) but applied to a generic SaaS hero template (logo/headline/subhead/2-CTA/microcopy). The product's actual distinguishing visual system (trail/waypoint rail) never appears on the page. The 3-card feature grid duplicates Home.jsx's SectionGrid icon-in-rounded-square pattern verbatim (confirmed matching classes: bg-accent-green-100 rounded-lg, text-accent-green-700, w-5 h-5 icon).

## Priority Issues
1. [P1] Hero has no waypoint-rail visual (MarketingLanding.jsx:71-108) - generic template. Fix: static rail preview under headline, 5 markers w/ Home's SECTION_ICONS, amber current-dot. -> /impeccable overdrive
2. [P1] Feature-card grid duplicates flagged icon-in-box pattern (MarketingLanding.jsx:124-136 vs Home.jsx:141-144, confirmed near-identical classes). Fix: replace with real 4-step trail-segment sequence. -> /impeccable distill
3. [P2] Amber used decoratively on headline word "earning" (line 81), contract reserves it for current-position marker only. Fix: drop flourish, spend amber on the rail's current marker. -> /impeccable colorize
4. [P2] Gloock on prose headline instead of contracted stat-number role - classic AI-landing-page serif-headline tell. Fix: ClashGrotesk headline, Gloock on an actual stat. -> /impeccable typeset
5. [P2] Dark/light/dark section rhythm is templated; .journey-background's own comment ties it to the rail, but no rail present so it's decorative not functional. -> /impeccable layout
6. [P3] Generic startup copy voice vs PRODUCT.md's sharper mechanism language. -> /impeccable clarify
7. [P3] Leftover pre-redesign .card class (globals.css ~663-675) still has gradient + purple/green shadow, used by Home.jsx's dashboard grid, contradicts no-gradient rule. -> /impeccable polish
8. [P3] MarketingLanding's 3-card grid skips sm:grid-cols-2 step that Home's own grid includes. -> /impeccable adapt

## What's Working
- journey-theme CSS-variable scoping pattern is legitimately good engineering.
- Fine-print copy (no bank linking, 15 minutes, sign up later) is honest and specific, matches PRODUCT.md constraints.
- Dependency-free Reveal/IntersectionObserver scroll animation is a reasonable choice, not itself generic-AI.

## Persona Red Flags
- Jordan (first-timer): never sees what "guided" looks like before being asked to click Get Started.
- Riley (stress tester): icon-card pattern duplicated sitewide with slightly different implementations, reads as copy-paste drift.

No browser evidence available this run; all findings are structural/class-level from source.
