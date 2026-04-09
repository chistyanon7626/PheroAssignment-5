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
// 4. Render Grid Cards
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
                
                <div class="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                    <span class="font-medium">#${issue.id} by ${issue.author}</span>
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ${new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        `;
        
        card.onclick = () => openModal(issue);
        container.appendChild(card);
    });
}
