const form = document.getElementById("booking-form");
const dateInput = document.getElementById("appointment_date");
const timeSelect = document.getElementById("appointment_time");
const statusMessage = document.getElementById("statusMessage");
const feeNote = document.getElementById("feeNote");

// 🔒 Secure backend (Cloudflare Worker)
const WORKER_URL = "https://southsideblendz-secure.victor0129hernandez.workers.dev";

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
    // NOTE: your site text says "after 9:00 PM" but this flags 9:00 PM as late.
    // If you want strictly after 9:00 PM, change this to: t.startsWith("9:30") || t.startsWith("10:") || t.startsWith("11:")
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

// Events
dateInput.addEventListener("change", buildTimeOptions);
timeSelect.addEventListener("change", updateFeeNote);

// Submit handler
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  statusMessage.textContent = "Sending request...";
  statusMessage.style.color = "#7CFC00";

  // Collect values (matching your booking.html input IDs)
  const client_name = document.getElementById("client_name").value.trim();
  const client_email = document.getElementById("client_email").value.trim();
  const service = document.getElementById("service").value;
  const appointment_date = document.getElementById("appointment_date").value;
  const appointment_time = document.getElementById("appointment_time").value;

  // Basic front-end validation
  if (!client_name || !client_email || !service || !appointment_date || !appointment_time) {
    statusMessage.textContent = "❌ Please fill out all fields.";
    statusMessage.style.color = "#ff6b6b";
    return;
  }

  // Worker expects keys: client_name, client_email, service, date, time
  const payload = {
    client_name,
    client_email,
    service,
    date: appointment_date,
    time: appointment_time
  };

  try {
    const res = await fetch(`${WORKER_URL}/api/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Request failed. Please try again.");
    }

    statusMessage.textContent =
      "✅ Request sent! You’ll get an email once it’s accepted or denied.";
    statusMessage.style.color = "#7CFC00";

    form.reset();
    timeSelect.innerHTML = `<option value="">Select a time (pick a date first)</option>`;
    feeNote.textContent = "";
  } catch (err) {
    console.error("Worker error:", err);
    statusMessage.textContent = "❌ Something went wrong. Please try again.";
    statusMessage.style.color = "#ff6b6b";
  }
});

// Init
buildTimeOptions();