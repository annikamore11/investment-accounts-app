# FundJoi

A guided, step-by-step journey that takes a beginner from "I should probably invest" to having an emergency fund, a retirement plan and a brokerage account actually set up.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19, Tailwind CSS 4
- [Clerk](https://clerk.com) for auth, [Convex](https://convex.dev) for saving journey progress
- Recharts (budget charts)

## Getting started

```bash
npm install
cp .env.example .env.local
npx convex dev   # first run: log in, create/link a Convex project, prints NEXT_PUBLIC_CONVEX_URL
```

Then, one-time Clerk setup (clerk.com):

1. Create an application, enable email/password sign-in.
2. Copy the publishable + secret keys into `.env.local`.
3. Under **JWT Templates**, create a template named `convex` (Clerk has a Convex preset). Copy its issuer URL and run:
   ```bash
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-instance.clerk.accounts.dev
   ```

```bash
npm run dev
```

Open <http://localhost:3000>. The journey works without an account (progress is kept in `localStorage`); signing up migrates that progress into Convex — see the invariant in `src/context/AuthContext.jsx` (migrate only if the account has no saved journey yet, so an existing account logging in is never overwritten).

## How the journey is structured

```
src/components/journey/
├── JourneyFlow.jsx        # state, navigation, load/save
├── JourneySidebar.jsx     # section/step list + progress
└── sections/
    ├── index.js           # SECTION_CONFIGS + INITIAL_JOURNEY_DATA
    ├── Welcome/
    ├── About/
    ├── BudgetIncome/
    ├── EmergencyFund/
    ├── Retirement/
    └── Investing/
```

Each section exports a config with `getSteps(journeyData)` returning `[{ name, Component }]`. Steps are computed from the user's answers, so earlier answers can add or remove later steps (e.g. the 401(k) questions only appear for people employed at a company).

Step components receive:

| prop | purpose |
|---|---|
| `journeyData` | all answers so far |
| `updateJourneyData(key, value)` | save an answer (persisted automatically, debounced) |
| `nextStep()` / `prevStep()` | navigate; safe to call right after `updateJourneyData` |
| `goToSection(id, stepIndex?)` | jump elsewhere |

Shared building blocks live in `src/components/ui/` (`StepContainer`, `StepNavigation`, `OptionGrid`, `DollarInput`, `InfoBox`, `GlossaryTerm`) and `useStepTransition` handles the exit animation.

## Backend

```
convex/
├── schema.ts        # one `journeys` table, keyed by Clerk user id
├── journey.ts        # get / save / remove — identity comes from ctx.auth, never a client-passed id
└── auth.config.ts    # tells Convex to trust Clerk's JWTs
```

`src/utils/JourneyStorage.jsx` wraps these behind the same three functions the rest of the app already calls (`saveJourneyToDatabase`, `loadJourneyFromDatabase`, `deleteJourneyFromDatabase`), so `JourneyFlow.jsx` and `useJourneySave.jsx` don't need to know Convex is underneath.

## Scripts

- `npm run dev` — dev server
- `npm run build` / `npm start` — production
- `npm run lint`
