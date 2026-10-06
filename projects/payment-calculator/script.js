const form = document.getElementById("payment-form");
const resultName = document.getElementById("result-name");
const resultTotal = document.getElementById("result-total");
const resultDetails = document.getElementById("result-details");

function calculatePayment(event) {
  event?.preventDefault();

  const data = new FormData(form);
  const name = data.get("name").toString().trim() || "Customer";
  const price = Number(data.get("price"));
  const months = Number(data.get("months"));
  const discount = Number(data.get("discount"));
  const referrals = Number(data.get("referrals"));

  const freeMonths = Math.floor(referrals / 3);
  const paidMonths = Math.max(months - freeMonths, 0);
  const discountFactor = (100 - discount) / 100;
  const total = paidMonths * price * discountFactor;

  resultName.textContent = `${name} pays`;
  resultTotal.textContent = `EUR ${total.toFixed(2)}`;
  resultDetails.textContent = `${freeMonths} free month${freeMonths === 1 ? "" : "s"}, ${paidMonths} paid month${paidMonths === 1 ? "" : "s"}, ${discount}% discount.`;
}

form.addEventListener("submit", calculatePayment);
form.addEventListener("input", calculatePayment);
calculatePayment();
