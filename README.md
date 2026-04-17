# CleanOps Mobile App

React Native / Expo mobile app for the CleanOps cleaning services marketplace.  
Sits alongside the `frontend/` folder — both share the same Supabase backend.

## Folder Structure

```
mobile-app/
├── actions/                      # Supabase calls (mirrors web app/actions/)
│   ├── auth.ts
│   ├── jobs.ts
│   ├── messages.ts
│   └── payments.ts
├── app/                          # Screens (mirrors web app/ structure)
│   ├── _layout.tsx               # Root layout + auth guard
│   ├── index.tsx                 # Redirect to homepage
│   ├── homepage/index.tsx        # Welcome / landing screen
│   ├── login/index.tsx           # Sign in
│   ├── signup/index.tsx          # Register (customer or employee)
│   ├── customer/
│   │   ├── dashboard/index.tsx   # Customer home
│   │   ├── order/index.tsx       # 4-step booking form
│   │   ├── requests/index.tsx    # All jobs with filters
│   │   ├── payment/index.tsx     # Payment history & balance
│   │   └── jobs/[id]/index.tsx   # Job detail + approve
│   ├── employee/
│   │   ├── dashboard/index.tsx   # Employee home + earnings
│   │   ├── feed/index.tsx        # Browse & claim open jobs
│   │   ├── history/index.tsx     # My jobs + mark-as-done
│   │   └── jobs/[id]/index.tsx   # Job detail + claim + chat
│   └── admin/
│       └── dashboard/index.tsx   # Admin manage all jobs
├── components/                   # Mirrors web components/ structure
│   ├── booking/BookingForm.tsx
│   ├── chat/ChatWindow.tsx
│   ├── dashboard/
│   │   ├── QuickStatsRow.tsx
│   │   └── RecentActivityFeed.tsx
│   ├── home/
│   │   ├── FeatureHighlights.tsx
│   │   └── CTABanner.tsx
│   └── shared/
│       ├── JobCard.tsx
│       ├── StatusBadge.tsx
│       ├── StatCard.tsx
│       └── LoadingScreen.tsx
├── lib/
│   ├── supabase.ts               # Supabase client (same project as web)
│   └── authContext.tsx           # Auth state + role detection
├── stores/
│   └── bookingStore.ts           # Booking form constants & price logic
├── types/index.ts                # TypeScript types (matches web types)
├── constants/colors.ts           # Color tokens matching web theme
└── assets/                       # App icons & splash screen
```

## Quick Start

```bash
cd mobile-app
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your Android device.

## User Roles

| Role     | After login goes to            |
|----------|-------------------------------|
| Customer | `/customer/dashboard`          |
| Employee | `/employee/dashboard`          |
| Admin    | `/admin/dashboard`             |

## Notes

- Supabase credentials are pre-configured in `lib/supabase.ts` (same project as the web frontend)
- The `actions/` files are the mobile equivalent of the web's `app/actions/` — same file names, rewritten to use the Supabase JS client directly instead of Next.js server actions
- Navigation uses Expo Router (file-based routing, same concept as Next.js App Router)
