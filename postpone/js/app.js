import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { FIREBASE_CONFIG } from "../../enrol/js/config.js";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM Elements
const loginSection = document.getElementById('login-section');
const postponeSection = document.getElementById('postpone-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const postponeForm = document.getElementById('postpone-form');
const postponeDate = document.getElementById('postpone-date');
const postponeReason = document.getElementById('postpone-reason');
const dateError = document.getElementById('date-error');
const postponeMessage = document.getElementById('postpone-message');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
const submitBtn = document.getElementById('submit-btn');

let currentUser = null;
let requestType = 'postpone'; // 'postpone' | 'cancel'

// Switch between Postpone and Cancel modes
window.setRequestType = function(type) {
  requestType = type;
  const dateSection = document.getElementById('date-section');
  const postponeDate = document.getElementById('postpone-date');
  const reasonLabel = document.getElementById('reason-label');
  const submitLabel = document.getElementById('submit-label');
  const bannerIcon = document.getElementById('banner-icon');
  const bannerText = document.getElementById('banner-text');
  const infoBanner = document.getElementById('info-banner');
  const btnPostpone = document.getElementById('btn-postpone');
  const btnCancel = document.getElementById('btn-cancel');
  
  if (type === 'postpone') {
    // Show date section
    dateSection.style.display = 'block';
    postponeDate.required = true;
    reasonLabel.textContent = 'Reason for Postponement';
    postponeDate.placeholder = 'Select new date';
    submitLabel.textContent = 'Submit Postponement';
    bannerIcon.textContent = 'policy';
    bannerText.innerHTML = 'Postponements require a minimum <strong class="text-blue-200">14-day advance notice</strong>. Select a date at least 2 weeks from today.';
    infoBanner.className = 'flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 mb-5';
    bannerText.className = 'text-xs text-blue-300 font-medium leading-relaxed';
    bannerIcon.className = 'material-symbols-outlined text-blue-400 text-lg shrink-0 mt-0.5';
    // Active styles
    btnPostpone.style.cssText = 'background: rgba(37,99,235,0.2); border-color: rgba(37,99,235,0.5); color: #93c5fd;';
    btnCancel.style.cssText = 'background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: #64748b;';
  } else {
    // Hide date section for cancel
    dateSection.style.display = 'none';
    postponeDate.required = false;
    reasonLabel.textContent = 'Reason for Cancellation';
    postponeDate.placeholder = '';
    submitLabel.textContent = 'Submit Cancellation';
    bannerIcon.textContent = 'cancel';
    bannerText.innerHTML = 'Please provide a clear reason for cancellation. Our admin team will be notified immediately.';
    infoBanner.className = 'flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 mb-5';
    bannerText.className = 'text-xs text-red-300 font-medium leading-relaxed';
    bannerIcon.className = 'material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5';
    // Active styles
    btnCancel.style.cssText = 'background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); color: #fca5a5;';
    btnPostpone.style.cssText = 'background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: #64748b;';
  }
};


// ── Quarter Utilities ──────────────────────────────────────────
const QUARTER_NAMES = [
  { label: 'Q1 (Jan – Mar)', months: [0,1,2],  end: [2,31]  },
  { label: 'Q2 (Apr – Jun)', months: [3,4,5],  end: [5,30]  },
  { label: 'Q3 (Jul – Sep)', months: [6,7,8],  end: [8,30]  },
  { label: 'Q4 (Oct – Dec)', months: [9,10,11], end: [11,31] },
];

function getQuarterBounds(dateStr) {
  const d = new Date(dateStr);
  const month = d.getMonth();
  const year  = d.getFullYear();
  const q = QUARTER_NAMES.find(q => q.months.includes(month));
  const qStart = new Date(year, q.months[0], 1);
  const qEnd   = new Date(year, q.end[0], q.end[1]);
  return { label: q.label, qStart, qEnd };
}

function toDateInputStr(date) {
  return date.toISOString().split('T')[0];
}

// Called when student picks original class date
window.onOriginalDateChange = function() {
  const originalInput = document.getElementById('original-class-date');
  const newDateInput  = document.getElementById('postpone-date');
  const badge         = document.getElementById('quarter-badge');
  const badgeText     = document.getElementById('quarter-badge-text');

  if (!originalInput.value) {
    badge.classList.add('hidden');
    return;
  }

  const { label, qStart, qEnd } = getQuarterBounds(originalInput.value);

  // Min for new date = max(today+14, qStart)
  const today14 = new Date();
  today14.setDate(today14.getDate() + 14);
  const minDate = today14 > qStart ? today14 : qStart;

  newDateInput.min = toDateInputStr(minDate);
  newDateInput.max = toDateInputStr(qEnd);
  newDateInput.value = ''; // reset new date when original changes

  // Show quarter badge
  badge.classList.remove('hidden');
  badgeText.textContent = `Invoice Quarter: ${label}  ·  New date must be before ${qEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

// Set minimum date to 14 days from today (fallback for cancel mode)
function setMinDate() {
  const today = new Date();
  today.setDate(today.getDate() + 14);
  // Only set min if no original date picked yet
  const newDateInput = document.getElementById('postpone-date');
  if (newDateInput && !newDateInput.min) {
    newDateInput.min = toDateInputStr(today);
  }
}

setMinDate();

// Auth State Observer
let myRequestsUnsubscribe = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loginSection.classList.add('hidden-state');
    postponeSection.classList.remove('hidden-state');

    // Populate user info bar
    const emailDisplay = document.getElementById('user-email-display');
    const avatar = document.getElementById('user-avatar');
    if (emailDisplay) emailDisplay.textContent = user.email;
    if (avatar) avatar.textContent = user.email.charAt(0).toUpperCase();

    // Start listening to this student's requests
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

// Listen to all postponements, filter by UID, render in "My Requests"
function startMyRequestsListener(uid) {
  const listEl = document.getElementById('my-requests-list');
  if (!listEl) return;

  const allRef = ref(db, 'postponements');
  myRequestsUnsubscribe = onValue(allRef, (snapshot) => {
    listEl.innerHTML = '';
    const data = snapshot.val();
    if (!data) {
      listEl.innerHTML = `<p class="text-xs text-slate-500 italic">No requests submitted yet.</p>`;
      return;
    }

    const myRequests = Object.values(data)
      .filter(r => r.uid === uid)
      .sort((a, b) => b.createdAt - a.createdAt);

    if (myRequests.length === 0) {
      listEl.innerHTML = `<p class="text-xs text-slate-500 italic">No requests submitted yet.</p>`;
      return;
    }

    myRequests.forEach(req => {
      const card = document.createElement('div');
      card.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px;';

      // Status styles
      let statusStyle = 'background: rgba(234,179,8,0.15); color: #fbbf24; border: 1px solid rgba(234,179,8,0.3);';
      let statusLabel = '⏳ Pending';
      if (req.status === 'APPROVED') {
        statusStyle = 'background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3);';
        statusLabel = '✓ Approved';
      } else if (req.status === 'REJECTED') {
        statusStyle = 'background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3);';
        statusLabel = '✗ Rejected';
      }

      const typeLabel = req.type === 'cancel' ? '✕ Cancel' : '↷ Postpone';
      const dateLabel = req.postponeDate ? `→ ${new Date(req.postponeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : '';
      const submittedLabel = req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
          <div>
            <span style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em;">${typeLabel} ${dateLabel}</span>
            <p style="font-size:12px; color:#94a3b8; margin-top:3px; line-height:1.4;">${req.reason || '—'}</p>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0;">
            <span style="font-size:11px; font-weight:700; padding:2px 8px; border-radius:20px; ${statusStyle}">${statusLabel}</span>
            <span style="font-size:10px; color:#64748b;">${submittedLabel}</span>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  });
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.classList.add('hidden');
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span><span>Signing In...</span>';
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", error);
    
    // Display the specific Firebase error to help debugging
    let errorMessage = "Invalid email or password. Please try again.";
    if (error.code === 'auth/operation-not-allowed') {
      errorMessage = "Error: Email/Password sign-in is not enabled in the Firebase Console.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    loginError.textContent = errorMessage;
    loginError.classList.remove('hidden');
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<span>Sign In</span><span class="material-symbols-outlined text-sm">arrow_forward</span>';
  }
});

// Postpone Submission Handler
postponeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  dateError.classList.add('hidden');
  postponeMessage.classList.add('hidden');
  
  // Only validate date for postponement requests
  if (requestType === 'postpone') {
    const originalVal = document.getElementById('original-class-date').value;
    const newVal      = postponeDate.value;
    const dateErrorText = document.getElementById('date-error-text');
    
    if (!originalVal) {
      dateErrorText.textContent = 'Please select your original class date first.';
      dateError.classList.remove('hidden');
      return;
    }
    if (!newVal) {
      dateErrorText.textContent = 'Please select a preferred new date.';
      dateError.classList.remove('hidden');
      return;
    }
    
    const selectedNew = new Date(newVal);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((selectedNew - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 14) {
      dateErrorText.textContent = 'New date must be at least 14 days from today.';
      dateError.classList.remove('hidden');
      return;
    }

    // Quarter check
    const { label, qEnd } = getQuarterBounds(originalVal);
    if (selectedNew > qEnd) {
      dateErrorText.textContent = `New date must be within the same invoice quarter (${label}).`;
      dateError.classList.remove('hidden');
      return;
    }
  }
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span><span>Submitting...</span>';
  
  try {
    const postponementsRef = ref(db, 'postponements');
    
    // Build payload — don't include postponeDate for cancellations (Firebase rejects null)
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
      const { label } = getQuarterBounds(originalClassDate);
      payload.quarter = label;
    }
    
    await push(postponementsRef, payload);
    
    // Initialize EmailJS (using the same public key as your enrollment system)
    emailjs.init("GFxAVPzBfXX4d-vQR");
    
    // Prepare email parameters
    const templateParams = {
      from_name: currentUser.email,
      email: currentUser.email,
      message: `Student ${currentUser.email} has requested to postpone their class to ${postponeDate.value}. Reason: ${postponeReason.value.trim()}`
    };
    
    // Send email to admin
    // NOTE: You need to replace 'YOUR_NEW_TEMPLATE_ID' with a real EmailJS template ID
    // that accepts these parameters (from_name, email, message).
    try {
      await emailjs.send("service_atizuna", "YOUR_NEW_TEMPLATE_ID", templateParams);
    } catch (emailErr) {
      console.warn("Could not send email notification (check template ID):", emailErr);
    }
    
    postponeMessage.textContent = "Your request has been submitted successfully.";
    postponeMessage.className = "text-center text-sm font-semibold mt-3 p-3 rounded-xl bg-green-50 text-green-600 border border-green-200";
    postponeForm.reset();
  } catch (error) {
    console.error("Submission error:", error);
    // Show actual Firebase error to help diagnose rule issues
    let errMsg = "An error occurred while submitting your request.";
    if (error && error.message) errMsg = `Error: ${error.message}`;
    postponeMessage.textContent = errMsg;
    postponeMessage.className = "text-sm font-semibold p-3.5 rounded-xl flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400";
    postponeMessage.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    const label = requestType === 'cancel' ? 'Submit Cancellation' : 'Submit Postponement';
    submitBtn.innerHTML = `<span>${label}</span><span class="material-symbols-outlined text-base">send</span>`;
  }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
  signOut(auth);
});
