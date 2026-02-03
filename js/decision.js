// decision.js (accept.html + deny.html)
// We no longer send emails from the browser.
// The Cloudflare Worker sends emails securely.

document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("statusMessage");

  if (!statusEl) return;

  const page = window.location.pathname.toLowerCase();

  if (page.includes("accept")) {
    statusEl.textContent = "✅ Appointment approved. The client has been notified.";
    statusEl.style.color = "#7CFC00";
  } else if (page.includes("deny")) {
    statusEl.textContent = "❌ Appointment denied. The client has been notified.";
    statusEl.style.color = "#ff6b6b";
  } else {
    statusEl.textContent = "✅ Updated.";
    statusEl.style.color = "#7CFC00";
  }
});