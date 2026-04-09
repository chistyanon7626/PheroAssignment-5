const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
const container = document.getElementById("container");
const spinner = document.getElementById("spinner");
let allIssues = [];

// 1. Initial Load
window.onload = async () => {
    if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = "login.html";
        return;
    }
    await loadIssues();
};

// 2. Fetch Data
async function loadIssues() {
    spinner.classList.remove("hidden");
    try {
        const res = await fetch(`${API_BASE}/issues`);
        const data = await res.json();
        allIssues = data.data || [];
        showAll(); 
    } catch (err) {
        console.error("Fetch Error:", err);
    }
    spinner.classList.add("hidden");
}

// 3. Counter Logic
function updateStats(issues) {
    const counterEl = document.getElementById("issueCounter");
    if (counterEl) counterEl.innerText = issues.length;
}

// 4. Cards
function renderIssues(issues) {
    container.innerHTML = "";
    
    issues.forEach((issue) => {
       
        const statusBorder = issue.status === "open" ? "border-[#00A96E]" : "border-[#A855F7]";
        
       
        const priority = (issue.priority || "low").toLowerCase();
        let priorityColor = "";
        if (priority === "high") priorityColor = "badge-error text-white";
        else if (priority === "medium") priorityColor = "badge-warning text-white";
        else priorityColor = "badge-accent text-white";

       
        const rawLabels = issue.label || issue.labels || [];
        const labelsArray = Array.isArray(rawLabels) ? (Array.isArray(rawLabels) ? rawLabels : [rawLabels]) : [];
        
        const labelsHTML = labelsArray
            .filter(l => l && l.trim() !== "")
            .map(l => {
                const text = l.toUpperCase();
                let colors = "bg-slate-50 text-slate-600 border-slate-200"; 
                
                if (text === "BUG") colors = "bg-red-50 text-red-600 border-red-200";
                if (text === "HELP WANTED") colors = "bg-amber-50 text-amber-600 border-amber-200";
                if (text === "ENHANCEMENT") colors = "bg-blue-50 text-blue-600 border-blue-200";
                
                return `<div class="badge ${colors} text-[9px] font-bold py-1 px-2 h-auto border rounded-md uppercase">${text}</div>`;
            }).join("");

        const card = document.createElement("div");
       
        card.className = `card bg-white shadow-sm border-t-4 ${statusBorder} cursor-pointer hover:shadow-md transition-all rounded-xl font-geist`;
        
        card.innerHTML = `
            <div class="p-5">
                <div class="flex justify-between items-center mb-4">
                    <img src="./assets/${issue.status === "open" ? "Open-Status.png" : "Closed- Status .png"}" class="h-5 w-auto" />
                    <span class="badge ${priorityColor} text-[10px] font-bold border-none px-3 uppercase">
                        ${priority}
                    </span>
                </div>
                
                <h2 class="font-bold text-gray-800 line-clamp-1 mb-2 text-lg">${issue.title}</h2>
                
                <div class="flex gap-2 mb-4 flex-wrap">
                    ${labelsHTML}
                </div>

                <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">${issue.description}</p>
                
                            <div class="mt-auto pt-4 border-t border-gray-100 flex flex-col  gap-2 text-[10px] text-gray-700">
                                <span class="font-medium">#${issue.id} by ${issue.author}</span>
                                <span class="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    ${new Date(issue.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div> `;
        
        card.onclick = () => openModal(issue);
        container.appendChild(card);
    });
}
// 5. Modal Logic 
function openModal(issue) {
    const modal = document.getElementById("my_modal");
    const content = document.getElementById("modal-content");

    const isOpened = issue.status === "open";
    const statusText = isOpened ? "Opened" : "Closed"; 
    const statusBadge = isOpened ? "badge-success" : "badge-secondary";
    
    const priority = (issue.priority || "low").toLowerCase();
    const priorityClass = priority === "high" ? "badge-error" : priority === "medium" ? "badge-warning" : "badge-accent";

    const labels = Array.isArray(issue.label) ? issue.label : [issue.label];
    const labelsHTML = labels
        .filter(l => l)
        .map(l => `<div class="badge badge-soft border-current text-[10px]">${l.toUpperCase()}</div>`)
        .join("");

            content.innerHTML = `
                <h3 class="text-lg font-bold text-gray-800">${issue.title}</h3>
                
            <div class="flex items-center gap-4 py-4">
            <div class="badge ${statusBadge}">${statusText}</div>

    <div class="flex items-center gap-2 text-sm text-gray-500"> 
        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
        <p>Opened by <span class="font-medium text-gray-700">${issue.author}</span></p>
        
        <span class="w-2 h-2 bg-gray-400 rounded-full ml-2"></span>
        <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
          </div> 
          </div>

        <div class="flex gap-4 py-4">
            ${labelsHTML}
        </div>

        <p class="text-[#64748B] text-sm">
            ${issue.description || "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior."}
        </p>

        <div class="flex justify-between items-center mt-4 px-4 py-2 bg-[#F8FAFC] rounded-lg">
            <div class="mx-2">
                <p class="text-xs text-gray-400">Assignee:</p>
                <p class="text-sm font-bold">${issue.author}</p>
            </div>
            <div class="text-right my-2">
                <p class="text-xs text-gray-400">Priority:</p>
                <div class="badge ${priorityClass} text-white">${priority.toUpperCase()}</div>
            </div>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-primary">Close</button>
            </form>
        </div>
    `;

    modal.showModal();
}

// 6. Tab Controls
function showAll() { updateTab('allBtn', allIssues); }
function showOpen() { updateTab('openBtn', allIssues.filter(i => i.status === 'open')); }
function showClosed() { updateTab('closedBtn', allIssues.filter(i => i.status === 'closed')); }

function updateTab(btnId, data) {
    ["allBtn", "openBtn", "closedBtn"].forEach(id => {
        const b = document.getElementById(id);
        b.classList.remove("bg-[#4A00FF]", "text-white");
        b.classList.add("btn-outline");
    });
    document.getElementById(btnId).classList.add("bg-[#4A00FF]", "text-white");
    renderIssues(data);
    updateStats(data);
}

// 7. Search
async function searchIssues() {
    const q = document.getElementById("search").value.trim();
    if (!q) { showAll(); return; }
    spinner.classList.remove("hidden");
    try {
        const res = await fetch(`${API_BASE}/issues/search?q=${q}`);
        const json = await res.json();
        renderIssues(json.data || []);
        updateStats(json.data || []);
    } catch (e) { console.error(e); }
    spinner.classList.add("hidden");
}