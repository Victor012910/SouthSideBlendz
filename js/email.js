const form = document.getElementById("booking-form");
const dateInput = document.getElementById("appointment_date");
const timeSelect = document.getElementById("appointment_time");
const statusMessage = document.getElementById("statusMessage");
const feeNote = document.getElementById("feeNote");
const acceptLinkInput = document.getElementById("accept_link");
const denyLinkInput = document.getElementById("deny_link");

/**
 * Time options: 3:00 PM → 11:00 PM (30-min slots)
 * After 9 PM: mark (+$5)
 */
function buildTimeOptions() {
  timeSelect.innerHTML = `<option value="">Select a time</option>`;
  feeNote.textContent = "";

  if (!dateInput.value) {
    timeSelect.innerHTML = `<option value="">Select a time (pick a date first)</option>`;
    return;
  }

  const times = [
    "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM",
    "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM",
    "9:00 PM", "9:30 PM",
    "10:00 PM", "10:30 PM",
    "11:00 PM"
  ];

  times.forEach((t) => {
    const isLate = t.startsWith("9:") || t.startsWith("10:") || t.startsWith("11:");
    const label = isLate ? `${t} (+$5)` : t;

    const opt = document.createElement("option");
    opt.value = label;
    opt.textContent = label;
    timeSelect.appendChild(opt);
  });
}

/**
 * Shows a note if they choose a late-fee time
 */
function updateFeeNote() {
  const v = timeSelect.value;
  if (!v) {
    feeNote.textContent = "";
    return;
  }

  if (v.includes("9:") || v.includes("10:") || v.includes("11:")) {
    feeNote.textContent = "⚠️ Appointments after 9:00 PM include a $5 late fee.";
    feeNote.style.color = "#ff6b6b";
  } else {
    feeNote.textContent = "";
  }
}

/**
 * Builds the base URL for accept/deny links.
 * This handles GitHub Pages pathing:
 * - https://username.github.io/repo/
 * - local dev
 * - normal domains
 */
function getBaseUrl() {
  const { origin, pathname } = window.location;

  // If on GitHub Pages, keep the repo path (/REPO/) so links work.
  // Example pathname: /SouthSideBlendz/booking.html
  const parts = pathname.split("/").filter(Boolean);

  // If we have at least 1 path segment and we're on github.io, treat first segment as repo name.
  const isGithubPages = origin.includes("github.io") && parts.length >= 1;

  if (isGithubPages) {
    return `${origin}/${parts[0]}`;
  }

  // Otherwise, normal hosting
  return origin;
}

/**
 * Stores Accept/Deny links into hidden inputs (so EmailJS template can print them)
 */
function setDecisionLinks() {
  const baseUrl = getBaseUrl();

  const params = new URLSearchParams({
    client_name: document.getElementById("client_name").value.trim(),
    client_email: document.getElementById("client_email").value.trim(),
    service: document.getElementById("service").value,
    appointment_date: document.getElementById("appointment_date").value,
    appointment_time: document.getElementById("appointment_time").value
  });

  acceptLinkInput.value = `${baseUrl}/accept.html?${params.toString()}`;
  denyLinkInput.value = `${baseUrl}/deny.html?${params.toString()}`;
}

// Events
dateInput.addEventListener("change", buildTimeOptions);
timeSelect.addEventListener("change", updateFeeNote);

// Submit handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  statusMessage.textContent = "Sending request...";
  statusMessage.style.color = "#7CFC00";

  // Build Accept/Deny URLs and inject into hidden fields
  setDecisionLinks();

  emailjs.sendForm(
    "service_bkl0x7d",
    "template_it12o9h",
    form
  )
  .then(() => {
    statusMessage.textContent =
      "✅ Request sent! You’ll get an email once it’s accepted or denied.";
    statusMessage.style.color = "#7CFC00";

    form.reset();
    timeSelect.innerHTML = `<option value="">Select a time (pick a date first)</option>`;
    feeNote.textContent = "";
  })
  .catch((err) => {
    console.error("EmailJS error:", err);
    statusMessage.textContent = "❌ Something went wrong. Please try again.";
    statusMessage.style.color = "#ff6b6b";
  });
});

// Init
buildTimeOptions();