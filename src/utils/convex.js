import { ConvexReactClient } from 'convex/react'

// Single shared client: used both by <ConvexProviderWithClerk> (ClientLayout)
// and directly by JourneyStorage.jsx's imperative save/load/delete calls, so
// both go through the same authenticated connection.
export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)
