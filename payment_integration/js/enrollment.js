import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { FIREBASE_CONFIG } from "./config.js?v=4";

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

const PRICING = {
  Beginner: { 2: 9999, 3: 14999, 4: 19999 },
  Intermediate: { 2: 14999, 3: 22499, 4: 29999 },
  Portfolio: { 2: 24999, 3: 37499, 4: 49999 },
  TINKERING_KIT: 9999
};

const CLASS_MAPPING = { 2: 10, 3: 15, 4: 20 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const EMAILJS_CONFIG = {
  serviceId: "service_atizuna",
  publicKey: "GFxAVPzBfXX4d-vQR",
  adminTemplateId: "template_4cus82e",
  recipients: ["makerworkslab@gmail.com", "ummadi.vinay2000@gmail.com"]
};

let emailJsInitialized = false;
let partialLeadTimer = null;
let partialLeadSent = false;

function calculatePrice(program, hours, hasKit = false, hasMonth = false, freqMultiplier = 1, countryMultiplier = 1) {
  let basePrice = 0;
  if (program && PRICING[program]) {
    basePrice = PRICING[program][hours] || PRICING[program][2];
  }

  let total = hasMonth ? basePrice : (basePrice * freqMultiplier);

  if (hasKit && !hasMonth) total += PRICING.TINKERING_KIT;

  return total * countryMultiplier;
}

function formatCurrency(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

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
  el.classList.toggle('field-error', Boolean(message));
  return !message;
}

function collectEnrollmentSnapshot() {
  const selectedProgram = document.querySelector('input[name="programDivision"]:checked');
  const selectedHours = document.querySelector('input[name="tinkeringHours"]:checked');
  const selectedFreq = document.querySelector('input[name="paymentFreq"]:checked');
  const programName = selectedProgram ? selectedProgram.value : '';
  const hours = selectedHours ? parseInt(selectedHours.value) : 2;
  const hasKit = document.getElementById('check-kit')?.checked || false;
  const hasMonth = document.getElementById('check-month')?.checked || false;
  const country = document.getElementById('country')?.value || 'India';
  const countryMultiplier = country === 'Other' ? 1.5 : 1.0;
  const freq = selectedFreq ? selectedFreq.value : (hasMonth ? 'Experiment Month' : 'Quarterly');

  let freqMultiplier = 1;
  if (!hasMonth) {
    if (freq === 'Quarterly') freqMultiplier = 3;
    else if (freq === 'Half-Yearly') freqMultiplier = 6 * 0.95;
    else if (freq === 'Yearly') freqMultiplier = 12 * 0.90;
  }

  return {
    studentName: document.getElementById('studentName')?.value.trim() || '',
    dob: document.getElementById('dob')?.value || '',
    tshirt: document.getElementById('tshirt')?.value || '',
    schoolName: document.getElementById('schoolName')?.value.trim() || '',
    studyGrade: document.getElementById('studyGrade')?.value || '',
    parentName: document.getElementById('parentName')?.value.trim() || '',
    parentPhone: normalizePhone(document.getElementById('parentPhone')?.value || ''),
    email: document.getElementById('email')?.value.trim() || '',
    address: document.getElementById('address')?.value.trim() || '',
    country,
    companyName: document.getElementById('companyName')?.value.trim() || '',
    gstNumber: document.getElementById('gstNumber')?.value.trim().toUpperCase() || '',
    expRobotics: document.getElementById('expRobotics')?.value || '',
    expProgramming: document.getElementById('expProgramming')?.value || '',
    exp3D: document.getElementById('exp3D')?.value || '',
    studentAchievements: document.getElementById('studentAchievements')?.value.trim() || '',
    program: programName,
    tinkeringHours: hours,
    paymentFrequency: freq,
    tinkeringKit: hasKit ? "Yes" : "No",
    experimentMonth: hasMonth ? "Yes" : "No",
    totalPrice: calculatePrice(programName, hours, hasKit, hasMonth, freqMultiplier, countryMultiplier)
  };
}

function createNotificationMessage(data, status) {
  const rows = [
    ['Status', status],
    ['Student Name', data.studentName],
    ['Date of Birth', data.dob],
    ['T-Shirt Size', data.tshirt],
    ['School', data.schoolName],
    ['Grade', data.studyGrade ? `Grade ${data.studyGrade}` : ''],
    ['Parent Name', data.parentName],
    ['Phone', data.parentPhone],
    ['Email', data.email],
    ['Address', data.address],
    ['Country', data.country],
    ['Company', data.companyName],
    ['GST Number', data.gstNumber],
    ['Robotics Hardware Experience', data.expRobotics],
    ['Programming Experience', data.expProgramming],
    ['3D Design Experience', data.exp3D],
    ['Learning Notes / Achievements', data.studentAchievements],
    ['Program', getProgramLabel(data.program)],
    ['Hours', data.tinkeringHours ? `${data.tinkeringHours} hrs/week (${CLASS_MAPPING[data.tinkeringHours] || 10} hrs/month)` : ''],
    ['Payment Frequency', data.paymentFrequency],
    ['MWL Tinkering Kit', data.tinkeringKit],
    ['Experiment Month', data.experimentMonth],
    ['Amount Before GST', data.totalPrice ? formatCurrency(data.totalPrice) : '']
  ];

  return rows
    .map(([label, value]) => `${label}: ${value || 'Not provided yet'}`)
    .join('\n');
}

function initEmailJs() {
  if (emailJsInitialized) return true;
  if (!window.emailjs || !EMAILJS_CONFIG.publicKey) return false;
  window.emailjs.init(EMAILJS_CONFIG.publicKey);
  emailJsInitialized = true;
  return true;
}

async function sendEnrollmentNotification(data, status) {
  if (!initEmailJs()) return;

  const message = createNotificationMessage(data, status);
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const sends = EMAILJS_CONFIG.recipients.map(recipient => {
    const templateParams = {
      title: `MakerWorks Enrollment: ${status}`,
      name: data.parentName || data.studentName || 'Enrollment Lead',
      email: data.email || 'makerworkslab@gmail.com',
      reply_to: data.email || 'makerworkslab@gmail.com',
      to_email: recipient,
      recipient_email: recipient,
      time: timestamp,
      message
    };
    return window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.adminTemplateId, templateParams);
  });

  const results = await Promise.allSettled(sends);
  results.forEach(result => {
    if (result.status === 'rejected') console.error('Enrollment EmailJS Error:', result.reason);
  });
}

async function saveEnrollmentLead(data, status) {
  if (!db) return;
  const { photoData, ...dataWithoutPhoto } = data;
  const leadData = {
    ...dataWithoutPhoto,
    notificationStatus: status,
    timestamp: serverTimestamp()
  };
  try {
    await push(ref(db, 'enrollment_leads'), leadData);
  } catch (error) {
    console.error('Enrollment lead save error:', error);
  }
}

function hasUsableLeadContact(data) {
  return Boolean((data.studentName || data.parentName) && (isValidPhone(data.parentPhone) || isValidEmail(data.email)));
}

function schedulePartialLeadNotification() {
  if (partialLeadSent) return;
  window.clearTimeout(partialLeadTimer);
  partialLeadTimer = window.setTimeout(async () => {
    const data = collectEnrollmentSnapshot();
    if (!hasUsableLeadContact(data)) return;

    partialLeadSent = true;

    await saveEnrollmentLead(data, 'PARTIAL_FORM_STARTED');
    await sendEnrollmentNotification(data, 'Partial Form Started');
  }, 1800);
}

function getProgramLabel(program) {
  if (program === 'Portfolio') return 'Portfolio Building Program';
  if (program) return `${program} Level`;
  return '';
}

function updatePriceDisplay() {
  console.log("updatePriceDisplay running - Card baseline: Basic Monthly");
  const selectedProgram = document.querySelector('input[name="programDivision"]:checked');
  const selectedHours = document.querySelector('input[name="tinkeringHours"]:checked');
  const selectedFreq = document.querySelector('input[name="paymentFreq"]:checked');
  const hasKit = document.getElementById('check-kit')?.checked || false;
  const hasMonth = document.getElementById('check-month')?.checked || false;

  const countryEl = document.getElementById('country');
  const program = selectedProgram ? selectedProgram.value : null;
  const hours = selectedHours ? parseInt(selectedHours.value) : 2;
  const freq = selectedFreq ? selectedFreq.value : 'Quarterly';
  const country = countryEl ? countryEl.value : 'India';

  // Multipliers
  let freqMultiplier = 1;
  let months = 1;

  if (!hasMonth) {
    if (freq === 'Quarterly') {
      freqMultiplier = 3;
      months = 3;
    } else if (freq === 'Half-Yearly') {
      freqMultiplier = 6 * 0.95; // 5% discount
      months = 6;
    } else if (freq === 'Yearly') {
      freqMultiplier = 12 * 0.90; // 10% discount
      months = 12;
    }
  }

  const countryMultiplier = (country === 'Other') ? 1.5 : 1.0;
  const price = calculatePrice(program, hours, hasKit, hasMonth, freqMultiplier, countryMultiplier);
  const classesPerMonth = CLASS_MAPPING[hours] || 10;
  const totalClasses = hasMonth ? classesPerMonth : classesPerMonth * months;

  const summaryProgram = document.getElementById('summaryProgram');
  const summaryClasses = document.getElementById('summaryClasses');
  const summaryPrice = document.getElementById('summaryPrice');

  if (summaryProgram) {
    if (program) {
      let label = getProgramLabel(program);
      if (hasKit && !hasMonth) label += " + Kit";
      if (hasMonth) label += " + Experiment Month";
      summaryProgram.textContent = label;
    } else {
      let label = "";
      if (hasKit && hasMonth) label = "Experiment Month";
      else if (hasKit) label = "MWL Tinkering Kit";
      else if (hasMonth) label = "Experiment Month";
      summaryProgram.textContent = label || "-";
    }
  }

  if (summaryClasses) {
    summaryClasses.textContent = program ? (hasMonth ? `${classesPerMonth} Hrs (Experiment Month)` : `${totalClasses} Hrs (${months} Months)`) : (hasMonth ? `${classesPerMonth} Hrs` : "-");
  }

  if (summaryPrice) {
    summaryPrice.textContent = formatCurrency(price);
  }

  const finalReviewPrice = document.getElementById('finalReviewPrice');
  const finalReviewDetails = document.getElementById('finalReviewDetails');
  if (finalReviewPrice) finalReviewPrice.textContent = formatCurrency(price);
  if (finalReviewDetails) {
    const programLabel = program ? getProgramLabel(program) : 'Program not selected';
    const classText = `${classesPerMonth} hrs/month`;
    const freqText = hasMonth ? 'Experiment Month' : `${months} month billing`;
    const kitText = hasKit && !hasMonth ? ' + MWL Tinkering Kit' : '';
    finalReviewDetails.textContent = `${programLabel}${kitText} · ${classText} · ${freqText}`;
  }

  // Update mobile bar
  const mobilePrice = document.getElementById('mobileTotalPrice');
  if (mobilePrice) mobilePrice.textContent = formatCurrency(price);

  // Update selection cards (always show basic monthly price)
  const beginnerCardPrice = calculatePrice('Beginner', hours, false, false, 1, countryMultiplier);
  const intermediateCardPrice = calculatePrice('Intermediate', hours, false, false, 1, countryMultiplier);
  const portfolioCardPrice = calculatePrice('Portfolio', hours, false, false, 1, countryMultiplier);
  const classPerMonth = CLASS_MAPPING[hours] || 10;
  const cardClassText = `for ${classPerMonth} hrs / month`;

  const begPriceEl = document.getElementById('price-beginner');
  const intPriceEl = document.getElementById('price-intermediate');
  const portfolioPriceEl = document.getElementById('price-portfolio');
  const experimentPriceEl = document.getElementById('experiment-price');
  if (begPriceEl) {
    begPriceEl.textContent = formatCurrency(beginnerCardPrice);
    const label = begPriceEl.parentElement.querySelector('span:last-child');
    if (label) label.textContent = cardClassText;
  }
  if (intPriceEl) {
    intPriceEl.textContent = formatCurrency(intermediateCardPrice);
    const label = intPriceEl.parentElement.querySelector('span:last-child');
    if (label) label.textContent = cardClassText;
  }
  if (portfolioPriceEl) {
    portfolioPriceEl.textContent = formatCurrency(portfolioCardPrice);
    const label = portfolioPriceEl.parentElement.querySelector('span:last-child');
    if (label) label.textContent = cardClassText;
  }
  if (experimentPriceEl) {
    experimentPriceEl.textContent = `${formatCurrency(basePriceForSelection(program, hours, countryMultiplier))} + GST`;
  }
}

function basePriceForSelection(program, hours, countryMultiplier = 1) {
  if (!program || !PRICING[program]) return 0;
  return (PRICING[program][hours] || PRICING[program][2]) * countryMultiplier;
}

// Mobile bar scroll behavior
window.addEventListener('scroll', () => {
  const bar = document.getElementById('mobilePriceBar');
  if (bar) {
    if (window.scrollY > 50) {
      bar.classList.remove('translate-y-full');
    } else {
      bar.classList.add('translate-y-full');
    }
  }
});

function calculateAge(dobValue) {
  if (!dobValue) return null;
  const dob = new Date(dobValue);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function getRecommendedProgram() {
  const grade = document.getElementById('studyGrade')?.value;
  const age = calculateAge(document.getElementById('dob')?.value);
  const gradeNum = parseInt(grade);

  if (!Number.isNaN(gradeNum) && gradeNum >= 9) {
    return {
      program: 'Portfolio',
      hint: 'Portfolio Building Program is recommended for Grade 9 and above.'
    };
  }

  if (age !== null) {
    if (age <= 10) {
      return {
        program: 'Beginner',
        hint: 'Beginner Level is recommended for students up to 10 years old.'
      };
    }

    return {
      program: 'Intermediate',
      hint: 'Intermediate Level is recommended for students above 10 years old.'
    };
  }

  if (!Number.isNaN(gradeNum)) {
    if (gradeNum <= 5) {
      return {
        program: 'Beginner',
        hint: 'Beginner Level is recommended for this grade.'
      };
    }

    return {
      program: 'Intermediate',
      hint: 'Intermediate Level is recommended for this grade.'
    };
  }

  return { program: null, hint: '' };
}

function applyProgramLockState() {
  const editToggle = document.getElementById('editProgramToggle');
  const allowEdit = editToggle?.checked || false;
  document.querySelectorAll('input[name="programDivision"]').forEach(radio => {
    radio.disabled = !allowEdit && !radio.checked;
  });

  const hint = document.getElementById('programLockHint');
  if (hint) {
    hint.textContent = allowEdit
      ? 'Manual program editing is enabled.'
      : 'Recommended program is selected automatically. Enable edit to change it.';
  }
}

function applyRecommendedProgram() {
  const { program: suggestedProgram, hint } = getRecommendedProgram();

  // Update badges
  const beginnerBadge = document.getElementById('badge-beginner');
  const intermediateBadge = document.getElementById('badge-intermediate');
  const portfolioBadge = document.getElementById('badge-portfolio');
  if (beginnerBadge) beginnerBadge.classList.add('hidden');
  if (intermediateBadge) intermediateBadge.classList.add('hidden');
  if (portfolioBadge) portfolioBadge.classList.add('hidden');

  const gradeSelectHint = document.getElementById('gradeSelectHint');
  const gradeSelectHintText = document.getElementById('gradeSelectHintText');
  const gradeHint = document.getElementById('gradeHint');
  const gradeHintText = document.getElementById('gradeHintText');

  // Update select-level hint
  if (gradeSelectHint && gradeSelectHintText) {
    if (hint) {
      gradeSelectHintText.textContent = hint;
      gradeSelectHint.classList.remove('hidden');
    } else {
      gradeSelectHint.classList.add('hidden');
    }
  }

  // Update block-level hint
  if (gradeHint && gradeHintText) {
    if (hint) {
      gradeHintText.textContent = hint;
      gradeHint.classList.remove('hidden');
    } else {
      gradeHint.classList.add('hidden');
    }
  }

  const editToggle = document.getElementById('editProgramToggle');
  if (suggestedProgram && !editToggle?.checked) {
    const radio = document.querySelector(`input[name="programDivision"][value="${suggestedProgram}"]`);
    if (radio) {
      radio.checked = true;
      // Show appropriate badge
      const badge = document.getElementById(`badge-${suggestedProgram.toLowerCase()}`);
      if (badge) badge.classList.remove('hidden');

      radio.dispatchEvent(new Event('change'));
    }
  }

  applyProgramLockState();
  updatePriceDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
  // Photo preview
  const photoFileInput = document.getElementById('photoFile');
  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const previewContainer = document.getElementById('photoPreviewContainer');
      const preview = document.getElementById('photoPreview');
      const photoIcon = document.getElementById('photoIcon');
      const photoText = document.getElementById('photoText');

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
          previewContainer.classList.remove('hidden');
          previewContainer.style.animation = 'bounce 0.5s ease';
          photoIcon.textContent = "check_circle";
          photoIcon.className = "material-symbols-outlined text-4xl text-success mb-3 transition-colors";
          photoText.textContent = file.name;
          photoText.className = "text-sm font-bold text-success";
        };
        reader.readAsDataURL(file);
      } else {
        previewContainer.classList.add('hidden');
        preview.src = '';
      }
    });
  }

  // Age and grade recommendation changes
  const dobInput = document.getElementById('dob');
  if (dobInput) {
    dobInput.addEventListener('change', applyRecommendedProgram);
    dobInput.addEventListener('input', applyRecommendedProgram);
  }

  const gradeSelect = document.getElementById('studyGrade');
  if (gradeSelect) {
    gradeSelect.addEventListener('change', applyRecommendedProgram);
  }

  const editProgramToggle = document.getElementById('editProgramToggle');
  if (editProgramToggle) {
    editProgramToggle.addEventListener('change', () => {
      if (!editProgramToggle.checked) applyRecommendedProgram();
      else applyProgramLockState();
    });
  }

  // Price update listeners
  document.querySelectorAll('input[name="programDivision"], input[name="tinkeringHours"], input[name="paymentFreq"]').forEach(radio => {
    radio.addEventListener('change', updatePriceDisplay);
  });

  const setupContactValidation = () => {
    const phoneInput = document.getElementById('parentPhone');
    const emailInput = document.getElementById('email');

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        phoneInput.value = normalizePhone(phoneInput.value);
        setFieldValidity(phoneInput, phoneInput.value && !isValidPhone(phoneInput.value) ? 'Please enter exactly 10 digits.' : '');
        schedulePartialLeadNotification();
      });
      phoneInput.addEventListener('blur', () => {
        setFieldValidity(phoneInput, isValidPhone(phoneInput.value) ? '' : 'Please enter exactly 10 digits.');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        setFieldValidity(emailInput, emailInput.value && !isValidEmail(emailInput.value) ? 'Please enter a valid email address.' : '');
        schedulePartialLeadNotification();
      });
      emailInput.addEventListener('blur', () => {
        setFieldValidity(emailInput, isValidEmail(emailInput.value) ? '' : 'Please enter a valid email address.');
      });
    }
  };

  const updatePolicyGate = () => {
    const policyCheckboxes = Array.from(document.querySelectorAll('#policies-section input[type="checkbox"]'));
    const allChecked = policyCheckboxes.length > 0 && policyCheckboxes.every(input => input.checked);
    const submitBtn = document.getElementById('btn-submit');
    const mobileSubmitBtn = document.getElementById('btn-submit-mobile');
    const status = document.getElementById('policyStatus');

    [submitBtn, mobileSubmitBtn].forEach(button => {
      if (!button) return;
      button.disabled = !allChecked;
      button.classList.toggle('opacity-60', !allChecked);
      button.classList.toggle('cursor-not-allowed', !allChecked);
      button.title = allChecked ? '' : 'Please check all policies and commitments to continue.';
    });

    if (status) {
      status.classList.toggle('hidden', allChecked);
    }

    return allChecked;
  };

  const validatePolicies = () => {
    const allChecked = updatePolicyGate();
    if (!allChecked) {
      document.getElementById('policies-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const validateEnrollmentForm = () => {
    const phoneInput = document.getElementById('parentPhone');
    const emailInput = document.getElementById('email');
    if (phoneInput) phoneInput.value = normalizePhone(phoneInput.value);

    const phoneValid = setFieldValidity(phoneInput, isValidPhone(phoneInput?.value || '') ? '' : 'Please enter exactly 10 digits.');
    const emailValid = setFieldValidity(emailInput, isValidEmail(emailInput?.value || '') ? '' : 'Please enter a valid email address.');
    const policiesValid = validatePolicies();

    if (!phoneValid || !emailValid) {
      const first = document.querySelector('.field-error');
      if (first) {
        first.reportValidity();
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return policiesValid;
  };

  setupContactValidation();

  document.querySelectorAll('#policies-section input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', updatePolicyGate);
  });

  const checkKit = document.getElementById('check-kit');
  const checkMonth = document.getElementById('check-month');
  const countrySelect = document.getElementById('country');
  if (checkKit) checkKit.addEventListener('change', updatePriceDisplay);
  if (checkMonth) {
    checkMonth.addEventListener('change', () => {
      if (checkMonth.checked) {
        if (checkKit) {
          checkKit.checked = false;
          checkKit.disabled = true;
        }
        document.querySelectorAll('input[name="paymentFreq"]').forEach(radio => {
          radio.disabled = true;
          radio.checked = false;
        });
        const hint = document.getElementById('paymentFreqHint');
        if (hint) hint.textContent = 'Experiment Month is charged for one month only. Long-term payment frequency is skipped.';
      } else {
        if (checkKit) {
          checkKit.disabled = false;
          checkKit.checked = true;
        }
        document.querySelectorAll('input[name="paymentFreq"]').forEach(radio => {
          radio.disabled = false;
        });
        const quarterly = document.querySelector('input[name="paymentFreq"][value="Quarterly"]');
        if (quarterly) quarterly.checked = true;
        const hint = document.getElementById('paymentFreqHint');
        if (hint) hint.textContent = 'All fees paid in advance:';
      }
      updatePriceDisplay();
    });
  }
  if (countrySelect) countrySelect.addEventListener('change', updatePriceDisplay);

  const partialLeadFields = [
    'studentName', 'dob', 'tshirt', 'schoolName', 'studyGrade', 'parentName',
    'address', 'country', 'companyName', 'gstNumber', 'expRobotics',
    'expProgramming', 'exp3D', 'studentAchievements'
  ];
  partialLeadFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', schedulePartialLeadNotification);
    el.addEventListener('change', schedulePartialLeadNotification);
  });

  // Setup progress tracking
  const requiredFields = [
    'studentName', 'dob', 'schoolName', 'studyGrade',
    'parentName', 'parentPhone', 'email', 'address',
    'expRobotics', 'expProgramming', 'exp3D'
  ];

  function updateFormProgress() {
    let filled = 0;

    // Check text/selects
    requiredFields.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value.trim() !== "") filled++;
    });

    // Check program radios
    if (document.querySelector('input[name="programDivision"]:checked')) filled++;

    // Total steps (11 fields + 1 program)
    const total = requiredFields.length + 1;
    const progress = (filled / total) * 100;

    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = `${progress}%`;
  }

  // Attach listeners for progress
  [...requiredFields, 'programDivision', 'paymentFreq'].forEach(idOrName => {
    const els = idOrName === 'programDivision'
      ? document.querySelectorAll(`input[name="${idOrName}"]`)
      : [document.getElementById(idOrName)];

    els.forEach(el => {
      if (el) {
        el.addEventListener('input', updateFormProgress);
        el.addEventListener('change', updateFormProgress);
      }
    });
  });

  // Initialize
  applyRecommendedProgram();
  updateFormProgress();
  updatePolicyGate();

  // Handle mobile scroll
  window.dispatchEvent(new Event('scroll'));

  // Form submission
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = () => resolve(reader.result);
      };
      reader.onerror = error => reject(error);
    });
  };

  const form = document.getElementById('enrollment-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateEnrollmentForm()) return;

      const submitBtn = document.getElementById('btn-submit');
      submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-xl">progress_activity</span> Processing...`;
      submitBtn.disabled = true;

      let studentPhotoBase64 = null;
      if (photoFileInput && photoFileInput.files && photoFileInput.files[0]) {
        try {
          studentPhotoBase64 = await getBase64(photoFileInput.files[0]);
        } catch (err) {
          console.error("Failed to parse image file", err);
        }
      }

      const selectedProgram = document.querySelector('input[name="programDivision"]:checked');
      const selectedHours = document.querySelector('input[name="tinkeringHours"]:checked');
      const selectedFreq = document.querySelector('input[name="paymentFreq"]:checked');

      const programName = selectedProgram ? selectedProgram.value : '';
      const hours = selectedHours ? parseInt(selectedHours.value) : 2;
      const hasKit = document.getElementById('check-kit')?.checked || false;
      const hasMonth = document.getElementById('check-month')?.checked || false;
      const freq = hasMonth ? 'Experiment Month' : (selectedFreq ? selectedFreq.value : 'Quarterly');

      const country = document.getElementById('country')?.value || 'India';

      let freqMultiplier = 1;
      if (!hasMonth) {
        if (freq === 'Quarterly') freqMultiplier = 3;
        else if (freq === 'Half-Yearly') freqMultiplier = 6 * 0.95;
        else if (freq === 'Yearly') freqMultiplier = 12 * 0.90;
      }

      const countryMultiplier = (country === 'Other') ? 1.5 : 1.0;
      const totalPrice = calculatePrice(programName, hours, hasKit, hasMonth, freqMultiplier, countryMultiplier);

      const enrollmentData = {
        studentName: document.getElementById('studentName').value.trim(),
        dob: document.getElementById('dob').value,
        tshirt: document.getElementById('tshirt').value,
        schoolName: document.getElementById('schoolName').value.trim(),
        studyGrade: document.getElementById('studyGrade').value,
        photoData: studentPhotoBase64,
        parentName: document.getElementById('parentName').value.trim(),
        parentPhone: normalizePhone(document.getElementById('parentPhone').value),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        country: document.getElementById('country').value,
        companyName: document.getElementById('companyName') ? document.getElementById('companyName').value.trim() : '',
        gstNumber: document.getElementById('gstNumber') ? document.getElementById('gstNumber').value.trim().toUpperCase() : '',
        expRobotics: document.getElementById('expRobotics').value,
        expProgramming: document.getElementById('expProgramming').value,
        exp3D: document.getElementById('exp3D').value,
        studentAchievements: document.getElementById('studentAchievements') ? document.getElementById('studentAchievements').value.trim() : '',
        program: programName,
        tinkeringHours: hours,
        paymentFrequency: freq,
        tinkeringKit: hasKit ? "Yes" : "No",
        experimentMonth: hasMonth ? "Yes" : "No",
        totalPrice: totalPrice,
        timestamp: serverTimestamp()
      };

      await saveEnrollmentLead(enrollmentData, 'REVIEW_DETAILS_SUBMITTED');
      await sendEnrollmentNotification(enrollmentData, 'Review Details Submitted');

      try {
        sessionStorage.setItem('pendingEnrollment', JSON.stringify(enrollmentData));
      } catch (error) {
        console.error("Error saving to session storage:", error);
      }

      let itemDescription = getProgramLabel(programName);
      if (hasKit && !hasMonth) itemDescription += (itemDescription ? " + " : "") + "MWL Tinkering Kit";
      if (hasMonth) itemDescription += (itemDescription ? " + " : "") + "Experiment Month";

      const params = new URLSearchParams({
        name: enrollmentData.parentName,
        email: enrollmentData.email,
        phone: enrollmentData.parentPhone,
        address: enrollmentData.address,
        company: enrollmentData.companyName || '',
        gst: enrollmentData.gstNumber || '',
        program: itemDescription,
        hours: enrollmentData.tinkeringHours,
        amount: enrollmentData.totalPrice,
        tshirt: enrollmentData.tshirt,
        freq: freq,
        country: enrollmentData.country
      });

      window.location.href = `checkout.html?${params.toString()}`;
    });
  }
});
