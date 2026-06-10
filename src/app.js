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

// Serve static files for the Web UI
app.use(express.static('public'));

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

// Web UI API endpoint
const { analyzeMessage } = require('./services/scamDetector');
const { formatResponse } = require('./services/responseFormatter');

app.post('/api/analyze', (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ response: 'Please provide some text to analyze.' });
  
  const result = analyzeMessage(text);
  const formatted = formatResponse(result);
  res.json({ response: formatted, status: result.status });
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
