/**
 * Webhook Routes
 * Defines Express routes for Twilio WhatsApp webhooks.
 */
const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const validateTwilio = require('../middleware/validateTwilio');

// Incoming WhatsApp message webhook
router.post('/whatsapp', validateTwilio, whatsappController.handleIncoming);

// Message delivery status callback
router.post('/whatsapp/status', whatsappController.statusCallback);

module.exports = router;
