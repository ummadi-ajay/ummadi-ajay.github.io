import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update, push, remove } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { FIREBASE_CONFIG } from "../../enrol/js/config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db  = getDatabase(app);

// ── Helpers ───────────────────────────────────────────────────────────────────

const QUARTERS = [
  { value: 'Q1', label: 'Q1 (Jan – Mar)' },
  { value: 'Q2', label: 'Q2 (Apr – Jun)' },
  { value: 'Q3', label: 'Q3 (Jul – Sep)' },
  { value: 'Q4', label: 'Q4 (Oct – Dec)' },
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

// Populate quarter dropdown
(function populateQuarterDropdown() {
  const sel = document.getElementById('win-quarter');
  if (!sel) return;
  QUARTERS.forEach(q => {
    years.forEach(yr => {
      const opt = document.createElement('option');
      opt.value       = `${q.value} ${yr}`;
      opt.textContent = `${q.label} – ${yr}`;
      sel.appendChild(opt);
    });
  });
})();


function showMsg(elId, text, isError = false) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? '#ef4444' : '#16a34a';
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3500);
}

// ── Load enrolled students into dropdown ──────────────────────────────────────

let enrolledEmails = [];
let selectedStudentEmail = '';

onValue(ref(db, 'enrollments'), (snap) => {
  const data = snap.val();
  enrolledEmails = [];
  if (data) {
    const seen = new Set();
    Object.values(data).forEach(e => {
      const email = e.email || e.parentEmail || e.studentEmail || e.Email;
      if (email && !seen.has(email)) { seen.add(email); enrolledEmails.push(email); }
    });
    enrolledEmails.sort();
  }
  renderDropdownItems(enrolledEmails);
});

// ── Student Search UI ─────────────────────────────────────────────────────────

function renderDropdownItems(list) {
  const container = document.getElementById('student-dropdown-items');
  if (!container) return;
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `<p class="p-3 text-xs text-slate-400 italic">No matching students found.</p>`;
    return;
  }

  list.forEach(email => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors flex items-center gap-3 border-b border-slate-100 last:border-0';
    btn.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">${email.charAt(0).toUpperCase()}</div>
      <span class="text-sm font-medium text-slate-800">${email}</span>
    `;
    btn.onclick = () => selectStudent(email);
    container.appendChild(btn);
  });
}

window.filterStudents = function(query) {
  const filtered = query
    ? enrolledEmails.filter(e => e.toLowerCase().includes(query.toLowerCase()))
    : enrolledEmails;

  // Also add the typed value if it looks like an email and isn't in list
  if (query.includes('@') && !enrolledEmails.includes(query)) {
    filtered.unshift(query); // allow manual entry
  }

  renderDropdownItems(filtered);
  document.getElementById('student-dropdown').classList.remove('hidden');
};

window.showStudentList = function() {
  renderDropdownItems(enrolledEmails);
  document.getElementById('student-dropdown').classList.remove('hidden');
};

// Hide dropdown on outside click
document.addEventListener('click', (e) => {
  const dd = document.getElementById('student-dropdown');
  const input = document.getElementById('student-search');
  if (dd && input && !dd.contains(e.target) && e.target !== input) {
    dd.classList.add('hidden');
  }
});

function selectStudent(email) {
  selectedStudentEmail = email;
  document.getElementById('student-search').value = email;
  document.getElementById('student-dropdown').classList.add('hidden');

  // Show chip
  const chip = document.getElementById('selected-student-chip');
  document.getElementById('selected-email-label').textContent = email;
  document.getElementById('selected-avatar').textContent = email.charAt(0).toUpperCase();
  chip.classList.remove('hidden');

  // Reveal Step 2
  document.getElementById('step2-panel').classList.remove('hidden');
}

window.clearStudentSelection = function() {
  selectedStudentEmail = '';
  document.getElementById('student-search').value = '';
  document.getElementById('selected-student-chip').classList.add('hidden');
  document.getElementById('step2-panel').classList.add('hidden');
};

// ── Save Per-User Window ──────────────────────────────────────────────────────

window.saveWindow = async function() {
  const email   = selectedStudentEmail || document.getElementById('student-search').value.trim();
  const quarter = document.getElementById('win-quarter').value;
  const start   = document.getElementById('win-start').value;
  const end     = document.getElementById('win-end').value;

  if (!email)   { alert('Please select a student first.'); return; }
  if (!quarter) { alert('Please select a quarter.'); return; }
  if (!start || !end) { alert('Please set the date range.'); return; }
  if (start > end)    { alert('Start date must be before end date.'); return; }

  const btn = document.getElementById('win-save-btn');
  btn.disabled = true; btn.innerHTML = '<span>Saving...</span>';

  try {
    await push(ref(db, 'user_postponement_windows'), {
      userEmail: email,
      quarter,
      startDate: start,
      endDate: end,
      active: true,
      createdAt: Date.now()
    });
    window.clearStudentSelection();
    document.getElementById('win-quarter').value = '';
    document.getElementById('win-start').value   = '';
    document.getElementById('win-end').value     = '';
    showMsg('win-msg', `✓ Window assigned to ${email}`);
  } catch(e) { alert('Error: ' + e.message); }
  finally { btn.disabled = false; btn.innerHTML = '<span class="material-symbols-outlined text-sm">check_circle</span> Assign Window'; }
};

window.toggleUserWindow = async function(id, isActive) {
  try { await update(ref(db, `user_postponement_windows/${id}`), { active: !isActive }); }
  catch(e) { alert('Error: ' + e.message); }
};

window.deleteUserWindow = async function(id, email) {
  if (!confirm(`Delete window for ${email}?`)) return;
  try { await remove(ref(db, `user_postponement_windows/${id}`)); }
  catch(e) { alert('Error: ' + e.message); }
};

// ── Render Per-User Windows ───────────────────────────────────────────────────

onValue(ref(db, 'user_postponement_windows'), (snap) => {
  const listEl = document.getElementById('windows-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  const data = snap.val();
  if (!data) {
    listEl.innerHTML = `<p class="text-xs text-slate-400 italic p-2">No windows assigned yet.</p>`;
    return;
  }

  // Group by email
  const byEmail = {};
  Object.keys(data).forEach(k => {
    const w = { id: k, ...data[k] };
    if (!byEmail[w.userEmail]) byEmail[w.userEmail] = [];
    byEmail[w.userEmail].push(w);
  });

  Object.keys(byEmail).sort().forEach(email => {
    const windows = byEmail[email].sort((a,b) => b.createdAt - a.createdAt);

    const studentBlock = document.createElement('div');
    studentBlock.className = 'mb-5';
    studentBlock.innerHTML = `
      <div class="flex items-center gap-2 mb-2">
        <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">${email.charAt(0).toUpperCase()}</div>
        <p class="text-sm font-bold text-slate-800">${email}</p>
        <span class="text-xs text-slate-400">(${windows.length} window${windows.length > 1 ? 's' : ''})</span>
      </div>
      <div class="pl-9 space-y-2" id="windows-for-${email.replace(/[@.]/g,'_')}"></div>
    `;
    listEl.appendChild(studentBlock);

    const container = studentBlock.querySelector(`#windows-for-${email.replace(/[@.]/g,'_')}`);
    windows.forEach(win => {
      const isActive = win.active === true;
      const startFmt = new Date(win.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const endFmt   = new Date(win.endDate).toLocaleDateString('en-US',   { month: 'short', day: 'numeric', year: 'numeric' });

      const row = document.createElement('div');
      row.className = `flex items-center justify-between gap-3 p-3 rounded-xl border text-sm ${isActive ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`;
      row.innerHTML = `
        <div class="flex items-center gap-3">
          ${isActive
            ? `<span class="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>`
            : `<span class="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>`
          }
          <div>
            <p class="font-bold text-slate-800 text-xs">${win.quarter}</p>
            <p class="text-slate-500 text-xs">${startFmt} → ${endFmt}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="toggleUserWindow('${win.id}', ${isActive})"
            class="px-3 py-1 text-xs font-bold rounded-lg transition-colors ${isActive
              ? 'bg-slate-200 hover:bg-slate-300 text-slate-600'
              : 'bg-green-600 hover:bg-green-700 text-white'}">
            ${isActive ? '⏸ Pause' : '▶ Enable'}
          </button>
          <button onclick="deleteUserWindow('${win.id}', '${email}')"
            class="px-2 py-1 text-xs font-bold rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors">
            🗑
          </button>
        </div>
      `;
      container.appendChild(row);
    });
  });
});

// ── Postponement Requests Table ───────────────────────────────────────────────

const tableBody    = document.getElementById('requests-table-body');
const totalCount   = document.getElementById('stat-total');
const pendingCount = document.getElementById('stat-pending');
const approvedCount= document.getElementById('stat-approved');
const rejectedCount= document.getElementById('stat-rejected');

async function updateStatus(id, status) {
  try { await update(ref(db, `postponements/${id}`), { status }); }
  catch (e) { alert('Update failed: ' + e.message); }
}
window.approveRequest = id => updateStatus(id, 'APPROVED');
window.rejectRequest  = id => updateStatus(id, 'REJECTED');
window.setPending     = id => updateStatus(id, 'PENDING');

onValue(ref(db, 'postponements'), (snap) => {
  tableBody.innerHTML = '';
  const data = snap.val();
  if (!data) {
    tableBody.innerHTML = `<tr><td colspan="8" class="p-10 text-center text-slate-400 italic">No postponement requests yet.</td></tr>`;
    [totalCount, pendingCount, approvedCount, rejectedCount].forEach(el => { if(el) el.textContent = '0'; });
    return;
  }

  const requests = Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a,b) => b.createdAt - a.createdAt);
  if (totalCount)    totalCount.textContent    = requests.length;
  if (pendingCount)  pendingCount.textContent  = requests.filter(r => r.status === 'PENDING').length;
  if (approvedCount) approvedCount.textContent = requests.filter(r => r.status === 'APPROVED').length;
  if (rejectedCount) rejectedCount.textContent = requests.filter(r => r.status === 'REJECTED').length;

  requests.forEach(req => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0";

    const submitDate   = req.createdAt ? new Date(req.createdAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }) : 'N/A';
    const originalDate = req.originalClassDate
      ? new Date(req.originalClassDate).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })
      : `<span class="text-slate-400 italic text-xs">N/A</span>`;
    const newDate = req.postponeDate
      ? new Date(req.postponeDate).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })
      : `<span class="text-slate-400 italic text-xs">Cancel</span>`;

    const typeBadge = req.type === 'cancel'
      ? `<span class="inline-flex px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">✕ Cancel</span>`
      : `<span class="inline-flex px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">↷ Postpone</span>`;

    const quarterBadge = req.windowLabel
      ? `<span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">${req.windowLabel}</span>`
      : `<span class="text-slate-400 text-xs">—</span>`;

    let statusBadge = `<span class="inline-flex px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">⏳ PENDING</span>`;
    if (req.status === 'APPROVED') statusBadge = `<span class="inline-flex px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">✓ APPROVED</span>`;
    if (req.status === 'REJECTED') statusBadge = `<span class="inline-flex px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">✗ REJECTED</span>`;

    const actionBtns = req.status === 'PENDING'
      ? `<div class="flex gap-2">
           <button onclick="approveRequest('${req.id}')" class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg">✓ Approve</button>
           <button onclick="rejectRequest('${req.id}')"  class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg">✗ Reject</button>
         </div>`
      : `<button onclick="setPending('${req.id}')" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-semibold rounded-lg">↩ Reset</button>`;

    tr.innerHTML = `
      <td class="p-4">${typeBadge}</td>
      <td class="p-4 font-semibold text-slate-900 text-sm">${req.email || '—'}</td>
      <td class="p-4">${quarterBadge}</td>
      <td class="p-4 text-slate-600 text-sm">${originalDate}</td>
      <td class="p-4 text-slate-700 text-sm font-medium">${newDate}</td>
      <td class="p-4 text-slate-600 text-sm max-w-[160px] truncate" title="${req.reason || ''}">${req.reason || '—'}</td>
      <td class="p-4 text-slate-400 text-xs">${submitDate}</td>
      <td class="p-4">${statusBadge}</td>
      <td class="p-4">${actionBtns}</td>
    `;
    tableBody.appendChild(tr);
  });
});
