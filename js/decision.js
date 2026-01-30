// Sends ACCEPT/DENY emails to the client when barber clicks a link.
const CLIENT_DECISION_TEMPLATE_ID = "template_n0zl0r8";

const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");

const params = new URLSearchParams(window.location.search);

const client_name = params.get("client_name") || "";
const client_email = params.get("client_email") || "";
const service = params.get("service") || "";
const appointment_date = params.get("appointment_date") || "";
const appointment_time = params.get("appointment_time") || "";

const isAccept = window.location.pathname.toLowerCase().includes("accept");

const subject = isAccept
  ? "Appointment Confirmed ✅ | SouthSideBlendz"
  : "Appointment Request Update | SouthSideBlendz";

const message = isAccept
  ? `Hey ${client_name},

Your appointment has been CONFIRMED ✅

Service: ${service}
Date: ${appointment_date}
Time: ${appointment_time}

Location: Danforth Hall
Phone: (281) 630-6056

When you arrive at Danforth Hall, text (281) 630-6056 and you’ll be let in.

— SouthSideBlendz`
  : `Hey ${client_name},

Sorry — your appointment request was DENIED.

Service: ${service}
Date: ${appointment_date}
Time: ${appointment_time}

Please submit another request with a different date or time and the barber will get back to you.

— SouthSideBlendz`;

emailjs
  .send("service_bkl0x7d", CLIENT_DECISION_TEMPLATE_ID, {
    to_email: client_email,
    subject: subject,
    message: message
  })
  .then(() => {
    resultTitle.textContent = isAccept ? "✅ Confirmation sent!" : "✅ Denial sent!";
    resultText.textContent = isAccept
      ? "The client has been emailed the confirmation details."
      : "The client has been emailed to request a different time/date.";
  })
  .catch((err) => {
    console.error("Decision EmailJS error:", err);
    resultTitle.textContent = "❌ Failed to send email";
    resultText.textContent =
      "Double-check the decision template To Email={{to_email}}, Subject={{subject}}, Body={{message}}.";
  });