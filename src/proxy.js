import { clerkMiddleware } from '@clerk/nextjs/server'

// Required by Clerk to attach session state to every request. No routes are
// gated here — every page in this app is reachable signed-out (see
// Landing.jsx); this only makes `auth()`/useUser() work.
export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
