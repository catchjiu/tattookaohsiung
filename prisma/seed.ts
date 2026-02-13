/**
 * Honkaku Tattoo Studio — Curated Seed
 * Kaohsiung's flagship destination for world-class ink.
 * Editorial-grade copy. No placeholders.
 */

import { config } from "dotenv";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: ".env.local" });
config({ path: ".env" });

const connectionString = process.env.DATABASE_URL ?? "postgresql://localhost:5432/kh_tattoo";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─────────────────────────────────────────────────────────────────────────
  // Admin User — Default login for admin panel
  // ─────────────────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@honkakutattoo.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      name: "Studio Admin",
    },
    update: {},
  });
  // ─────────────────────────────────────────────────────────────────────────
  // Artists — Three distinct voices
  // ─────────────────────────────────────────────────────────────────────────

  const founder = await prisma.artist.upsert({
    where: { slug: "lin-weimin" },
    create: {
      name: "Lin Wei-Min",
      slug: "lin-weimin",
      bio: "Founder and principal. Lin approaches the body as architectural terrain—each piece a deliberate intervention in negative space. His work draws from brutalist geometry, Japanese sumi-e discipline, and a lifelong obsession with the weight of black. Every line is a decision. Every void, intentional. Based in Kaohsiung; consulted globally.",
      specialty: "Brutalist Blackwork",
      status: "AVAILABLE",
      avatarUrl: "https://images.unsplash.com/photo-1568515041317-4c1a7c936ee0?w=800&q=80",
      instagramUrl: "https://instagram.com/honkaku_lin",
      sortOrder: 0,
    },
    update: {},
  });

  const perfectionist = await prisma.artist.upsert({
    where: { slug: "chen-yu-ling" },
    create: {
      name: "Chen Yu-Ling",
      slug: "chen-yu-ling",
      bio: "The skin is parchment. The needle, a brush. Chen specializes exclusively in single-needle, microscopic fine-line realism—pieces that demand hundreds of hours and a surgeon's precision. Her work has been described as 'breathing photographs': hyper-detailed portraits, botanical studies, and the kind of fur rendering that makes viewers reach out to touch. Patience is her medium.",
      specialty: "Single-Needle Fine-Line",
      status: "AVAILABLE",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
      instagramUrl: "https://instagram.com/chenyu_fineline",
      sortOrder: 1,
    },
    update: {},
  });

  const resident = await prisma.artist.upsert({
    where: { slug: "mika-tanaka" },
    create: {
      name: "Mika Tanaka",
      slug: "mika-tanaka",
      bio: "Guest resident. Tokyo–Berlin–Kaohsiung. Mika's work exists in the space between control and chaos—fluid, brush-stroke contemporary pieces that feel like captured motion. She treats ink like watercolour: bleeding edges, layered translucency, compositions that shift with the body. Ephemeral in spirit, permanent in execution. Limited residency.",
      specialty: "Fluid Contemporary",
      status: "AVAILABLE",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      instagramUrl: "https://instagram.com/mika_fluid_ink",
      sortOrder: 2,
    },
    update: {},
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Portfolio — Lin Wei-Min (Brutalist Blackwork)
  // ─────────────────────────────────────────────────────────────────────────

  const linPortfolio = [
    {
      url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&q=80",
      altText: "Full back piece: geometric abstraction in pure black. Negative space forms a cathedral-like void through the spine. The ink sits heavy, matte, almost architectural—as if the skin has been carved rather than marked.",
      title: "Cathedral Void",
      category: "blackwork",
      tags: ["Blackwork", "Geometric"],
      sortOrder: 0,
    },
    {
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
      altText: "Sleeve: brutalist lattice work. Interlocking triangles and sharp angles create a cage of shadow around the arm. The piece reads as both armour and vulnerability—a philosophical tension Lin returns to obsessively.",
      title: "Brutalist Lattice",
      category: "geometric",
      tags: ["Geometric", "Blackwork"],
      sortOrder: 1,
    },
    {
      url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
      altText: "Chest panel: single massive form—a black circle with a precise cut-out. The placement follows the sternum. Minimal. Devastating. The void is the subject.",
      title: "The Void",
      category: "blackwork",
      tags: ["Blackwork", "Minimal"],
      sortOrder: 2,
    },
    {
      url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80",
      altText: "Ribs: vertical bands of varying density—gradients from solid black to barely-there grey. The effect is rhythmic, almost musical. Skin becomes score.",
      title: "Skin as Score",
      category: "abstract",
      tags: ["Abstract", "Blackwork"],
      sortOrder: 3,
    },
  ];

  await prisma.portfolioImage.deleteMany({ where: { artistId: founder.id } });
  await prisma.portfolioImage.createMany({
    data: linPortfolio.map((p, i) => ({
      artistId: founder.id,
      url: p.url,
      altText: p.altText,
      title: p.title,
      category: p.category,
      tags: p.tags,
      sortOrder: i,
    })),
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Portfolio — Chen Yu-Ling (Single-Needle Fine-Line)
  // ─────────────────────────────────────────────────────────────────────────

  const chenPortfolio = [
    {
      url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80",
      altText: "Inner forearm: hyper-detailed, micro-realism portrait of a male long-haired dachshund. Rendered exclusively with single-needle technique. Every strand of fur—the wiry texture of the coat, the soft fringe along the ears—is individually articulated. The eyes hold a soulful depth that stops viewers mid-step. A memorial piece executed with the precision of a Renaissance miniature.",
      title: "Long-Haired Dachshund",
      category: "fine-line",
      tags: ["Fine-Line", "Realism", "Pet Portrait"],
      sortOrder: 0,
    },
    {
      url: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80",
      altText: "Upper arm: botanical study—a single magnolia bloom in full detail. Petal veins, stamen filaments, the delicate gradient from white to blush. The skin treated as fragile parchment; the needle never rushed.",
      title: "Magnolia Bloom",
      category: "botanical",
      tags: ["Fine-Line", "Botanical"],
      sortOrder: 1,
    },
    {
      url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&q=80",
      altText: "Collarbone: portrait of an elderly hand—wrinkles, age spots, the topography of a life. Single-needle throughout. The texture is so precise it verges on uncanny. A meditation on time and tenderness.",
      title: "Topography of a Life",
      category: "portrait",
      tags: ["Fine-Line", "Portrait"],
      sortOrder: 2,
    },
    {
      url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1200&q=80",
      altText: "Rib: moth in flight—translucent wings, antennae finer than hair. The piece feels like it could lift off the skin. Microscopic detail; monumental patience.",
      title: "Moth in Flight",
      category: "fine-line",
      tags: ["Fine-Line", "Nature"],
      sortOrder: 3,
    },
  ];

  await prisma.portfolioImage.deleteMany({ where: { artistId: perfectionist.id } });
  await prisma.portfolioImage.createMany({
    data: chenPortfolio.map((p, i) => ({
      artistId: perfectionist.id,
      url: p.url,
      altText: p.altText,
      title: p.title,
      category: p.category,
      tags: p.tags,
      sortOrder: i,
    })),
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Portfolio — Mika Tanaka (Fluid Contemporary)
  // ─────────────────────────────────────────────────────────────────────────

  const mikaPortfolio = [
    {
      url: "https://images.unsplash.com/photo-1549497538-303791108f95?w=1200&q=80",
      altText: "Full thigh: ink wash in motion—blacks and greys bleeding into one another like sumi on wet paper. The composition suggests a storm or a wave, but resists definition. Fluid. Ephemeral. Perfectly controlled chaos.",
      title: "Ink Wash in Motion",
      category: "contemporary",
      tags: ["Contemporary", "Fluid"],
      sortOrder: 0,
    },
    {
      url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&q=80",
      altText: "Shoulder blade: brush-stroke abstraction—a single gesture that reads as both calligraphy and dance. The edges bleed deliberately. The piece changes with the body's movement.",
      title: "Calligraphy and Dance",
      category: "abstract",
      tags: ["Abstract", "Contemporary"],
      sortOrder: 1,
    },
    {
      url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=80",
      altText: "Calf: layered translucency—overlapping forms in varying densities. Feathers, perhaps, or smoke. The effect is dreamlike. Mika's signature: chaos that resolves into harmony.",
      title: "Chaos into Harmony",
      category: "fluid",
      tags: ["Fluid", "Contemporary"],
      sortOrder: 2,
    },
    {
      url: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=1200&q=80",
      altText: "Inner bicep: a single stroke—one continuous line that suggests a bird in flight, a wave, a breath. Minimal. Evocative. The kind of piece that rewards repeated viewing.",
      title: "A Single Stroke",
      category: "contemporary",
      tags: ["Contemporary", "Minimal"],
      sortOrder: 3,
    },
  ];

  await prisma.portfolioImage.deleteMany({ where: { artistId: resident.id } });
  await prisma.portfolioImage.createMany({
    data: mikaPortfolio.map((p, i) => ({
      artistId: resident.id,
      url: p.url,
      altText: p.altText,
      title: p.title,
      category: p.category,
      tags: p.tags,
      sortOrder: i,
    })),
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Booking Requests — High-profile, respectful inquiries
  // ─────────────────────────────────────────────────────────────────────────

  const bookings = [
    {
      artistId: founder.id,
      clientName: "Kenji Sato",
      clientEmail: "k.sato@satodesign.co.jp",
      clientPhone: "+81 90 1234 5678",
      conceptDescription: `I am an architect based in Tokyo, flying to Kaohsiung in March for a design conference. I have admired Lin Wei-Min's work for years—particularly the way he treats negative space as structural. 

I am interested in a large-scale piece on my back: a geometric composition that echoes the brutalist aesthetic of my own work. I have attached reference images of concrete facades and a rough sketch of the silhouette I envision. I understand this will require multiple sessions and am prepared to schedule around the studio's availability. I am also happy to discuss pricing and deposit requirements at your convenience.`,
      placement: "Full back — centre panel",
      status: "PENDING" as const,
    },
    {
      artistId: perfectionist.id,
      clientName: "Eleanor Ashworth",
      clientEmail: "eleanor@ashworthatelier.com",
      clientPhone: "+44 7700 900123",
      conceptDescription: `I am a textile designer from London, visiting Taiwan for a month in April. Chen Yu-Ling's botanical work is extraordinary—the magnolia piece in particular moved me deeply.

I would like to commission a single-needle piece: a detailed study of a camellia bloom, inspired by the specimens in the Royal Botanic Gardens. Placement would be inner forearm, approximately 4" x 6". I have high-resolution reference photographs and understand the time investment required for this level of detail. I am flexible with scheduling and would be honoured to work with Chen.`,
      placement: "Inner forearm, left",
      status: "PENDING" as const,
    },
    {
      artistId: resident.id,
      clientName: "Marcus Chen",
      clientEmail: "marcus@fluid.studio",
      clientPhone: "+886 912 345 678",
      conceptDescription: `I run a contemporary art gallery in Taipei. Mika Tanaka's residency at Honkaku is precisely the kind of cross-pollination the regional scene needs. Her fluid, brush-stroke approach has influenced my own thinking about form and movement.

I am seeking a piece for my upper arm: something that captures the feeling of ink meeting water—that moment of diffusion before control gives way. I have no fixed image in mind; I trust Mika's vision entirely. I am available for consultation and multiple sessions. Budget is not a constraint; I value the work.`,
      placement: "Upper arm, right — wrapping",
      status: "PENDING" as const,
    },
  ];

  await prisma.bookingRequest.deleteMany({});
  await prisma.bookingRequest.createMany({
    data: bookings,
  });

  console.log("Seeding complete: The gallery is curated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
