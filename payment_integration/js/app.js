import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { FIREBASE_CONFIG, RAZORPAY_KEY } from "./config.js?v=4";

const firebaseConfig = FIREBASE_CONFIG;

let db = null;
let analytics = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  analytics = getAnalytics(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// ===== State =====
let orderData = {
  name: '', email: '', phone: '', address: '', companyName: '', gstNumber: '',
  itemName: '', unitPrice: 0,
  subtotal: 0, tax: 0, grandTotal: 0,
  paymentId: '', billNumber: '',
  tshirt: '', paymentFreq: 'Quarterly', country: 'India',
  preferredClassDays: [], preferredClassTimeSlots: []
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const EMAILJS_CONFIG = {
  serviceId: "service_atizuna",
  publicKey: "GFxAVPzBfXX4d-vQR",
  adminTemplateId: "template_4cus82e",
  recipients: ["makerworkslab@gmail.com"]
};

let emailJsInitialized = false;

function normalizePhone(value) {
  return (value || '').replace(/\D/g, '').slice(0, 10);
}

function isValidPhone(value) {
  return /^\d{10}$/.test(normalizePhone(value));
}

function isValidEmail(value) {
  return EMAIL_REGEX.test((value || '').trim());
}

function setFieldValidity(el, message = '') {
  if (!el) return true;
  el.setCustomValidity(message);
  el.classList.toggle('!border-red-400', Boolean(message));
  el.classList.toggle('border-transparent', !message);
  return !message;
}

function normalizePreferredDays(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return (value || '')
    .split(',')
    .map(day => day.trim())
    .filter(Boolean);
}

function formatPreferredDays(days) {
  const normalized = normalizePreferredDays(days);
  return normalized.length ? normalized.join(', ') : '—';
}

function normalizePreferredTimeSlots(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return (value || '')
    .split(',')
    .map(timeSlot => timeSlot.trim())
    .filter(Boolean);
}

function formatPreferredTimeSlots(timeSlots) {
  const normalized = normalizePreferredTimeSlots(timeSlots);
  return normalized.length ? normalized.join(', ') : '—';
}

function getPendingEnrollmentData() {
  const pendingJson = sessionStorage.getItem('pendingEnrollment');
  if (!pendingJson) return null;
  try {
    return JSON.parse(pendingJson);
  } catch (error) {
    console.error("Pending enrollment parse error:", error);
    return null;
  }
}

function initEmailJs() {
  if (emailJsInitialized) return true;
  if (!window.emailjs || !EMAILJS_CONFIG.publicKey) return false;
  window.emailjs.init(EMAILJS_CONFIG.publicKey);
  emailJsInitialized = true;
  return true;
}

function createPaymentCompletionMessage(pendingEnrollment = {}) {
  const rows = [
    ['Status', 'PAYMENT_COMPLETED'],
    ['Payment ID', orderData.paymentId],
    ['Receipt No', orderData.billNumber],
    ['Parent Name', orderData.name || pendingEnrollment.parentName],
    ['Student Name', pendingEnrollment.studentName],
    ['Date of Birth', pendingEnrollment.dob],
    ['School', pendingEnrollment.schoolName],
    ['Grade', pendingEnrollment.studyGrade ? `Grade ${pendingEnrollment.studyGrade}` : ''],
    ['Phone', orderData.phone || pendingEnrollment.parentPhone],
    ['Email', orderData.email || pendingEnrollment.email],
    ['Address', orderData.address || pendingEnrollment.address],
    ['Country', orderData.country || pendingEnrollment.country],
    ['Company', orderData.companyName || pendingEnrollment.companyName],
    ['GST Number', orderData.gstNumber || pendingEnrollment.gstNumber],
    ['Program', orderData.itemName || pendingEnrollment.program],
    ['Preferred Class Days', formatPreferredDays(pendingEnrollment.preferredClassDays || orderData.preferredClassDays)],
    ['Preferred Class Time Slots', formatPreferredTimeSlots(pendingEnrollment.preferredClassTimeSlots || pendingEnrollment.preferredClassTimeSlot || orderData.preferredClassTimeSlots)],
    ['Robotics Hardware Experience', pendingEnrollment.expRobotics],
    ['Programming Experience', pendingEnrollment.expProgramming],
    ['3D Design Experience', pendingEnrollment.exp3D],
    ['Learning Notes / Achievements', pendingEnrollment.studentAchievements],
    ['T-Shirt Size', orderData.tshirt || pendingEnrollment.tshirt],
    ['Payment Frequency', orderData.paymentFreq || pendingEnrollment.paymentFrequency],
    ['MWL Tinkering Kit', pendingEnrollment.tinkeringKit],
    ['Experiment Month', pendingEnrollment.experimentMonth],
    ['Original Amount Before GST', pendingEnrollment.totalPrice ? formatCurrency(pendingEnrollment.totalPrice) : ''],
    ['Paid Program Fee', formatCurrency(orderData.subtotal)],
    ['GST Paid', formatCurrency(orderData.tax)],
    ['Total Paid', formatCurrency(orderData.grandTotal)]
  ];

  return rows
    .map(([label, value]) => `${label}: ${value || 'Not provided'}`)
    .join('\n');
}

async function sendPaymentCompletionNotification(pendingEnrollment = {}) {
  if (!initEmailJs()) return;

  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  const message = createPaymentCompletionMessage(pendingEnrollment);
  const replyTo = orderData.email || pendingEnrollment.email || 'makerworkslab@gmail.com';

  const sends = EMAILJS_CONFIG.recipients.map(recipient => {
    const templateParams = {
      title: 'MakerWorks Enrollment: Payment Completed',
      name: orderData.name || pendingEnrollment.parentName || 'Enrollment Payment',
      email: replyTo,
      reply_to: replyTo,
      to_email: recipient,
      recipient_email: recipient,
      time: timestamp,
      message
    };
    return window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.adminTemplateId, templateParams);
  });

  const results = await Promise.allSettled(sends);
  results.forEach(result => {
    if (result.status === 'rejected') console.error('Payment EmailJS Error:', result.reason);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Auto-fill form from Enrollment redirect
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('name')) {
    const nameEl = document.getElementById('fullName');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    if (nameEl) nameEl.value = urlParams.get('name');
    if (emailEl) emailEl.value = urlParams.get('email');
    if (phoneEl) phoneEl.value = normalizePhone(urlParams.get('phone'));

    const prog = urlParams.get('program');
    const amount = parseInt(urlParams.get('amount')) || 0;
    const hours = parseInt(urlParams.get('hours')) || 2;
    orderData.tshirt = urlParams.get('tshirt') || '';
    orderData.paymentFreq = urlParams.get('freq') || 'Quarterly';
    orderData.address = urlParams.get('address') || '';
    orderData.companyName = urlParams.get('company') || '';
    orderData.gstNumber = urlParams.get('gst') || '';
    orderData.country = urlParams.get('country') || 'India';
    orderData.preferredClassDays = normalizePreferredDays(urlParams.get('preferredDays'));
    orderData.preferredClassTimeSlots = normalizePreferredTimeSlots(urlParams.get('preferredTimes') || urlParams.get('preferredTime'));
    
    if (document.getElementById('address')) document.getElementById('address').value = orderData.address;
    if (document.getElementById('companyName')) document.getElementById('companyName').value = orderData.companyName;
    if (document.getElementById('gstNumber')) document.getElementById('gstNumber').value = orderData.gstNumber;

    if (prog && amount > 0) {
      let months = 1;
      const isExperimentMonth = prog.includes('Experiment Month');
      const isFullProgram = prog.includes('Level') || prog.includes('Portfolio');
      
      if (isFullProgram && !isExperimentMonth) {
        if (orderData.paymentFreq === 'Quarterly') months = 3;
        else if (orderData.paymentFreq === 'Half-Yearly') months = 6;
        else if (orderData.paymentFreq === 'Yearly') months = 12;
      }

      const baseHoursPerMonth = (hours === 3 ? 15 : hours === 4 ? 20 : 10);
      const totalHours = baseHoursPerMonth * months;
      
      let itemTitle = "";
      if (isFullProgram) {
        itemTitle = `${prog} (${totalHours} Hrs)`;
      } else {
        // Handle standalone Kit or Experiment Month
        itemTitle = prog;
        if (prog.includes('Month')) itemTitle += ` (${baseHoursPerMonth} Hrs)`;
      }
      
      const itemValue = `${itemTitle}|${amount}`;

      const itemSelect = document.getElementById('item');
      if (itemSelect) {
        itemSelect.innerHTML = '';
        const customOption = new Option(`${itemTitle} — ₹${amount.toLocaleString('en-IN')}`, itemValue, true, true);
        itemSelect.appendChild(customOption);
        itemSelect.value = itemValue;
        itemSelect.disabled = true;
      }

      // Show program info badge
      const badge = document.getElementById('program-info-badge');
      const badgeText = document.getElementById('program-info-text');
      if (badge && badgeText) {
        badgeText.textContent = `✓ Auto-filled from enrollment: ${itemTitle}`;
        badge.classList.remove('hidden');
      }
    }
  }

  setupFormListeners();
  setupButtons();
  updatePrice();
});

// ===== Price Calculation =====
function setupFormListeners() {
  const itemSelect = document.getElementById('item');
  if (itemSelect) itemSelect.addEventListener('change', updatePrice);

  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = normalizePhone(phoneInput.value);
      setFieldValidity(phoneInput, phoneInput.value && !isValidPhone(phoneInput.value) ? 'Please enter exactly 10 digits.' : '');
    });
    phoneInput.addEventListener('blur', () => {
      setFieldValidity(phoneInput, isValidPhone(phoneInput.value) ? '' : 'Please enter exactly 10 digits.');
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      setFieldValidity(emailInput, emailInput.value && !isValidEmail(emailInput.value) ? 'Please enter a valid email address.' : '');
    });
    emailInput.addEventListener('blur', () => {
      setFieldValidity(emailInput, isValidEmail(emailInput.value) ? '' : 'Please enter a valid email address.');
    });
  }
}

function updatePrice() {
  const itemSelect = document.getElementById('item');
  if (!itemSelect) return;

  let unitPrice = 0;
  let itemName = '';

  if (itemSelect.value) {
    const parts = itemSelect.value.split('|');
    itemName = parts[0];
    unitPrice = parseInt(parts[1]) || 0;
  }

  const displayTotal = document.getElementById('display-total');
  if (displayTotal) displayTotal.textContent = formatCurrency(unitPrice);

  orderData.itemName = itemName;
  orderData.unitPrice = unitPrice;
  orderData.subtotal = unitPrice;
}

// ===== Button Handlers =====
function setupButtons() {
  const btnProceed = document.getElementById('btn-proceed');
  const btnBack = document.getElementById('btn-back');
  const btnPay = document.getElementById('btn-pay');
  const btnPrint = document.getElementById('btn-print');
  const btnNew = document.getElementById('btn-new');

  if (btnProceed) btnProceed.addEventListener('click', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    orderData.name = document.getElementById('fullName').value.trim();
    orderData.email = document.getElementById('email').value.trim();
    orderData.phone = normalizePhone(document.getElementById('phone').value);
    orderData.address = document.getElementById('address').value.trim();
    orderData.companyName = document.getElementById('companyName') ? document.getElementById('companyName').value.trim() : '';
    orderData.gstNumber = document.getElementById('gstNumber') ? document.getElementById('gstNumber').value.trim().toUpperCase() : '';

    const tax = Math.round(orderData.subtotal * 0.18);
    orderData.tax = tax;
    orderData.grandTotal = orderData.subtotal + tax;

    setEl('conf-name', orderData.name);
    setEl('conf-email', orderData.email);
    setEl('conf-address', orderData.address);
    setEl('conf-item-name', orderData.itemName);
    setEl('conf-item-qty', '1 enrollment');
    setEl('conf-item-price', formatCurrency(orderData.subtotal));
    setEl('conf-preferred-days', formatPreferredDays(orderData.preferredClassDays));
    setEl('conf-preferred-time', formatPreferredTimeSlots(orderData.preferredClassTimeSlots));
    setEl('conf-subtotal', formatCurrency(orderData.subtotal));
    setEl('conf-tax', formatCurrency(orderData.tax));
    setEl('conf-grand-total', formatCurrency(orderData.grandTotal));

    goToStep(2);
  });

  if (btnBack) btnBack.addEventListener('click', () => goToStep(1));
  if (btnPay) btnPay.addEventListener('click', () => openRazorpay());
  if (btnPrint) btnPrint.addEventListener('click', () => window.print());
  if (btnNew) btnNew.addEventListener('click', () => {
    const form = document.getElementById('customer-form');
    if (form) form.reset();
    goToStep(1);
  });
}

function setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function validateForm() {
  let valid = true;
  const fields = ['fullName', 'email', 'phone', 'address'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'phone') el.value = normalizePhone(el.value);

    let message = '';
    if (!el.value.trim()) message = 'This field is required.';
    else if (id === 'email' && !isValidEmail(el.value)) message = 'Please enter a valid email address.';
    else if (id === 'phone' && !isValidPhone(el.value)) message = 'Please enter exactly 10 digits.';

    if (!setFieldValidity(el, message)) valid = false;
  });
  if (!valid) {
    // Scroll to first error
    const first = document.querySelector('.\\!border-red-400');
    if (first) {
      first.reportValidity();
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  return valid;
}

function goToStep(num) {
  document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
  const targetSection = document.getElementById('step-' + num);
  if (targetSection) targetSection.classList.add('active');

  for (let i = 1; i <= 3; i++) {
    const bar = document.getElementById('prog-bar-' + i);
    const prog = document.getElementById('prog-' + i);
    if (!bar || !prog) continue;
    const span = prog.querySelector('span');

    if (i <= num) {
      bar.style.background = 'linear-gradient(90deg, #4f46e5, #a855f7)';
      if (span) { span.classList.remove('text-slate-400'); span.classList.add('text-primary'); }
    } else {
      bar.style.background = '#e2e8f0';
      if (span) { span.classList.add('text-slate-400'); span.classList.remove('text-primary'); }
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Razorpay & Firebase Storage =====
async function saveOrderToFirebase(pendingEnrollment = getPendingEnrollmentData()) {
  if (!db) return;
  try {
    const ordersRef = ref(db, 'orders');
    await push(ordersRef, {
      ...orderData,
      timestamp: serverTimestamp(),
      status: 'PAID'
    });
    
    if (pendingEnrollment) {
      pendingEnrollment.paymentId = orderData.paymentId;
      pendingEnrollment.billNumber = orderData.billNumber;
      pendingEnrollment.paidSubtotal = orderData.subtotal;
      pendingEnrollment.paidGst = orderData.tax;
      pendingEnrollment.paidTotal = orderData.grandTotal;
      pendingEnrollment.status = 'PAID';
      
      const enrollmentsRef = ref(db, 'enrollments');
      await push(enrollmentsRef, pendingEnrollment);
      sessionStorage.removeItem('pendingEnrollment');
    }
  } catch (e) {
    console.error("Firebase Save Error:", e);
  }
}


function openRazorpay() {
  if (!RAZORPAY_KEY) {
    const btnPay = document.getElementById('btn-pay');
    if (btnPay) {
      btnPay.innerHTML = '<span class="material-symbols-outlined animate-spin text-xl">sync</span> Processing...';
      btnPay.disabled = true;
    }
    
    setTimeout(() => {
      orderData.paymentId = 'pay_DEMO_' + Date.now();
      const pendingEnrollment = getPendingEnrollmentData();
      generateBill();
      saveOrderToFirebase(pendingEnrollment);
      sendPaymentCompletionNotification(pendingEnrollment || {});
      goToStep(3);
    }, 1500);
    return;
  }

  const options = {
    key: RAZORPAY_KEY,
    amount: orderData.grandTotal * 100,
    currency: 'INR',
    name: 'MakerWorks Lab',
    description: orderData.itemName,
    prefill: { name: orderData.name, email: orderData.email, contact: orderData.phone },
    theme: { color: '#4f46e5' },
    handler: async function (response) {
      orderData.paymentId = response.razorpay_payment_id;
      const pendingEnrollment = getPendingEnrollmentData();
      generateBill();
      await saveOrderToFirebase(pendingEnrollment);
      await sendPaymentCompletionNotification(pendingEnrollment || {});
      goToStep(3);
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

function generateBill() {
  const now = new Date();
  orderData.billNumber = 'BILL-' + now.getFullYear() + '-' + String(Math.floor(Math.random() * 99999)).padStart(5, '0');

  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 14);

  const dateOpts = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-IN', dateOpts);
  const dueDateStr = dueDate.toLocaleDateString('en-IN', dateOpts);

  // Extract hour count from item name when available.
  const hourMatch = orderData.itemName.match(/\((\d+)\s*Hrs?\)/i);
  const classCount = hourMatch ? hourMatch[1] : '—';

  setEl('bill-number', orderData.billNumber);
  setEl('bill-bot-no', orderData.billNumber);
  setEl('bill-date', dateStr);
  setEl('bill-bot-date', dateStr);
  setEl('bill-due-date', dueDateStr);

  setEl('bill-name', orderData.name);
  setEl('bill-bot-name', orderData.name);
  setEl('bill-email', orderData.email);
  setEl('bill-phone', orderData.phone);
  setEl('bill-address', orderData.address || '');

  const billCompanyEl = document.getElementById('bill-company');
  const billGstEl = document.getElementById('bill-gst');
  const billGstVal = document.getElementById('bill-gst-val');
  
  if (billCompanyEl) {
    if (orderData.companyName) {
      billCompanyEl.textContent = orderData.companyName;
      billCompanyEl.classList.remove('hidden');
    } else {
      billCompanyEl.classList.add('hidden');
    }
  }
  
  if (billGstEl && billGstVal) {
    if (orderData.gstNumber) {
      billGstVal.textContent = orderData.gstNumber;
      billGstEl.classList.remove('hidden');
    } else {
      billGstEl.classList.add('hidden');
    }
  }

  // Add T-shirt and Frequency to Bill To section if elements exist
  const billToBox = document.querySelector('#bill-printable .bg-slate-50');
  if (billToBox) {
    // Check if we already added these to avoid duplicates if generateBill is called twice
    if (!document.getElementById('bill-tshirt-row')) {
      const extraInfo = document.createElement('div');
      extraInfo.id = 'bill-tshirt-row';
      extraInfo.className = 'mt-2 pt-2 border-t border-indigo-100/50 space-y-0.5';
      extraInfo.innerHTML = `
        <p><strong>T-Shirt Size:</strong> ${orderData.tshirt || '—'}</p>
        <p><strong>Payment Plan:</strong> ${orderData.paymentFreq || 'Quarterly'}</p>
        <p><strong>Preferred Days:</strong> ${formatPreferredDays(orderData.preferredClassDays)}</p>
        <p><strong>Preferred Times:</strong> ${formatPreferredTimeSlots(orderData.preferredClassTimeSlots)}</p>
      `;
      billToBox.appendChild(extraInfo);
    }
  }

  const subtotal = orderData.subtotal;
  const halfTax = orderData.tax / 2;

  const billItems = document.getElementById('bill-items');
  if (billItems) {
    billItems.innerHTML = `
      <tr class="bg-primary/5 border-b border-slate-100">
        <td class="p-3">
          <p class="font-bold text-slate-800">${orderData.itemName}</p>
          <p class="text-[0.6rem] text-slate-400 mt-1 uppercase tracking-wider">Ref: ${orderData.paymentId || '—'}</p>
        </td>
        <td class="p-3 text-center text-slate-700 font-medium">${classCount}</td>
        <td class="p-3 text-right text-slate-700 font-medium">${formatCurrency(subtotal)}</td>
        <td class="p-3 text-right font-black text-slate-900">${formatCurrency(orderData.grandTotal)}</td>
      </tr>`;
  }

  setEl('bill-subtotal', formatCurrency(subtotal));
  setEl('bill-tax', formatCurrency(orderData.tax));
  setEl('bill-grand-total', formatCurrency(orderData.grandTotal));
  setEl('bill-words', numberToWords(orderData.grandTotal) + " RUPEES ONLY");
}

function numberToWords(num) {
  const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  num = Math.floor(Math.abs(num));
  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim();
}

function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
