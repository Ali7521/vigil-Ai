/**
 * VigilAI Scam Detector — Test Suite
 * Run: node src/test/testScamDetector.js
 */
const { analyzeMessage } = require('../services/scamDetector');

let passed = 0;
let failed = 0;

function test(description, message, expectedStatus) {
  const result = analyzeMessage(message);
  const success = result.status === expectedStatus;
  
  if (success) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.log(`  ❌ ${description}`);
    console.log(`     Expected: ${expectedStatus}, Got: ${result.status}`);
    console.log(`     Message: "${message}"`);
    console.log(`     Reason: ${result.reason}`);
    failed++;
  }
}

console.log('\n🧪 VigilAI Scam Detector — Test Suite\n');
console.log('━'.repeat(50));

// ─── 🔴 SCAM ALERT Tests ─────────────────────────
console.log('\n🔴 SCAM ALERT Tests:\n');

test('OTP harvesting', 'Aapka OTP 4532 hai, please share karo verify karne ke liye', 'SCAM');
test('PIN stealing', 'Apna ATM PIN enter karo is link pe', 'SCAM');
test('CVV harvesting', 'Credit card ka CVV number chahiye verification ke liye', 'SCAM');
test('Electricity threat', 'Aapki bijli kal kat jayegi, turant yeh link click karo', 'SCAM');
test('Bill overdue scam', 'Your electricity bill is overdue. Pay now to avoid disconnection', 'SCAM');
test('SIM block threat', 'Aapka SIM 24 ghante mein block ho jayega, KYC update karo', 'SCAM');
test('TRAI notice', 'TRAI notice: Your number will be deactivated. Call immediately', 'SCAM');
test('Lottery scam', 'Congratulations! Aapne 50 lakh ki lottery jeet li hai', 'SCAM');
test('Lucky draw', 'You are the lucky draw winner! Claim your prize now', 'SCAM');
test('Job scam', 'Ghar baithe kamao 50000 daily. WhatsApp pe contact karo', 'SCAM');
test('Work from home scam', 'Work from home job - daily earn 5000. No experience needed', 'SCAM');
test('Double money scheme', 'Invest 500 aur 5000 kamao, guaranteed income daily', 'SCAM');
test('Urgency + link combo', 'Jaldi click karo is link pe, last chance hai: http://example.com', 'SCAM');
test('Fake police notice', 'Police notice: FIR darj ho gayi hai aapke naam pe, turant call karo', 'SCAM');
test('Fake court notice', 'Court notice: Legal action will be taken, contact immediately', 'SCAM');
test('UPI scam', 'Aapke account mein 5000 cashback pending hai, claim refund karo', 'SCAM');
test('Payment scam', 'Pay ₹1 and get ₹500 cashback. Google Pay exclusive offer!', 'SCAM');
test('KYC update scam', 'Your KYC has expired. Update immediately to avoid account suspension', 'SCAM');
test('Aadhaar link scam', 'Aadhaar verify karo warna bank account band ho jayega', 'SCAM');
test('Income tax notice', 'Income tax department notice: Pay pending tax or face arrest', 'SCAM');

// ─── 🟡 SUSPICIOUS Tests ─────────────────────────
console.log('\n🟡 SUSPICIOUS Tests:\n');

test('Viral forward', 'Yeh message 10 logo ko forward karo warna bad luck aayega', 'SUSPICIOUS');
test('Share in groups', 'Is message ko 5 groups mein share karo', 'SUSPICIOUS');
test('Fake NASA claim', 'NASA ne kaha ki kal raat 2 chand dikhenge', 'SUSPICIOUS');
test('Fake PM announcement', 'Modi ne announce kiya sabko 15 lakh milenge', 'SUSPICIOUS');
test('Media conspiracy', 'Media nahi dikha rahi yeh sach, viral karo', 'SUSPICIOUS');
test('Free iPhone', 'Apple de raha hai free iPhone 16, bas form fill karo', 'SUSPICIOUS');
test('Amazon voucher', 'Amazon voucher worth 10000 free! Anniversary offer', 'SUSPICIOUS');
test('Free recharge', 'Jio free recharge de raha hai 1 saal ka, link click karo', 'SUSPICIOUS');
test('Health misinformation', 'Corona cure mil gaya, yeh desi nuskha try karo', 'SUSPICIOUS');
test('Shortened URL', 'Check this amazing offer: https://bit.ly/3xYz123', 'SUSPICIOUS');
test('IP-based URL', 'Login here: http://192.168.1.100/bank-login', 'SUSPICIOUS');

// ─── 🟢 SAFE Tests ───────────────────────────────
console.log('\n🟢 SAFE Tests:\n');

test('Normal greeting', 'Bhai aaj dinner pe chal?', 'SAFE');
test('Normal conversation', 'Kal office mein meeting hai 10 baje', 'SAFE');
test('Casual chat', 'Movie dekhne chalein weekend pe?', 'SAFE');
test('Simple question', 'Kya haal hai? Sab theek?', 'SAFE');
test('Family message', 'Mummy ne pucha ki tum kab aa rahe ho', 'SAFE');
test('Work discussion', 'Project ka deadline extend ho gaya hai', 'SAFE');

// ─── Results ──────────────────────────────────────
console.log('\n' + '━'.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(failed === 0 ? '\n🎉 All tests passed!\n' : '\n⚠️  Some tests failed!\n');

process.exit(failed > 0 ? 1 : 0);
