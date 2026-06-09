/**
 * VigilAI — WhatsApp Scam Detection Bot
 * Main application entry point.
 * 
 * Sets up Express server with Twilio webhook handlers.
 */
require('dotenv').config();
const express = require('express');
const webhookRoutes = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────

// Parse URL-encoded bodies (Twilio sends form data, NOT JSON)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  if (req.path !== '/health') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// ─────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VigilAI',
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// Webhook routes
app.use('/webhook', webhookRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🛡️  VigilAI v1.0                       ║
  ║   Aapka Digital Bodyguard                ║
  ║                                          ║
  ║   Server:    http://localhost:${PORT}       ║
  ║   Webhook:   /webhook/whatsapp           ║
  ║   Health:    /health                     ║
  ║   Mode:      ${(process.env.NODE_ENV || 'production').padEnd(14)}         ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
