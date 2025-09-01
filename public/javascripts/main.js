document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("login-btn");

  try {
    // get login status
    const res = await fetch("/login/status", {
      credentials: "include" // send cookies!
    });
    const data = await res.json();

    if (data.isAuthenticated) {
      console.log("User is logged in via session");
      loginBtn.textContent = "Logout";
      loginBtn.href = "/login/logout";
    } else {
      console.log("User is NOT logged in");
      loginBtn.textContent = "Login";
      loginBtn.href = "/login/authorize";
    }
  } catch (err) {
    console.error("Error checking login status:", err);
  }
  
});