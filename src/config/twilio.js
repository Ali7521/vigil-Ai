/**
 * Twilio Client Configuration
 * Initializes the Twilio SDK client with credentials from environment variables.
 */
require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = { client, twilio };
