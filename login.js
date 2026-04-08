 function login() {
      const user = document.getElementById("username").value.trim();
      const pass = document.getElementById("password").value.trim();
      const error = document.getElementById("error");

      // Check empty fields
      if (!user || !pass) {
        error.innerText = "Please fill in all fields!";
        return;
      }

      // Validate credentials
      if (user === "admin" && pass === "admin123") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";
      } else {
        error.innerText = "Invalid credentials!";
      }
    }

    // Optional: press Enter to login
    document.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        login();
      }
    });