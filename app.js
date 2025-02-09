document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle
  const themeSwitch = document.getElementById("theme-switch");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", savedTheme);
  themeSwitch.checked = savedTheme === "dark";

  themeSwitch.addEventListener("change", () => {
    const theme = themeSwitch.checked ? "dark" : "light";
    body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  });
});

async function generatePlaylist() {
  const genre = document.getElementById("genre").value;
  const artist = document.getElementById("artist").value;
  const mood = document.getElementById("mood").value;

  const inputs = document.querySelectorAll(".form-input");
  inputs.forEach((input) => input.classList.remove("invalid"));

  if (!genre && !artist && !mood) {
    showError("Please share at least one preference with us");
    inputs.forEach((input) => input.classList.add("invalid"));
    return;
  }

  const btn = document.querySelector(".generate-btn");
  const spinner = document.querySelector(".spinner");
  const btnText = document.querySelector(".btn-text");

  try {
    btn.disabled = true;
    btnText.style.visibility = "hidden";
    spinner.style.display = "block";

    const dynamicUrl = getDynamicUrl();  // Call the function to get the dynamic URL

    const response = await fetch(dynamicUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genre, artist, mood }),
    });

    const textResponse = await response.text();
    const data = textResponse ? JSON.parse(textResponse) : {};

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    if (data.playlistUrl) {
      window.open(data.playlistUrl, "_blank");
    } else {
      showError("Unable to create playlist. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    showError(error.message);
  } finally {
    btn.disabled = false;
    btnText.style.visibility = "visible";
    spinner.style.display = "none";
  }
}

function showError(message) {
  const errorEl = document.createElement("div");
  errorEl.className = "error-message";
  errorEl.textContent = message;

  const container = document.querySelector(".container");
  container.insertBefore(errorEl, document.querySelector(".form-container"));

  setTimeout(() => errorEl.remove(), 5000);
}

// Dynamic URL generation function
function getDynamicUrl() {
  // Example: Change this logic as per your requirement
  const isProduction = window.location.hostname !== 'localhost';  // Check if it's production or local
  const baseUrl = isProduction ? 'https://your-production-url.com' : 'http://localhost:3000';
  return `${baseUrl}/generate-playlist`;  // Return the full dynamic URL
}
