<div align="center">
  <img src="public/whispr-final.png" alt="Whispr Logo" width="120" height="120" />
  
  # Whispr
  
  **Say It Without Saying Who.**
  
  A privacy-first anonymous peer support platform that connects people in their local community for safe, judgment-free conversations.

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

  [Live Demo](https://whispr-ph.vercel.app) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Security & Privacy](#-security--privacy)
- [Rate Limiting](#-rate-limiting)
- [Contributing](#-contributing)
- [License](#-license)

---

## About

**Whispr** is an anonymous peer support web application designed to foster mental wellness through meaningful, private conversations. Users can connect with nearby community members without revealing their identity, creating a safe space for sharing thoughts, seeking support, or simply venting.

### The Problem

Mental health support often comes with barriers:
- Fear of judgment or stigma
- Lack of accessible, immediate support
- Difficulty connecting with people who understand local context

### Our Solution

Whispr hopes to remove these barriers by providing:
- **Complete anonymity** through system-generated credentials
- **Location-based matching** to connect with nearby peers
- **Timed conversations** that encourage focused, meaningful exchanges
- **Community features** for broader engagement without direct identification

---

##  Key Features

### Anonymous & Secure
- System-generated Anonymous IDs and passwords
- No email, phone, or personal data required
- Zero-knowledge authentication design

### Nearby Connections
- Geolocation-based peer matching
- Connect with people in your local community
- Shared context without shared identity

### Timed Chat Sessions
- Focused 10-minute conversations
- Mutual extension requests (both parties must agree)
- Automatic session cleanup for privacy

### Community Wall
- Share thoughts anonymously with your community
- React with empathy to others' posts
- No persistent profiles or tracking

### Mood Check-ins
- Daily mood tracking for self-awareness
- Streak system to encourage consistency
- Private and personal—only you see your data

### Role-Based Matching
- Choose to **Vent** (share your thoughts) or **Listen** (support others)
- Balanced matching algorithm
- Earn points for being a good listener

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Components** | Shadcn |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Realtime** | Supabase Realtime |
| **Rate Limiting** | Upstash Redis |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account
- Upstash account (for rate limiting)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-whispr-web.git
   cd batch-2025-whispr-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase and Upstash credentials (see [Environment Variables](#-environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL | ✅ |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API token | ✅ |

---

## Project Structure

```
whispr/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth routes (login, register)
│   ├── (authenticated)/      # Protected routes
│   │   ├── chat/[sessionId]/ # Real-time chat interface
│   │   ├── home/             # Dashboard & community wall
│   │   └── profile/          # User profile & stats
│   ├── api/                  # API route handlers
│   │   ├── auth/             # Authentication endpoints
│   │   ├── chat/             # Chat session management
│   │   ├── post/             # Community posts CRUD
│   │   └── mood-checkin/     # Mood tracking
│   └── layout.tsx            # Root layout
|   |__ page.tsx              # Landing Page
|   |__ logout/               # Logout 
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI primitives
│   └── ...                   # Feature components
├── context/                  # React Context providers
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
├── types/                    # TypeScript type definitions
└── utils/                    # Helper utilities
    └── supabase/             # Supabase client configurations
```

---

## Security & Privacy

Whispr is built with privacy as a core principle:

### Data Minimization
- **No PII collected**: No emails, names, phone numbers, or social accounts
- **Anonymous credentials**: System-generated IDs that cannot be traced back to users
- **Location hashing**: Approximate location used for matching, never stored precisely

### Authentication Security
- **Secure password hashing**: Industry-standard bcrypt via Supabase Auth
- **HTTP-only cookies**: Session tokens protected from XSS attacks
- **Automatic session refresh**: Seamless re-authentication without user friction

### API Security
- **Rate limiting**: Protection against brute-force and abuse (see below)

---

## Rate Limiting

Whispr implements tiered rate limiting to prevent abuse while maintaining usability:

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| Registration | 3 requests | 30 days | IP address |
| Login | 5 requests | 15 minutes | IP address |
| General API | 10 requests | 60 seconds | User ID |

### Implementation

- **Provider**: Upstash Redis (serverless, edge-compatible)
- **Algorithm**: Sliding window counter

### Why These Limits?

- **Registration (3/month)**: Prevents mass account creation while allowing legitimate re-registration
- **Login (5/15min)**: Stops brute-force password attacks
- **General (10/60s)**: Prevents API abuse from authenticated users

---

## Contributing

I welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is developed as part of the **CSci 153: Web Systems and Technologies** course at the Visayas State University (VSU).

---

<div align="center">
  
  [ Back to Top](#whispr)
  
</div>
