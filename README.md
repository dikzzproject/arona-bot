<div align="center">

<img src="https://i.pinimg.com/736x/1d/72/97/1d7297046b65a0208688859dbbb7f54a.jpg" alt="Arona Bot Banner" width="100%" style="border-radius: 12px; max-width: 800px;" />

<br /><br />

# Arona Bot

**A lightweight, modular, and personal WhatsApp automation bot built with JavaScript.**

[![License](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-black.svg?style=flat-square)](https://nodejs.org/)
[![Language](https://img.shields.io/badge/JavaScript-100%25-black.svg?style=flat-square)]()

[Overview](#overview) • [Architecture](#architecture) • [Installation & Setup](#installation--setup) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

## Overview

**Arona Bot** is a personal WhatsApp bot engineered for speed, modularity, and effortless extensibility. Designed around a clean plugin and event-driven architecture, it allows rapid feature expansion while keeping core socket management isolated and maintainable.

### Key Highlights
- **Plugin-Based System** — Drop-in command modules inside `plugins/` for instant feature integration.
- **Event-Driven Core** — Dedicated socket and message event listeners managed under `events/`.
- **Session Persistence** — Reliable multi-device authentication state handling stored in `auth/`.
- **Centralized Configuration** — Streamlined bot settings and owner credentials via `config/`.

---

## Architecture

```text
arona-bot/
├── auth/               # WhatsApp session & multi-device credentials
├── config/             # Bot settings, prefixes, and owner configurations
├── events/             # Socket connection & message event handlers
├── plugins/            # Modular command plugins & features
├── index.js            # Main application & socket entry point
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Locked dependency tree
└── README.md           # Project documentation
