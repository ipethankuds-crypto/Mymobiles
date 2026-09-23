const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const INQUIRIES_FILE = path.join(PUBLIC_DIR, 'inquiries.json');
const FORMSUBMIT_EMAIL = 'navarrojoserene.ca@gmail.com';
const SITE_URL = 'https://www.my-mobileapps.com/';
const SITE_ORIGIN = 'https://www.my-mobileapps.com';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8'
};

function dispatchToFormSubmit(emailData) {
  const payload = JSON.stringify({
    ...emailData,
    _captcha: 'false',
    _template: emailData._template || 'table',
    _next: SITE_URL,
    _url: SITE_URL,
    website: SITE_URL
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'formsubmit.co',
      path: `/ajax/${encodeURIComponent(FORMSUBMIT_EMAIL)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Origin: SITE_ORIGIN,
        Referer: SITE_URL
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const resText = (data || '').trim();
        console.log('[EMAIL DISPATCH RESPONSE]', resText);
        if (resText.includes('needs Activation')) {
          console.log('[ACTION REQUIRED] FormSubmit sent an activation email to ' + FORMSUBMIT_EMAIL + '. Open Gmail and click Activate Form once.');
        }
        resolve(resText);
      });
    });

    req.on('error', (err) => {
      console.error('[EMAIL DISPATCH WARNING]', err.message);
      resolve('');
    });
    req.write(payload);
    req.end();
  });
}

// Helper: Save and Dispatch Inquiry in Background
function saveAndDispatchInquiry(record) {
  const { skipDispatch, ...storedRecord } = record;
  let list = [];
  if (fs.existsSync(INQUIRIES_FILE)) {
    try { list = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8')); } catch (e) { list = []; }
  }
  list.push(storedRecord);
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf8');
  console.log(`[INQUIRY LOGGED] From: ${storedRecord.name} (${storedRecord.email}) -> Recipient: ${FORMSUBMIT_EMAIL}`);

  if (skipDispatch) return;

  const replyTo = /@/.test(storedRecord.email || '') ? storedRecord.email : FORMSUBMIT_EMAIL;
  const clientSubject = `[My Mobile Apps Inquiry] ${storedRecord.name} - ${storedRecord.projectType || 'Custom App'} (${storedRecord.businessName || 'Business'})`;
  dispatchToFormSubmit({
    name: storedRecord.name,
    businessName: storedRecord.businessName || 'My Mobile Apps Lead',
    email: replyTo,
    _replyto: replyTo,
    phone: storedRecord.phone || 'Not provided',
    solutionType: storedRecord.projectType || 'Website Inquiry',
    industry: storedRecord.industry || 'General',
    message: storedRecord.message,
    _subject: clientSubject
  });
}

// 100% Free Forever Self-Contained Knowledge Engine (ChatGPT-Style Response Engine)
function generateAiResponse(userMsg, history) {
  const raw = (userMsg || '').trim();
  const q = raw.toLowerCase();

  // 1. Lead Detection (Email or Phone)
  const emailMatch = raw.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  const phoneMatch = raw.match(/(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);

  if (emailMatch || phoneMatch) {
    const contactMethod = emailMatch ? emailMatch[0] : phoneMatch[0];
    return {
      reply: `🎉 **Thank you! I have captured your contact info (${contactMethod}).**\n\nJose Rene Navarro has received your details directly at **navarrojoserene.ca@gmail.com** and will reach out to you within 24 hours to schedule your free 30-minute discovery consultation.\n\nIn the meantime, feel free to ask me any questions about our architecture, 5-7 business day turnaround, or previous app deployments!`,
      capturedLead: true,
      leadData: {
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        details: raw
      },
      suggestions: ['Tell me about Level 1 App Tier', 'How does delivery work in 5-7 days?', 'Call Jose: (437) 423-3456']
    };
  }

  // 2. Polite Thanks, Compliments & Pleasantries
  if (q.match(/\b(thank\s*you|thanks|thx|appreciate\s*it|awesome|great\s*job|good\s*job|cool|you('re|\s*are)\s*(smart|awesome|great|cool|helpful))\b/)) {
    return {
      reply: `🙏 **You're very welcome!**\n\nI'm always happy to help. Whether you want to explore app ideas for your business, dive into our 4 modular tiers, or learn more about Jose's 20+ years in software QA, I'm here 24/7.\n\nIf you'd like to talk directly with Jose Rene Navarro, you can call him anytime at **(437) 423-3456** or email **navarrojoserene.ca@gmail.com**.\n\nIs there anything else I can help you with today?`,
      suggestions: ['Tell me about Level 1 App', 'What apps has Jose built?', 'Book a discovery consultation']
    };
  }

  // 3. Goodbyes & Farewells
  if (q.match(/\b(goodbye|bye|see\s*you|cya|farewell|have\s*a\s*good\s*(day|night)|good\s*night)\b/)) {
    return {
      reply: `👋 **Have a wonderful day!**\n\nThanks for stopping by My Mobile Apps. Whenever you're ready to transform your team's workflow into a high-speed mobile & web app, Jose Rene Navarro is ready to build it in just **5 to 7 business days**.\n\nFeel free to return anytime or reach Jose directly at **(437) 423-3456**!`,
      suggestions: ['Book consultation', 'View 5 Case Studies', 'Call Jose']
    };
  }

  // 4. "How are you?" / Status Check
  if (q.match(/\b(how\s*(are|r)\s*(you|u)|how('s|\s*is)\s*it\s*going|how\s*do\s*you\s*do|how('s|\s*is)\s*your\s*day)\b/)) {
    return {
      reply: `🚀 **I'm doing great, thank you for asking!**\n\nI'm fully online, running at sub-50ms latency, and ready to assist you with custom app designs, workforce automation, and software testing.\n\nHow is your day going? What kind of project or business are you working on?`,
      suggestions: ['I need an app for my business', 'Explain Level 1 App', 'Who is Jose Rene Navarro?']
    };
  }

  // 5. Greetings
  if (q.match(/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|yo|howdy|sup)\b/) || q === 'hi' || q === 'hello') {
    return {
      reply: `👋 **Hello! Welcome to My Mobile Apps.**\n\nI am the **My Mobile Apps AI Assistant**, virtual assistant to **Jose Rene Navarro**. Think of me as your dedicated assistant for custom mobile apps, workflow automation, and Software QA.\n\nI can help you:\n• Explore **App Levels 1 to 4** (Face Verification, Task Checklists, CRA Payroll & Scheduling)\n• Review Jose's **5 live production applications**\n• Understand our **5 to 7 business day** delivery timeline\n• Scope a custom mobile & web app for your team\n\nWhat kind of business or project are you looking to build today?`,
      suggestions: ['Explain Level 1 App', 'Can you build an app for my team?', 'What apps has Jose built?', 'Book a discovery consultation']
    };
  }

  // 6. Math & Calculations (ChatGPT Capability)
  const mathMatch = raw.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/xX\^]|times|plus|minus|divided\s*by)\s*(\d+(?:\.\d+)?)/i);
  const percentMatch = raw.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of)\s*(\d+(?:\.\d+)?)/i);
  
  if (percentMatch) {
    const pct = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    const res = (pct / 100) * total;
    return {
      reply: `🔢 **Calculation Result**:\n\n**${pct}% of ${total} = ${res}**\n\nNeed to calculate payroll hours, overtime rates, or cost savings for your team? Our Level 3 Suite automates regular vs. overtime calculations under Ontario ESA regulations automatically!`,
      suggestions: ['Explain Level 3 CRA Payroll', 'How much does an app cost?', 'Book a discovery call']
    };
  } else if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    let op = mathMatch[2].toLowerCase().trim();
    const num2 = parseFloat(mathMatch[3]);
    let result = null;
    let opSymbol = op;

    if (op === '+' || op === 'plus') { result = num1 + num2; opSymbol = '+'; }
    else if (op === '-' || op === 'minus') { result = num1 - num2; opSymbol = '−'; }
    else if (op === '*' || op === 'x' || op === 'times') { result = num1 * num2; opSymbol = '×'; }
    else if (op === '/' || op === 'divided by') { result = num2 !== 0 ? (num1 / num2) : 'Undefined (divide by 0)'; opSymbol = '÷'; }
    else if (op === '^') { result = Math.pow(num1, num2); opSymbol = '^'; }

    if (result !== null) {
      return {
        reply: `🔢 **Calculation Result**:\n\n**${num1} ${opSymbol} ${num2} = ${result}**\n\nJust like ChatGPT, I can handle calculations, timesheet arithmetic, and operational logic. My Mobile Apps uses this same precision for automated CRA payroll hours and overtime calculations!`,
        suggestions: ['Calculate overtime for 44+ hrs', 'What is Level 3?', 'Book a consultation']
      };
    }
  }

  // 7. Ontario Overtime / ESA Calculation Questions
  if (q.includes('overtime') || q.includes('esa') || q.includes('44 hour') || q.includes('payroll rule')) {
    return {
      reply: `⚖️ **Ontario Employment Standards Act (ESA) Overtime Calculation**:\n\nIn Ontario, overtime must be paid after an employee works **44 hours** in a work week:\n\n• **Regular Hours**: Up to 44 hours per week (paid at standard hourly wage).\n• **Overtime Hours**: Every hour beyond 44 is paid at **1.5× the regular rate** ("time and a half").\n• **Example**: If an employee works 48 hours at $20/hr:\n  - Regular: 44 hrs × $20 = $880\n  - Overtime: 4 hrs × $30 (1.5×) = $120\n  - Total Gross: **$1,000**\n\n📊 **Level 3 Suite** automatically computes this split down to the exact minute and outputs 1-click CRA-ready CSV spreadsheets!`,
      suggestions: ['Explain Level 3 Suite', 'How fast can you build our app?', 'Schedule a consultation']
    };
  }

  // 8. Coding & Technical Generation (ChatGPT Capability)
  if (q.includes('python') || q.includes('javascript') || q.includes('write code') || q.includes('code snippet') || q.includes('sql') || q.includes('script') || q.includes('programming')) {
    let language = 'Python';
    let sampleCode = ``;

    if (q.includes('sql') || q.includes('database')) {
      language = 'SQL';
      sampleCode = `-- Query verified staff attendance with zero buddy punching\nSELECT \n    employee_id, \n    employee_name, \n    clock_in_time, \n    gps_coordinates, \n    face_match_score \nFROM shift_attendance \nWHERE face_match_score = 1.00 \n  AND shift_date = CURRENT_DATE \nORDER BY clock_in_time DESC;`;
    } else if (q.includes('javascript') || q.includes('js') || q.includes('react')) {
      language = 'JavaScript (ES6)';
      sampleCode = `// Fetch attendance shift status asynchronously\nasync function verifyShift(employeeId) {\n  try {\n    const res = await fetch('/api/verify-shift', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ employeeId, timestamp: new Date().toISOString() })\n    });\n    const data = await res.json();\n    console.log('Biometric Match:', data.faceScore === 1.00 ? 'Verified' : 'Flagged');\n    return data;\n  } catch (err) {\n    console.error('Shift sync error:', err);\n  }\n}`;
    } else {
      language = 'Python';
      sampleCode = `# Python script to calculate Ontario ESA overtime and payroll\ndef calculate_ontario_payroll(hours_worked, hourly_rate):\n    REGULAR_LIMIT = 44.0\n    if hours_worked <= REGULAR_LIMIT:\n        regular_pay = hours_worked * hourly_rate\n        overtime_pay = 0.0\n    else:\n        regular_pay = REGULAR_LIMIT * hourly_rate\n        overtime_hours = hours_worked - REGULAR_LIMIT\n        overtime_pay = overtime_hours * (hourly_rate * 1.5)\n    \n    total_gross = regular_pay + overtime_pay\n    return {\n        "regular_pay": round(regular_pay, 2),\n        "overtime_pay": round(overtime_pay, 2),\n        "total_gross": round(total_gross, 2)\n    }\n\n# Example: 48 hours at $22.50/hr\nprint(calculate_ontario_payroll(48, 22.50))`;
    }

    return {
      reply: `💻 **Here is your ${language} code sample:**\n\n\`\`\`${language.toLowerCase().split(' ')[0]}\n${sampleCode}\n\`\`\`\n\nAt My Mobile Apps, Jose Rene Navarro applies **20+ years of Software QA Engineering rigor** to all software architectures, ensuring clean code, zero crashes, and enterprise performance.\n\nWould you like this logic built into a custom mobile/web application for your business?`,
      suggestions: ['Can you build an app for my team?', 'What is Level 1?', 'Book a consultation']
    };
  }

  // 9. Comparisons: PWA vs Native App / Glide vs Traditional Agencies
  if (q.includes('pwa vs') || q.includes('native') || q.includes('flutter') || q.includes('react native') || q.includes('traditional') || q.includes('agency')) {
    return {
      reply: `📱 **PWA (Progressive Web App) vs. Traditional Native App**:\n\n• **Speed to Market**: Glide PWAs deploy in **5 to 7 business days**. Traditional native apps take **4 to 6 months**.\n• **Cost**: Glide PWAs save up to **80% in development fees** ($25k–$50k+ traditional vs. accessible high-ROI custom Glide apps).\n• **Instant Deployment**: Deploys immediately to employee smartphones and desktop web browsers with 1 tap, with immediate real-time cloud updates.\n• **Universal Device Support**: One single codebase works on iPhone, Android, iPad, and desktop web browsers with real-time cloud data sync.\n\nWould you like to see how a Glide PWA works for your team?`,
      suggestions: ['Show me case studies', 'How much does it cost?', 'Book a discovery call']
    };
  }

  // 10. Paper / Excel vs. Digital Systems
  if (q.includes('excel') || q.includes('spreadsheet') || q.includes('paper') || q.includes('manual') || q.includes('whatsapp') || q.includes('text message')) {
    return {
      reply: `📑 **Why Spreadsheets & Paper Fall Apart for Field Teams**:\n\n• **Buddy Punching & Dishonest Hours**: Paper timesheets and WhatsApp check-ins cannot verify identity or location.\n• **Lost Documentation**: Paper inspection checklists get stained, lost, or forged. Our apps require live photo evidence before clocking out.\n• **Endless Payroll Disputes**: Managers spend 15+ hours every pay period deciphering messy handwriting and arguing over missing hours.\n• **The Digital Fix**: AI Face Biometrics (1.00 match score), GPS timestamping, and 1-click CRA payroll export.\n\nReady to ditch the paper clipboard for good?`,
      suggestions: ['Explain Level 1 App', 'How fast is delivery?', 'Book a 30-min discovery call']
    };
  }

  // 11. Custom App Scoping for Specific Industries
  if (q.includes('clean') || q.includes('janitorial') || q.includes('security') || q.includes('construct') || q.includes('landscap') || q.includes('hvac') || q.includes('plumb') || q.includes('clinic') || q.includes('dental') || q.includes('gym') || q.includes('contractor') || q.includes('fleet') || q.includes('restaurant') || q.includes('drive') || q.includes('driving')) {
    let industry = 'your industry';
    if (q.includes('clean') || q.includes('janitorial')) industry = 'Commercial Cleaning & Maintenance';
    else if (q.includes('security')) industry = 'Security & Guard Services';
    else if (q.includes('construct') || q.includes('contractor')) industry = 'Construction & Trades';
    else if (q.includes('landscap')) industry = 'Landscaping & Property Maintenance';
    else if (q.includes('hvac') || q.includes('plumb')) industry = 'HVAC & Plumbing Field Services';
    else if (q.includes('drive') || q.includes('driving')) industry = 'Driving Schools & Student Dispatch';

    return {
      reply: `🏢 **Custom Mobile & Web App Scoping for ${industry}**:\n\nJose Rene Navarro specializes in building rapid, high-impact operational apps for field and service teams. Here is a recommended architecture for your team:\n\n• **Frontline Mobile PWA**: Staff clock in on their smartphones using **AI Biometric Face Verification** (eliminates buddy punching) with GPS geofencing at client job sites.\n• **Task Checklists & Photo Evidence**: Mandatory shift checklist requiring before/after photos of finished work before clocking out.\n• **Real-Time Web Portal**: Managers and dispatchers see live team attendance, instant photo proof, and automated alerts for late arrivals.\n• **1-Click CRA Payroll**: Automatically compiles regular vs. overtime hours compliant with Ontario ESA standards.\n\n⏱️ **Timeline**: Ready for production deployment in just **5 to 7 business days**!\n\nWould you like to book a 30-minute discovery call with Jose to review your requirements?`,
      suggestions: ['Book a discovery call', 'How much does it cost?', 'What is Level 1?']
    };
  }

  // 12. Modular Tiers (Levels 1 to 4)
  if (q.includes('level 1') || q.includes('foundation') || (q.includes('level') && q.includes('1'))) {
    return {
      reply: `📱 **Level 1: Foundation Suite (Attendance + Task Verification)**\n\nEngineered specifically to solve the #1 problem in field operations: unverified hours and incomplete jobs.\n\n• **AI Biometric Face Verification**: Strict Face Score 1.00 match prevents buddy punching 100%.\n• **Late Arrival & Missing Checkout Alerts**: Real-time push notifications when staff miss shifts.\n• **Mandatory Shift Task Lists**: Field staff upload photo evidence of completed work.\n• **Manager Web Dashboard**: Live visibility over all shifts across multiple client locations.\n• **Turnaround**: 5 to 7 business days.\n• **Admin Savings**: 10+ hours per week in eliminated timesheet disputes.\n\nWould you like to see how Level 1 deploys for your team?`,
      suggestions: ['What is Level 2?', 'How does face verification work?', 'Book a consultation']
    };
  }

  if (q.includes('level 2') || q.includes('communication') || (q.includes('level') && q.includes('2'))) {
    return {
      reply: `💬 **Level 2: Communication Suite (Attendance + Tasks + Team Chat)**\n\nCentralizes team operations and eliminates chaotic personal WhatsApp and SMS text threads.\n\n• **Everything in Level 1**: Full AI biometric attendance & photo-verified task checklists.\n• **Direct In-App Staff Messaging**: 1-on-1 and group communication between management and field crew.\n• **Broadcast Announcements**: Company-wide notices, safety updates, and shift reminders with read receipts.\n• **Turnaround**: 5 to 7 business days.\n• **Admin Savings**: 15+ hours per week in streamlined team communication.\n\nWould you like to explore Level 3 with CRA payroll automation?`,
      suggestions: ['Tell me about Level 3 Payroll', 'What is Level 1?', 'Book a discovery consultation']
    };
  }

  if (q.includes('level 3') || q.includes('payroll') || q.includes('cra') || (q.includes('level') && q.includes('3'))) {
    return {
      reply: `💰 **Level 3: Workforce Management & CRA Payroll Suite**\n\nTransforms messy handwriting and disputed timesheets into audit-proof payroll exports.\n\n• **Everything in Levels 1 & 2**: AI facial attendance, task photo proof, and team messaging.\n• **Automated Hours & Overtime**: Calculates regular vs. overtime hours compliant with Ontario ESA regulations.\n• **1-Click CRA Payroll Exports**: Generates clean CSV/Excel spreadsheets ready for your accountant or payroll software.\n• **Turnaround**: 5 to 7 business days.\n• **Admin Savings**: 20+ hours per week in eliminated manual bookkeeping.\n\nWould you like Jose to review your current payroll calculation workflow?`,
      suggestions: ['What is Level 4 Scheduling?', 'What apps has Jose built?', 'Book a consultation']
    };
  }

  if (q.includes('level 4') || q.includes('schedul') || q.includes('dispatch') || q.includes('calendar') || (q.includes('level') && q.includes('4'))) {
    return {
      reply: `🗓️ **Level 4: Enterprise Orchestration & Smart Scheduling**\n\nThe ultimate end-to-end management platform for growing field service enterprises.\n\n• **Everything in Levels 1, 2 & 3**: Full attendance, photo proof, chat, and payroll exports.\n• **Drag-and-Drop Shift Dispatch**: Assign crews to client locations with instant mobile shift notifications.\n• **Conflict & Overlap Prevention**: Automatically blocks double-booking and unauthorized overtime.\n• **Real-Time GPS Crew Verification**: Map visibility over staff arrival times and location accuracy.\n• **Turnaround**: 5 to 7 business days.\n\nWould you like to discuss deploying Level 4 for your business?`,
      suggestions: ['Show me case studies', 'How fast can you build our app?', 'Schedule a consultation']
    };
  }

  // 13. Biometric Face Verification & Anti-Buddy Punching
  if (q.includes('face') || q.includes('biometric') || q.includes('buddy') || q.includes('punching') || q.includes('cheat') || q.includes('fake') || q.includes('ghost')) {
    return {
      reply: `🛡️ **How Our AI Face Verification Eliminates Buddy Punching 100%**:\n\n• **Strict 1.00 Face Match Score**: When an employee arrives at a job site, they snap a live selfie in the app. Our AI biometric engine compares their facial landmark geometry against their registered employee profile.\n• **Anti-Spoofing & Live Camera**: Staff cannot upload old photos or pictures of pictures from their camera roll; the photo must be taken live with active timestamp and GPS coordinates.\n• **Zero Buddy Punching**: It is physically impossible for a coworker to clock in for an absent friend.\n• **Verified Case Study**: In *The Manpower Solution* app, 18 cleaning staff achieved 100% verified attendance with zero buddy punching since day one.\n\nWould you like to try a demo or see the case study?`,
      suggestions: ['Tell me about Manpower Solution', 'What is Level 1?', 'Book a discovery consultation']
    };
  }

  // 14. Case Studies & Previous Work
  if (q.includes('case stud') || q.includes('work done') || q.includes('portfolio') || q.includes('previous') || q.includes('apps') || q.includes('manpower') || q.includes('cfc') || q.includes('saint') || q.includes('driving') || q.includes('joren')) {
    return {
      reply: `🚀 **Jose Rene Navarro's 5 Production App Deployments**:\n\n1. **The Manpower Solution (Level 1 App)**: 18 active commercial cleaners across the GTA. 100% eliminated buddy punching with Face Match 1.00 and photo task verification.\n2. **CFC Music Ministry App (100% Free Community App)**: 135+ Catholic worship songs with live interactive chord transposing (change key in 1 click) and embedded audio, available completely free.\n3. **Birthday Saint Finder**: 100% offline liturgical calendar with biographical saint profiles and feast day search.\n4. **Driving Academy Management Platform**: Dual-sided system for student lesson logging and driving instructor vehicle dispatch.\n5. **Joren Property Listings**: Mobile real estate catalog with automated buyer interest analytics.\n\nYou can view the full case studies on our **"Solutions & Work"** page. Which project would you like to know more about?`,
      suggestions: ['Tell me about Manpower Solution', 'Tell me about CFC Music', 'Book a discovery consultation']
    };
  }

  // 15. Pricing, Cost & Turnaround Time
  if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('quote') || q.includes('how much') || q.includes('timeline') || q.includes('how long') || q.includes('fast') || q.includes('days') || q.includes('budget')) {
    return {
      reply: `⚡ **Rapid Turnaround & Unmatched Cost Efficiency**:\n\n• **Delivery Speed**: Production-ready deployment in just **5 to 7 business days**!\n• **Up to 80% Cost Savings**: Traditional app agencies charge $25,000–$50,000+ and take 4 to 6 months. Jose builds custom Progressive Web Apps (PWAs) on Glide, reducing costs by up to 80% while delivering enterprise reliability.\n• **Instant Web & Mobile Deployment**: Rapid distribution directly to employee smartphones and desktop browsers with 1 click, ensuring rapid rollout across your entire organization.\n• **Measurable ROI**: Saves 10 to 25 hours per week in eliminated timesheet disputes and manual paperwork.\n\nLeave your email or phone here, and Jose will provide an exact quote and scope within 24 hours!`,
      suggestions: ['Book a 30-min discovery call', 'What is Level 1?', 'Call Jose: (437) 423-3456']
    };
  }

  // 16. About Jose Rene Navarro / 20+ Years QA Rigor
  if (q.includes('about jose') || q.includes('who is jose') || q.includes('jose navarro') || (q.includes('qa') && q.includes('experience')) || q.includes('founder') || q.includes('credentials')) {
    return {
      reply: `👨‍💻 **About Jose Rene Navarro**:\n\nJose is a seasoned software engineering consultant based in Toronto, Ontario, Canada, with over **20 years of Software Quality Assurance (QA) Engineering** experience.\n\n• **Why QA Rigor Matters**: Most custom apps crash or confuse users because they aren't properly tested. Jose designs zero-crash, highly resilient mobile & web applications that frontline workers can learn in under 5 minutes.\n• **Core Specialization**: Modernizing paper-heavy workflows for commercial cleaning, facilities, and service businesses.\n• **Contact Jose Directly**:\n  📞 **(437) 423-3456**\n  ✉️ **navarrojoserene.ca@gmail.com**\n  🔗 [LinkedIn Profile](https://www.linkedin.com/in/jose-navarro-93b31015/)\n\nWould you like to schedule a quick call with Jose?`,
      suggestions: ['Call Jose: (437) 423-3456', 'Request consultation', 'See Jose\'s apps']
    };
  }

  // 17. Technology / Glide / PWA / Devices (iPhone, Android, Desktop)
  if (q.includes('glide') || q.includes('pwa') || q.includes('progressive web') || q.includes('iphone') || q.includes('android') || q.includes('ios') || q.includes('tablet') || q.includes('desktop')) {
    return {
      reply: `📲 **Cross-Platform Architecture (Glide Progressive Web Apps)**:\n\n• **Universal Device Compatibility**: My Mobile Apps run smoothly on iPhone (iOS), Android smartphones, iPads, tablets, and desktop web browsers.\n• **Instant Home Screen Install**: Users simply tap "Add to Home Screen". It opens as a full-screen standalone application with its own app icon, splash screen, and offline capabilities.\n• **Zero Friction**: Instant access via secure web link or QR code, with zero download hurdles or manual update delays.\n• **Real-Time Cloud Sync**: Every clock-in, photo upload, and task checklist syncs instantly to management web dashboards.\n\nWould you like to build an app for your team?`,
      suggestions: ['How fast can you build our app?', 'What is Level 1?', 'Book a discovery consultation']
    };
  }

  // 18. Identity & What are you / Who made you / ChatGPT comparisons
  if (q.includes('who are you') || q.includes('what are you') || q.includes('who made you') || q.includes('what can you do') || q.includes('chatgpt') || q.includes('your name')) {
    return {
      reply: `I am the **My Mobile Apps AI Assistant**, an AI assistant built specifically for **Jose Rene Navarro's** custom software and workforce platform.\n\nJust like ChatGPT, I can converse in natural language, answer technical questions, write app specs, do calculations, and guide you through software architecture. My domain expertise covers:\n\n1. **Workforce Operations**: Eliminating buddy punching with AI Face Verification (1.00 match score), GPS check-ins, and mandatory before/after photo proof.\n2. **Cross-Platform Apps**: Building Progressive Web Apps (PWAs) on Glide that work seamlessly across iPhone, Android, and desktop browsers.\n3. **Quality Assurance Rigor**: Leveraging Jose's 20+ years of software QA experience to ensure zero-crash reliability.\n\nHow can I assist your business today?`,
      suggestions: ['Tell me about Level 1 App', 'What apps has Jose built?', 'How much does an app cost?']
    };
  }

  // 19. Overview / Services / What is My Mobile Apps
  if (q.includes('what is my mobile apps') || q.includes('what is proofly') || q.includes('what do you do') || q.includes('what does proofly do') || q.includes('overview') || q.includes('services')) {
    return {
      reply: `⭐ **My Mobile Apps Overview**: My Mobile Apps is a custom mobile/web application studio and AI workforce solutions platform created by **Jose Rene Navarro** in Toronto, Ontario.\n\nWe specialize in turning chaotic, paper-based field operations into simple, audit-proof digital applications:\n\n• **AI Face Biometrics**: Guarantees zero buddy punching with 1.00 facial match score.\n• **Mandatory Shift Checklists**: Staff must upload before/after photos of finished work.\n• **In-App Messaging & Announcements**: Replaces messy WhatsApp/SMS chains.\n• **1-Click CRA Payroll**: Calculates regular vs. overtime hours under Ontario ESA.\n• **Fast Delivery**: Built on Glide Progressive Web Apps (PWAs) in just **5 to 7 business days**!\n\nWould you like to explore App Level 1, or discuss an app for your team?`,
      suggestions: ['Explain Level 1 App', 'How much does an app cost?', 'See Jose\'s 5 live apps', 'Book a discovery call']
    };
  }

  // 20. Jokes / Humor
  if (q.includes('joke') || q.includes('funny') || q.includes('humor')) {
    const jokes = [
      `😄 **Here's a developer joke for you:**\n\nWhy do programmers prefer dark mode?\n*Because light attracts bugs!*\n\nSpeaking of bugs—with Jose Rene Navarro's **20+ years of Software QA experience**, our apps are thoroughly tested so your business runs bug-free! Can I help you with an app for your team?`,
      `😄 **Here's another one:**\n\nThere are only 10 types of people in the world:\n*Those who understand binary, and those who don't!*\n\nAnd when it comes to attendance tracking, there are only 2 types of systems: paper timesheets that invite buddy punching, and AI biometric verification that eliminates it 100%!`,
      `😄 **A QA engineer walks into a bar:**\n\nOrders a beer. Orders 0 beers. Orders 999999999 beers. Orders a lizard. Orders -1 beers. Orders a sfdeljknesv.\n\nFirst real customer walks in and asks where the bathroom is. The bar burns down!\n\nThat's why Jose Rene Navarro tests **real user scenarios** across 20+ years of QA practice!`
    ];
    const picked = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      reply: picked,
      suggestions: ['Tell me another joke', 'Tell me about Level 1 App', 'Book a consultation']
    };
  }

  // 21. Contact, Phone, Email & Consultation
  if (q.includes('contact') || q.includes('book') || q.includes('call') || q.includes('consult') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('meet') || q.includes('schedule')) {
    return {
      reply: `📅 **Connect Directly with Jose Rene Navarro**:\n\n• **Direct Phone**: (437) 423-3456\n• **Email**: navarrojoserene.ca@gmail.com\n• **Location**: Toronto, Ontario, Canada\n• **Discovery Consultation**: Free 30-minute operational review of your workflow\n\nYou can also simply **type your name, email, or phone right here in this chat**, and I will automatically dispatch your inquiry to Jose's inbox!`,
      suggestions: ['Book consultation', 'What is Level 1?', 'How fast is delivery?']
    };
  }

  // 22. Conversational Intelligent Fallback
  return {
    reply: `💡 **Regarding "${raw}":**\n\nAs the My Mobile Apps AI Assistant, I can assist you with:\n1. **App Architecture & Scoping**: Translating your business workflow into a clean Glide mobile & web app.\n2. **Eliminating Buddy Punching**: AI Biometric Face Verification with 1.00 match score.\n3. **Task Checklists**: Mandatory before/after photo verification for field staff.\n4. **Ontario ESA & CRA Payroll**: Calculating regular and overtime hours with 1-click export.\n5. **Calculations & Logic**: Just ask me any arithmetic or workflow questions!\n\nIf you have a specific requirement or want a custom proposal, you can reach **Jose Rene Navarro** directly at **navarrojoserene.ca@gmail.com** or **(437) 423-3456**.\n\nWhat would you like to explore next?`,
    suggestions: [
      'Explain Level 1 App',
      'What apps has Jose built?',
      'How fast can you build our app?',
      'Book a discovery consultation'
    ]
  };
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle Contact Form Submission (100% Automated Backend Email Dispatch)
  if (req.method === 'POST' && req.url === '/api/contact') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const inquiry = JSON.parse(body || '{}');
        const record = {
          id: 'inq_' + Date.now(),
          timestamp: new Date().toISOString(),
          recipient: 'navarrojoserene.ca@gmail.com',
          consultant: 'Jose Rene Navarro (navarrojoserene.ca@gmail.com)',
          ...inquiry
        };

        saveAndDispatchInquiry(record);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Inquiry received and email dispatched automatically in background.',
          recipient: 'navarrojoserene.ca@gmail.com',
          id: record.id
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Handle AI Chatbot Interaction (100% Free Forever Self-Contained Engine)
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { message, history, leadInfo } = JSON.parse(body || '{}');
        
        // Generate intelligent domain response
        const aiResponse = generateAiResponse(message, history);

        // If leadInfo was submitted or detected from message, automatically log & email Jose
        if (leadInfo || aiResponse.capturedLead) {
          const clientLead = leadInfo || {};
          const record = {
            id: 'lead_' + Date.now(),
            timestamp: new Date().toISOString(),
            recipient: 'navarrojoserene.ca@gmail.com',
            consultant: 'Jose Rene Navarro (navarrojoserene.ca@gmail.com)',
            source: 'My Mobile Apps Chat',
            name: clientLead.name || 'Chatbot Visitor',
            email: clientLead.email || (aiResponse.leadData ? aiResponse.leadData.email : 'Captured in chat'),
            phone: clientLead.phone || (aiResponse.leadData ? aiResponse.leadData.phone : 'Not provided'),
            projectType: clientLead.projectType || 'AI Chat Inquiry',
            industry: clientLead.industry || 'General',
            message: `[AI CHAT INQUIRY]\nUser Message: ${message}\nContact: ${clientLead.email || clientLead.phone || 'In chat conversation'}`
          };

          saveAndDispatchInquiry(record);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          reply: aiResponse.reply,
          suggestions: aiResponse.suggestions,
          capturedLead: aiResponse.capturedLead || false
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath.endsWith('/') && reqPath.length > 1) {
    reqPath = reqPath.slice(0, -1);
  }

  // Define SEO metadata for all clean SPA routes
  const ROUTE_SEO = {
    '/': {
      title: 'My Mobile Apps | Custom Business Mobile & Web App Development Toronto',
      description: 'My Mobile Apps builds custom mobile PWAs, web applications, and AI face verification systems for field service businesses across Toronto & Canada. Rapid 5–7 day delivery.',
      canonical: 'https://www.my-mobileapps.com/'
    },
    '/index.html': {
      title: 'My Mobile Apps | Custom Business Mobile & Web App Development Toronto',
      description: 'My Mobile Apps builds custom mobile PWAs, web applications, and AI face verification systems for field service businesses across Toronto & Canada. Rapid 5–7 day delivery.',
      canonical: 'https://www.my-mobileapps.com/'
    },
    '/mobile-app-development': {
      title: 'Custom Mobile App Development Toronto & Canada | Rapid 5–7 Day PWAs',
      description: 'Get custom mobile Progressive Web Apps (PWAs) built on Glide and deployed for your business in 5-7 business days. 20+ years of Software QA rigor by Jose Rene Navarro.',
      canonical: 'https://www.my-mobileapps.com/mobile-app-development'
    },
    '/website-development': {
      title: 'Custom Business Web Portals & Dashboard Development | Toronto & Canada',
      description: 'Custom business web portals, operations management dashboards, and automated CRA payroll export systems built fast for Toronto and Ontario businesses.',
      canonical: 'https://www.my-mobileapps.com/website-development'
    },
    '/qa-testing': {
      title: 'Website & Software QA Testing Services Toronto | 20+ Yrs QA Engineering',
      description: 'Professional Software Quality Assurance testing by Jose Rene Navarro. Eliminate broken workflows, usability flaws, and UI bugs across desktop and mobile.',
      canonical: 'https://www.my-mobileapps.com/qa-testing'
    },
    '/ai-solutions': {
      title: 'AI Biometric Face Verification & Business Solutions | Anti-Buddy Punching',
      description: 'Stop buddy punching 100% with AI Face Match biometrics, anti-spoofing cameras, and GPS geofenced mobile attendance for Canadian field service teams.',
      canonical: 'https://www.my-mobileapps.com/ai-solutions'
    },
    '/industries/field-services': {
      title: 'Field Service, Cleaning & Construction Apps Toronto | My Mobile Apps',
      description: 'Custom mobile apps for commercial cleaning, construction, HVAC, and trades. Digital before/after photo checklists, live shift tracking, and CRA payroll.',
      canonical: 'https://www.my-mobileapps.com/industries/field-services'
    },
    '/field-services': {
      title: 'Field Service, Cleaning & Construction Apps Toronto | My Mobile Apps',
      description: 'Custom mobile apps for commercial cleaning, construction, HVAC, and trades. Digital before/after photo checklists, live shift tracking, and CRA payroll.',
      canonical: 'https://www.my-mobileapps.com/industries/field-services'
    },
    '/work-done': {
      title: 'Verified Client Work Done & Live Apps Portfolio | My Mobile Apps',
      description: 'Explore 5 live production apps built by Jose Rene Navarro: Manpower Solution, Driving Academy, Property Listings, CFC Music Ministry, and Saint Finder.',
      canonical: 'https://www.my-mobileapps.com/work-done'
    },
    '/case-studies': {
      title: 'Production App Case Studies & Portfolio | My Mobile Apps Toronto',
      description: 'Explore 5 live production apps built by Jose Rene Navarro: Manpower Solution, Driving Academy, Property Listings, CFC Music Ministry, and Saint Finder.',
      canonical: 'https://www.my-mobileapps.com/work-done'
    },
    '/contact': {
      title: 'Contact Jose Rene Navarro | Free App Discovery Consultation Toronto',
      description: 'Book a free 30-minute consultation or call (437) 423-3456. Get your custom mobile or web app scoped and delivered in 5 to 7 days.',
      canonical: 'https://www.my-mobileapps.com/contact'
    }
  };

  // Check if requested path is a known clean SPA route
  if (ROUTE_SEO[reqPath]) {
    const seo = ROUTE_SEO[reqPath];
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    fs.readFile(indexPath, 'utf8', (err, htmlContent) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }

      // Pre-render route-specific SEO tags into <head> for Googlebot and users
      let modifiedHtml = htmlContent
        .replace(/<title>.*?<\/title>/i, `<title>${seo.title}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${seo.description}" />`)
        .replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${seo.canonical}" />`)
        .replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${seo.title}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${seo.description}" />`)
        .replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${seo.canonical}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${seo.title}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${seo.description}" />`);

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'no-cache'
      });
      res.end(modifiedHtml);
    });
    return;
  }

  const filePath = path.normalize(path.join(PUBLIC_DIR, reqPath));

  // Security check: ensure path stays within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Demo site running at http://localhost:${PORT}/`);
});
