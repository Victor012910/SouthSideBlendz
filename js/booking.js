// booking.js — SouthSideBlendz

const form = document.getElementById("booking-form");
const statusMessage = document.getElementById("statusMessage");

const timeSelect = document.getElementById("appointment_time");
const feeNote = document.getElementById("feeNote");

// Every day: 3:00 PM → 11:00 PM in 30-min steps
const START_MINUTES = 15 * 60; // 3:00 PM
const END_MINUTES = 23 * 60;   // 11:00 PM
const STEP_MINUTES = 30;

// Late fee starts AT 9:00 PM (9:00 and later)
const LATE_FEE_START_MINUTES = 21 * 60; // 9:00 PM

function formatTimeLabel(totalMinutes) {
  const hour24 = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;

  const mm = mins === 0 ? "00" : String(mins);
  return `${hour12}:${mm} ${ampm}`;
}

function renderTimeSelect() {
  timeSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a time";
  timeSelect.appendChild(placeholder);

  for (let t = START_MINUTES; t <= END_MINUTES; t += STEP_MINUTES) {
    const label = formatTimeLabel(t);
    const isLate = t >= LATE_FEE_START_MINUTES;

    const opt = document.createElement("option");
    opt.value = isLate ? `${label} (+$5)` : label;
    opt.textContent = isLate ? `${label} (+$5 late fee)` : label;

    timeSelect.appendChild(opt);
  }

  feeNote.textContent = "";
}

function updateFeeNote() {
  const v = timeSelect.value || "";
  if (v.includes("(+$5)")) {
    feeNote.textContent =
      "Late fee applies: +$5 for appointments at/after 9:00 PM.";
    feeNote.style.color = "#ef4444"; // red
    feeNote.style.fontWeight = "600";
  } else {
    feeNote.textContent = "";
    feeNote.style.color = "";
    feeNote.style.fontWeight = "";
  }
}

// Populate times on load
renderTimeSelect();

// Update fee note when time changes
timeSelect.addEventListener("change", updateFeeNote);

// Submit to Worker
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusMessage.textContent = "Sending request...";
  statusMessage.style.color = "#bbbbbb";

  const bookingData = {
    client_name: document.getElementById("client_name").value.trim(),
    client_email: document.getElementById("client_email").value.trim(),
    service: document.getElementById("service").value,
    date: document.getElementById("appointment_date").value,
    time: document.getElementById("appointment_time").value,
    notes: document.getElementById("notes").value.trim(),
  };

  try {
    const res = await fetch("https://southsideblendz-secure.victor0129hernandez.workers.dev/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 429) {
      statusMessage.textContent =
        data.error || "Too many requests. Please wait 30 minutes and try again.";
      statusMessage.style.color = "#ff6b6b";
      return;
    }

    if (!res.ok) {
      statusMessage.textContent =
        data.error || "Something went wrong. Please try again.";
      statusMessage.style.color = "#ff6b6b";
      return;
    }

    statusMessage.textContent =
      "Request sent! You’ll get an email once it’s accepted or denied.";
    statusMessage.style.color = "#22c55e";

    form.reset();
    renderTimeSelect();
  } catch (err) {
    statusMessage.textContent = "Network error. Please try again.";
    statusMessage.style.color = "#ff6b6b";
  }
});