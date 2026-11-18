<div align="center">

<img src="https://i.pinimg.com/736x/1d/72/97/1d7297046b65a0208688859dbbb7f54a.jpg" alt="Arona Bot Banner" width="100%" style="border-radius: 12px; max-width: 800px;" />

<br /><br />

# Arona Bot

**A lightweight, modular, and personal WhatsApp automation bot built with JavaScript.**

[![License](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-black.svg?style=flat-square)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-black.svg?style=flat-square)]()
[![Maintenance](https://img.shields.io/badge/Maintained-Yes-black.svg?style=flat-square)](https://github.com/dikzzproject/arona-bot)

[Overview](#overview) • [Features](#features) • [Directory Structure](#directory-structure) • [Prerequisites](#prerequisites) • [Installation & Setup](#installation--setup) • [Usage](#usage) • [Security & Best Practices](#security--best-practices) • [Contributing](#contributing) • [License](#license)

</div>

---

## Overview

**Arona Bot** is a personal WhatsApp automation bot engineered for speed, modularity, and effortless extensibility. Built on a clean plugin-based and event-driven architecture in JavaScript, it allows rapid feature expansion while keeping core socket management, authentication state, and configurations strictly isolated and maintainable.

---

## Features

- **Modular Plugin Architecture** — Drop-in command modules inside `plugins/` allow you to add, update, or remove features without modifying core socket logic.
- **Event-Driven Core** — Dedicated socket connection, credential updates, and incoming message listeners managed cleanly under `events/`.
- **Persistent Multi-Device Session** — Reliable authentication state management stored locally inside `auth/` to prevent repeated logins across restarts.
- **Centralized Configuration** — Streamlined management of bot identity, command prefixes, and owner privileges via `config/`.
- **Lightweight Runtime** — Minimal resource footprint designed for stable, continuous execution on local machines or cloud VPS environments.

---

## Directory Structure

```text
arona-bot/
├── auth/               # WhatsApp multi-device session & authentication credentials
├── config/             # Centralized bot settings, prefixes, and owner configurations
├── events/             # Socket connection, session, and message event handlers
├── plugins/            # Modular command plugins & custom bot features
├── index.js            # Main application & WhatsApp socket entry point
├── package.json        # Project metadata, scripts, and dependencies
├── package-lock.json   # Locked dependency tree for reproducible builds
└── README.md           # Project documentation
```

---

## Prerequisites

Before proceeding with the installation, ensure your environment meets the following requirements:

- **Node.js**: Version `18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **Package Manager**: `npm` (included with Node.js) or `yarn`
- **Git**: Installed for repository cloning ([Download Git](https://git-scm.com/))
- **WhatsApp Account**: An active mobile WhatsApp client to authorize the multi-device session

---

## Installation & Setup

Follow these steps in order to deploy and run **Arona Bot** locally or on a server:

### 1. Clone the Repository
Download the source code from GitHub and navigate into the project directory:
```bash
git clone https://github.com/dikzzproject/arona-bot.git
cd arona-bot
```

### 2. Install Dependencies
Install all required Node.js packages defined in `package.json`:
```bash
npm install
```

### 3. Configure Bot Settings
Navigate to the `config/` directory and open the configuration file(s). Update the parameters to match your setup:
- **Owner Number**: Set your WhatsApp phone number using the international format without `+` or spaces (e.g., `628xxxxxxxxxx`).
- **Bot Name**: Define the display name used by the bot in responses and menus.
- **Command Prefix**: Specify the trigger character(s) for commands (e.g., `!`, `.`, or `/`).
- **API Keys** *(if applicable)*: Add any third-party service keys required by specific modules inside `plugins/`.

### 4. Start the Application
Launch the bot process using Node.js:
```bash
npm start
```

### 5. Link Your WhatsApp Account
1. Upon startup, the terminal will display either a **QR Code** or prompt for a **Pairing Code**.
2. Open **WhatsApp** on your mobile device.
3. Navigate to **Settings** (or the three-dot menu) > **Linked Devices** > **Link a Device**.
4. Scan the QR code shown in your terminal or enter the pairing code on your phone.
5. Once connected, your authentication state will automatically be saved inside the `auth/` folder so future restarts reconnect seamlessly.

---

## Usage

Once connected, interact with the bot in private chats or group conversations using your configured prefix (defaulting to `!` below):

| Command | Description | Access Level |
| :--- | :--- | :--- |
| `!menu` | Display a structured list of all available plugin commands | Public |
| `!ping` | Measure response latency and check runtime uptime | Public |
| `!info` | View system diagnostics, bot version, and runtime metadata | Public |
| `!eval` | Evaluate and execute administrative JavaScript expressions | Owner Only |

### Adding Custom Plugins
To extend functionality, create a new module inside the `plugins/` directory following the existing plugin export structure. Restart the bot (or trigger a plugin reload if supported) to register the new command.

---

## Security & Best Practices

- **Protect Session Credentials**: Never share or commit the contents of the `auth/` directory publicly. Anyone with access to your session files can impersonate your WhatsApp account.
- **Git Ignore Rules**: Ensure `auth/` and `node_modules/` are explicitly listed in your `.gitignore` file before pushing updates to GitHub.
- **Owner Permissions**: Restrict administrative commands (such as `!eval` or shell execution plugins) strictly to verified owner JIDs defined in `config/`.

---

## Contributing

Contributions, issues, and feature enhancements are welcome.

1. Fork the repository
2. Create a dedicated feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes with clear messages (`git commit -m "Add your feature"`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request for review

---

## License

This project is distributed under the **MIT License**. See the `LICENSE` file for full terms and conditions.

---

<div align="center">
  <sub>Developed and maintained by <a href="https://github.com/dikzzproject">dikzzproject</a></sub>
</div>
