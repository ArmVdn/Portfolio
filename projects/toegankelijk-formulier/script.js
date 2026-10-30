const form = document.getElementById("workshop-form");
const statusMessage = document.getElementById("form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  statusMessage.textContent =
    "De invoer is gecontroleerd. Dit oefenformulier verstuurt geen aanmelding.";
});
