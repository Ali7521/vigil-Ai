/**
 * Response Formatter
 * Formats scam detection results into the VigilAI WhatsApp message format.
 * Uses WhatsApp markdown (*bold*, _italic_) for formatting.
 */

const STATUS_MAP = {
  SCAM: '🔴 SCAM ALERT',
  SUSPICIOUS: '🟡 SUSPICIOUS',
  SAFE: '🟢 SAFE',
};

/**
 * Format the detection result into a WhatsApp-friendly message
 * @param {Object} result - { status, reason, advice, confidence }
 * @returns {string} Formatted message string
 */
function formatResponse(result) {
  const statusLabel = STATUS_MAP[result.status] || '⚪ UNKNOWN';

  let response = `🚨 *STATUS:* ${statusLabel}\n\n`;
  response += `🔍 *Kyun?* ${result.reason}\n\n`;
  response += `🛡️ *VigilAI ki Advice:* ${result.advice}`;

  // Add confidence indicator for SCAM results
  if (result.status === 'SCAM' && result.confidence === 'HIGH') {
    response += `\n\n⚠️ _Multiple scam signals detected — bahut zyada khatarnak hai!_`;
  }

  // Add branding footer
  response += `\n\n— 🤖 _VigilAI | Aapka Digital Bodyguard_`;

  return response;
}

/**
 * Format a welcome message for new users or "hi" greetings
 * @param {string} profileName - User's WhatsApp profile name
 * @returns {string} Welcome message
 */
function formatWelcome(profileName) {
  const name = profileName || 'Dost';
  return (
    `👋 *Namaste ${name}!*\n\n` +
    `Main hoon *VigilAI* 🤖🛡️ — tumhara digital bodyguard!\n\n` +
    `Koi bhi suspicious message aaye — WhatsApp forward ho, SMS ho, ya koi link — bas idhar bhej do.\n\n` +
    `Main turant bata dunga ki *SCAM* hai, *SUSPICIOUS* hai, ya *SAFE* hai.\n\n` +
    `🔹 Suspicious message forward karo — main check karunga\n` +
    `🔹 Type *help* — commands dekhne ke liye\n` +
    `🔹 Type *about* — mere baare mein jaanne ke liye\n\n` +
    `_Toh bhejo — kya check karna hai?_ 🔍`
  );
}

/**
 * Format a help message listing available commands
 * @returns {string} Help message
 */
function formatHelp() {
  return (
    `📋 *VigilAI Commands:*\n\n` +
    `🔹 Koi bhi message forward karo — scam check\n` +
    `🔹 Link bhejo — link analysis\n` +
    `🔹 *hi / hello* — welcome message\n` +
    `🔹 *help* — yeh menu\n` +
    `🔹 *about* — VigilAI ke baare mein\n\n` +
    `💡 _Tip: Suspicious SMS ya email ka text copy karke bhej do, main analyze kar dunga!_\n\n` +
    `— 🤖 _VigilAI | Aapka Digital Bodyguard_`
  );
}

/**
 * Format an about message
 * @returns {string} About message
 */
function formatAbout() {
  return (
    `🤖 *VigilAI — Aapka Digital Bodyguard*\n\n` +
    `Main ek AI-powered scam detection bot hoon jo aapko online fraud se bachata hai.\n\n` +
    `*Kya detect karta hoon:*\n` +
    `🔴 Phishing attacks & OTP scams\n` +
    `🔴 Fake job & lottery offers\n` +
    `🔴 KYC & SIM block threats\n` +
    `🟡 Fake news & viral forwards\n` +
    `🟡 Free gift & voucher traps\n\n` +
    `*Kaise kaam karta hoon:*\n` +
    `📩 Aap message bhejte ho → Main analyze karta hoon → Turant verdict deta hoon\n\n` +
    `_Stay safe, stay vigilant!_ 💪\n\n` +
    `— 🤖 _VigilAI v1.0_`
  );
}

module.exports = { formatResponse, formatWelcome, formatHelp, formatAbout };
