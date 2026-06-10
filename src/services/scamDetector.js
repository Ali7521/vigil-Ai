/**
 * Scam Detection Engine
 * Analyzes messages to determine if they are SCAM, SUSPICIOUS, or SAFE.
 */

const SCAM_PATTERNS = [
  {
    keywords: ['otp', 'pin', 'cvv', 'password', 'passcode', 'atm pin', 'upi pin', 'credit card number', 'debit card number', 'bank account number', 'ifsc'],
    reason: 'Yeh message aapki personal banking details ya OTP chura raha hai.',
    advice: 'Kisi ko bhi OTP, PIN, ya password KABHI mat batao. Koi bhi bank ya company yeh nahi mangti.'
  },
  {
    keywords: ['bijli kategi', 'bijli kat', 'electricity disconnect', 'power cut', 'bill overdue', 'meter disconnect', 'gas connection kat', 'avoid disconnection'],
    reason: 'Darake turant action lene ka trap hai. Asli bijli company WhatsApp pe aisa message nahi bhejti.',
    advice: 'Apne bijli provider ki official app ya website se bill check karo. Is link pe click mat karo.'
  },
  {
    keywords: ['sim block', 'sim band', 'sim deactivate', 'mobile number band', 'trai', 'telecom authority', 'kyc expire', 'kyc update', 'aadhaar link', 'aadhaar verify', 'kyc has expired', 'account suspension'],
    reason: 'Fake TRAI/telecom notice hai. Aapka SIM aise WhatsApp message se band nahi hota.',
    advice: 'Apne carrier (Jio/Airtel/Vi) ki official app se KYC status check karo. Yeh link open mat karo.'
  },
  {
    keywords: ['lottery', 'jackpot', 'prize', 'winner', 'jeet liya', 'jeeta hai', 'crore jeet', 'lakh jeet', 'lucky draw', 'congratulations you won', 'claim your prize', 'reward points'],
    reason: 'Bina kuch kiye koi prize nahi milta. Yeh paisa lootne ka trap hai.',
    advice: 'Ignore karo aur delete karo. Kabhi bhi \'claim prize\' ke liye paise mat do.'
  },
  {
    keywords: ['ghar baithe kamao', 'work from home job', 'daily 5000', 'daily earn', 'typing job', 'data entry job', 'part time job whatsapp', 'online earning', 'invest 500 earn 5000', 'double your money', 'guaranteed income', 'paytm cash daily'],
    reason: 'Fake job offer hai. Koi bhi legitimate company WhatsApp pe random job offer nahi karti.',
    advice: 'Kisi bhi \'easy money\' scheme pe trust mat karo. Asli jobs official portals pe milti hain (LinkedIn, Naukri).'
  },
  {
    keywords: ['liking youtube videos', 'like youtube video', 'google review job', 'registration fee', 'earn per hour by liking', 'work from home opportunity', 'earn rs'],
    reason: 'Yeh "Task Scam" ya "YouTube Like Scam" hai. Pehle yeh aasan task denge, phir registration fee ke naam pe paise loot lenge.',
    advice: 'KABHI BHI job paane ke liye paise mat do. Asli company employee ko paise deti hai, unse maangti nahi.'
  },
  {
    keywords: ['income tax notice', 'income tax department', 'it department', 'rbi notice', 'police notice', 'court notice', 'cyber cell', 'fir darj', 'arrest warrant', 'legal action', 'jail', 'prosecution'],
    reason: 'Sarkari notice WhatsApp pe nahi aata. Yeh darake paise ya details lene ka trick hai.',
    advice: 'Government kabhi WhatsApp pe notice nahi bhejti. Official website pe jaake verify karo.'
  },
  {
    keywords: ['paisa aa raha hai', 'amount credited', 'cashback', 'refund pending', 'claim refund', 'upi collect', 'pay ₹1 get', 'pay 1 rupee', 'send money to receive', 'google pay offer', 'phonepe cashback'],
    reason: 'Paisa receive karne ke liye kabhi pay nahi karna hota. UPI scam hai yeh.',
    advice: 'Paisa lene ke liye kabhi UPI se payment mat karo. Cashback ke liye koi paise nahi mangta.'
  },
  {
    keywords: ['business proposal', '3x return', 'double your money', 'crypto investment', 'bitcoin', 'guaranteed profit', 'invest in scheme', 'legal business', 'earn profit in 30 days', '30 days returns', 'high returns'],
    reason: 'Asli business WhatsApp pe random logo ko guarantee wale returns offer nahi karte. Yeh ek investment ya ponzi scam hai.',
    advice: 'Aise messages ko block karein. Koi bhi legal business bina risk ke 2x-3x return nahi deta.'
  }
];

const SUSPICIOUS_PATTERNS = [
  {
    keywords: ['forward to 10', 'share in 5 groups', '5 groups mein share', 'forward karo', '10 logo ko bhejo', 'broadcast', 'viral karo', 'sabko bhejo'],
    reason: 'Viral forward lag raha hai. Aise messages mein information verify nahi hoti.',
    advice: 'Forward karne se pehle Google pe fact-check karo. Fake news mat failao.'
  },
  {
    keywords: ['nasa ne kaha', 'who ne bola', 'doctor ne bataya', 'research mein aaya', 'modi ne announce', 'pm ne bola', 'breaking news', 'exclusive news', 'media nahi dikha rahi'],
    reason: 'Unverified claim hai. Aise messages mein source check karna zaroori hai.',
    advice: 'Official news websites (NDTV, BBC Hindi) se verify karo pehle. WhatsApp pe news trust mat karo.'
  },
  {
    keywords: ['free iphone', 'free gift', 'amazon voucher', 'flipkart voucher', 'free recharge', 'free data', 'anniversary offer', 'birthday celebration offer', 'survey fill karo', 'fill form get'],
    reason: 'Koi bhi brand free gifts WhatsApp pe nahi baant ta. Data chori ka trap ho sakta hai.',
    advice: 'Brand ki official website ya app pe offer verify karo. Apni details kisi form mein mat dalo.'
  },
  {
    keywords: ['corona cure', 'covid cure', 'cancer cure whatsapp', 'vaccine side effect exposed', 'home remedy cure', 'desi nuskha cure', 'doctors don\'t want you to know', 'big pharma hiding'],
    reason: 'Medical misinformation ho sakti hai. Doctor ki advice ke bina kuch mat karo.',
    advice: 'Health ke baare mein sirf apne doctor ki suno. WhatsApp forwards se treatment mat lo.'
  }
];

const URGENCY_KEYWORDS = ['turant', 'abhi', 'jaldi', 'last chance', 'expire', 'urgent', 'immediately', '24 hours', '2 ghante', 'deadline'];
const ACTION_KEYWORDS = ['click', 'link', 'download', 'install', 'open karo', 'tap here'];

function analyzeMessage(text) {
  if (!text) return { status: 'SAFE', reason: 'Empty message', advice: '' };
  
  const lowerText = text.toLowerCase();
  
  let scamMatchCount = 0;
  let matchedScamPattern = null;

  for (const pattern of SCAM_PATTERNS) {
    if (pattern.keywords.some(kw => lowerText.includes(kw))) {
      scamMatchCount++;
      if (!matchedScamPattern) matchedScamPattern = pattern;
    }
  }

  const hasUrgency = URGENCY_KEYWORDS.some(kw => lowerText.includes(kw));
  const hasAction = ACTION_KEYWORDS.some(kw => lowerText.includes(kw));
  
  if (hasUrgency && hasAction) {
    scamMatchCount++;
    if (!matchedScamPattern) {
        matchedScamPattern = {
            reason: 'Urgency create karke link click karwa raha hai — classic phishing attack hai.',
            advice: 'Jaldi-jaldi mein koi bhi link mat kholna. Pehle verify karo ki sender kaun hai.'
        }
    }
  }

  if (matchedScamPattern) {
    return {
      status: 'SCAM',
      reason: matchedScamPattern.reason,
      advice: matchedScamPattern.advice,
      confidence: scamMatchCount >= 3 ? 'HIGH' : 'MEDIUM'
    };
  }

  let suspiciousMatchCount = 0;
  let matchedSuspiciousPattern = null;

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.keywords.some(kw => lowerText.includes(kw))) {
      suspiciousMatchCount++;
      if (!matchedSuspiciousPattern) matchedSuspiciousPattern = pattern;
    }
  }
  
  // URL Analysis
  const shortenedUrlRegex = /\b(?:bit\.ly|tinyurl\.com|goo\.gl|t\.co|is\.gd|rb\.gy|cutt\.ly)\/[^\s]+/gi;
  const ipUrlRegex = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi;
  
  if (shortenedUrlRegex.test(lowerText) || ipUrlRegex.test(lowerText)) {
      suspiciousMatchCount++;
      if(!matchedSuspiciousPattern) {
          matchedSuspiciousPattern = {
              reason: 'Shortened ya suspicious link hai. Actual URL chhupaya ja raha hai.',
              advice: 'Shortened links pe click mat karo. Pehle link ko expand karke dekho (checkshorturl.com).'
          }
      }
  }

  if (matchedSuspiciousPattern) {
    return {
      status: 'SUSPICIOUS',
      reason: matchedSuspiciousPattern.reason,
      advice: matchedSuspiciousPattern.advice,
      confidence: suspiciousMatchCount >= 3 ? 'HIGH' : 'MEDIUM'
    };
  }

  return {
    status: 'SAFE',
    reason: 'Yeh message safe lagta hai. Koi scam pattern nahi mila.',
    advice: 'Sab theek lag raha hai! Phir bhi agar doubt ho toh hamesha VigilAI se check kara lo. 😊'
  };
}

module.exports = { analyzeMessage };
