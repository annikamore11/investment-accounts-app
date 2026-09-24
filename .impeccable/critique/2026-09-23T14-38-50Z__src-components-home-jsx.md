---
target: Home page (/)
total_score: 18
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:/Users/annikamore/Desktop/investment-accounts-app/src/components/Home.jsx"
target_fingerprint: "sha256:fe3e9f75a66c930ab75784eb16369d7ebaf8a75186f29a7bdb74edf41e37554c"
target_path: /Users/annikamore/Desktop/investment-accounts-app/src/components/Home.jsx
timestamp: 2026-09-23T14-38-50Z
slug: src-components-home-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Percent bar exists, but no "current section" ever renders — no data field for it |
| 2 | Match System / Real World | 1 | Brief promises a trail/elevation metaphor; delivered UI is a flat % bar, and the surrounding chrome leans into a competing aviation motif |
| 3 | User Control and Freedom | 2 | All 5 section cards route to the same generic `/journey`, no deep link to "resume here" |
| 4 | Consistency and Standards | 1 | Home uses pre-rebrand gray/green/purple Tailwind defaults; `/journey` uses Trail Waypoint tokens — two visual languages, one product |
| 5 | Error Prevention | 3 | Low-risk surface, nothing to break |
| 6 | Recognition Rather Than Recall | 3 | Icons + blurbs per section are self-explanatory |
| 7 | Flexibility and Efficiency | 1 | No shortcuts, no direct-to-section nav, one path for new and 80%-done users alike |
| 8 | Aesthetic and Minimalist Design | 2 | Near-black cinematic gradient hero meets stark white cards with cool-gray shadows, no transition surface |
| 9 | Error Recovery | 2 | No visible handling for a failed Convex fetch or offline/guest-storage-full state |
| 10 | Help and Documentation | 1 | No contextual help, no first-visit explainer, no tooltip on the progress structure |
| **Total** | | **18/40** | **Poor** |

## Design Specificity Verdict

**LLM assessment:** This is not the authored trail/waypoint dashboard the brief specifies — it's a generic SaaS "welcome back" hero + 5-card feature grid sitting next to a codebase that does have a fully-built Trail Waypoint system, but that system is walled off. `globals.css` scopes every Trail Waypoint token (forest greens, amber, rust, the 6/12px radius pair, warm shadows, tabular numerals, Gloock) inside a `.journey-theme` class, with a comment stating Home, NavBar, and Login are "outside this scope and keep the original gray/green tokens untouched." `Home.jsx` never applies `.journey-theme`. The data model (`getSectionCompletion`) tracks only `completedSteps`/`isFullyCompleted` — there's no "current section" concept, so the amber current-position marker is structurally impossible without a data-model change. The hero also sits in a near-black cinematic gradient with an animated paper-airplane motif — a code comment says the accent hue was deliberately shifted "rather than a trail blaze" for a flight metaphor, a second brand story competing with the approved brief.

**Deterministic scan:** `impeccable detect --json` ran clean (exit 0, zero findings) on `src/components/Home.jsx` and `src/app/layout.jsx`, no config overrides. No false positives — the real failure here is architectural (theme boundary, missing data field, metaphor mismatch), which a static token/contrast detector cannot catch.

**Visual overlays:** Unavailable this run — no browser-automation tool exists in this session. Fallback signal: static source/CSS read only.

## Overall Impression

The Home page is competently built and the continuity logic (guest/localStorage-vs-Convex merge, relative timestamps) is genuinely careful — but visually and structurally it is not the same product as `/journey`. The biggest opportunity: this is the page returning users see most often, and it's the one place the brief's entire thesis ("always know where you stand on the trail") is currently unbuilt.

## What's Working

1. `prefers-reduced-motion` handling in `globals.css` resolves every animation to its completed end state rather than just disabling motion.
2. Completion badges avoid color-only signaling: "Done" pairs an icon with green; in-progress pairs gray with an explicit "x/y" numeral.
3. Guest/account continuity logic (`formatRelativeDate`, localStorage-vs-Convex merge, differentiated nudge copy) shows real care for returning users.

## Priority Issues

**[P0] Trail Waypoint theme never applied to Home**
- Why it matters: The product's entire promise is only real inside `/journey`. The most-revisited screen looks unrelated and less-crafted to a nervous first-time saver.
- Fix: Apply `.journey-theme` (or extract its tokens into a page-agnostic scope) to Home, NavBar, and Login.
- Suggested command: /impeccable harden or /impeccable colorize

**[P0] No elevation-profile rail / waypoint markers**
- Why it matters: The approved first-viewport spec is entirely unbuilt — a plain percentage bar forces the user to do the "where am I" math themselves.
- Fix: Add a `currentSection` field to the journey data model, then build the waypoint rail tied 1:1 to the 5 sections.
- Suggested command: /impeccable shape, then /impeccable layout

**[P1] Flat 5-card grid violates the ≤4-choice cognitive load rule, and every card routes to the same generic `/journey`**
- Why it matters: A first-time saver scanning 5 identical-weight cards has to guess both which matters now and whether clicking gets them there.
- Fix: Deep-link each card to its specific step; visually demote completed/ahead cards and promote the current one.
- Suggested command: /impeccable layout

**[P1] 100%-completion CTA bug: "Continue Your Journey" never changes**
- Why it matters: `hasProgress` is derived from `hasAnswers`, not "not yet done," so a fully-finished user still sees a CTA implying unfinished work.
- Fix: Add a `percent === 100` branch with distinct copy and a small on-brand completion state.
- Suggested command: /impeccable clarify

**[P2] Visual composition clash between hero and cards**
- Why it matters: Near-black cinematic gradient hero meets stark white cards with cool-gray shadows, no transition surface, and neither matches the brief's paper-green ground.
- Fix: Move Home onto the paper-green ground with a forest-tinted texture; reserve the cinematic dark treatment for the marketing page only.
- Suggested command: /impeccable quieter or /impeccable layout

## Persona Red Flags

**Jordan (First-Timer):** Fails hardest here. No visual trail metaphor, no "you are here" marker, 5 flat undifferentiated cards.

**Riley (Stress-Tester):** The 100%-completion CTA bug and every card silently routing to the same URL are exactly the "does this even work" cracks a skeptical user will probe.

**Sam (Accessibility):** Custom `:focus-visible` styling is defined only inside `.journey-theme` — Home has no guaranteed visible focus ring on its pill-shaped CTA or the 5 card links.

## Minor Observations

- The hero CTA (`.btn-secondary`) is fully pill-shaped — conflicts with "no pill shapes except the trail rail itself."
- Tabular numerals are only enforced inside `.journey-theme`, so Home's numerals aren't guaranteed monospaced alignment.
- `SECTION_BLURBS` and `SECTION_ICONS` are hand-maintained parallel objects keyed by section id — a maintenance risk.
- GuestNudge copy doesn't say what happens if the device/cache is lost.

## Questions to Consider

1. What if the aviation motif already in `globals.css` is the team's real current direction, and "Trail Waypoint System" is a stale brief?
2. What if the 5-card grid became one horizontal rail with 5 waypoint dots?
3. What if surfacing just `currentSection` on the data model unlocked most of the visibility/match-to-real-world fixes without touching layout at all?
