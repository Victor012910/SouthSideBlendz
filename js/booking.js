const form = document.getElementById("booking-form"); // matches your booking.html
const statusMessage = document.getElementById("statusMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusMessage.textContent = "Sending request...";
  statusMessage.style.color = "#bbbbbb";

  // Grab values from your booking.html IDs
  const bookingData = {
    client_name: document.getElementById("client_name").value.trim(),
    client_email: document.getElementById("client_email").value.trim(),
    service: document.getElementById("service").value,
    date: document.getElementById("appointment_date").value,
    time: document.getElementById("appointment_time").value,
    notes: document.getElementById("notes").value.trim(), // optional (worker ignores if not used)
  };

  try {
    const res = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json().catch(() => ({}));

    // Rate limited
    if (res.status === 429) {
      statusMessage.textContent =
        data.error || "Too many requests. Please wait 30 minutes and try again.";
      statusMessage.style.color = "#ff6b6b";
      return;
    }

    // Other error
    if (!res.ok) {
      statusMessage.textContent =
        data.error || "Something went wrong. Please try again.";
      statusMessage.style.color = "#ff6b6b";
      return;
    }

    // Success
    statusMessage.textContent =
      "Request sent! You’ll get an email once it’s accepted or denied.";
    statusMessage.style.color = "#22c55e";

    form.reset();
  } catch (err) {
    statusMessage.textContent = "Network error. Please try again.";
    statusMessage.style.color = "#ff6b6b";
  }
});