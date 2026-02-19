# Tattoo Kaohsiung — Migration Plan

## Overview
Clone Honkaku's architecture to create **Tattoo Kaohsiung** — same Next.js/Supabase stack, routing, and logic, with a distinctly different **Cyberpunk-Industrial / Dark Mode / Brutalist** aesthetic.

---

## Phase 1: Global Configuration (Priority)

### 1.1 Design Tokens
| File | Changes |
|------|---------|
| `app/globals.css` | New palette: Deep Charcoal `#1A1A1A`, Neon Electric Blue `#00E5FF`, Industrial Grey; replace bronze with neon accents; update semantic vars |
| `tailwind.config.ts` | Add `neon`, `industrial-grey`; extend `borderRadius` for sharp edges (e.g. `0`); update font families |

### 1.2 Typography
| File | Changes |
|------|---------|
| `app/layout.tsx` | Replace DM Sans + Cormorant with **Inter** (body) + **Oswald** (headings); update `--font-display` to Oswald |

### 1.3 Root Layout
| File | Changes |
|------|---------|
| `app/layout.tsx` | SEO metadata: title, description; body classes |

---

## Phase 2: Branding — Search & Replace

| Find | Replace | Files |
|------|---------|-------|
| `Honkaku Tattoo Studio` | `Tattoo Kaohsiung` | layout.tsx, locales, prisma/seed.ts, tailwind, globals.css |
| `Honkaku` (brand name) | `Tattoo Kaohsiung` | Navbar, Footer, HeroSection, ComingSoon |
| `@honkakutattoostudio` | `@tattookaohsiung` | Footer, ContactContent (update when real handle exists) |
| `honkaku-locale` | `tattookaohsiung-locale` | lib/i18n.ts |
| `honkaku/` (Cloudinary) | `tattookaohsiung/` | lib/cloudinary.ts |

---

## Phase 3: UI Component Styling (No Prop Changes)

| Component | Old Style | New Style |
|-----------|-----------|-----------|
| **Button** | `rounded-sm`, bronze accent, soft hover | `rounded-none`, neon accent, sharp borders, `border-2` high-contrast |
| **Card** | `rounded-sm`, soft border | `rounded-none`, `border-2 border-[color]` |
| **SectionTitle** | `font-serif` (Cormorant) | `font-display` (Oswald), bolder weight |
| **SectionLabel** | luxury watch typography | industrial uppercase, neon underline optional |
| **Input/Textarea** | soft borders | `rounded-none`, `border-2`, focus: neon glow |

---

## Phase 4: Layout & Page Components

| Component | Changes |
|-----------|---------|
| **Navbar** | Brand text → "Tattoo Kaohsiung"; font-display; neon hover |
| **Footer** | Same; update social links display |
| **HeroSection** | "Tattoo Kaohsiung" single line or split; neon accent on CTA; industrial gradient overlay |
| **ComingSoon** | Brand text; accent color; optional grid/noise overlay (cyberpunk) |

---

## Phase 5: SEO & Locales

| Location | Updates |
|----------|---------|
| `app/layout.tsx` | `metadata.title`, `metadata.description` |
| `locales/en.json` | `metadata.title`, `metadata.description`, `footer.copyright` |
| `locales/zh-TW.json` | Same in Chinese |
| Alt text | Sweep GalleryGrid, ArtistShowcase, ArtistDetailContent, BlogContent — ensure "Tattoo Kaohsiung" in descriptive alts where appropriate |

---

## Phase 6: Optional Design Enhancements

- **Grain overlay**: Slightly more visible, or switch to subtle grid/noise for cyberpunk feel
- **Selection**: `::selection` with neon tint
- **Hero animation**: Keep pan or add subtle glitch/scan-line effect
- **Admin/Crimson**: Keep for errors; or use neon-red `#FF3366` for consistency

---

## Execution Order
1. globals.css + tailwind.config.ts  
2. layout.tsx (fonts + metadata)  
3. Branding search-replace (all files)  
4. Button, Card, SectionTitle, SectionLabel  
5. Navbar, Footer, HeroSection, ComingSoon  
6. Locales + remaining components  

---

## ✅ Completed (Feb 2025)

All phases executed. Run `npm run dev` to preview.

**Note:** Update Instagram handle in `Footer.tsx` and `ContactContent.tsx` when you have the real @tattookaohsiung (or new) account. Cloudinary folder is now `tattookaohsiung/` — ensure env is configured for uploads.

---

## Files Modified Summary

```
app/globals.css
app/layout.tsx
tailwind.config.ts
components/ui/Button.tsx
components/ui/Card.tsx
components/ui/SectionTitle.tsx
components/layout/Navbar.tsx
components/layout/Footer.tsx
components/home/HeroSection.tsx
components/ComingSoon.tsx
components/contact/ContactContent.tsx
locales/en.json
locales/zh-TW.json
lib/i18n.ts
lib/cloudinary.ts
prisma/seed.ts
docker-compose.yml
```
