// Interactive Logic for My Mobile Apps - Jose Rene Navarro Demo Website

document.addEventListener('DOMContentLoaded', () => {
  initPhoneSimulator();
  initProoflyLevels();
  initAppEstimator();
  initPortfolioFilters();
  initModals();
  initFAQ();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. Interactive Phone Simulator
   ========================================================================== */
let currentSimulatorScreen = 'clockin';
let isClockedIn = false;
let checklistState = [true, false, false, false];

function initPhoneSimulator() {
  const screenContainer = document.getElementById('phone-screen-content');
  if (!screenContainer) return;

  renderPhoneScreen(currentSimulatorScreen);

  // Tab buttons above/below mockup
  document.querySelectorAll('.phone-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const screen = btn.dataset.screen;
      if (screen) {
        currentSimulatorScreen = screen;
        updatePhoneNavButtons();
        renderPhoneScreen(screen);
      }
    });
  });
}

function updatePhoneNavButtons() {
  document.querySelectorAll('.phone-nav-btn').forEach(btn => {
    if (btn.dataset.screen === currentSimulatorScreen) {
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
    } else {
      btn.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
    }
  });
}

function renderPhoneScreen(screen) {
  const container = document.getElementById('phone-screen-content');
  if (!container) return;

  if (screen === 'clockin') {
    container.innerHTML = `
      <div class="p-4 flex flex-col h-full text-slate-800">
        <!-- App Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div class="flex items-center space-x-2">
            <div class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">P</div>
            <div>
              <div class="text-xs font-bold leading-none text-slate-900">Proofly Mobile</div>
              <div class="text-[10px] text-emerald-600 font-semibold flex items-center">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span> Glide Live PWA
              </div>
            </div>
          </div>
          <div class="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">Shift #408</div>
        </div>

        <!-- Employee Card -->
        <div class="mt-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div class="relative">
            <div class="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">
              MC
            </div>
            <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>
          <div class="flex-1">
            <div class="text-xs font-bold text-slate-900">Marcus Chen</div>
            <div class="text-[11px] text-slate-500">Field Ops Team A</div>
            <div class="text-[10px] text-blue-600 font-medium mt-0.5 flex items-center">
              <svg class="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 116 0z"></path></svg>
              Toronto Metro Site 04
            </div>
          </div>
        </div>

        <!-- Shift Status Box -->
        <div class="mt-3 bg-slate-900 text-white p-3.5 rounded-2xl shadow-md">
          <div class="flex justify-between items-center text-[11px] text-slate-400">
            <span>Scheduled: 08:00 AM - 04:30 PM</span>
            <span class="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase">On Time</span>
          </div>
          <div class="mt-2 text-center">
            <div class="text-2xl font-mono font-bold tracking-tight text-white" id="live-phone-time">07:58:24 AM</div>
            <div class="text-[10px] text-slate-400 mt-0.5">GPS Verification Active (within 15m radius)</div>
          </div>
        </div>

        <!-- Verification State & Action Button -->
        <div class="mt-4 flex-1 flex flex-col justify-center items-center text-center">
          <div id="sim-face-scanner" class="relative w-28 h-28 rounded-2xl border-2 border-dashed ${isClockedIn ? 'border-emerald-500 bg-emerald-50' : 'border-blue-400 bg-blue-50'} flex flex-col items-center justify-center p-2 transition-all duration-300">
            ${isClockedIn ? `
              <div class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1 animate-check">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="text-[11px] font-bold text-emerald-800">Face Verified</div>
              <div class="text-[9px] text-emerald-600">Match 99.1% · ID Confirmed</div>
            ` : `
              <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div class="text-[11px] font-semibold text-slate-700">Selfie Verification</div>
              <div class="text-[9px] text-slate-500">Tap below to simulate</div>
            `}
          </div>

          <div class="mt-3 text-[10px] text-slate-500">
            ${isClockedIn 
              ? '<span class="text-emerald-700 font-medium">Shift started at 07:58 AM · Logged to Payroll</span>' 
              : 'AI compares photo with registered employee file to stop buddy punching.'}
          </div>
        </div>

        <!-- Action Button -->
        <button id="sim-clock-action-btn" class="w-full mt-auto py-2.5 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center space-x-1.5 ${isClockedIn ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700 active:scale-98'}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isClockedIn ? 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'}"></path></svg>
          <span>${isClockedIn ? 'Complete Shift & Clock Out' : 'Verify Face & Clock In'}</span>
        </button>
      </div>
    `;

    // Add click event for simulator button
    const btn = document.getElementById('sim-clock-action-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (!isClockedIn) {
          // Simulate camera scanning
          btn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Analyzing Facial Biometrics...</span>
          `;
          btn.disabled = true;

          setTimeout(() => {
            isClockedIn = true;
            renderPhoneScreen('clockin');
            showToast('✅ Face Verified! Shift successfully recorded to admin dashboard.');
          }, 900);
        } else {
          isClockedIn = false;
          renderPhoneScreen('clockin');
          showToast('👋 Clock-out recorded. Hours exported to payroll queue.');
        }
      });
    }
  } else if (screen === 'tasks') {
    const completedCount = checklistState.filter(Boolean).length;
    const progressPct = Math.round((completedCount / checklistState.length) * 100);

    container.innerHTML = `
      <div class="p-4 flex flex-col h-full text-slate-800">
        <!-- Header -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <div class="text-xs font-bold text-slate-900">Shift Task Checklist</div>
            <div class="text-[10px] text-slate-500">Site: North Tower Floor 3</div>
          </div>
          <span class="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">${progressPct}% Done</span>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
          <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style="width: ${progressPct}%"></div>
        </div>

        <!-- Task List items -->
        <div class="mt-3 space-y-2 flex-1 overflow-y-auto pr-0.5">
          <div class="sim-task-item p-2.5 rounded-xl border ${checklistState[0] ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200'} flex items-start space-x-2.5 cursor-pointer transition-colors" data-index="0">
            <input type="checkbox" ${checklistState[0] ? 'checked' : ''} class="mt-0.5 rounded text-blue-600 pointer-events-none">
            <div class="flex-1 text-[11px]">
              <div class="font-semibold ${checklistState[0] ? 'line-through text-emerald-900' : 'text-slate-800'}">Arrival & Equipment Inspection</div>
              <div class="text-[9px] text-slate-500">Safety gear and sanitization unit confirmed</div>
            </div>
          </div>

          <div class="sim-task-item p-2.5 rounded-xl border ${checklistState[1] ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200'} flex items-start space-x-2.5 cursor-pointer transition-colors" data-index="1">
            <input type="checkbox" ${checklistState[1] ? 'checked' : ''} class="mt-0.5 rounded text-blue-600 pointer-events-none">
            <div class="flex-1 text-[11px]">
              <div class="font-semibold ${checklistState[1] ? 'line-through text-emerald-900' : 'text-slate-800'}">Upload "Before" Area Photo</div>
              <div class="text-[9px] text-slate-500 flex items-center mt-0.5">
                <span class="text-blue-600 font-medium">📷 Photo Evidence Attached</span>
              </div>
            </div>
          </div>

          <div class="sim-task-item p-2.5 rounded-xl border ${checklistState[2] ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200'} flex items-start space-x-2.5 cursor-pointer transition-colors" data-index="2">
            <input type="checkbox" ${checklistState[2] ? 'checked' : ''} class="mt-0.5 rounded text-blue-600 pointer-events-none">
            <div class="flex-1 text-[11px]">
              <div class="font-semibold ${checklistState[2] ? 'line-through text-emerald-900' : 'text-slate-800'}">Disinfect High-Touch Keyboards</div>
              <div class="text-[9px] text-slate-500">32 workstations on Floor 3</div>
            </div>
          </div>

          <div class="sim-task-item p-2.5 rounded-xl border ${checklistState[3] ? 'bg-emerald-50/70 border-emerald-200' : 'bg-white border-slate-200'} flex items-start space-x-2.5 cursor-pointer transition-colors" data-index="3">
            <input type="checkbox" ${checklistState[3] ? 'checked' : ''} class="mt-0.5 rounded text-blue-600 pointer-events-none">
            <div class="flex-1 text-[11px]">
              <div class="font-semibold ${checklistState[3] ? 'line-through text-emerald-900' : 'text-slate-800'}">Upload "After" Clean Room Photo</div>
              <div class="text-[9px] text-slate-500">Required for client sign-off</div>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div class="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-[10px] text-blue-800 flex items-center space-x-2">
          <svg class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Tap items to toggle completion proof in real-time.</span>
        </div>

        <button onclick="currentSimulatorScreen='dashboard'; updatePhoneNavButtons(); renderPhoneScreen('dashboard');" class="w-full mt-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1">
          <span>View Live Manager Dashboard</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    `;

    // Add checkbox toggle listener
    container.querySelectorAll('.sim-task-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        checklistState[idx] = !checklistState[idx];
        renderPhoneScreen('tasks');
      });
    });
  } else if (screen === 'dashboard') {
    container.innerHTML = `
      <div class="p-4 flex flex-col h-full text-slate-800">
        <!-- Dashboard Header -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <div class="text-xs font-bold text-slate-900">Admin Control Center</div>
            <div class="text-[10px] text-slate-500">Live Team Status (Glide App)</div>
          </div>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        <!-- Metric Grid -->
        <div class="grid grid-cols-2 gap-2 mt-3">
          <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500">On Duty Now</div>
            <div class="text-lg font-bold text-slate-900">14 / 15</div>
            <div class="text-[9px] text-emerald-600 font-medium">93% Attendance</div>
          </div>
          <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500">AI Late Alerts</div>
            <div class="text-lg font-bold text-amber-600">1</div>
            <div class="text-[9px] text-amber-700 font-medium">12m delay (Traffic)</div>
          </div>
          <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500">Photo Proofs</div>
            <div class="text-lg font-bold text-blue-600">28</div>
            <div class="text-[9px] text-blue-700 font-medium">100% Verified</div>
          </div>
          <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500">Total Hours (Wk)</div>
            <div class="text-lg font-bold text-slate-900">342.5 h</div>
            <div class="text-[9px] text-purple-700 font-medium">Payroll-ready</div>
          </div>
        </div>

        <!-- Recent Shift Feed -->
        <div class="mt-3 flex-1 overflow-y-auto">
          <div class="text-[11px] font-bold text-slate-800 mb-1.5 flex justify-between items-center">
            <span>Recent Face-Verified Shifts</span>
            <span class="text-[9px] text-blue-600 cursor-pointer">View All</span>
          </div>

          <div class="space-y-1.5 text-[10px]">
            <div class="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-900">Marcus Chen</div>
                <div class="text-[9px] text-slate-500">07:58 AM · Verified 99.1%</div>
              </div>
              <span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[9px] font-semibold">Active</span>
            </div>

            <div class="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-900">Elena Rostova</div>
                <div class="text-[9px] text-slate-500">08:02 AM · Verified 98.4%</div>
              </div>
              <span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[9px] font-semibold">Active</span>
            </div>

            <div class="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-900">David Miller</div>
                <div class="text-[9px] text-slate-500">08:12 AM · AI Late Flagged</div>
              </div>
              <span class="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[9px] font-semibold">Late</span>
            </div>
          </div>
        </div>

        <!-- Export Action -->
        <button id="sim-export-payroll-btn" class="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span>Export CRA Payroll Report (CSV)</span>
        </button>
      </div>
    `;

    const exportBtn = document.getElementById('sim-export-payroll-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        showToast('📄 Payroll Report Generated: 14 staff, 342.5 hrs, CRA deduction summaries exported.');
      });
    }
  }
}

/* ==========================================================================
   2. Proofly Level Explorer (Levels 1 to 4)
   ========================================================================== */
const prooflyLevelsData = {
  1: {
    title: 'Level 1 – Attendance Essentials + Face Verification',
    subtitle: 'Best for businesses replacing paper or Excel timesheets with bulletproof mobile verification.',
    tagline: 'Foundation Tier',
    badge: 'Popular for 5–25 Staff',
    features: [
      'One-tap mobile Start & End Shift check-ins on iOS & Android',
      'AI Face Verification with selfie biometric comparison',
      'AI Late Detection — flags tardy clock-ins immediately',
      'AI Missing Checkout Alerts — detects forgotten shift endings',
      'Live admin dashboard with site location assignment',
      '100% paperless, zero buddy punching'
    ],
    idealFor: 'Contract cleaning crews, security guards, landscapers, field technicians',
    simulatorScreen: 'clockin'
  },
  2: {
    title: 'Level 2 – Operations, Task Verification & Messaging',
    subtitle: 'Track shift attendance AND confirm physical work completed with verifiable photo proof.',
    tagline: 'Operations Tier',
    badge: 'Best for Quality & Audits',
    features: [
      'Everything included in Level 1',
      'Custom shift task checklists with mandatory completion steps',
      'Before / After photo proof upload with timestamp & GPS tag',
      'Built-in team announcements & direct manager messaging',
      'AI Photo Submission Check — highlights missing inspection photos',
      'Real-time client progress reports'
    ],
    idealFor: 'Facility maintenance, multi-site cleaners, construction crews, HVAC & equipment repairs',
    simulatorScreen: 'tasks'
  },
  3: {
    title: 'Level 3 – Full Operations & Payroll Prep Automation',
    subtitle: 'Turn verified frontline attendance data into automated payroll-ready spreadsheets.',
    tagline: 'Management Tier',
    badge: 'CRA Compliance Ready',
    features: [
      'Everything included in Level 1 & Level 2',
      'Automated payroll-ready hours calculations per employee',
      'Overtime, holiday, and weekend rate categorization',
      'Comprehensive Admin Analytics & Productivity dashboards',
      'Dispute resolution center with audit-proof biometric timestamps',
      'Ongoing CRA tax compliance & payroll format exports'
    ],
    idealFor: 'Growing companies with 15–100+ frontline staff spending hours on payroll every 2 weeks',
    simulatorScreen: 'dashboard'
  },
  4: {
    title: 'Level 4 – Advanced Logistics, Scheduling & Geofencing',
    subtitle: 'Enterprise-grade shift dispatching, geo-radius verification, and automated routing.',
    tagline: 'Logistics Tier',
    badge: 'Active Development',
    features: [
      'Everything included in Levels 1, 2, and 3',
      'Visual drag-and-drop employee shift calendar and scheduling',
      'GPS Geofencing — check-in unlocks only within client premises',
      'Multi-site dispatching with turn-by-turn routing links',
      'Automated shift reminders via push/SMS',
      'Client portal access for direct inspection approvals'
    ],
    idealFor: 'Logistics, delivery fleets, security patrol services, municipal contractors',
    simulatorScreen: 'dashboard'
  }
};

function initProoflyLevels() {
  const tabs = document.querySelectorAll('.proofly-tab-btn');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const level = parseInt(tab.dataset.level);
      selectProoflyLevel(level);
    });
  });

  // Select Level 1 by default
  selectProoflyLevel(1);
}

function selectProoflyLevel(level) {
  const data = prooflyLevelsData[level];
  if (!data) return;

  // Update tabs visual state
  document.querySelectorAll('.proofly-tab-btn').forEach(t => {
    if (parseInt(t.dataset.level) === level) {
      t.className = 'proofly-tab-btn px-4 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-md transition-all flex items-center space-x-2';
    } else {
      t.className = 'proofly-tab-btn px-4 py-2.5 rounded-xl font-medium text-sm bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center space-x-2';
    }
  });

  // Update content container
  const detailContainer = document.getElementById('proofly-level-details');
  if (detailContainer) {
    detailContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl transition-all">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">${data.tagline}</span>
              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">${data.badge}</span>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mt-2">${data.title}</h3>
            <p class="text-slate-600 mt-1 text-sm max-w-2xl">${data.subtitle}</p>
          </div>
          <button onclick="document.getElementById('phone-simulator-section').scrollIntoView({behavior: 'smooth'}); currentSimulatorScreen='${data.simulatorScreen}'; updatePhoneNavButtons(); renderPhoneScreen('${data.simulatorScreen}');" class="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-blue-600 text-xs font-bold transition-all shadow">
            <span>Preview in Mobile Simulator</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Core Included Capabilities</h4>
            <ul class="space-y-2.5">
              ${data.features.map(f => `
                <li class="flex items-start text-sm text-slate-700">
                  <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ideal Industry Fit</h4>
              <p class="text-sm font-semibold text-slate-800">${data.idealFor}</p>

              <div class="mt-4 pt-4 border-t border-slate-200/80">
                <div class="text-xs font-bold text-slate-700 mb-1">Built Fast with Glide</div>
                <p class="text-xs text-slate-500">Deployable in 5 to 10 business days. Works instantly on worker phones without App Store delays or complex logins.</p>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div class="text-[11px] text-slate-500">Need this for your company?</div>
                <div class="text-sm font-bold text-blue-600">Free 14-Day Pilot Available</div>
              </div>
              <a href="#contact" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow">
                Request Free Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   3. Interactive App Scope & Cost Estimator
   ========================================================================== */
function initAppEstimator() {
  const form = document.getElementById('app-estimator-form');
  if (!form) return;

  form.addEventListener('change', calculateAppEstimate);
  calculateAppEstimate();

  const applyBtn = document.getElementById('estimator-apply-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const summary = getEstimatorSummary();
      const messageField = document.getElementById('contact-message');
      const serviceField = document.getElementById('contact-service');
      if (messageField) {
        messageField.value = `Hi Jose, I generated an estimate for a custom Glide app:\n- App Type: ${summary.appType}\n- Features: ${summary.features.join(', ')}\n- Estimated Timeline: ${summary.timeline}\n- Estimated Scope: ${summary.priceRange}\n\nI would like to discuss this on a discovery call.`;
      }
      if (serviceField) {
        serviceField.value = 'Custom Glide Mobile App';
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      showToast('🎯 Estimate details copied into consultation form below!');
    });
  }
}

function calculateAppEstimate() {
  const typeSelect = document.getElementById('calc-app-type');
  const speedSelect = document.getElementById('calc-timeline');
  const featureCheckboxes = document.querySelectorAll('.calc-feature-checkbox:checked');

  if (!typeSelect) return;

  let basePrice = 1450;
  let baseHoursSaved = 6;
  let baseDays = 10;

  switch (typeSelect.value) {
    case 'workforce':
      basePrice = 1650;
      baseHoursSaved = 12;
      baseDays = 10;
      break;
    case 'inspection':
      basePrice = 1500;
      baseHoursSaved = 8;
      baseDays = 8;
      break;
    case 'client-portal':
      basePrice = 1800;
      baseHoursSaved = 10;
      baseDays = 12;
      break;
    case 'logistics':
      basePrice = 2100;
      baseHoursSaved = 15;
      baseDays = 14;
      break;
  }

  let addOnPrice = 0;
  let extraHours = 0;
  featureCheckboxes.forEach(cb => {
    addOnPrice += parseInt(cb.dataset.price || 0);
    extraHours += parseInt(cb.dataset.hours || 0);
  });

  let multiplier = 1.0;
  if (speedSelect && speedSelect.value === 'rush') {
    multiplier = 1.25;
    baseDays = Math.max(5, Math.round(baseDays * 0.6));
  }

  const totalPrice = Math.round((basePrice + addOnPrice) * multiplier);
  const lowRange = Math.round(totalPrice * 0.9);
  const highRange = Math.round(totalPrice * 1.15);
  const totalHoursSaved = baseHoursSaved + extraHours;

  // Update DOM elements
  const priceDisplay = document.getElementById('calc-price-display');
  const hoursDisplay = document.getElementById('calc-hours-display');
  const timelineDisplay = document.getElementById('calc-timeline-display');
  const tierDisplay = document.getElementById('calc-tier-display');

  if (priceDisplay) priceDisplay.textContent = `$${lowRange.toLocaleString()} - $${highRange.toLocaleString()} CAD`;
  if (hoursDisplay) hoursDisplay.textContent = `${totalHoursSaved}+ hrs / week`;
  if (timelineDisplay) timelineDisplay.textContent = speedSelect && speedSelect.value === 'rush' ? '5 - 7 Business Days' : '10 - 14 Business Days';
  if (tierDisplay) {
    tierDisplay.textContent = totalPrice > 2800 ? 'Glide Business / Custom Suite' : 'Glide Pro App Package';
  }
}

function getEstimatorSummary() {
  const typeSelect = document.getElementById('calc-app-type');
  const speedSelect = document.getElementById('calc-timeline');
  const featureCheckboxes = document.querySelectorAll('.calc-feature-checkbox:checked');
  const priceDisplay = document.getElementById('calc-price-display');

  const selectedFeatures = Array.from(featureCheckboxes).map(cb => cb.dataset.name || cb.value);

  return {
    appType: typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Custom App',
    features: selectedFeatures.length > 0 ? selectedFeatures : ['Standard Glide Essentials'],
    timeline: speedSelect && speedSelect.value === 'rush' ? 'Fast-Track (7 Days)' : 'Standard (2 Weeks)',
    priceRange: priceDisplay ? priceDisplay.textContent : 'Contact for Quote'
  };
}

/* ==========================================================================
   4. Portfolio Filtering
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const items = document.querySelectorAll('.portfolio-card');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button active state
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700');

      // Filter cards
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Modals (Blog Reader & Project Details)
   ========================================================================== */
const blogPosts = {
  1: {
    title: 'Why Paper Timesheets Cost Field Companies Thousands (And How to Go Digital)',
    date: 'August 2026',
    author: 'Jose Rene Navarro',
    category: 'Workforce Operations',
    content: `
      <p class="mb-4">For over two decades in software quality assurance and operational workflows, I have watched businesses bleed thousands of dollars every month through the simplest point of failure: <strong>the paper timesheet</strong>.</p>
      
      <h4 class="font-bold text-slate-900 text-lg mt-6 mb-2">The Hidden Math of Paper Timesheets</h4>
      <p class="mb-3">When employees jot down hours on paper or send end-of-week text messages, three unavoidable problems occur:</p>
      <ul class="list-disc pl-5 mb-4 space-y-2 text-slate-700">
        <li><strong>Time Inflation ("Rounding Up"):</strong> Workers round 7:42 AM to 7:30 AM or 4:18 PM to 4:30 PM. Across a team of 10 workers, 15 extra minutes daily costs over $9,750 per year in unworked payroll.</li>
        <li><strong>Buddy Punching:</strong> One employee signs an absent coworker in on a clip-board or shared paper log.</li>
        <li><strong>Admin Bottlenecks:</strong> Managers spend 6 to 10 hours every pay period manually deciphering handwriting, recalculating overtime, and rekeying numbers into QuickBooks or Excel.</li>
      </ul>

      <h4 class="font-bold text-slate-900 text-lg mt-6 mb-2">How Glide + AI Solves This in 7 Days</h4>
      <p class="mb-3">With custom Glide mobile apps like <strong>Proofly</strong>, workers check in on their own phones with a single tap and an instant selfie. The app verifies their identity in seconds, stamps the exact GPS coordinates, and syncs directly to a cloud payroll table.</p>
      <p class="mb-4">There are no hardware time clocks to install, no paper binders to collect, and payroll is calculated with 100% QA accuracy before the pay period ends.</p>
    `
  },
  2: {
    title: 'Glide Apps vs Custom Native Code: What Business Owners Need to Know',
    date: 'August 2026',
    author: 'Jose Rene Navarro',
    category: 'No-Code Strategy',
    content: `
      <p class="mb-4">When a business owner wants a mobile solution for their team, the traditional agency proposal is terrifying: <strong>$35,000 to $60,000 upfront</strong> and <strong>5 to 8 months of development</strong>.</p>
      
      <h4 class="font-bold text-slate-900 text-lg mt-6 mb-2">The True Cost of Traditional Native Apps</h4>
      <p class="mb-3">Native apps require writing separate code for iOS (Swift) and Android (Kotlin), waiting weeks for Apple and Google App Store approvals, and paying thousands in annual server maintenance whenever iOS updates.</p>

      <h4 class="font-bold text-slate-900 text-lg mt-6 mb-2">Why Glide is the Smarter Business Choice</h4>
      <p class="mb-3">Glide builds Progressive Web Apps (PWAs) that run smoothly directly on smartphones without forcing employees or clients to download anything from the App Store. They update instantly in real-time, connect directly to Google Sheets, PostgreSQL, or Airtable, and can be built for a fraction of the cost.</p>
      
      <div class="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
        <p class="text-sm font-semibold text-blue-900">"Why pay $50,000 to reinvent the wheel when you can get a customized, QA-tested mobile operations system running next week?"</p>
      </div>
    `
  },
  3: {
    title: 'Stopping Buddy Punching: How AI Face Verification Keeps Frontline Teams Accountable',
    date: 'July 2026',
    author: 'Jose Rene Navarro',
    category: 'AI & Security',
    content: `
      <p class="mb-4">In remote field services — commercial cleaning, security patrols, landscaping, and construction — supervisors cannot be everywhere at once. Trust is essential, but verification creates confidence for both the business and the client.</p>

      <h4 class="font-bold text-slate-900 text-lg mt-6 mb-2">Beyond Passwords and Pins</h4>
      <p class="mb-3">PIN numbers and mobile logins are easily texted to a coworker. AI Face Verification in Proofly takes attendance verification to the next level by comparing the employee's check-in selfie with their verified profile record.</p>

      <h4 class="font-bold text-slate-900 text-lg mt-6 mb-2">Key Operational Benefits</h4>
      <ul class="list-disc pl-5 mb-4 space-y-2 text-slate-700">
        <li><strong>Fewer Attendance Disputes:</strong> When a shift time is questioned, managers have photographic proof, precise timestamps, and face-match scores.</li>
        <li><strong>Audit & Client Readiness:</strong> When commercial clients ask, "Did your team really service our building at 6:00 AM?", you can show visual verification in seconds.</li>
        <li><strong>Respectful & Frictionless:</strong> Workers take a 2-second selfie during check-in. No fingerprint scanners or intrusive invasive tracking required.</li>
      </ul>
    `
  },
  4: {
    title: '5 Website QA Traps That Secretly Kill Customer Trust and Leads',
    date: 'June 2026',
    author: 'Jose Rene Navarro',
    category: 'Quality Assurance',
    content: `
      <p class="mb-4">With over 20 years in enterprise Quality Assurance, I have audited hundreds of websites. Most businesses do not lose leads because of poor products; they lose leads because of simple software bugs that go unnoticed.</p>

      <h4 class="font-bold text-slate-900 text-lg mt-6 mb-2">The Top 5 Silent Killers:</h4>
      <ol class="list-decimal pl-5 mb-4 space-y-2 text-slate-700">
        <li><strong>Broken Mobile Forms:</strong> Contact forms with keyboard overlap, invisible error states, or submit buttons pushed below the fold on modern iPhones.</li>
        <li><strong>Dead Phone & Email Links:</strong> "Call Us" buttons that don't trigger a mobile dialer or mailto links pointing to outdated inboxes.</li>
        <li><strong>Hidden Horizontal Scrollbars:</strong> Unresponsive images that break mobile viewport widths and make sites feel amateurish.</li>
        <li><strong>Slow Third-Party Script Bloat:</strong> Unoptimized plugins that trigger layout shifts and 6-second load times on 4G connections.</li>
        <li><strong>Unverified Usability Flows:</strong> Forms that don't display a clear "Thank You / What Happens Next" confirmation, leaving customers wondering if their inquiry was lost.</li>
      </ol>
      <p>A rigorous QA audit identifies and resolves these leaks within 48 hours.</p>
    `
  }
};

function initModals() {
  // Blog Modal
  const modal = document.getElementById('blog-modal');
  const modalClose = document.getElementById('blog-modal-close');
  const modalBackdrop = document.getElementById('blog-modal-backdrop');

  document.querySelectorAll('.open-blog-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.blogId;
      const post = blogPosts[id];
      if (post && modal) {
        document.getElementById('blog-modal-title').textContent = post.title;
        document.getElementById('blog-modal-meta').textContent = `${post.date} · By ${post.author} · ${post.category}`;
        document.getElementById('blog-modal-body').innerHTML = post.content;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFAQ() {
  document.querySelectorAll('.faq-item-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.faq-icon');
      const isOpen = content.classList.contains('open');

      // Close all accordions
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      // If clicked wasn't open, open it
      if (!isOpen) {
        content.classList.add('open');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   7. Contact & Consultation Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const service = document.getElementById('contact-service').value;

    if (!name || !email) {
      showToast('⚠️ Please enter your name and email address.', 'error');
      return;
    }

    // Submit state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>Scheduling Your Discovery Call...</span>
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Show friendly success confirmation container
      const container = document.getElementById('form-container');
      if (container) {
        container.innerHTML = `
          <div class="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center text-emerald-950">
            <div class="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 animate-check">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900">Thank You, ${name}!</h3>
            <p class="text-slate-600 mt-2 text-sm max-w-md mx-auto">
              Your inquiry regarding <strong>${service}</strong> has been received by Jose Rene Navarro.
            </p>
            <div class="mt-6 bg-white p-4 rounded-2xl border border-emerald-200 inline-block text-left text-xs space-y-1.5 shadow-sm">
              <div class="text-slate-500">Contact Email: <strong class="text-slate-800">${email}</strong></div>
              ${phone ? `<div class="text-slate-500">Phone: <strong class="text-slate-800">${phone}</strong></div>` : ''}
              <div class="text-emerald-700 font-semibold mt-1">✓ Jose will respond personally within 24 hours.</div>
            </div>
            <div class="mt-6">
              <a href="tel:437-423-3456" class="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>Or Call Direct Now: 437-423-3456</span>
              </a>
            </div>
          </div>
        `;
      }
      showToast('🚀 Consultation request sent! Jose will be in touch shortly.');
    }, 1000);
  });
}

/* ==========================================================================
   8. Toast Feedback & Helpers
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('demo-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'demo-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 transform transition-all duration-300 translate-y-20 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-3">
      <span>${message}</span>
      <button onclick="this.closest('#demo-toast').classList.add('translate-y-20', 'opacity-0');" class="text-slate-400 hover:text-white">&times;</button>
    </div>
  `;

  toast.classList.remove('translate-y-20', 'opacity-0');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 4500);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
