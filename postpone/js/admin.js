import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { FIREBASE_CONFIG } from "../../enrol/js/config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);

const tableBody = document.getElementById('requests-table-body');
const totalCount = document.getElementById('stat-total');
const pendingCount = document.getElementById('stat-pending');
const approvedCount = document.getElementById('stat-approved');
const rejectedCount = document.getElementById('stat-rejected');

// Update request status in Firebase
async function updateStatus(id, status) {
  const btn = document.getElementById(`action-${id}`);
  if (btn) btn.innerHTML = `<span class="animate-spin inline-block">↻</span> Updating...`;
  try {
    await update(ref(db, `postponements/${id}`), { status });
  } catch (err) {
    alert("Could not update status: " + err.message);
  }
}

// Expose to global scope for onclick handlers
window.approveRequest = (id) => updateStatus(id, 'APPROVED');
window.rejectRequest  = (id) => updateStatus(id, 'REJECTED');
window.setPending     = (id) => updateStatus(id, 'PENDING');

// Listen for real-time updates
const postponementsRef = ref(db, 'postponements');
onValue(postponementsRef, (snapshot) => {
  tableBody.innerHTML = '';

  const data = snapshot.val();

  if (!data) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="p-10 text-center text-slate-400 italic">
          No postponement requests yet.
        </td>
      </tr>
    `;
    updateStats(0, 0, 0, 0);
    return;
  }

  const requests = Object.keys(data).map(key => ({ id: key, ...data[key] }))
    .sort((a, b) => b.createdAt - a.createdAt);

  // Update stat counters
  const total    = requests.length;
  const pending  = requests.filter(r => r.status === 'PENDING').length;
  const approved = requests.filter(r => r.status === 'APPROVED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;
  updateStats(total, pending, approved, rejected);

  requests.forEach(req => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0";

    const submitDate = req.createdAt ? new Date(req.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';
    const originalDate = req.originalClassDate
      ? new Date(req.originalClassDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      : `<span class="text-slate-400 italic text-xs">N/A</span>`;
    const requestedDate = req.postponeDate
      ? new Date(req.postponeDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      : `<span class="text-slate-400 italic text-xs">No date (Cancel)</span>`;
    const quarterBadge = req.quarter
      ? `<span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">${req.quarter}</span>`
      : `<span class="text-slate-400 text-xs italic">—</span>`;

    // Type badge
    const isCancellation = req.type === 'cancel';
    const typeBadge = isCancellation
      ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">✕ Cancel</span>`
      : `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">↷ Postpone</span>`;

    // Status badge
    let statusBadge = `<span class="inline-flex px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">⏳ PENDING</span>`;
    if (req.status === 'APPROVED') statusBadge = `<span class="inline-flex px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">✓ APPROVED</span>`;
    if (req.status === 'REJECTED') statusBadge = `<span class="inline-flex px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">✗ REJECTED</span>`;

    // Action buttons
    let actionBtns = '';
    if (req.status === 'PENDING') {
      actionBtns = `
        <div class="flex gap-2" id="action-${req.id}">
          <button onclick="approveRequest('${req.id}')"
            class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
            ✓ Approve
          </button>
          <button onclick="rejectRequest('${req.id}')"
            class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
            ✗ Reject
          </button>
        </div>`;
    } else {
      actionBtns = `
        <div id="action-${req.id}">
          <button onclick="setPending('${req.id}')"
            class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-semibold rounded-lg transition-colors">
            ↩ Reset
          </button>
        </div>`;
    }

    tr.innerHTML = `
      <td class="p-4">${typeBadge}</td>
      <td class="p-4 font-semibold text-slate-900 text-sm">${req.email || '—'}</td>
      <td class="p-4 text-slate-600 text-sm">${originalDate}</td>
      <td class="p-4 text-slate-700 text-sm font-medium">${requestedDate}</td>
      <td class="p-4">${quarterBadge}</td>
      <td class="p-4 text-slate-600 text-sm max-w-[180px] truncate" title="${req.reason || ''}">${req.reason || '—'}</td>
      <td class="p-4 text-slate-400 text-xs">${submitDate}</td>
      <td class="p-4">${statusBadge}</td>
      <td class="p-4">${actionBtns}</td>
    `;

    tableBody.appendChild(tr);
  });
});

function updateStats(total, pending, approved, rejected) {
  if (totalCount)    totalCount.textContent    = total;
  if (pendingCount)  pendingCount.textContent  = pending;
  if (approvedCount) approvedCount.textContent = approved;
  if (rejectedCount) rejectedCount.textContent = rejected;
}
