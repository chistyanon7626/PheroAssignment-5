const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
const container = document.getElementById("container");
const spinner = document.getElementById("spinner");
let allIssues = [];
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