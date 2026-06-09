/**
 * WhatsApp Controller
 * Handles incoming WhatsApp webhook requests from Twilio.
 * Extracts message data, routes to the message processor, and returns TwiML response.
 */
const { MessagingResponse } = require('twilio').twiml;
const { processMessage } = require('../services/messageRouter');

/**
 * Handle incoming WhatsApp messages
 * POST /webhook/whatsapp
 */
exports.handleIncoming = async (req, res) => {
  const {
    MessageSid,
    From,
    To,
    Body,
    NumMedia,
    ProfileName,
    WaId,
  } = req.body;

  console.log(`\n📩 [${MessageSid}] Message from ${ProfileName} (${WaId})`);
  console.log(`   Text: ${Body || '(no text)'}`);
  console.log(`   Media: ${NumMedia || 0} attachment(s)`);

  // Extract media attachments if present
  const media = [];
  const numMedia = parseInt(NumMedia, 10) || 0;
  for (let i = 0; i < numMedia; i++) {
    media.push({
      url: req.body[`MediaUrl${i}`],
      contentType: req.body[`MediaContentType${i}`],
    });
  }

  try {
    // Process the message through the router
    const reply = await processMessage({
      body: Body,
      from: From,
      profileName: ProfileName,
      media,
    });

    console.log(`   ✅ Reply sent (${reply.length} chars)`);

    // Send TwiML response
    const twiml = new MessagingResponse();
    twiml.message(reply);
    res.type('text/xml').send(twiml.toString());
  } catch (error) {
    console.error(`   ❌ Error processing message:`, error);

    // Always return valid TwiML even on errors
    const twiml = new MessagingResponse();
    twiml.message(
      '😓 Oops! Kuch gadbad ho gayi. Please thodi der baad try karo.\n\n— 🤖 _VigilAI_'
    );
    res.type('text/xml').send(twiml.toString());
  }
};

/**
 * Handle message delivery status callbacks
 * POST /webhook/whatsapp/status
 */
exports.statusCallback = (req, res) => {
  const { MessageSid, MessageStatus } = req.body;
  console.log(`📊 Message ${MessageSid} → Status: ${MessageStatus}`);
  res.sendStatus(200);
};
