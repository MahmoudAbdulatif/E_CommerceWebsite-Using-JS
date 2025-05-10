function logout() {
    localStorage.removeItem("currentUser");
    alert("You have been logged out.");
    window.location.href = "index.html";
  }