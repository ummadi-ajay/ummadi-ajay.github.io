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
  
  const selectedDate = new Date(postponeDate.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(selectedDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays < 14 || selectedDate < today) {
    dateError.textContent = "Class must be postponed at least 2 weeks (14 days) in advance.";
    dateError.classList.remove('hidden');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span><span>Submitting...</span>';
  
  try {
    const postponementsRef = ref(db, 'postponements');
    await push(postponementsRef, {
      uid: currentUser.uid,
      email: currentUser.email,
      postponeDate: postponeDate.value,
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
    submitBtn.innerHTML = '<span>Submit Request</span><span class="material-symbols-outlined text-sm">send</span>';
  }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
  signOut(auth);
});
