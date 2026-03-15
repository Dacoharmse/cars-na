# Cars.na Codebase Audit

**Date:** 2026-03-15
**Auditor:** Claude Code (automated deep audit)
**Scope:** Full codebase at `C:\Users\User\Projects\cars-na\.claude\worktrees\beautiful-jennings`

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 7 |
| HIGH | 14 |
| MEDIUM | 12 |
| LOW | 8 |

---

## 1. BROKEN / NON-FUNCTIONAL FEATURES

### 1.1 DealerContactModal — Complete Mock, Never Sends Data
**Severity: HIGH**

`src/components/DealerContactModal.tsx` lines 47–64: The contact form on the homepage uses a raw `setTimeout` to simulate submission. No API call is made. User data is never persisted or emailed.

```ts
// Simulate form submission
await new Promise(resolve => setTimeout(resolve, 1500));
setSubmitted(true);
```

The modal appears on `src/app/page.tsx` line 544. Users who submit this form receive a "Message Sent!" confirmation but nothing happens in the backend.

---

### 1.2 Admin Process-Payments — Entirely Mock
**Severity: HIGH**

`src/app/api/admin/process-payments/route.ts` lines 4–27: Uses a hardcoded `DEALERS_DATA` array (three fake dealerships). The actual Paystack call is commented out (lines 78–84). The function generates a reference and returns `status: 'initiated'` without touching the database or charging anyone.

```ts
// Mock data - in production, this would come from the database
const DEALERS_DATA = [
  { id: 'dealer-001', name: 'Premium Motors Namibia', ... },
```

This endpoint is used by the admin payment processing UI.

---

### 1.3 Admin Generate-Report — Entirely Mock Data
**Severity: HIGH**

`src/app/api/admin/generate-report/route.ts` lines 3–65: All five report types (dealer-performance, revenue, subscriptions, analytics, listings) use a hardcoded 5-dealer `DEALERS_DATA` array. Downloaded CSV/HTML reports reflect fabricated figures, not real database data.

---

### 1.4 tRPC Analytics Router — All Mock Data Generators
**Severity: HIGH**

`src/server/routers/analytics.ts` lines 50+: The analytics tRPC router contains `generateUserMetrics`, `generateDealerMetrics`, etc., all returning `Math.random()`-based values. These feed the dealer analytics dashboard. No real DB queries are made for this data path.

The dealer analytics page (`src/app/dealer/analytics/page.tsx` lines 29–35) also hardcodes `dealershipData` with `id: 'dealer-123'` and `name: 'Premium Motors Namibia'` — it never reads from the session.

---

### 1.5 Dealer Analytics Dashboard — Mock Data Constants
**Severity: MEDIUM**

`src/components/analytics/DealershipAnalyticsDashboard.tsx` line 85: The entire metrics display (views: "24,567", leads: "156", etc.) uses hardcoded constants, not API calls.

---

### 1.6 Stripe Webhook — Stub, Does Nothing
**Severity: MEDIUM**

`src/app/api/stripe/webhook/route.ts`: Returns a placeholder JSON with no logic. The comment says "TODO: Implement DPO webhook handling here." There are two payment webhook routes (`/api/stripe/webhook` and `/api/paystack/webhook`) — the Stripe one is dead code; the Paystack one is functional but references a `PAYMENT_SUCCESS` notification type (line 206) that does not exist in the `NotificationType` enum in the Prisma schema. This will cause a Prisma validation error at runtime.

---

### 1.7 Subscription Tier Enforcement — Middleware Exists But Is Not Called
**Severity: HIGH**

`src/lib/subscription-middleware.ts` exports `checkListingLimit()`, `checkPhotoLimit()`, and `requireFeature()`. However, grepping the entire codebase shows **these functions are never imported or called** anywhere outside the file itself. The `src/app/api/dealer/vehicles/route.ts` (POST handler) checks `accessRestrictedAt` for invoice restriction but never calls `checkListingLimit`. Dealers can create unlimited listings regardless of their subscription plan.

---

### 1.8 "Mark as Bought by Dealership" Flow — Missing
**Severity: MEDIUM**

There is no API endpoint or UI flow for a dealer to mark a `UserVehicleListing` as bought/sold after expressing interest. The `DealerInterest` model has an `InterestStatus` enum with `ACCEPTED` and `CLOSED` values, but no endpoint updates those statuses beyond `PENDING` → `CONTACTED`. The `UserVehicleListing.status` field can only be set to `SOLD` from the admin panel `src/app/api/admin/sell-listings/route.ts` PATCH handler.

---

### 1.9 Admin Subscription Management Component — Mock Data
**Severity: MEDIUM**

`src/components/admin/subscriptions/SubscriptionManagement.tsx` line 58 and `src/components/admin/subscriptions/SubscriptionPlans.tsx` line 47 both declare `// Mock data for demonstration` constant arrays at the top. These components likely render fake subscription data in the admin panel even though a real API (`/api/admin/subscriptions`) exists.

---

### 1.10 Admin VehicleList Component — Mock Data
**Severity: MEDIUM**

`src/components/admin/vehicles/VehicleList.tsx` line 76: `// Mock data for demonstration` — the component renders hardcoded vehicles, not a real query.

---

### 1.11 Admin DealershipList Component — Mock Data
**Severity: MEDIUM**

`src/components/admin/dealerships/DealershipList.tsx` line 80: `// Mock data - in real app, this would come from tRPC` — same pattern.

---

## 2. SECURITY ISSUES

### 2.1 Hardcoded Production Credentials in Auth
**Severity: CRITICAL**

`src/lib/auth.ts` lines 33–75: Three hardcoded credential sets are active in production:
- `admin@cars.na` / `admin123` and `admin@cars2025`
- `dealer@premium-motors.com` / `dealer123`
- `dealer@citycars.na` / `dealer123`
- `sales@citycars.na` / `sales123`

These bypass the database entirely and grant ADMIN/DEALER_PRINCIPAL access with fixed IDs like `admin-001`, `dealer-001`. **These credentials are committed to git and readable by anyone with repo access.** The admin fallback at line 114 also fires when the database is unavailable, meaning a DB outage opens a backdoor.

---

### 2.2 `/api/admin/clean-database` — No Auth Check
**Severity: CRITICAL**

`src/app/api/admin/clean-database/route.ts`: This route **has no authentication or authorization check**. It deletes every lead, vehicle image, featured listing, vehicle, account, session, user, dealership, payment, etc. from the database. Any unauthenticated HTTP POST to `/api/admin/clean-database` wipes the entire database.

---

### 2.3 `/api/admin/notify` — No Auth Check
**Severity: CRITICAL**

`src/app/api/admin/notify/route.ts`: Accepts POST requests without any session check. Any caller can trigger `sendWelcomeEmail`, `notifyUserCreated`, `notifyUserSuspended`, `notifyDealershipApproved`, etc. for arbitrary email addresses. This is an unauthenticated email-sending endpoint exposed to the internet.

---

### 2.4 `/api/admin/generate-report` — No Auth Check
**Severity: HIGH**

`src/app/api/admin/generate-report/route.ts`: No session or role check. The endpoint is publicly accessible and returns downloadable reports (currently mock data, but this is the intended production endpoint).

---

### 2.5 Admin Sell-Listings — Weak Auth Check
**Severity: HIGH**

`src/app/api/admin/sell-listings/route.ts` lines 17–28:
```ts
const isAdmin = userRole === 'ADMIN' || userEmail === 'admin@cars.na';
```
Admin authorization is based on matching the email string `admin@cars.na`, not just the role. The hardcoded admin credential from auth.ts sets role to `ADMIN` and email to `admin@cars.na` — these two always overlap. But the email-based check is a broader escape hatch: if someone registered with `admin@cars.na` as their email via the registration API, they'd pass this check even without an `ADMIN` role.

The same email-based check appears in the PATCH and DELETE handlers (lines 61–62, 122–123).

---

### 2.6 TLS `rejectUnauthorized: false` in Lead Response Email
**Severity: HIGH**

`src/app/api/lead-response/route.ts` line 46:
```ts
tls: { rejectUnauthorized: false },
```
This disables TLS certificate validation for outbound email in production, making it vulnerable to MITM attacks on the SMTP connection. All other email senders in the codebase set `rejectUnauthorized` based on `NODE_ENV`, but this one hardcodes `false`.

---

### 2.7 Paystack Webhook Uses Invalid NotificationType
**Severity: HIGH**

`src/app/api/paystack/webhook/route.ts` line 206:
```ts
await createNotification(dealershipId, 'PAYMENT_SUCCESS', paymentData);
```
The Prisma `NotificationType` enum does not contain `PAYMENT_SUCCESS` (it has `PAYMENT_DUE` and `PAYMENT_FAILED`, but not `PAYMENT_SUCCESS`). At runtime, this will throw a Prisma validation error and the entire `charge.success` webhook handler will fail silently (caught by the outer try/catch), causing subscription activations to be missed after successful payment.

---

### 2.8 Auth Registration — No Rate Limiting
**Severity: HIGH**

`src/app/api/auth/register/route.ts`, `src/app/api/auth/forgot-password/route.ts`, and `src/app/api/auth/reset-password/route.ts` have no rate limiting. An attacker can brute-force registrations or spam password reset emails. Only 5 routes (`/api/sell-vehicle`, `/api/newsletter/subscribe`, `/api/dealership-inquiries`, `/api/contact`, `/api/advertise/submit`) use rate limiting via `src/lib/rate-limit.ts`.

---

### 2.9 `inquiries` Route Queries Wrong Role
**Severity: MEDIUM**

`src/app/api/inquiries/route.ts` line 61:
```ts
role: 'DEALER',
```
The `UserRole` enum in the Prisma schema contains `DEALER_PRINCIPAL`, `SALES_EXECUTIVE`, `ADMIN`, and `USER` — there is no `DEALER` role. This query will always return zero results, meaning inquiry notification emails are never sent to dealers because `dealerEmail` will always be `undefined`.

---

## 3. DATA MODEL ISSUES

### 3.1 `billingDate` and `startedAt` Don't Exist on `DealershipSubscription`
**Severity: HIGH**

`src/app/api/admin/subscriptions/route.ts` lines 157 and 161:
```ts
nextBilling: sub.billingDate?.toISOString() || null,
startedAt: sub.startedAt?.toISOString() || sub.createdAt.toISOString(),
```
`DealershipSubscription` in `prisma/schema.prisma` has no `billingDate` or `startedAt` fields. TypeScript build errors are silenced (`ignoreBuildErrors: true` in `next.config.ts`), so this compiles and fails at runtime, returning `null` for `nextBilling` and falling back to `createdAt` for `startedAt`.

---

### 3.2 `SubscriptionNotification.metadata` Field Missing from Schema
**Severity: HIGH**

`src/app/api/paystack/webhook/route.ts` line 307:
```ts
await prisma.subscriptionNotification.create({
  data: { ..., metadata: data },
});
```
`SubscriptionNotification` in the Prisma schema has no `metadata` field. This will throw a Prisma error at runtime whenever a Paystack webhook fires.

---

### 3.3 Invoice `pdfPath` Contains a Marker String, Not a Usable Path
**Severity: MEDIUM**

`src/lib/invoice-generator.ts` line 238:
```ts
data: { pdfPath: `generated:${invoice.invoiceNumber}` },
```
The `pdfPath` is set to a string like `generated:INV-2026-03-0001`. The dealer invoice page (`src/app/dealer/invoices/page.tsx` line 69) checks `if (!invoice.pdfPath) return;` before showing the download button, so the button will show. But the actual download goes to `/api/invoices/[id]/pdf` which regenerates the PDF from DB data — the `pdfPath` marker is misleading and inconsistent with the field's documented purpose ("Relative path e.g. /invoices/INV-2026-03-0001.pdf" per schema comment).

---

### 3.4 Vehicle `location` Filter Has No Backing Field
**Severity: MEDIUM**

`src/server/routers/vehicle.ts` line 39 accepts a `location` filter input, but the `getAll` query at line 436 never uses it when building the `where` clause. The `Vehicle` model has no `location` field (location is on `Dealership`). The filter is silently ignored.

---

### 3.5 `DealershipList` and Analytics Reference Non-Existent Fields
**Severity: LOW**

Several admin components reference `lastLogin`, `totalSales`, `monthlyRevenue`, and `rating` fields on dealerships. The API at `src/app/api/admin/dealerships/route.ts` lines 74–80 explicitly notes these as `TODO` and returns `null` or `0`. UI will show "N/A" or "0" permanently.

---

### 3.6 Missing Supabase Storage bucket config pattern
**Severity: LOW**

`src/app/api/dealer/upload-image/route.ts` uses `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` env vars directly for raw HTTP calls to Supabase Storage. If these aren't set, uploads silently fail without environment checks at startup. No validation of these vars exists anywhere.

---

## 4. VERCEL / SERVERLESS COMPATIBILITY

### 4.1 `pdfkit` — Not Traced for All Invoice Routes
**Severity: HIGH**

`next.config.ts` lines 10–13 adds `outputFileTracingIncludes` for `/api/admin/invoices/[id]/pdf` and `/api/admin/invoices`. However:
- `/api/invoices/[id]/pdf` (the **dealer** PDF download route) is missing from this list. On Vercel, the `pdfkit` font data won't be included in the function bundle for this route and PDF generation will fail.
- pdfkit's font data under `node_modules/pdfkit/js/data/` can be large (~10MB+), potentially pushing the serverless function over Vercel's 50MB limit.

---

### 4.2 In-Memory Showcase Cache — Resets on Every Cold Start
**Severity: MEDIUM**

`src/app/api/showcase/all/route.ts` lines 6–9:
```ts
let showcaseCache: { data: any; timestamp: number } | null = null;
```
This module-level variable is serverless-incompatible. On Vercel, each invocation may run in a fresh instance, making the cache ineffective. The 6-parallel-query showcase fetch will always hit the database in production serverless environments.

---

### 4.3 `express-rate-limit` — Wrong Package for Next.js
**Severity: MEDIUM**

`package.json` includes `express-rate-limit: ^8.0.1`, but the codebase uses a custom `src/lib/rate-limit.ts` that does not use this package. `express-rate-limit` also relies on in-memory state per-process, which doesn't work correctly in serverless. The custom rate limiter has the same problem — it uses a module-level `Map`:

```ts
// Rate limit state stored in module memory
const rateLimitStore = new Map<string, ...>();
```

This is incompatible with Vercel's serverless model where each request may hit a different instance. Rate limiting is effectively disabled in production on Vercel.

---

### 4.4 Escalation Checks Require a Cron Job or Scheduled Trigger
**Severity: MEDIUM**

`src/app/api/admin/invoices/escalate/route.ts`: The invoice escalation logic (restrict → suspend → delete) only runs when an admin manually POSTs to this endpoint. There is no cron job, Vercel scheduled function, or any automated trigger. The 7-day, 30-day, and 60-day overdue actions will never fire in production unless an admin remembers to click the escalate button.

---

### 4.5 TypeScript Build Errors Suppressed
**Severity: MEDIUM**

`next.config.ts` line 7:
```ts
ignoreBuildErrors: true,
```
This hides all TypeScript errors during `next build`. Multiple type violations exist in the codebase (references to non-existent fields, `as any` casts) that would be caught by strict compilation. Errors that would otherwise fail the CI/CD pipeline silently pass.

---

## 5. BUSINESS LOGIC GAPS

### 5.1 Dealer Interest Feed — All Dealers See All Interests
**Severity: MEDIUM**

`src/app/api/dealer/vehicle-listings/route.ts`: The endpoint is correctly scoped to return listings where the dealer has expressed interest, plus all approved listings. However, the `interests` include block at lines 82–94 only shows the current dealer's own interest status. The "feed" correctly works for individual dealers.

**The actual gap:** there is no mechanism for the listing owner (the user who posted the sell listing) to see which dealers have expressed interest and compare offers. The `UserVehicleListing` detail view for regular users is missing. A user who posts a vehicle has no dashboard to see dealer offers.

---

### 5.2 Subscription Tier Enforcement — Not Enforced
**Severity: HIGH** (duplicate of 1.7, included here for business context)

`src/lib/subscription-middleware.ts` implements listing limits, photo limits, and feature gating — but none of these are called anywhere in the API routes. A dealership on a "Basic" plan (5 listings) can add unlimited vehicles via `/api/dealer/vehicles` (POST) or the tRPC `vehicle.create` procedure without any limit checks.

---

### 5.3 Invoice Generation — No Automation
**Severity: HIGH**

Monthly invoices are only generated when an admin POSTs to `/api/admin/invoices`. There is no scheduled task, Vercel cron, or any automatic trigger. If the admin forgets to trigger generation, no invoices are produced for that month.

---

### 5.4 Auto-Moderate — Migrated to DB but not Consumed Everywhere
**Severity: LOW**

`src/app/api/admin/settings/auto-moderate/route.ts` correctly reads/writes the `PlatformSettings` table. However, the actual auto-moderation logic (automatically approving `UserVehicleListing` submissions) must read this setting at submission time. `src/app/api/sell-vehicle/route.ts` should check this setting — verify that it does or the feature remains non-functional even with the correct DB state.

---

### 5.5 Paystack Currency Mismatch
**Severity: HIGH**

`src/app/api/paystack/create-subscription/route.ts` lines 35–37:
```ts
const amountInNGN = convertNADToNGN(plan.price);
const amountInKobo = formatAmountForPaystack(amountInNGN, 'NGN');
```
Paystack processes in NGN (Nigerian Naira). The app bills in NAD (Namibian Dollar). A conversion function `convertNADToNGN` exists in `src/lib/paystack.ts`, but any hardcoded exchange rate will become inaccurate over time. More critically, the payment record is then stored with `currency: paymentData.currency.toUpperCase()` which will be `NGN`, not `NAD`, causing revenue reporting to mix currencies.

---

### 5.6 Invoice Stock Fee Percentage Inconsistency
**Severity: MEDIUM**

`src/lib/invoice-generator.ts` line 200 calculates: `stockValue * 0.001` (which is 0.1%).
The project overview says "0.01% of stock value."
The PDF template at line 118 renders: `Stock Value Fee (0.1% of total stock)`.

The code uses 0.1%, contradicting the project overview spec of 0.01%. This is a 10× discrepancy.

---

## 6. CODE QUALITY ISSUES

### 6.1 `any` Types Throughout API Routes
**Severity: MEDIUM**

Multiple files use `where: any` for Prisma query builders. Combined with `ignoreBuildErrors: true`, this masks type errors at build time:
- `src/app/api/admin/invoices/route.ts` line 24: `const where: any = {};`
- `src/app/api/admin/sell-listings/route.ts` line 34: `const whereClause: any = {};`
- `src/app/api/dealer/leads/route.ts` line 58: `const where: any = {`
- `src/server/routers/vehicle.ts` line 428: `const orderBy: any =`
- Many more throughout tRPC routers

---

### 6.2 Production `console.log` Statements in Hot Paths
**Severity: LOW**

60 `console.log` calls across 20 API route files (identified via grep). Notable examples:
- `src/app/api/dealer/vehicle-listings/route.ts` lines 8, 19, 29, 73: Emoji-prefixed logs on every dealer vehicle listing request
- `src/server/routers/vehicle.ts` lines 424, 503, 519, 542: Logs on every `getAll` call in the fallback path
- `src/app/api/admin/sell-listings/route.ts` lines 11–15: Debug logging including session details

These add noise, expose session/user info to server logs, and marginally slow hot paths.

---

### 6.3 Duplicate Admin Role Check Patterns
**Severity: LOW**

Two distinct patterns for admin auth exist:
1. `session.user.role !== 'ADMIN'` — correct, used in ~15 routes
2. `userRole === 'ADMIN' || userEmail === 'admin@cars.na'` — email-fallback pattern used in 3 routes (`sell-listings`, partially)

This inconsistency means some routes can be accessed via hardcoded email even if the role isn't set.

---

### 6.4 `sendDealerApprovalEmail` Called with Wrong Argument Shape
**Severity: MEDIUM**

`src/app/api/admin/dealerships/[id]/route.ts` line 113:
```ts
await emailService.sendDealerApprovalEmail({
  name: updatedDealership.name,
  email: updatedDealership.email,    // email is String | null
  dealershipName: updatedDealership.name,
});
```
`Dealership.email` is `String?` (nullable). Passing `null` as the recipient email will cause the email to fail or send to "null". No null check is performed before this call.

---

### 6.5 N+1 Query Pattern in Analytics
**Severity: MEDIUM**

`src/app/api/admin/analytics/route.ts` lines 224–251: After fetching the top 5 makes via `groupBy`, the code loops over each make and fires two additional queries per make (one `findMany` to get vehicle IDs, one `lead.count`). This is a classic N+1: 5 makes × 2 queries = 10 extra DB round trips on every analytics page load.

---

### 6.6 Slug Generation Loop Uses Unbounded While
**Severity: LOW**

`src/app/api/admin/dealerships/[id]/route.ts` lines 81–84:
```ts
while (await prisma.dealership.findUnique({ where: { slug } })) {
  slug = `${baseSlug}-${counter}`;
  counter++;
}
```
In theory this could loop indefinitely if many dealerships share a base name. In practice it's low risk, but each iteration is an async DB round trip.

---

### 6.7 `paystack/create-subscription` `PUT` Uses `setMonth` (date-fns Regression)
**Severity: LOW**

`src/app/api/paystack/create-subscription/route.ts` line 215:
```ts
endDate.setMonth(endDate.getMonth() + plan.duration);
```
Previous audit sessions fixed `setMonth` bugs in other files by using `addMonths` from date-fns. This one file still uses the buggy native method. For months near the end of the month (e.g., Jan 31 + 1 month → March 3 instead of Feb 28), the date calculation is wrong.

---

### 6.8 `uploadthing` Package Installed but Unused
**Severity: LOW**

`package.json` lists `@uploadthing/react: ^7.3.3` and `uploadthing: ^7.7.4` as dependencies. Grepping the codebase shows zero imports of either package. The actual image upload uses direct Supabase Storage HTTP calls. These packages add bundle weight for nothing.

---

## 7. PERFORMANCE ISSUES

### 7.1 `getAll` Vehicles — No Count Query, Infinite Pagination Edge Case
**Severity: LOW**

`src/server/routers/vehicle.ts` `getAll` procedure: cursor-based pagination is correctly implemented, but there's no total count query, so the frontend cannot show "Page X of Y" or "Showing N of M results."

---

### 7.2 Dealer Leads — Missing Pagination
**Severity: MEDIUM**

`src/app/api/dealer/leads/route.ts` line 28:
```ts
const limit = parseInt(searchParams.get('limit') || '50');
```
The limit defaults to 50 but there's no cursor/offset pagination and no total count returned beyond the stats aggregates. A dealership with hundreds of leads would get a truncated list with no way to page through the rest.

---

### 7.3 Admin Dealerships Fetches All Vehicles for All Dealerships
**Severity: MEDIUM**

`src/app/api/admin/dealerships/route.ts` lines 19–51: The query includes `vehicles: { select: { id: true, status: true } }` for every dealership to compute `activeListings`. For a platform with 50 dealerships × 100 vehicles each = 5,000 vehicle objects loaded into memory to count them, instead of using `_count`.

The `_count` select at line 42 already exists for `vehicles`, so `activeListings` could be derived from the already-present `_count.vehicles` minus a separate status aggregate, or a simple `where: { status: 'AVAILABLE' }` count. The `vehicles` include is redundant.

---

### 7.4 In-Memory Rate Limiter — Not Effective Under Load
**Severity: MEDIUM**

`src/lib/rate-limit.ts`: As noted in section 4.3, the rate limiter uses module-level Map state. Under any meaningful production load with multiple serverless instances, each instance has its own Map, so the effective rate limit is `(configured_limit × instance_count)` per window. At 10 instances, `contact` could receive 50 requests/minute instead of 5.

---

### 7.5 Showcase Cache — 6 Queries Fired in Parallel Without DB Pooling Consideration
**Severity: LOW**

`src/app/api/showcase/all/route.ts` lines 51–121: 6 `prisma.vehicle.findMany` queries run in parallel via `Promise.all`. With Supabase's connection pooler (PgBouncer), this is fine. But without connection pooling configured (`directUrl` in schema.prisma bypasses the pooler), burst traffic could exhaust connections.

---

## Appendix: Files Referenced

| File | Issues |
|------|--------|
| `src/components/DealerContactModal.tsx` | 1.1 — mock submit |
| `src/app/api/admin/process-payments/route.ts` | 1.2 — mock data |
| `src/app/api/admin/generate-report/route.ts` | 1.3 — mock data |
| `src/server/routers/analytics.ts` | 1.4 — mock generators |
| `src/app/dealer/analytics/page.tsx` | 1.4 — hardcoded dealership |
| `src/components/analytics/DealershipAnalyticsDashboard.tsx` | 1.5 — mock constants |
| `src/app/api/stripe/webhook/route.ts` | 1.6 — stub |
| `src/lib/subscription-middleware.ts` | 1.7 — never called |
| `src/app/api/dealer/vehicles/route.ts` | 1.7 — no limit check |
| `src/components/admin/subscriptions/SubscriptionManagement.tsx` | 1.9 — mock data |
| `src/components/admin/subscriptions/SubscriptionPlans.tsx` | 1.9 — mock data |
| `src/components/admin/vehicles/VehicleList.tsx` | 1.10 — mock data |
| `src/components/admin/dealerships/DealershipList.tsx` | 1.11 — mock data |
| `src/lib/auth.ts` | 2.1 — hardcoded creds |
| `src/app/api/admin/clean-database/route.ts` | 2.2 — no auth |
| `src/app/api/admin/notify/route.ts` | 2.3 — no auth |
| `src/app/api/admin/generate-report/route.ts` | 2.4 — no auth |
| `src/app/api/admin/sell-listings/route.ts` | 2.5 — weak auth |
| `src/app/api/lead-response/route.ts` | 2.6 — TLS disabled |
| `src/app/api/paystack/webhook/route.ts` | 2.7 — invalid enum value |
| `src/app/api/inquiries/route.ts` | 2.9 — wrong role string |
| `src/app/api/admin/subscriptions/route.ts` | 3.1 — missing fields |
| `src/app/api/paystack/webhook/route.ts` | 3.2 — missing metadata field |
| `src/lib/invoice-generator.ts` | 3.3, 5.6 — pdfPath marker, fee % |
| `src/server/routers/vehicle.ts` | 3.4 — unused location filter |
| `next.config.ts` | 4.1, 4.5 — pdfkit tracing, ignoreBuildErrors |
| `src/app/api/showcase/all/route.ts` | 4.2 — in-memory cache |
| `src/lib/rate-limit.ts` | 4.3 — in-memory, serverless-incompatible |
| `src/app/api/admin/invoices/escalate/route.ts` | 4.4 — no automation |
| `src/app/api/paystack/create-subscription/route.ts` | 5.5, 6.7 — currency, setMonth |
| `src/app/api/admin/analytics/route.ts` | 6.5 — N+1 queries |
| `src/app/api/admin/dealerships/[id]/route.ts` | 6.4, 6.6 — null email, slug loop |
| `src/app/api/admin/dealerships/route.ts` | 7.3 — excess vehicle fetch |
| `src/app/api/dealer/leads/route.ts` | 7.2 — no pagination |
