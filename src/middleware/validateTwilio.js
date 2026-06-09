/**
 * Twilio Request Validation Middleware
 * Verifies the X-Twilio-Signature header to ensure requests are genuinely from Twilio.
 * Skips validation in development mode for easier local testing.
 */
const twilio = require('twilio');

function validateTwilioRequest(req, res, next) {
  // Skip validation in development for easier testing with tools like curl/Postman
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const signature = req.headers['x-twilio-signature'];
  const url = `${process.env.WEBHOOK_BASE_URL}${req.originalUrl}`;
  const params = req.body;

  if (!signature) {
    console.warn('⚠️  Missing X-Twilio-Signature header');
    return res.status(403).send('Forbidden: Missing signature');
  }

  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    params
  );

  if (isValid) {
    next();
  } else {
    console.warn('⚠️  Invalid Twilio signature — possible spoofed request');
    res.status(403).send('Forbidden: Invalid Twilio Signature');
  }
}

module.exports = validateTwilioRequest;
