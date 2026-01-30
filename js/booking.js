const form = document.getElementById("bookingForm");
const statusMessage = document.getElementById("statusMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const bookingData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    service: document.getElementById("service").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
  };

  // Send email to barber
  emailjs.send(
    "YOUR_SERVICE_ID",
    "BARBER_TEMPLATE_ID",
    bookingData
  );

  // Send email to client
  emailjs.send(
    "YOUR_SERVICE_ID",
    "CLIENT_TEMPLATE_ID",
    bookingData
  );

  statusMessage.textContent =
    "Request sent! You’ll receive a confirmation email once approved.";

  form.reset();
});
