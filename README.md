# ⚔️ LIFE RPG — Gamify Your Real Life

> **Turn daily tasks into epic quests. Earn XP, collect Gold, level up your character, and spend rewards in the Mystic Bazaar.**

LIFE RPG is a full-stack productivity application that transforms mundane daily habits and tasks into an immersive RPG (Role-Playing Game) experience. Users create a hero character, complete real-life quests to earn XP and Gold, level up through an attribute system, unlock achievements, and spend earned Gold in a rewards shop.

---

## 🎮 Core Idea

Most productivity apps feel boring. LIFE RPG solves this by wrapping habit-tracking in deep RPG mechanics:

1. **Create Your Hero** — Pick a class (Warrior, Scholar, Creator, Explorer), name your character, and begin your journey.
2. **Accept Quests** — Real-life tasks become quests with XP, Gold, and attribute rewards. "Study for 45 minutes" becomes "Study Core Algorithms & Systems" worth 60 XP and 25 Gold.
3. **Complete & Earn** — Finish quests to earn rewards with satisfying animations, confetti, and sound effects.
4. **Level Up** — Accumulate XP to level up your hero rank. Each level unlocks new titles and rewards.
5. **Spend Gold** — Visit the **Mystic Bazaar** (Rewards Shop) to buy vanity gear, themes, badges, and pet companions with your hard-earned Gold.
6. **Track Progress** — View your character sheet, attribute radar, streak history, and achievement wall.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    LIFE RPG SYSTEM                       │
├───────────────────────┬─────────────────────────────────┤
│     FRONTEND (SPA)    │        BACKEND (API)            │
│     React + Vite      │     Express.js + Firebase       │
│     Port 3000         │        Port 5000                │
├───────────────────────┼─────────────────────────────────┤
│  Pages (14 views)     │  REST API (/api/*)              │
│  Components (28+)     │  Firebase Admin SDK             │
│  GameContext (state)   │  Firestore (NoSQL DB)          │
│  ThemeContext (UI)     │  Firebase Auth (verification)   │
│  API Layer (7 modules)│  Gemini AI (quest generation)   │
│  Firebase Client Auth │  Service Account Key            │
└───────────────────────┴─────────────────────────────────┘
```

### Data Flow

```
User Action (click "Complete Quest")
    │
    ▼
GameContext.completeQuest(id)
    │
    ▼
questApi.completeQuest(id) ──► POST /api/quests/:id/complete
    │                                    │
    ▼                                    ▼
Optimistic UI Update              server/db.ts (Firestore batch)
(instant gold/XP display)         ├── Update quest status
    │                              ├── Update character (XP, Gold, Attributes)
    ▼                              ├── Update progress summary
Re-sync from Firestore            ├── Create history record
(ensures persistence)             └── Spawn repeat quest (if Daily/Weekly)
    │
    ▼
Dashboard shows updated Gold, XP, Level
    │
    ▼
User clicks Gold ──► navigates to /rewards ──► Purchases item with Gold
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 19 + TypeScript | Component-based UI |
| **Build Tool** | Vite 6 | Fast dev server & bundler |
| **Routing** | React Router DOM 7 | SPA navigation |
| **Animations** | Framer Motion (motion) + GSAP | Page transitions, modals, card animations |
| **Icons** | Lucide React | 500+ crisp SVG icons |
| **Confetti** | canvas-confetti | Quest completion celebrations |
| **Styling** | Vanilla CSS + Tailwind CSS 4 | Dual theme (dark/light) |
| **Backend** | Express.js 4 | REST API server |
| **Database** | Firebase Firestore | NoSQL document store (per-user collections) |
| **Authentication** | Firebase Auth | Email/password + Google sign-in |
| **AI** | Google Gemini API | AI-powered quest suggestions |
| **Server Auth** | Firebase Admin SDK | Token verification |
| **Runtime** | Node.js + tsx | TypeScript execution |

---

## 📁 Project Structure

```
life/
├── index.html                    # App entry point
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite config (proxy /api → :5000)
├── start-dev.mjs                 # Dev launcher (starts both servers)
├── .env.example                  # Environment variable template
│
├── server/                       # ── BACKEND ──────────────────
│   ├── index.ts                  # Express server, all REST routes
│   ├── db.ts                     # Firestore database operations (UserDatabase class)
│   ├── firebase.ts               # Firebase Admin SDK initialization
│   ├── ai.ts                     # Gemini AI quest generation
│   ├── types.ts                  # Server-side TypeScript interfaces
│   ├── serviceAccountKey.json    # Firebase service account (gitignored)
│   └── data/
│       └── store.json            # Legacy local store fallback
│
├── src/                          # ── FRONTEND ─────────────────
│   ├── main.tsx                  # React DOM render entry
│   ├── App.tsx                   # Router + Provider tree
│   ├── firebase.ts               # Firebase client SDK init
│   ├── index.css                 # Global styles & CSS variables
│   │
│   ├── types/
│   │   └── index.ts              # All shared TypeScript interfaces
│   │
│   ├── context/
│   │   ├── GameContext.tsx        # Global RPG state (character, quests, rewards, actions)
│   │   └── ThemeContext.tsx       # Dark/light theme toggle
│   │
│   ├── api/
│   │   ├── client.ts             # fetchJson helper with Firebase auth token
│   │   ├── store.ts              # In-memory client cache (InMemoryStore)
│   │   ├── authApi.ts            # Login, signup, logout, preferences
│   │   ├── characterApi.ts       # Character CRUD, hero setup, avatar
│   │   ├── questApi.ts           # Quest CRUD, complete quest logic
│   │   ├── rewardApi.ts          # Purchase, equip, toggle rewards
│   │   ├── achievementApi.ts     # Fetch & claim achievements
│   │   ├── progressApi.ts        # Progress summary, history
│   │   └── mockData.ts           # Fallback/demo data & recommended quests
│   │
│   ├── utils/
│   │   ├── rpgEngine.ts          # XP calculations, level formulas, sound engine
│   │   └── timeUtils.ts          # Quest deadline calculations, time formatting
│   │
│   ├── pages/                    # ── 14 PAGE VIEWS ───────────
│   │   ├── LandingPage.tsx       # Marketing landing page
│   │   ├── HowItWorksPage.tsx    # Feature explanation
│   │   ├── LoginPage.tsx         # Email/Google sign-in
│   │   ├── SignUpPage.tsx        # New user registration
│   │   ├── CharacterCreationPage.tsx  # Hero class selection
│   │   ├── DashboardPage.tsx     # Main command deck (stats, quests, attributes)
│   │   ├── QuestsPage.tsx        # Full quest log with filters
│   │   ├── CreateQuestPage.tsx   # Quest inscription form
│   │   ├── DiscoverPage.tsx      # AI-powered quest discovery
│   │   ├── CharacterPage.tsx     # Character sheet, equipment, profile editor
│   │   ├── ProgressPage.tsx      # XP chart, timeline, statistics
│   │   ├── AchievementsPage.tsx  # Achievement wall with progress bars
│   │   ├── RewardsPage.tsx       # Mystic Bazaar shop (buy with Gold)
│   │   └── SettingsPage.tsx      # User preferences, theme, avatar
│   │
│   └── components/
│       ├── layout/
│       │   └── AppLayout.tsx     # Sidebar + TopBar + main content wrapper
│       │
│       ├── common/               # ── 25 REUSABLE COMPONENTS ──
│       │   ├── TopBar.tsx        # Top navigation bar with Gold balance
│       │   ├── Sidebar.tsx       # Desktop sidebar navigation
│       │   ├── MobileNavigation.tsx  # Bottom mobile nav bar
│       │   ├── PillNav.tsx       # Animated pill-style navigation
│       │   ├── Avatar.tsx        # User avatar with initials fallback
│       │   ├── LevelBadge.tsx    # Animated level number display
│       │   ├── XPBar.tsx         # Experience progress bar
│       │   ├── GoldBalance.tsx   # Gold coin counter display
│       │   ├── StreakCard.tsx     # Daily streak visualization
│       │   ├── AttributeCard.tsx # Individual attribute stat card
│       │   ├── QuestCard.tsx     # Quest list item with actions
│       │   ├── CountdownTimer.tsx # Quest deadline countdown
│       │   ├── ThemeToggle.tsx   # Dark/light mode switch
│       │   ├── ToastContainer.tsx # Toast notification system
│       │   ├── LoadingSkeleton.tsx # Skeleton loading states
│       │   ├── EmptyState.tsx    # Empty data placeholder
│       │   ├── ErrorState.tsx    # Error display component
│       │   ├── ErrorBoundary.tsx # React error boundary
│       │   ├── BorderGlow.tsx    # Animated border glow effect
│       │   ├── ClickSpark.tsx    # Click spark particle effect
│       │   ├── Shuffle.tsx       # Card shuffle animation
│       │   └── HowItWorksStrip.tsx # Feature showcase strip
│       │
│       └── modals/
│           ├── QuestCompleteModal.tsx  # Quest completion celebration
│           ├── LevelUpModal.tsx        # Level up announcement
│           └── ConfirmModal.tsx        # Delete/Purchase confirmation
```

---

## 🎲 Game Mechanics

### Character System

| Property | Description |
|----------|-------------|
| **Hero Classes** | Warrior, Scholar, Creator, Explorer — each with unique titles |
| **Level** | Calculated from total XP using formula: `25 × level² + 75 × level` |
| **6 Attributes** | Strength, Intelligence, Wisdom, Discipline, Endurance, Creativity |
| **Equipment Slots** | Weapon, Armor, Boots, Ring, Pet |
| **Gold** | Earned from quests, spent in the Rewards Shop |
| **Streak** | Consecutive days of quest completion |

### Quest System

| Feature | Details |
|---------|---------|
| **Categories** | Knowledge, Coding, Fitness, Health, Creativity, Discipline, Personal |
| **Difficulties** | Easy (30 XP), Medium (55 XP), Hard (85 XP), Epic (130 XP) |
| **Repeat Types** | None, Daily, Weekly — repeat quests auto-regenerate on completion |
| **Rewards** | XP + Gold + Attribute points per quest |
| **Deadlines** | Due date + optional time with countdown timer |

### Rewards Shop (Mystic Bazaar)

| Category | Examples |
|----------|---------|
| **Gear** | Shadow Blade of Focus (+5 STR), Boots of Prompt Execution (+4 DISC) |
| **Themes** | Cyber Theme HUD, Solar Flare Theme |
| **Badges** | Dragon Crest of Valor, Novice Adventurer Charm |
| **Pets** | Pocket Ember Familiar, Cyber Gryphon Companion |
| **Rarities** | Common, Rare, Epic, Legendary |

### Achievement System

| Achievement | Requirement |
|-------------|-------------|
| FIRST QUEST | Complete 1 quest |
| DISCIPLINE INCARNATE | 7-day streak |
| MIND PALACE | Intelligence ≥ 50 |
| QUEST MASTER | Complete 50 quests |
| DOUBLE DIGITS | Reach Level 10 |
| MONTH OF WILL | 30-day streak |
| IRON BODY | Endurance ≥ 50 |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/auth/register` | Register/fetch user after Firebase sign-in |
| `POST` | `/api/auth/login` | Legacy login endpoint |
| `POST` | `/api/auth/signup` | Legacy signup endpoint |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Get current user profile |
| `POST` | `/api/auth/preferences` | Update user preferences |
| `GET` | `/api/character` | Get hero character data |
| `PUT` | `/api/character` | Update character fields |
| `POST` | `/api/character/setup` | Initial hero class setup |
| `POST` | `/api/character/equip` | Equip/unequip gear slot |
| `GET` | `/api/quests` | List all quests |
| `POST` | `/api/quests` | Create new quest |
| `PUT` | `/api/quests/:id` | Update quest |
| `DELETE` | `/api/quests/:id` | Delete quest |
| `POST` | `/api/quests/:id/complete` | Complete quest (awards XP/Gold) |
| `GET` | `/api/achievements` | List achievements |
| `POST` | `/api/achievements/:id/claim` | Claim unlocked achievement |
| `GET` | `/api/rewards` | List shop items |
| `POST` | `/api/rewards/:id/purchase` | Buy item with Gold |
| `POST` | `/api/rewards/:id/equip` | Toggle equip/unequip |
| `GET` | `/api/progress/summary` | Progress stats |
| `GET` | `/api/history` | Activity history |
| `POST` | `/api/ai/generate` | AI quest generation (Gemini) |

---

## 🗄️ Firestore Data Model

Each user has their own sub-collections under `users/{uid}/`:

```
users/
  └── {uid}/
      ├── character/main          # Single document: Character object
      ├── quests/{questId}        # One document per quest
      ├── achievements/{achId}    # One document per achievement
      ├── rewards/{rewardId}      # One document per shop item
      ├── history/{historyId}     # One document per history event
      └── progress/summary        # Single document: ProgressSummary
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Firebase Project** with Firestore and Authentication enabled
- **Firebase Service Account Key** (`server/serviceAccountKey.json`)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd life

# 2. Install dependencies
npm install

# 3. Configure Firebase
# Place your Firebase service account JSON at: server/serviceAccountKey.json
# Update Firebase client config in: src/firebase.ts

# 4. Set environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY (optional, for AI quest generation)

# 5. Start development server
npm run dev
```

This starts **both** the Vite frontend (port 3000) and Express backend (port 5000) concurrently.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend + backend dev servers |
| `npm run dev:frontend` | Start only Vite frontend |
| `npm run server` | Start only Express backend |
| `npm run build` | Production build |
| `npm run lint` | TypeScript type checking |

---

## 🎨 Design System

### Dual Theme

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| Background | `#0A0A0A` | `#F5F0E8` |
| Primary Accent | `#F87171` (red glow) | `#5D866C` (forest green) |
| Border | `#F87171/20` | `#C2A68C` |
| Card BG | `#141414` | `#FFFFFF` |
| Gold | `#FBBF24` / `#D97706` | `#B45309` |
| Text Primary | `#FFFFFF` | `#1C1917` |
| Text Secondary | `#A1A1AA` | `#78716C` |

### Visual Effects

- **ClickSpark** — Particle burst on every click
- **BorderGlow** — Animated glowing borders on cards
- **Confetti** — Celebration burst on quest completion and purchases
- **Micro-animations** — Hover scales, fade-ins, staggered list reveals
- **Sound Engine** — Quest complete, coin, level-up, and click sounds
- **Skeleton Loading** — Shimmer loading states for all pages

---

## 📱 Responsive Layout

| Viewport | Navigation | Layout |
|----------|-----------|--------|
| **Desktop** (1024px+) | Sidebar + TopBar | Multi-column grid |
| **Tablet** (768px–1024px) | TopBar only | 2-column grid |
| **Mobile** (<768px) | Bottom NavBar + TopBar | Single column |

---

## 🔐 Authentication Flow

```
Landing Page → Sign Up / Login
      │
      ▼
Firebase Client Auth (Email or Google)
      │
      ▼
POST /api/auth/register (with Firebase ID token)
      │
      ▼
Server verifies token → Creates user in Firestore
      │
      ▼
Character Creation Page (choose hero class)
      │
      ▼
Dashboard (fully authenticated session)
```

---

## 📄 License

This project is private and not licensed for redistribution.

---

**Built with ❤️ and RPG spirit.**
