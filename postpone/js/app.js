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
// Reload window when user changes — called after auth
function loadUserWindow(email) {
  onValue(ref(db, 'user_postponement_windows'), (snap) => {
    const data = snap.val();
    activeWindow = null;

    if (data && email) {
      const windows = Object.values(data).filter(w => w.userEmail === email && w.active === true);
      // Pick the most recently created active window
      windows.sort((a,b) => b.createdAt - a.createdAt);
      activeWindow = windows[0] || null;
    }

    applyWindowToForm();
  });
}

function applyWindowToForm() {
  const windowBanner  = document.getElementById('window-banner');
  const windowText    = document.getElementById('window-banner-text');
  const formArea      = document.getElementById('form-area');
  const noWindowMsg   = document.getElementById('no-window-msg');
  const alreadyMsg    = document.getElementById('already-submitted-msg');

  if (!windowBanner) return; // Not logged in yet

  // Hide "already submitted" by default
  if (alreadyMsg) alreadyMsg.style.display = 'none';

  if (activeWindow && requestType === 'postpone') {
    // Show window banner
    const startFmt = new Date(activeWindow.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const endFmt   = new Date(activeWindow.endDate).toLocaleDateString('en-US',   { month: 'long', day: 'numeric', year: 'numeric' });
    windowText.innerHTML = `<strong>${activeWindow.label}:</strong> You can reschedule to any date between <strong>${startFmt}</strong> and <strong>${endFmt}</strong>.`;
    windowBanner.style.display = 'flex';

    // Constrain date picker
    postponeDate.min = activeWindow.startDate;
    postponeDate.max = activeWindow.endDate;

    // Check if user already submitted for this window
    checkExistingSubmission();
  } else if (requestType === 'postpone') {
    windowBanner.style.display = 'none';
    if (formArea)    formArea.style.display    = 'none';
    if (noWindowMsg) noWindowMsg.style.display = 'flex';
  } else {
    // Cancel mode — window doesn't restrict
    windowBanner.style.display = 'none';
    if (formArea)    formArea.style.display    = 'block';
    if (noWindowMsg) noWindowMsg.style.display = 'none';
  }
}

// Check if this student already has a request for the current active window
function checkExistingSubmission() {
  const formArea    = document.getElementById('form-area');
  const alreadyMsg  = document.getElementById('already-submitted-msg');
  const alreadyBody = document.getElementById('already-submitted-body');
  const noWindowMsg = document.getElementById('no-window-msg');

  if (!currentUser || !activeWindow) return;

  // Read all postponements, filter by this user + this window
  onValue(ref(db, 'postponements'), (snap) => {
    const data = snap.val();
    let existing = null;

    if (data) {
      const all = Object.values(data);
      existing = all.find(r =>
        r.uid === currentUser.uid &&
        r.type === 'postpone' &&
        r.windowLabel === activeWindow.quarter
      ) || null;
    }

    if (existing) {
      // Hide form, show status card
      if (formArea)    formArea.style.display    = 'none';
      if (noWindowMsg) noWindowMsg.style.display = 'none';
      if (alreadyMsg)  alreadyMsg.style.display  = 'flex';

      let statusStyle = 'background:#fef9c3;color:#92400e;border:1px solid #fde68a;';
      let statusLabel = '⏳ Pending Review';
      if (existing.status === 'APPROVED') { statusStyle = 'background:#dcfce7;color:#166534;border:1px solid #86efac;'; statusLabel = '✓ Approved'; }
      if (existing.status === 'REJECTED') { statusStyle = 'background:#fee2e2;color:#991b1b;border:1px solid #fecaca;'; statusLabel = '✗ Rejected'; }

      const newDate = existing.postponeDate
        ? new Date(existing.postponeDate).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
        : '—';

      if (alreadyBody) alreadyBody.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
          <div>
            <p style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Your Request · ${activeWindow.label}</p>
            <p style="font-size:13px;color:#0f172a;font-weight:700;">↷ Rescheduled to ${newDate}</p>
            <p style="font-size:12px;color:#94a3b8;margin-top:4px;">${existing.reason || ''}</p>
          </div>
          <span style="font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;${statusStyle}">${statusLabel}</span>
        </div>`;
    } else {
      // No existing — show form
      if (alreadyMsg)  alreadyMsg.style.display  = 'none';
      if (formArea)    formArea.style.display     = 'block';
    }
  }, { onlyOnce: true }); // Only read once, real-time handled by My Requests
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
    if (bannerText)  bannerText.innerHTML     = 'Postponements must fall within the <strong>admin-set window</strong> shown above.';
    if (infoBanner)  { infoBanner.className = 'flex items-start gap-3 banner-blue p-3.5 mb-4'; }
    if (bannerText)  bannerText.className   = 'text-[12px] font-medium leading-relaxed';
    if (bannerIcon)  bannerIcon.className   = 'material-symbols-outlined text-blue-500 text-lg shrink-0 mt-0.5';
    if (btnPostpone) { btnPostpone.className = 'type-toggle active-postpone'; btnPostpone.style.cssText = ''; }
    if (btnCancel)   { btnCancel.className = 'type-toggle'; btnCancel.style.cssText = ''; }
  } else {
    if (dateSection) dateSection.style.display = 'none';
    postponeDate.required = false;
    if (reasonLabel) reasonLabel.textContent = 'Reason for Cancellation';
    if (submitLabel) submitLabel.textContent  = 'Submit Cancellation';
    if (bannerIcon)  bannerIcon.textContent   = 'cancel';
    if (bannerText)  bannerText.innerHTML     = 'Please provide a clear reason for cancellation. Our admin team will be notified immediately.';
    if (infoBanner)  { infoBanner.className = 'flex items-start gap-3 banner-red p-3.5 mb-4'; }
    if (bannerText)  bannerText.className   = 'text-[12px] font-medium leading-relaxed';
    if (bannerIcon)  bannerIcon.className   = 'material-symbols-outlined text-red-500 text-lg shrink-0 mt-0.5';
    if (btnCancel)   { btnCancel.className = 'type-toggle active-cancel'; btnCancel.style.cssText = ''; }
    if (btnPostpone) { btnPostpone.className = 'type-toggle'; btnPostpone.style.cssText = ''; }
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
    loadUserWindow(user.email);
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
    if (!data) { listEl.innerHTML = `<p class="text-[12px] text-gray-400 italic">No requests submitted yet.</p>`; return; }

    const myRequests = Object.values(data).filter(r => r.uid === uid).sort((a,b) => b.createdAt - a.createdAt);
    if (myRequests.length === 0) { listEl.innerHTML = `<p class="text-[12px] text-gray-400 italic">No requests submitted yet.</p>`; return; }

    myRequests.forEach(req => {
      const card = document.createElement('div');
      card.className = 'request-card';

      let badgeClass = 'badge-pending';
      let statusLabel = '⏳ Pending';
      if (req.status === 'APPROVED') { badgeClass = 'badge-approved'; statusLabel = '✓ Approved'; }
      if (req.status === 'REJECTED') { badgeClass = 'badge-rejected'; statusLabel = '✗ Rejected'; }

      const typeLabel  = req.type === 'cancel' ? '✕ Cancel' : '↷ Postpone';
      const dateLabel  = req.postponeDate ? ` → ${new Date(req.postponeDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}` : '';
      const submitted  = req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '';

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div>
            <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">${typeLabel}${dateLabel}</span>
            <p style="font-size:12px;color:#94a3b8;margin-top:3px;line-height:1.4;">${req.reason || '—'}</p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
            <span class="${badgeClass}" style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;">${statusLabel}</span>
            <span style="font-size:10px;color:#94a3b8;">${submitted}</span>
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
      payload.postponeDate = postponeDate.value;
      payload.windowLabel  = activeWindow ? activeWindow.quarter : '';
    }

    await push(ref(db, 'postponements'), payload);

    postponeMessage.innerHTML = `<span class="material-symbols-outlined text-base">check_circle</span> Your request has been submitted successfully.`;
    postponeMessage.className  = 'text-[13px] font-semibold p-3.5 rounded-[14px] flex items-center gap-2 bg-green-50 border border-green-200 text-green-700';
    postponeMessage.classList.remove('hidden');
    postponeForm.reset();
    applyWindowToForm(); // Refresh window constraints after reset
  } catch (error) {
    let errMsg = 'An error occurred while submitting.';
    if (error && error.message) errMsg = `Error: ${error.message}`;
    postponeMessage.textContent = errMsg;
    postponeMessage.className   = 'text-[13px] font-semibold p-3.5 rounded-[14px] flex items-center gap-2 bg-red-50 border border-red-200 text-red-700';
    postponeMessage.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    const label = requestType === 'cancel' ? 'Submit Cancellation' : 'Submit Postponement';
    submitBtn.innerHTML = `<span>${label}</span><span class="material-symbols-outlined text-base">send</span>`;
  }
});

// ── Logout ────────────────────────────────────────────────────────────────────
logoutBtn.addEventListener('click', () => signOut(auth));
