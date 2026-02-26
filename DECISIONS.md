# HobbySpring MVP - Product & Technical Decisions

## Overview
HobbySpring is a one-stop platform to help users discover curated learning resources across 6 hobbies. This document outlines key architectural and product decisions made during the MVP phase.

## Product Decisions

### 1. Hobby Selection: 6 Static Hobbies
**Decision**: Start with 6 hardcoded hobbies (Gardening, Fitness/Yoga, Cooking/Baking, Photography, Creative Arts, Music) rather than admin-managed hobby catalog.

**Rationale**:
- Simplifies MVP scope and reduces complexity of hobby management
- Allows deep curation of ~20 resources per hobby
- Reduces onboarding friction (fixed choices vs. open-ended)

**Future**: Make hobbies admin-managed with community submissions

---

### 2. Learning Path: 3-Stage Roadmap
**Decision**: Simple 3-level hierarchy (Beginner → Intermediate → Advanced) with modules per stage.

**Rationale**:
- Clear mental model for users at any stage
- Matches common skill progression in hobbies
- Avoids paralysis of too-granular choices

**Future**: Add prerequisite tracking, time-to-proficiency estimates, milestone badges

---

### 3. Personalization: Deterministic Scoring Over ML
**Decision**: Use a simple scoring algorithm (popularity + level match + user feedback) rather than ML.

**Rationale**:
- No external dependencies (ML pipelines, data infrastructure)
- Fully transparent and debuggable
- Scores updated in real-time based on user actions
- MVP can validate if personalization improves retention

**Scoring Formula**:
```
score = (popularity * 30) + (level_match * 40) + (feedback * 30) + (tag_match * 20)
```

**Future**: Migrate to ML if usage patterns merit (e.g., if users engage with low-popularity items)

---

### 4. Authentication: Simple Email Magic Link Mock
**Decision**: Email-based "magic link" authentication with minimal security overhead (no passwords, no OAuth).

**Rationale**:
- MVP validates product fit, not user growth at scale
- Reduces auth infrastructure cost
- Easy to migrate to NextAuth.js later

**Current Implementation**: Hardcoded session cookie (dev only)

**Future**: Implement proper email magic link flow or OAuth (Google, GitHub)

---

### 5. Resource Metadata
**Decision**: Include 9 fields per resource (title, type, url, source, description, tags, level, timeMinutes, freePaid).

**Rationale**:
- Enables sorting/filtering for users seeking specific time commitments
- Supports freemium/paid tier indication
- Tags enable secondary discovery and scoring boost

**Not Included**: Author attribution, reviews/ratings (kept minimal)

---

## Technical Decisions

### 1. Framework: Next.js App Router
**Decision**: Next.js 15 with App Router + TypeScript

**Rationale**:
- Full-stack framework (frontend + API routes in one repo)
- Built-in optimizations (static generation, image optimization)
- Excellent developer experience for rapid MVP iteration
- Handles both UI and API in unified codebase

**Trade-off**: Over-engineered for simple CRUD, but pays off if features scale

---

### 2. Database: SQLite (Local Dev) → Postgres Ready
**Decision**: SQLite via Prisma for fast local iteration; schema ready to migrate to Postgres.

**Rationale**:
- Zero setup (file-based DB)
- Prisma abstracts migrations (easy switch to Postgres)
- Good enough for 1000s of users during MVP phase
- No managed database costs during experimentation

**Migration Path**:
1. Change `datasource` URL in `prisma/schema.prisma` to Postgres connection string
2. Run `prisma db push`
3. No code changes needed

---

### 3. Styling: Tailwind CSS
**Decision**: Utility-first CSS framework (Tailwind) with custom component classes.

**Rationale**:
- Fast to prototype UI without context-switching to CSS files
- Mobile-first responsive design out of the box
- Small bundle size (<50KB gzipped)
- Custom classes (`.btn-primary`) reduce verbosity

---

### 4. Data Modeling: Normalized Schema with Key Relationships
**Decision**: 8 core tables (User, Hobby, UserHobby, Resource, Tag, ResourceTag, UserResource, LearningPath, PathModule, ModuleResource)

**Rationale**:
- Clean separation of concerns (hobbies, resources, user interactions)
- Supports many-to-many relationships (resources ↔ tags, users ↔ hobbies)
- Learning paths linked to resources for future structured learning flows

**Denormalization**: None (kept fully normalized for MVP)

---

### 5. API Design: RESTful Routes
**Decision**: RESTful API routes (POST /api/resources, GET /api/recommendations) rather than GraphQL.

**Rationale**:
- Simpler debugging and monitoring
- Faster for small number of resources
- Lower complexity for MVP scope

**Future**: GraphQL if clients need more granular filtering

---

### 6. Scoring Implementation: Server-Side Logic
**Decision**: Scoring calculated server-side in API route handlers, not in database.

**Rationale**:
- Easier to debug and tweak scoring weights
- Flexible to change scoring based on A/B tests
- Database stays clean (no stored procedures)

**Trade-off**: Slight latency for large result sets (mitigated by pagination later)

---

### 7. Session Management: Simple Cookie
**Decision**: No external session store; session ID stored in httpOnly cookie.

**Rationale**:
- Zero infrastructure cost
- Good enough for <1000 users
- Cryptographically secure (httpOnly flag prevents XSS theft)

**Future**: When needing distributed sessions → Redis + NextAuth.js

---

## Feature Scope: What's NOT in MVP

### Intentionally Excluded (Future)
- **Payments**: No paid resources upsell yet
- **Social**: No user-to-user messaging or communities
- **Notifications**: No email reminders or push alerts
- **Admin Dashboard**: Seed script only for resource management
- **Advanced Analytics**: No user behavior heatmaps
- **Accessibility Levels**: No captions, transcripts, or a11y scoring
- **Internationalization**: English only
- **Offline Mode**: No PWA or sync-to-device
- **API Rate Limiting**: Not needed at MVP scale

### Why?
These features can be validated post-MVP. Adding them now would:
- Double implementation time
- Complicate testing and debugging
- Distract from core value (recommendation + curation)

---

## File Structure

```
HobbySpring/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Tailwind setup
│   ├── page.tsx                   # Landing page
│   ├── onboarding/page.tsx        # Hobby selection
│   ├── dashboard/page.tsx         # User's hobby hub
│   ├── h/[hobbySlug]/page.tsx    # Hobby detail with tabs
│   ├── saved/page.tsx             # Saved resources
│   └── api/
│       ├── auth/login/route.ts    # Login endpoint
│       ├── auth/user/route.ts     # Get current user
│       ├── hobbies/route.ts       # List all hobbies
│       ├── recommendations/route.ts # Get ranked resources
│       ├── resources/route.ts     # Save/update resource status
│       └── onboarding/route.ts    # Add user hobbies
├── components/
│   └── ResourceCard.tsx           # Resource display + actions
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── scoring.ts                 # Recommendation scoring
│   └── auth.ts                    # Session management
├── prisma/
│   ├── schema.prisma              # Data model
│   └── dev.db                     # SQLite file (git-ignored)
├── scripts/
│   └── seed.js                    # Populate DB with hobbies & resources
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── .env.local                     # Environment variables
```

---

## Performance Considerations

### 1. Recommendation Ranking
- **Current**: O(n) scoring for each resource in response
- **Bottleneck**: If >1000 resources per hobby
- **Solution**: Add pagination (`?page=1&limit=20`) server-side
- **Future**: Database indexing on (hobbyId, level) for faster filtering

### 2. Learning Path Generation
- **Current**: Static modules, hard-coded per hobby
- **Future**: Generate modules dynamically from curated resource lists

### 3. Caching Strategy
- **Cache**: Hobbies list (hardly changes) via HTTP caching headers
- **No Cache**: User-specific data (always fresh)
- **Future**: Add Redis for frequently-ranked resource sets

---

## Testing Strategy

### Current (MVP)
1. **Smoke Tests**: 
   - POST /api/auth/login → returns user
   - GET /api/hobbies → returns 6 hobbies
   - GET /api/recommendations?hobby=gardening → returns sorted resources

2. **Manual**: UI/UX tested in dev browser

### Future
- Unit tests for scoring algorithm
- E2E tests for onboarding → recommendation flow
- Load testing for 1000+ concurrent users

---

## What's Next: Post-MVP Roadmap

### Phase 2: Scale & Retention
1. **Email Notifications**: "New resource in your hobby" → improve engagement
2. **Resource Scraping**: Auto-ingest YouTube, Reddit, Medium (reduce manual curation)
3. **User Profiles**: Public profiles showing hobby expertise badges
4. **Leaderboards**: Community engagement (gamification)

### Phase 3: Monetization
1. **Premium Path**: Curated cohort-based courses (paid)
2. **Creator Marketplace**: Hobby experts can sell mini-courses
3. **Sponsorships**: Tool brands sponsor hobby resources

### Phase 4: Community
1. **Forums**: Per-hobby discussion boards
2. **Meetups**: Local hobby groups (via geo-tagging)
3. **Live Classes**: Scheduled group learning sessions

---

## Deployment Checklist

### Ready for Production
- [ ] Migrate to Postgres (change .env DATABASE_URL)
- [ ] Set NEXTAUTH_SECRET to random 32-char string
- [ ] Set NEXTAUTH_URL to production domain
- [ ] Add email verification to login flow
- [ ] Set up error tracking (Sentry)
- [ ] Enable rate limiting on API routes
- [ ] Add CORS restrictions if hosting frontend separately

### Monitoring
- [ ] Track recommendation click-through rate
- [ ] Monitor resource save/completion rates
- [ ] A/B test scoring weights
- [ ] Survey user satisfaction post-hobby

---

## Conclusion

HobbySpring MVP prioritizes **speed → validation → scale**. We've opted for simple, transparent solutions (deterministic scoring, Tailwind over custom CSS, SQLite, REST API) that can be upgraded later. This lets us ship in weeks and learn from real users before over-engineering.

The codebase is intentionally modular: swap Prisma → Drizzle, Tailwind → CSS-in-JS, or SQLite → Postgres with minimal changes. That's the goal of an MVP.

**Ship fast. Learn. Iterate.**
