import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update, push, remove } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { FIREBASE_CONFIG } from "../../enrol/js/config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db  = getDatabase(app);

// ── Postponement Requests ─────────────────────────────────────────────────────

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

    const submitDate   = req.createdAt ? new Date(req.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';
    const originalDate = req.originalClassDate
      ? new Date(req.originalClassDate).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })
      : `<span class="text-slate-400 italic text-xs">N/A</span>`;
    const newDate = req.postponeDate
      ? new Date(req.postponeDate).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })
      : `<span class="text-slate-400 italic text-xs">No date (Cancel)</span>`;

    const typeBadge = req.type === 'cancel'
      ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">✕ Cancel</span>`
      : `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">↷ Postpone</span>`;

    let statusBadge = `<span class="inline-flex px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">⏳ PENDING</span>`;
    if (req.status === 'APPROVED') statusBadge = `<span class="inline-flex px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">✓ APPROVED</span>`;
    if (req.status === 'REJECTED') statusBadge = `<span class="inline-flex px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">✗ REJECTED</span>`;

    const actionBtns = req.status === 'PENDING'
      ? `<div class="flex gap-2">
           <button onclick="approveRequest('${req.id}')" class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors">✓ Approve</button>
           <button onclick="rejectRequest('${req.id}')"  class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">✗ Reject</button>
         </div>`
      : `<button onclick="setPending('${req.id}')" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-semibold rounded-lg transition-colors">↩ Reset</button>`;

    tr.innerHTML = `
      <td class="p-4">${typeBadge}</td>
      <td class="p-4 font-semibold text-slate-900 text-sm">${req.email || '—'}</td>
      <td class="p-4 text-slate-600 text-sm">${originalDate}</td>
      <td class="p-4 text-slate-700 text-sm font-medium">${newDate}</td>
      <td class="p-4 text-slate-600 text-sm max-w-[180px] truncate" title="${req.reason || ''}">${req.reason || '—'}</td>
      <td class="p-4 text-slate-400 text-xs">${submitDate}</td>
      <td class="p-4">${statusBadge}</td>
      <td class="p-4">${actionBtns}</td>
    `;
    tableBody.appendChild(tr);
  });
});

// ── Postponement Windows ──────────────────────────────────────────────────────

const windowsList = document.getElementById('windows-list');
const winMsg      = document.getElementById('win-msg');

// Save new window
window.saveWindow = async function() {
  const label = document.getElementById('win-label').value.trim();
  const start = document.getElementById('win-start').value;
  const end   = document.getElementById('win-end').value;

  if (!label || !start || !end) { alert('Please fill in all fields.'); return; }
  if (start > end) { alert('Start date must be before end date.'); return; }

  const btn = document.getElementById('win-save-btn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    await push(ref(db, 'postponement_windows'), {
      label, startDate: start, endDate: end,
      active: false,
      createdAt: Date.now()
    });
    document.getElementById('win-label').value = '';
    document.getElementById('win-start').value = '';
    document.getElementById('win-end').value   = '';
    showMsg('Window created!');
  } catch(e) { alert('Error: ' + e.message); }
  finally { btn.disabled = false; btn.innerHTML = '<span class="material-symbols-outlined text-sm">add_circle</span> Create Window'; }
};

// Toggle active state — only ONE window can be active at a time
window.toggleWindow = async function(id, currentlyActive, allIds) {
  // Deactivate all others first, then activate this one
  const updates = {};
  allIds.forEach(wid => { updates[`postponement_windows/${wid}/active`] = false; });
  if (!currentlyActive) updates[`postponement_windows/${id}/active`] = true;
  try { await update(ref(db), updates); }
  catch(e) { alert('Error: ' + e.message); }
};

window.deleteWindow = async function(id) {
  if (!confirm('Delete this window?')) return;
  try { await remove(ref(db, `postponement_windows/${id}`)); }
  catch(e) { alert('Error: ' + e.message); }
};

function showMsg(text) {
  winMsg.textContent = text;
  winMsg.classList.remove('hidden');
  setTimeout(() => winMsg.classList.add('hidden'), 3000);
}

// Listen to windows in real-time
onValue(ref(db, 'postponement_windows'), (snap) => {
  windowsList.innerHTML = '';
  const data = snap.val();
  if (!data) {
    windowsList.innerHTML = `<p class="text-xs text-slate-400 italic">No windows created yet.</p>`;
    return;
  }

  const allIds = Object.keys(data);
  const windows = allIds.map(k => ({ id: k, ...data[k] })).sort((a,b) => b.createdAt - a.createdAt);

  windows.forEach(win => {
    const isActive = win.active === true;
    const startFmt = new Date(win.startDate).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
    const endFmt   = new Date(win.endDate).toLocaleDateString('en-US',   { month:'long', day:'numeric', year:'numeric' });

    const div = document.createElement('div');
    div.className = `flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border mb-3 ${isActive ? 'window-active' : 'window-inactive'}`;
    div.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="mt-0.5">
          ${isActive
            ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-300">● ACTIVE</span>`
            : `<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold border border-slate-200">○ Inactive</span>`
          }
        </div>
        <div>
          <p class="font-bold text-slate-900 text-sm">${win.label}</p>
          <p class="text-xs text-slate-500 mt-0.5">
            <span class="material-symbols-outlined text-xs align-middle">calendar_month</span>
            ${startFmt} → ${endFmt}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="toggleWindow('${win.id}', ${isActive}, ${JSON.stringify(allIds)})"
          class="px-4 py-2 text-xs font-bold rounded-xl transition-colors ${isActive
            ? 'bg-slate-200 hover:bg-slate-300 text-slate-600'
            : 'bg-green-600 hover:bg-green-700 text-white'}">
          ${isActive ? '⏸ Deactivate' : '▶ Activate'}
        </button>
        <button onclick="deleteWindow('${win.id}')"
          class="px-3 py-2 text-xs font-bold rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors">
          🗑 Delete
        </button>
      </div>
    `;
    windowsList.appendChild(div);
  });
});
