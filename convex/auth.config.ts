// Tells Convex to trust Clerk-issued JWTs. CLERK_JWT_ISSUER_DOMAIN is set in
// Convex's own environment (npx convex env set CLERK_JWT_ISSUER_DOMAIN ...
// or the Convex dashboard) — NOT in .env.local, which only reaches Next.js.
// See the "Clerk JWT template" step in README.md for where this value comes
// from and how to set it.
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
