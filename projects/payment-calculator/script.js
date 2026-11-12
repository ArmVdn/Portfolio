const form = document.getElementById("comparison-form");
const inputs = [...form.querySelectorAll("input")];
const periodInput = document.getElementById("period-months");
const results = document.getElementById("comparison-results");
const feedback = document.getElementById("form-feedback");

const currency = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

const number = new Intl.NumberFormat("nl-NL", {
  maximumFractionDigits: 2,
});

// Toon een foutmelding direct onder het invoerveld.
function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);

  input.setCustomValidity(message);
  error.textContent = message;
  error.hidden = !message;

  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

// Controleer de ingevulde waarde.
function validateInput(input) {
  input.setCustomValidity("");

  const value = input.valueAsNumber;
  const wholeMonths = input === periodInput || input.id.endsWith("free-months");

  let message = "";

  if (input.type === "text") {
    if (!input.value.trim()) {
      message = "Vul een naam voor het abonnement in.";
    } else if (input.value.length > 60) {
      message = "Gebruik maximaal 60 tekens.";
    }
  } else if (input.validity.badInput) {
    message = "Vul een geldig getal in.";
  } else if (input.validity.valueMissing) {
    message = "Vul dit veld in.";
  } else if (input.validity.rangeUnderflow) {
    message =
      input === periodInput
        ? "Kies een periode van minimaal 1 maand."
        : "Vul een getal van 0 of hoger in.";
  } else if (input.validity.rangeOverflow) {
    message = input.id.endsWith("discount")
      ? "De korting mag maximaal 100% zijn."
      : "Gratis maanden mogen niet meer zijn dan de vergelijkingsperiode.";
  } else if (input.validity.stepMismatch) {
    message = wholeMonths
      ? "Vul een heel aantal maanden in."
      : "Gebruik maximaal twee cijfers achter de komma.";
  } else if (
    input.type === "number" &&
    !Number.isSafeInteger(wholeMonths ? value : Math.round(value * 100))
  ) {
    message = "Dit getal is te groot. Kies een kleinere waarde.";
  }

  setError(input, message);
  return !message;
}

// Bereken een abonnement met bedragen in centen.
function calculatePlan(key, months) {
  const field = (name) => document.getElementById(`plan-${key}-${name}`);

  const price = Math.round(field("price").valueAsNumber * 100);
  const discount = Math.round(field("discount").valueAsNumber * 100);
  const fees = Math.round(field("fees").valueAsNumber * 100);
  const freeMonths = field("free-months").valueAsNumber;

  const paidMonths = months - freeMonths;
  const gross = paidMonths * price;
  const weighted = gross * (10000 - discount);
  const total = Math.round(weighted / 10000) + fees;

  if (![gross, weighted, total].every(Number.isSafeInteger)) {
    setError(
      field("price"),
      "Deze combinatie is te groot om nauwkeurig te berekenen.",
    );
    return null;
  }

  return {
    key,
    name: field("name").value.trim(),
    total,
    average: total / months / 100,
    paidMonths,
    freeMonths,
    discount: discount / 100,
    fees,
  };
}

// Vul de resultaatkaart.
function showPlan(plan, cheapest) {
  const write = (name, value) => {
    document.getElementById(`result-${plan.key}-${name}`).textContent = value;
  };

  write("name", plan.name);
  write("total", currency.format(plan.total / 100));
  write("average", currency.format(plan.average));
  write("paid-months", number.format(plan.paidMonths));
  write("free-months", number.format(plan.freeMonths));
  write("discount", `${number.format(plan.discount)}%`);
  write("fees", currency.format(plan.fees / 100));

  const isCheaper = plan.key === cheapest;

  document.getElementById(`result-${plan.key}-badge`).hidden = !isCheaper;

  document
    .getElementById(`result-${plan.key}-card`)
    .classList.toggle("is-cheaper", isCheaper);
}

// Controleer alle velden en werk de vergelijking bij.
function updateComparison() {
  const months = periodInput.valueAsNumber;

  for (const key of ["a", "b"]) {
    const freeInput = document.getElementById(`plan-${key}-free-months`);

    if (Number.isSafeInteger(months) && months >= 1) {
      freeInput.max = String(months);
    } else {
      freeInput.removeAttribute("max");
    }
  }

  const valid = inputs.map(validateInput).every(Boolean);

  const plans = valid
    ? ["a", "b"].map((key) => calculatePlan(key, months))
    : [];

  if (!valid || plans.some((plan) => !plan)) {
    results.hidden = true;
    feedback.textContent = "Controleer de gemarkeerde velden.";
    return false;
  }

  const [a, b] = plans;

  const cheapest = a.total === b.total ? null : a.total < b.total ? "a" : "b";

  showPlan(a, cheapest);
  showPlan(b, cheapest);

  const period = `${number.format(months)} ${months === 1 ? "maand" : "maanden"}`;

  let summary;

  if (cheapest === null) {
    summary =
      `Beide abonnementen kosten over ${period} evenveel: ` +
      `${currency.format(a.total / 100)}.`;
  } else {
    const cheaper = cheapest === "a" ? a : b;
    const other = cheapest === "a" ? b : a;

    const saving = currency.format((other.total - cheaper.total) / 100);

    summary =
      `${cheaper.name} kost over ${period} ` +
      `${saving} minder dan ${other.name}.`;
  }

  document.getElementById("comparison-summary").textContent = summary;

  feedback.textContent = "";
  results.hidden = false;

  return true;
}

// Werk resultaten bij tijdens het invullen.
form.addEventListener("input", updateComparison);

// Behoud ook de foutmelding van de browser.
form.addEventListener("invalid", updateComparison, true);

// Ga na het vergelijken naar de resultaten.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (updateComparison()) {
    document.getElementById("results-title").focus();
  }
});

// Herstel de oorspronkelijke voorbeeldwaarden.
document.getElementById("reset-comparison").addEventListener("click", () => {
  form.reset();
  updateComparison();
  periodInput.focus();
});

// Toon het voorbeeld en activeer de knoppen.
updateComparison();

document.getElementById("compare-button").disabled = false;
document.getElementById("reset-comparison").disabled = false;
