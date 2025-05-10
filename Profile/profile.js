const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  alert("Please log in first.");
  window.location.href = "../Login/login.html";
}

const form = document.getElementById("profileForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const userRoleElement = document.getElementById("userRole");
const usernamePreview = document.getElementById("usernamePreview");
const notification = document.getElementById("notification");

usernameInput.value = currentUser.username;
userRoleElement.textContent = currentUser.role;

usernameInput.addEventListener("input", () => {
  const newUsername = usernameInput.value.trim();
  usernamePreview.textContent = newUsername
    ? `New username will be: ${newUsername}`
    : "";
});

function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newUsername = usernameInput.value.trim();
  const newPassword = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (newUsername !== currentUser.username) {
    try {
      const res = await fetch(`http://localhost:3000/users?username=${newUsername}`);
      const data = await res.json();
      if (data.length > 0) {
        showNotification("Username already exists!", "error");
        return;
      }
    } catch (error) {
      console.error("Error checking username:", error);
      showNotification("Error checking username. Please try again.", "error");
      return;
    }
  }

  if (newPassword) {
    if (newPassword.length < 8) {
      showNotification("Password must be at least 8 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match!", "error");
      return;
    }
  }

  const updatedUser = {
    username: newUsername,
    ...(newPassword && { password: newPassword }), 
  };

  try {
    const res = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    if (!res.ok) throw new Error("Failed to update profile");

    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, ...updatedUser }));

    showNotification("Profile updated successfully!", "success");
    passwordInput.value = "";
    confirmPasswordInput.value = "";
  } catch (error) {
    console.error("Error updating profile:", error);
    showNotification("Failed to update profile. Please try again.", "error");
  }
});