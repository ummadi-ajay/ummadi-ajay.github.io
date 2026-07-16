import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { FIREBASE_CONFIG } from "../../enrol/js/config.js";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);

const tableBody = document.getElementById('requests-table-body');

// Listen for real-time updates on the postponements node
const postponementsRef = ref(db, 'postponements');
onValue(postponementsRef, (snapshot) => {
  tableBody.innerHTML = ''; // Clear loading state
  
  const data = snapshot.val();
  
  if (!data) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="p-8 text-center text-slate-500 italic">
          No postponement requests found.
        </td>
      </tr>
    `;
    return;
  }
  
  // Convert object to array, add keys, and sort by newest first
  const requests = Object.keys(data).map(key => ({
    id: key,
    ...data[key]
  })).sort((a, b) => b.createdAt - a.createdAt);
  
  requests.forEach(req => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50 transition-colors";
    
    // Format date string
    const submitDate = req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A';
    const requestedDate = req.postponeDate
      ? new Date(req.postponeDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
      : '<span class="text-slate-400 italic">N/A (Cancellation)</span>';
    
    // Type badge
    const isCancellation = req.type === 'cancel';
    const typeBadge = isCancellation
      ? `<span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1 w-fit"><span class="text-xs">✕</span> Cancel</span>`
      : `<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200 flex items-center gap-1 w-fit"><span class="text-xs">↷</span> Postpone</span>`;
    
    // Status badge coloring
    let statusBadge = `<span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">PENDING</span>`;
    if (req.status === 'APPROVED') statusBadge = `<span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">APPROVED</span>`;
    if (req.status === 'REJECTED') statusBadge = `<span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">REJECTED</span>`;

    tr.innerHTML = `
      <td class="p-4">${typeBadge}</td>
      <td class="p-4 font-medium text-slate-900">${req.email}</td>
      <td class="p-4 text-slate-700 font-semibold">${requestedDate}</td>
      <td class="p-4 text-slate-600 max-w-xs truncate" title="${req.reason}">${req.reason}</td>
      <td class="p-4 text-slate-500 text-xs">${submitDate}</td>
      <td class="p-4">${statusBadge}</td>
    `;
    
    tableBody.appendChild(tr);
  });
});
