import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
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


// Set minimum date to 14 days from today
function setMinDate() {
  const today = new Date();
  today.setDate(today.getDate() + 14);
  const minDateStr = today.toISOString().split('T')[0];
  postponeDate.setAttribute('min', minDateStr);
}

setMinDate();

// Auth State Observer
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
  } else {
    currentUser = null;
    loginSection.classList.remove('hidden-state');
    postponeSection.classList.add('hidden-state');
    loginForm.reset();
    postponeForm.reset();
  }
});

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
    const selectedDate = new Date(postponeDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = selectedDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (!postponeDate.value || diffDays < 14) {
      const dateErrorText = document.getElementById('date-error-text');
      if (dateErrorText) dateErrorText.textContent = "Class must be postponed at least 2 weeks (14 days) in advance.";
      dateError.classList.remove('hidden');
      return;
    }
  }
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span><span>Submitting...</span>';
  
  try {
    const postponementsRef = ref(db, 'postponements');
    await push(postponementsRef, {
      uid: currentUser.uid,
      email: currentUser.email,
      type: requestType,  // 'postpone' or 'cancel'
      postponeDate: requestType === 'postpone' ? postponeDate.value : null,
      reason: postponeReason.value.trim(),
      status: 'PENDING',
      createdAt: serverTimestamp()
    });
    
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
    postponeMessage.textContent = "An error occurred while submitting your request.";
    postponeMessage.className = "text-center text-sm font-semibold mt-3 p-3 rounded-xl bg-red-50 text-red-600 border border-red-200";
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
