# Tattoo Kaohsiung - Project Structure

## Folder Structure

```
KH-Tattoo/
├── app/
│   ├── (frontend)/                    # Public-facing routes
│   │   ├── page.tsx                   # Home page
│   │   ├── artists/
│   │   │   └── page.tsx               # Artist showcase
│   │   ├── gallery/
│   │   │   └── page.tsx               # Art gallery
│   │   ├── blog/
│   │   │   ├── page.tsx               # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Blog post
│   │   └── contact/
│   │       └── page.tsx               # Booking/contact form
│   ├── admin/                         # Protected admin dashboard
│   │   ├── layout.tsx                 # Admin layout + auth guard
│   │   ├── page.tsx                   # Admin dashboard
│   │   ├── artists/
│   │   │   └── page.tsx               # Artist CRUD
│   │   ├── gallery/
│   │   │   └── page.tsx               # Art uploads management
│   │   └── blog/
│   │       └── page.tsx               # Blog management
│   ├── api/                           # API routes
│   │   ├── artists/
│   │   ├── gallery/
│   │   └── blog/
│   ├── layout.tsx                     # Root layout (nav + footer)
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── ui/                            # Shadcn components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ArtistShowcase.tsx
│   │   └── BookingCTA.tsx
│   └── shared/
│       └── ImageWithHover.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── database.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
│   └── images/
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```
