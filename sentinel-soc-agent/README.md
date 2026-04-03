# 🛡️ SentinelSOC Security Agent

[![npm version](https://img.shields.io/npm/v/sentinel-soc-agent.svg?style=flat-square)](https://www.npmjs.com/package/sentinel-soc-agent)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**SentinelSOC Security Agent** is an enterprise-grade, real-time threat detection middleware for Node.js/Express. It acts as an intelligent firewall that intercepts attacks at the edge before they hit your application logic.

---

## 🔥 Key Features

- **🚀 Real-Time Reporting**: Instant log delivery to your SOC (Security Operations Center) dashboard via secure fetch.
- **🛡️ Active Protection**: Optional `block: true` mode to instantly drop malicious requests with a premium "Access Denied" page.
- **🧠 Pattern Analytics**: High-performance regex engine detecting:
  - **SQL Injection (SQLi)**
  - **Cross-Site Scripting (XSS)**
  - **Path Traversal Attacks**
- **⚡ Zero Overhead**: Designed to be lightweight and non-blocking for a seamless user experience.
- **💅 Premium UX**: Includes a professionally designed, dark-mode "Security Blocked" response page.

---

## 📦 Installation

```bash
npm install sentinel-soc-agent
```

## 🚀 Quick Usage

```javascript
const express = require('express');
const { sentinelAgent } = require('sentinel-soc-agent');

const app = express();

// Protect your entire app in 1 minute
app.use(sentinelAgent({
  apiKey: "YOUR_SENTINEL_API_KEY", // Get yours from the dashboard
  endpoint: "https://your-soc-backend.com/api/v1/logs",
  block: true // Enable active firewall mode
}));

app.get('/', (req, res) => {
  res.send('Your App is Now Protected by SentinelSOC 🛡️');
});

app.listen(8080);
```

---

## 🎨 Premium Block Page
When a threat is detected in `block: true` mode, the agent serves a beautiful, high-contrast "Access Denied" page featuring:
- **Pulsing Shield Animation**
- **Detailed Event IDs**
- **Threat Metadata**
- **Source IP Attribution**

---

## 🛡️ License
Licensed under the **GNU Affero General Public License v3.0**. 

## 🤝 Contribution
Found a bug or want to add a new threat pattern? Check out our [Contributing Guide](https://github.com/Hasrat270/SentinelSOC-Saas-Platform/blob/main/CONTRIBUTING.md).

---
**Crafted with ❤️ by the SentinelSOC Engineering Team** 🚀
