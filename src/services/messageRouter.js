/**
 * Message Router
 * Routes incoming WhatsApp messages to the appropriate handler.
 * Handles bot commands (hi, help, about) and forwards other messages to the scam detector.
 */
const { analyzeMessage } = require('./scamDetector');
const { formatResponse, formatWelcome, formatHelp, formatAbout } = require('./responseFormatter');

/**
 * Process an incoming message and return the appropriate response
 * @param {Object} params
 * @param {string} params.body - Message text
 * @param {string} params.from - Sender's WhatsApp number
 * @param {string} params.profileName - Sender's WhatsApp profile name
 * @param {Array} params.media - Array of media attachments
 * @returns {string} Response message to send back
 */
async function processMessage({ body, from, profileName, media }) {
  // Handle media messages (screenshots, images)
  if (media && media.length > 0) {
    return (
      `📸 *Image/Media mila!*\n\n` +
      `Abhi main sirf text messages analyze kar sakta hoon. ` +
      `Screenshot ka text copy karke bhej do, main check kar dunga! ✍️\n\n` +
      `— 🤖 _VigilAI_`
    );
  }

  // If no text body, ask for input
  if (!body || body.trim().length === 0) {
    return formatWelcome(profileName);
  }

  const text = body.trim().toLowerCase();

  // Handle bot commands
  switch (text) {
    case 'hi':
    case 'hello':
    case 'hii':
    case 'hey':
    case 'hlo':
    case 'namaste':
    case 'namaskar':
      return formatWelcome(profileName);

    case 'help':
    case 'menu':
    case 'commands':
      return formatHelp();

    case 'about':
    case 'info':
      return formatAbout();

    default:
      // Analyze the message for scams
      const result = analyzeMessage(body);
      return formatResponse(result);
  }
}

module.exports = { processMessage };
