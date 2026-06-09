# 🛡️ VigilAI — WhatsApp Scam Detection Bot

> Aapka Digital Bodyguard! A WhatsApp bot that analyzes forwarded messages, links, and text for scams & fraud. Replies in Hinglish for Indian users.

## ✨ Features

- 🔴 **SCAM ALERT** — Detects phishing, OTP scams, fake jobs, lottery fraud, KYC threats
- 🟡 **SUSPICIOUS** — Flags fake news, viral forwards, free gift traps
- 🟢 **SAFE** — Confirms genuine messages
- 🗣️ **Hinglish Responses** — Easy to understand for WhatsApp users
- ⚡ **Instant Analysis** — Rule-based engine, no API delays

## 🏗️ Architecture

```
User (WhatsApp) → Twilio → Express Server → Scam Detector → TwiML Response → Twilio → User
```

## 📋 Prerequisites

1. **Node.js** v18+ — [Download](https://nodejs.org/)
2. **Twilio Account** (free trial works) — [Sign Up](https://www.twilio.com/try-twilio)
3. **ngrok** for local development — `brew install ngrok`

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd vigilai-bot
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Twilio credentials
```

### 3. Set Up Twilio WhatsApp Sandbox

1. Go to [Twilio Console](https://www.twilio.com/console) → Messaging → Try it out → Send a WhatsApp message
2. Activate the sandbox and note the **join code** (e.g., `join magic-pizza`)
3. Send the join code from your WhatsApp to the sandbox number

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 5. Expose with ngrok

```bash
ngrok http 3000
```

Copy the `https://` URL and set it in Twilio Console:
- **Sandbox Settings** → "When a message comes in" → `https://YOUR-NGROK-URL/webhook/whatsapp` (POST)

### 6. Test It!

Send these messages from WhatsApp to the sandbox number:

| Test Message | Expected Result |
|---|---|
| `hi` | Welcome message |
| `help` | Command list |
| `Aapki bijli kal kat jayegi, abhi click karo` | 🔴 SCAM ALERT |
| `Amazon free iPhone de raha hai, 10 logo ko forward karo` | 🟡 SUSPICIOUS |
| `Bhai aaj dinner pe chal?` | 🟢 SAFE |

## 📁 Project Structure

```
vigilai-bot/
├── .env.example              # Environment template
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── app.js                 # Express server entry point
    ├── config/
    │   └── twilio.js          # Twilio client setup
    ├── middleware/
    │   └── validateTwilio.js  # Request signature validation
    ├── routes/
    │   └── webhook.js         # Route definitions
    ├── controllers/
    │   └── whatsappController.js  # Request handlers
    ├── services/
    │   ├── scamDetector.js    # 🧠 Core detection engine
    │   ├── responseFormatter.js   # Hinglish response templates
    │   └── messageRouter.js   # Command & message routing
    └── test/
        └── testScamDetector.js    # Detection tests
```

## 🧪 Running Tests

```bash
npm test
```

## 🔒 Security

- All incoming webhooks are validated via `X-Twilio-Signature` (in production)
- Environment variables are never committed to git
- No user data is stored or logged beyond the current session

## 📝 Adding New Scam Patterns

Edit `src/services/scamDetector.js`:

1. Add keywords to the relevant category in `SCAM_PATTERNS` or `SUSPICIOUS_PATTERNS`
2. Run `npm test` to verify
3. Restart the server

## 🛣️ Roadmap

- [ ] AI-powered analysis (Google Gemini / OpenAI integration)
- [ ] Screenshot/image analysis via OCR
- [ ] URL reputation checking via VirusTotal API
- [ ] User reporting & community-driven scam database
- [ ] Multi-language support (Tamil, Telugu, Bengali)

## 📄 License

MIT
