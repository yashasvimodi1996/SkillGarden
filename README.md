# 🌿 HobbySpring

> A one-stop MVP app to grow your hobby with curated, personalized learning resources.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to SQLite
npm run db:push

# Seed with 6 hobbies & sample resources
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features

### 🎯 Hobbies (6 Total)
- Gardening
- Fitness & Yoga
- Cooking & Baking
- Photography
- Creative Arts
- Music

### 📚 For Each Hobby
- **Learning Path**: Beginner → Intermediate → Advanced roadmaps
- **Videos**: Curated video tutorials
- **Articles**: Written guides and tips
- **Communities**: Forums, subreddits, Discord links
- **Saved**: Your personal collection with progress tracking

### ⭐ Personalization
- **Skill Level**: Mark yourself as beginner/intermediate/advanced
- **Smart Ranking**: Resources sorted by popularity, level match, and your feedback
- **Feedback Loop**: Thumbs up/down to tune recommendations
- **Progress Tracking**: Mark resources as "not started" → "in progress" → "done"

### 💾 Free & Simple
- **No Login**: Anonymous (dev mode) — ready for email auth integration
- **No Ads**: Pure learning experience
- **No Paywall**: All resources are free or labeled clearly

---

## Project Structure

```
.
├── app/                           # Next.js App Router
│   ├── api/                       # API routes
│   ├── dashboard/                 # Dashboard after onboarding
│   ├── h/[hobbySlug]/             # Hobby detail page
│   ├── onboarding/                # Hobby selection flow
│   ├── saved/                     # Saved resources
│   ├── globals.css                # Tailwind setup + custom classes
│   └── layout.tsx                 # Root layout
├── components/                    # React components
│   └── ResourceCard.tsx           # Resource card with actions
├── lib/                           # Utilities
│   ├── auth.ts                    # Session/cookie management
│   ├── prisma.ts                  # Prisma client singleton
│   └── scoring.ts                 # Recommendation algorithm
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── dev.db                     # SQLite database (git-ignored)
├── scripts/
│   └── seed.js                    # Populate database
├── DECISIONS.md                   # Architecture & tradeoff docs
└── ...config files                # Next, Tailwind, TypeScript configs
```

---

## Data Models

### Core Entities

**User**: `id`, `email`, `name`, `createdAt`, `updatedAt`
**Hobby**: `id`, `slug`, `name`, `description`, `icon`, `color`
**UserHobby**: `userId`, `hobbyId`, `level`, `goals`
**Resource**: `id`, `title`, `type`, `url`, `source`, `level`, `timeMinutes`, `popularityScore`
**UserResource**: `userId`, `resourceId`, `saved`, `status`, `feedback`
**Tag/ResourceTag**: Many-to-many tagging system
**LearningPath/PathModule/ModuleResource**: Structured learning roadmaps

---

## API Endpoints

- `POST /api/auth/login` — Log in or create user
- `GET /api/auth/user` — Get current user
- `GET /api/hobbies` — List all hobbies
- `GET /api/recommendations?hobby=SLUG&type=TYPE&level=LEVEL` — Get ranked resources
- `POST /api/resources` — Save/update resource
- `POST /api/onboarding` — Add hobbies to user

---

## Personalization Algorithm

Resources ranked by: `(popularity × 30) + (level_match × 40) + (feedback × 30) + (tag_match × 20)`

---

## Development

```bash
npm run db:reset      # Wipe and reseed database
npm run lint          # Lint code
npm run build         # Build for production
npm run start         # Start production server
```

---

## Deployment

Set Postgres connection string in `DATABASE_URL` environment variable and deploy to Vercel or Docker. See [DECISIONS.md](./DECISIONS.md) for details.

---

## What's Next

See [DECISIONS.md](./DECISIONS.md) for post-MVP roadmap including email auth, resource scraping, user profiles, and premium features.

---

**Happy Growing! 🌱→🌿→🌳**
