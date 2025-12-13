# Release v0.1.0 - Initial Release

**Release Date:** December 13, 2025

## Overview

Whispr is an anonymous peer support platform that connects users in their local community for safe, judgment-free conversations. This initial release includes the core functionality for anonymous authentication, real-time chat, community engagement, and privacy-focused design.

---

## Features

### Authentication
- System-generated anonymous credentials (Anonymous ID + password)
- Zero personal information required for registration
- Secure session management with automatic refresh

### Real-Time Chat
- Peer-to-peer messaging with WebSocket-based realtime updates
- Role-based matching (Vent or Listen)
- 10-minute timed sessions with mutual extension requests
- Session feedback system for community health

### Location-Based Matching
- Geolocation-based peer discovery
- Configurable nearby matching toggle
- Privacy-preserving location handling

### Community Wall
- Anonymous post creation with location context
- Community feed with reactions
- Post management (create, edit, delete)

### Mood Tracking
- Daily mood check-in system
- Streak tracking for engagement
- Personal mood history

### User Profiles
- Anonymous profile pages
- Activity summary and statistics
- Listening and venting point system

---

## Security

### Rate Limiting
| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| Registration | 3 requests | 30 days | IP address |
| Login | 5 attempts | 15 minutes | IP address |
| General API | 10 requests | 60 seconds | User ID |

- Powered by Upstash Redis with sliding window algorithm

### Data Protection
- No personally identifiable information collected
- Supabase Row-Level Security on all tables
- HTTP-only cookies for session management
- Server-side input validation on all endpoints

---

## Technical Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Components | Shadcn |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Realtime | Supabase Realtime |
| Rate Limiting | Upstash Redis |

---

## Environment Requirements

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

---

## Known Limitations

- Rate limiting requires Upstash Redis configuration
- Location services require user permission in browser
- Chat sessions are automatically deleted after completion

---

## Contributors

Ken Cedrick A. Jimeno

---

## Breaking Changes

None (initial release)

---
---

# Release v0.1.2 - Patch

**Release Date:** December 13, 2025

## Bug Fixes

- Fixed viewport height issues on mobile browsers by changing `h-screen` to `h-dvh` on chat, login, register, and logout pages

## Breaking Changes

None

---
---

# Release v0.1.3 - Patch

**Release Date:** December 13, 2025  
**Hotfix Branch:** `hotfix/ui-improvements-v0.1.3`

## UI Improvements

- Added shadow to auth form section for better visual depth
- Increased horizontal padding on auth form container (`px-6` to `px-8`)
- Improved mood check-in card layout alignment on larger screens (`justify-evenly`)
- Adjusted profile page top margin for better spacing (`mt-10` to `mt-15`)

## Bug Fixes

- Added empty state for user feed when no posts exist, displaying a friendly "It's quiet here..." message with icon

## Breaking Changes

None
