# The Card Vault

A modern, full-stack card collection tracker built with React, TypeScript, and Supabase. Track sports cards and trading cards, monitor collection value, and manage your entire collection from one place.

🔗 **Live Site:** [the-card-vault.vercel.app](https://the-card-vault.vercel.app)

---

## Features

- **Multi-category support** — Baseball, hockey, football, basketball, soccer, golf, Pokémon, Magic: The Gathering, Yu-Gi-Oh!, and more
- **Full CRUD** — Add, edit, and delete cards with image upload support
- **Collection analytics** — Track purchase price vs current value with real-time P&L calculations
- **Advanced filtering** — Search, filter by category and condition, sort by any field
- **Pagination** — Client-side pagination with configurable page size
- **Authentication** — Email/password auth with session timeout and inactivity warning
- **Responsive design** — Optimized for desktop and mobile
- **Glassmorphism UI** — Modern dark theme with glass-effect components

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Redux Toolkit | State management |
| RTK Query | Server state and caching |
| React Router v7 | Client-side routing |
| React Hook Form | Form handling |
| Zod | Schema validation |
| SCSS/BEM | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Supabase | PostgreSQL database, auth, file storage |
| Row Level Security | Per-user data isolation |
| Supabase Edge Functions | Serverless API (planned) |

### Deployment
| Technology | Purpose |
|---|---|
| Vercel | Frontend hosting, CI/CD |
| GitHub | Source control |

---

## Architecture
src/  
├── assets/                  # Static assets  
├── components/  
│   ├── common/              # Reusable UI components  
│   └── layout/              # Header, Footer  
├── features/  
│   ├── auth/                # Auth slice + state  
│   ├── cards/               # RTK Query API + CardItem component  
│   └── collection/          # Filter/sort slice + CollectionFilters  
├── hooks/                   # useAuthListener, useSessionTimeout  
├── pages/                   # Route-level page components  
├── routes/                  # React Router configuration  
├── services/                # Supabase client  
├── store/                   # Redux store + typed hooks  
├── styles/                  # SCSS architecture (abstracts, base, components)  
├── types/                   # TypeScript interfaces + Supabase generated types  
└── utils/                   # formatters.ts

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MarkShumway/the-card-vault.git
cd the-card-vault
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

Create a new Supabase project and run the following SQL in the SQL editor:

```sql
create extension if not exists "pgcrypto";

create table cards (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  player_name     text not null,
  year            integer not null,
  brand           text not null,
  series          text,
  card_number     text,
  category        text not null check (category in (
                    'baseball', 'hockey', 'football', 'basketball',
                    'soccer', 'golf', 'tennis', 'wrestling',
                    'pokemon', 'magic', 'yugioh', 'other'
                  )),
  condition       text not null check (condition in (
                    'PSA 10', 'PSA 9', 'PSA 8', 'PSA 7',
                    'BGS 9.5', 'BGS 9',
                    'Raw - Mint', 'Raw - Near Mint', 'Raw - Excellent', 'Raw - Good'
                  )),
  purchase_price  numeric(10, 2) not null default 0,
  current_value   numeric(10, 2) not null default 0,
  image_url       text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table cards enable row level security;

create policy "Users can view own cards" on cards for select using (auth.uid() = user_id);
create policy "Users can insert own cards" on cards for insert with check (auth.uid() = user_id);
create policy "Users can update own cards" on cards for update using (auth.uid() = user_id);
create policy "Users can delete own cards" on cards for delete using (auth.uid() = user_id);
```

Create a storage bucket named `card-images` with public access enabled.

4. **Configure environment variables**

Create a `.env.local` file in the project root:

- VITE\_SUPABASE\_URL=your\_supabase\_project\_url 

- VITE\_SUPABASE\_ANON\_KEY=your\_supabase\_publishable\_key
5. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Key Implementation Details

### Redux Architecture
State is split into two layers — **UI state** (filters, sort, pagination) lives in Redux slices, while **server state** (card data) flows through RTK Query with automatic caching and cache invalidation.

### Authentication
Supabase handles session management. A custom `useAuthListener` hook keeps Redux in sync with Supabase's auth state. A `useSessionTimeout` hook tracks user inactivity and shows a warning modal at 25 minutes, signing out automatically at 30 minutes.

### Row Level Security
Every database query is automatically scoped to the authenticated user via Supabase RLS policies — users can only read and write their own cards regardless of what the frontend sends.

### Type Safety
Database types are auto-generated from the Supabase schema using the Supabase CLI (`supabase gen types typescript`), ensuring TypeScript types stay in sync with the actual database structure.

---

## Roadmap

- [ ] eBay pricing API integration for real-time card values
- [ ] Collection analytics dashboard with charts
- [ ] CSV import/export
- [ ] Public collection sharing
- [ ] Mobile app (React Native)

---

## License

MIT — feel free to use this project as a reference or starting point for your own collection tracker.

---

*Built by [Mark Shumway](https://github.com/MarkShumway)*
