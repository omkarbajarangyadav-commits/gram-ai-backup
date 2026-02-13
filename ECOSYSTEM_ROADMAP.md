# Smart Farm: Ecosystem Roadmap & Architecture 🚀

**Role:** Autonomous AI Product Team (CTO, Product, DevOps)
**Objective:** Production-Grade Agriculture Platform
**Status:** Execution Mode

---

## 1. System Architecture (Scalable & Low Cost)

We are using a **Serverless, Mobile-First Architecture** optimized for rural India (2G/3G compatible).

```mermaid
graph TD
    User[Farmer Mobile PWA] -->|HTTPS/JSON| CDN[Vercel Edge Network]
    CDN -->|Next.js App Router| Backend[Serverless Functions]
    
    subgraph "Core Services"
        Backend -->|Auth & Data| DB[(Supabase PostgreSQL)]
        Backend -->|AI Logic| AI[OpenAI GPT-4o-mini]
        Backend -->|Storage| Storage[Supabase Storage (Images)]
    end
    
    subgraph "External Integrations"
        Backend -->|Weather| OpenMeteo[Open-Meteo API]
        Backend -->|Market| MandiAPI[Govt Mandi API (Mocked)]
    end

    User -->|Offline Cache| LocalStorage[Local Device Storage]
```

### Technology Stack (Free Tier Optimized)
*   **Frontend:** Next.js 14 (App Router) - Fast, SEO-friendly.
*   **Database:** Supabase (PostgreSQL) - Robust, includes Auth & Realtime.
*   **AI:** OpenAI API (GPT-3.5/4) - Cost-effective intelligence.
*   **Styling:** Tailwind CSS - Lightweight UI.
*   **Analysis:** TensorFlow.js (Client-side) - For finding crop diseases without server costs.

---

## 2. Execution Roadmap: From MVP to Scale

### Phase 1: Core Foundation (Current Status: ✅)
*   [x] Next.js Framework Setup
*   [x] Basic UI Components (Mobile First)
*   [x] Mock Authenticaton Flow
*   [x] Mock Market Data

### Phase 2: The "Smart" Upgrade (Active Now 🚧)
*   [ ] **Real Database:** Apply `schema.sql` to Supabase.
*   [ ] **Labour Marketplace:** Build `/jobs` for hiring workers.
*   [ ] **Shop System:** Build `/shops` for buying inputs.
*   [ ] **AI Assistant:** Connect real API keys.

### Phase 3: Production Hardening
*   [ ] **Security:** Enable RLS (Row Level Security).
*   [ ] **Monitoring:** Add Sentry for error tracking.
*   [ ] **Performance:** Image optimization & lazy loading.

---

## 3. Startup Strategy: "Cold Start" Problem

**How do we get the first 1,000 users?**

1.  **The "Anchor" Feature:** Focus on the **Crop Doctor** tool. Farmers *need* immediate help for diseases. Use this as the hook to get them on board.
2.  **Village Ambassador:** Appoint one "Tech-Savvy" youth in a village as the admin. Use the `Admin` role in our schema to give them special dashboards.
3.  **WhatsApp Integration:** (Future) Allow farmers to interact via WhatsApp, which feeds into our Supabase backend.

---

## 4. Monetization Strategy (Future)

1.  **Commission:** 1-2% on Labour Hiring transactions.
2.  **Premium Listings:** Shops pay to appear at the top of search.
3.  **Data Insights:** Sell aggregated, anonymized crop data to Agri-inputs companies.

---

## 5. Security Protocols

*   **API Security:** All API routes must validate `userId` against the database.
*   **Data Isolation:** RLS policies ensure a farmer in "Village A" cannot edit the data of "Village B".
*   **Input Validation:** Sanitize all text inputs to prevent SQL Injection (handled by Supabase client).

---

**Next Steps for User:**
1.  Go to [Supabase](https://supabase.com).
2.  Create a Project.
3.  Copy content of `schema.sql` and run it in the SQL Editor.
4.  Add your *Supabase URL* and *Anon Key* to `.env.local`.
