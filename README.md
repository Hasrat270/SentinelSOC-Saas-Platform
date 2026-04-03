# SentinelSOC 🛡️
### Enterprise-Grade Real-Time Security SaaS Platform

SentinelSOC is a high-performance, multi-tenant SaaS platform designed to protect web applications from real-time attacks. It provides an automated, edge-detection security agent that intercepts threats (SQLi, XSS, Path Traversal) and reports them instantly to a centralized "Pro" dashboard.

---

## 🎨 Premium Features
- **Real-Time Threat Stream**: Live socket connection for instant attack visualization.
- **AI-Driven Analytics**: Historical data analysis and severity-aware threat scoring.
- **Edge Security Agent**: Lightweight middleware for Node.js/Express with zero-latency overhead.
- **Multi-Tenant Architecture**: Secure data isolation for multiple organizations.
- **Usage Enforcement**: Automatic log limits for Free tier with Stripe-ready upgrade paths.
- **Premium Design**: High-contrast "Slate/Indigo" SOC aesthetic.

## 🏗️ Project Architecture
The platform is structured with the Next.js application in the root for seamless Vercel deployment:
- **`src/`**, **`public/`**: Next.js 15+ Core Application (Dashboard & UI).
- **`backend/`**: Node.js & Express API with MongoDB and Socket.io.
- **`sentinel-soc-agent/`**: Distributed security middleware (publishable to npm).

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/Hasrat270/SentinelSOC-Saas-Platform.git
cd SentinelSOC-Saas-Platform
```

### 2. Configure Environment
Create `.env.local` in the root and `.env` in `backend/` based on the provided templates (Clerk Auth, Stripe, and MongoDB required).

### 3. Install & Run
```bash
# In Root
npm install
npm run dev
```

### 4. Backend Only
```bash
npm run backend:dev
```

## 🛡️ License
Licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. 
*Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.*

---
**Maintained by SentinelSOC Enterprise Team** 🚀
