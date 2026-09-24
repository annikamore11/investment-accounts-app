# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Young professionals in their first job — people who just started earning a
real paycheck and are facing their first real financial decisions (401(k)
enrollment/match, where to keep savings, whether to open an IRA) for the
first time, usually with no prior framework for making them.

## Product Purpose

FundJoi is a guided, step-by-step journey that takes a beginner from "I
should probably invest" to having an actual emergency fund, retirement
plan, and brokerage account set up. Success is a completed, personalized
plan the user has acted on — not just information consumed. The journey
branches on the user's own answers (e.g. 401(k) questions only appear for
people employed at a company), so later steps adapt to what's already been
established.

## Positioning

The product's mechanism is a strict, personalized ordering: "tell us your
income and expenses — we'll show you exactly what to do with what's left
over, in order" (budget → emergency fund → retirement → investing). It is
prescriptive and sequential rather than a library of generic educational
content, and it works from numbers the user types in themselves rather
than requiring a linked bank account.

## Operating Context

- The journey works fully without an account; progress is kept in
  `localStorage` for guests.
- Signing up migrates guest progress into Convex — but only if the
  account has no saved journey yet, so an existing account logging in is
  never overwritten (the invariant lives in `src/context/AuthContext.jsx`).
- Returning users land on a dashboard-style home (`/`) showing per-section
  completion and a resume CTA; the journey itself lives at `/journey`.
- Auth is Clerk; persistence is Convex, keyed by Clerk user id
  (`convex/journey.ts`, identity from `ctx.auth`, never a client-passed id).

## Capabilities and Constraints

- Self-reported financial data for now — users manually enter income,
  expenses, balances, and debts; there is no bank-account linking
  currently built. (The project previously integrated Mastercard Open
  Banking for account linking and institution search; that code was
  removed.) This is no longer treated as a permanent constraint: account
  linking (e.g. for institution search/autocomplete, or full linking) is
  an open possible future feature, just not one currently planned or in
  progress. Don't market self-reported/no-linking as a permanent
  differentiator in user-facing copy — say what the product does today,
  not a forward-looking promise.
- Journey sections: About You, Budget/Income, Emergency Fund, Retirement,
  Investing (config and full saved-data contract in
  `src/components/journey/sections/index.js`).
- Steps are computed dynamically from prior answers (e.g. self-employed
  users skip 401(k)-match questions; a slider's numeric field must stay
  blank, not default to a value, until the user actually touches it — see
  `riskTolerance` in `INITIAL_JOURNEY_DATA`).

## Brand Commitments

- Product name: **FundJoi**. Logo: a sprout mark (`public/assets/logo/Sprout.svg`,
  `Sprout2.svg`) plus a wordmark (`Title.svg`).
- Typefaces on hand: ClashGrotesk (Bold/Regular) and Gloock
  (`public/assets/fonts/`).

## Evidence on Hand

No real testimonials, case studies, press, or user data exist yet. Future
work must not fabricate any of that.

## Product Principles

1. Prescriptive over informational — always tell the user the next
   concrete action, not just facts about investing.
2. Sequence matters — budget, then emergency fund, then retirement, then
   investing; don't let later steps outrun the foundation earlier steps
   establish.
3. No account required to get value — the guest path must stay fully
   functional; account creation is an upgrade (persistence), never a
   gate.
4. Adapt to the user's own answers rather than presenting a fixed script
   — irrelevant steps (e.g. 401(k) questions for the self-employed)
   should disappear, not be skippable filler.
5. Ask for numbers, not bank credentials, for now — self-reported input
   keeps things simple today; this may change if account linking is
   built later, so don't bake "no linking, ever" into user-facing copy.
