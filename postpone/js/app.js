import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { FIREBASE_CONFIG } from "../../enrol/js/config.js";

const app  = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db   = getDatabase(app);

// DOM Elements
const loginSection   = document.getElementById('login-section');
const postponeSection= document.getElementById('postpone-section');
const loginForm      = document.getElementById('login-form');
const loginError     = document.getElementById('login-error');
const postponeForm   = document.getElementById('postpone-form');
const postponeDate   = document.getElementById('postpone-date');
const postponeReason = document.getElementById('postpone-reason');
const dateError      = document.getElementById('date-error');
const postponeMessage= document.getElementById('postpone-message');
const logoutBtn      = document.getElementById('logout-btn');
const loginBtn       = document.getElementById('login-btn');
const submitBtn      = document.getElementById('submit-btn');

let currentUser = null;
let requestType = 'postpone'; // 'postpone' | 'cancel'
let activeWindow = null;      // The admin-set postponement window {label, startDate, endDate}

// ── Active Window Listener ────────────────────────────────────────────────────
// Reads the admin-set window in real time and updates the date picker + banner
onValue(ref(db, 'postponement_windows'), (snap) => {
  const data = snap.val();
  activeWindow = null;

  if (data) {
    const windows = Object.values(data);
    activeWindow = windows.find(w => w.active === true) || null;
  }

  applyWindowToForm();
});

function applyWindowToForm() {
  const windowBanner   = document.getElementById('window-banner');
  const windowText     = document.getElementById('window-banner-text');
  const formArea       = document.getElementById('form-area');
  const noWindowMsg    = document.getElementById('no-window-msg');
  const dateSection    = document.getElementById('date-section');

  if (!windowBanner) return; // Not logged in yet, skip

  if (activeWindow && requestType === 'postpone') {
    // Show window info banner
    const startFmt = new Date(activeWindow.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const endFmt   = new Date(activeWindow.endDate).toLocaleDateString('en-US',   { month: 'long', day: 'numeric', year: 'numeric' });
    windowText.innerHTML = `<strong class="text-blue-200">${activeWindow.label}:</strong> You can reschedule your class to any date between <strong class="text-blue-200">${startFmt}</strong> and <strong class="text-blue-200">${endFmt}</strong>.`;
    windowBanner.style.display = 'flex';

    // Constrain the new date picker to the admin window
    postponeDate.min = activeWindow.startDate;
    postponeDate.max = activeWindow.endDate;

    if (formArea)   formArea.style.display   = 'block';
    if (noWindowMsg) noWindowMsg.style.display = 'none';
  } else if (requestType === 'postpone') {
    // No active window — hide the form, show message
    windowBanner.style.display = 'none';
    if (formArea)   formArea.style.display   = 'none';
    if (noWindowMsg) noWindowMsg.style.display = 'flex';
  } else {
    // Cancel mode — window doesn't matter
    windowBanner.style.display = 'none';
    if (formArea)   formArea.style.display   = 'block';
    if (noWindowMsg) noWindowMsg.style.display = 'none';
  }
}

// ── Request Type Toggle ───────────────────────────────────────────────────────
window.setRequestType = function(type) {
  requestType = type;
  const dateSection  = document.getElementById('date-section');
  const reasonLabel  = document.getElementById('reason-label');
  const submitLabel  = document.getElementById('submit-label');
  const infoBanner   = document.getElementById('info-banner');
  const bannerIcon   = document.getElementById('banner-icon');
  const bannerText   = document.getElementById('banner-text');
  const btnPostpone  = document.getElementById('btn-postpone');
  const btnCancel    = document.getElementById('btn-cancel');

  if (type === 'postpone') {
    if (dateSection) dateSection.style.display = 'block';
    postponeDate.required = true;
    if (reasonLabel) reasonLabel.textContent = 'Reason for Postponement';
    if (submitLabel) submitLabel.textContent  = 'Submit Postponement';
    if (bannerIcon)  bannerIcon.textContent   = 'policy';
    if (bannerText)  bannerText.innerHTML     = 'Postponements must fall within the <strong class="text-blue-200">admin-set window</strong> shown above.';
    if (infoBanner)  { infoBanner.className = 'flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 mb-3'; }
    if (bannerText)  bannerText.className   = 'text-xs text-blue-300 font-medium leading-relaxed';
    if (bannerIcon)  bannerIcon.className   = 'material-symbols-outlined text-blue-400 text-lg shrink-0 mt-0.5';
    if (btnPostpone) btnPostpone.style.cssText = 'background: rgba(37,99,235,0.2); border-color: rgba(37,99,235,0.5); color: #93c5fd;';
    if (btnCancel)   btnCancel.style.cssText   = 'background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: #64748b;';
  } else {
    if (dateSection) dateSection.style.display = 'none';
    postponeDate.required = false;
    if (reasonLabel) reasonLabel.textContent = 'Reason for Cancellation';
    if (submitLabel) submitLabel.textContent  = 'Submit Cancellation';
    if (bannerIcon)  bannerIcon.textContent   = 'cancel';
    if (bannerText)  bannerText.innerHTML     = 'Please provide a clear reason for cancellation. Our admin team will be notified immediately.';
    if (infoBanner)  { infoBanner.className = 'flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 mb-3'; }
    if (bannerText)  bannerText.className   = 'text-xs text-red-300 font-medium leading-relaxed';
    if (bannerIcon)  bannerIcon.className   = 'material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5';
    if (btnCancel)   btnCancel.style.cssText   = 'background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); color: #fca5a5;';
    if (btnPostpone) btnPostpone.style.cssText = 'background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: #64748b;';
  }

  applyWindowToForm();
};

// ── Auth State ────────────────────────────────────────────────────────────────
let myRequestsUnsubscribe = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loginSection.classList.add('hidden-state');
    postponeSection.classList.remove('hidden-state');

    const emailDisplay = document.getElementById('user-email-display');
    const avatar       = document.getElementById('user-avatar');
    if (emailDisplay) emailDisplay.textContent = user.email;
    if (avatar)       avatar.textContent       = user.email.charAt(0).toUpperCase();

    applyWindowToForm();
    startMyRequestsListener(user.uid);
  } else {
    currentUser = null;
    loginSection.classList.remove('hidden-state');
    postponeSection.classList.add('hidden-state');
    loginForm.reset();
    postponeForm.reset();
    if (myRequestsUnsubscribe) { myRequestsUnsubscribe(); myRequestsUnsubscribe = null; }
  }
});

// ── My Requests Listener (student history) ────────────────────────────────────
function startMyRequestsListener(uid) {
  const listEl = document.getElementById('my-requests-list');
  if (!listEl) return;
  myRequestsUnsubscribe = onValue(ref(db, 'postponements'), (snapshot) => {
    listEl.innerHTML = '';
    const data = snapshot.val();
    if (!data) { listEl.innerHTML = `<p class="text-xs text-slate-500 italic">No requests submitted yet.</p>`; return; }

    const myRequests = Object.values(data).filter(r => r.uid === uid).sort((a,b) => b.createdAt - a.createdAt);
    if (myRequests.length === 0) { listEl.innerHTML = `<p class="text-xs text-slate-500 italic">No requests submitted yet.</p>`; return; }

    myRequests.forEach(req => {
      const card = document.createElement('div');
      card.style.cssText = 'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px;margin-bottom:8px;';

      let statusStyle = 'background:rgba(234,179,8,0.15);color:#fbbf24;border:1px solid rgba(234,179,8,0.3);';
      let statusLabel = '⏳ Pending';
      if (req.status === 'APPROVED') { statusStyle = 'background:rgba(34,197,94,0.15);color:#4ade80;border:1px solid rgba(34,197,94,0.3);'; statusLabel = '✓ Approved'; }
      if (req.status === 'REJECTED') { statusStyle = 'background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.3);'; statusLabel = '✗ Rejected'; }

      const typeLabel  = req.type === 'cancel' ? '✕ Cancel' : '↷ Postpone';
      const dateLabel  = req.postponeDate ? ` → ${new Date(req.postponeDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}` : '';
      const submitted  = req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '';

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div>
            <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">${typeLabel}${dateLabel}</span>
            <p style="font-size:12px;color:#94a3b8;margin-top:3px;line-height:1.4;">${req.reason || '—'}</p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
            <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;${statusStyle}">${statusLabel}</span>
            <span style="font-size:10px;color:#64748b;">${submitted}</span>
          </div>
        </div>`;
      listEl.appendChild(card);
    });
  });
}

// ── Login Handler ─────────────────────────────────────────────────────────────
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.classList.add('hidden');
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span><span>Signing In...</span>';
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    let msg = 'Invalid email or password. Please try again.';
    if (error.code === 'auth/operation-not-allowed') msg = 'Email/Password sign-in is not enabled.';
    else if (error.message) msg = `Error: ${error.message}`;
    document.getElementById('login-error-text').textContent = msg;
    loginError.classList.remove('hidden');
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<span>Sign In</span><span class="material-symbols-outlined text-sm">arrow_forward</span>';
  }
});

// ── Postpone / Cancel Submission ──────────────────────────────────────────────
postponeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  dateError.classList.add('hidden');
  postponeMessage.classList.add('hidden');

  if (requestType === 'postpone') {
    const originalVal = document.getElementById('original-class-date').value;
    const newVal      = postponeDate.value;
    const errText     = document.getElementById('date-error-text');

    if (!originalVal) { errText.textContent = 'Please select your original class date.'; dateError.classList.remove('hidden'); return; }
    if (!newVal)      { errText.textContent = 'Please select a new date from the window.'; dateError.classList.remove('hidden'); return; }

    // Validate against active window
    if (!activeWindow) { errText.textContent = 'No postponement window is currently open.'; dateError.classList.remove('hidden'); return; }
    if (newVal < activeWindow.startDate || newVal > activeWindow.endDate) {
      errText.textContent = `New date must be between ${activeWindow.startDate} and ${activeWindow.endDate}.`;
      dateError.classList.remove('hidden'); return;
    }
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span><span>Submitting...</span>';

  try {
    const originalClassDate = document.getElementById('original-class-date').value;
    const payload = {
      uid: currentUser.uid,
      email: currentUser.email,
      type: requestType,
      originalClassDate,
      reason: postponeReason.value.trim(),
      status: 'PENDING',
      createdAt: serverTimestamp()
    };
    if (requestType === 'postpone') {
      payload.postponeDate  = postponeDate.value;
      payload.windowLabel   = activeWindow ? activeWindow.label : '';
    }

    await push(ref(db, 'postponements'), payload);

    postponeMessage.innerHTML = `<span class="material-symbols-outlined text-base">check_circle</span> Your request has been submitted successfully.`;
    postponeMessage.className  = 'text-sm font-semibold p-3.5 rounded-xl flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400';
    postponeMessage.classList.remove('hidden');
    postponeForm.reset();
    applyWindowToForm(); // Refresh window constraints after reset
  } catch (error) {
    let errMsg = 'An error occurred while submitting.';
    if (error && error.message) errMsg = `Error: ${error.message}`;
    postponeMessage.textContent = errMsg;
    postponeMessage.className   = 'text-sm font-semibold p-3.5 rounded-xl flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400';
    postponeMessage.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    const label = requestType === 'cancel' ? 'Submit Cancellation' : 'Submit Postponement';
    submitBtn.innerHTML = `<span>${label}</span><span class="material-symbols-outlined text-base">send</span>`;
  }
});

// ── Logout ────────────────────────────────────────────────────────────────────
logoutBtn.addEventListener('click', () => signOut(auth));
