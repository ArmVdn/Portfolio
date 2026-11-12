const body = document.body;
const links = document.querySelectorAll(".nav-links a");
const increaseButton = document.getElementById("increase-text");
const decreaseButton = document.getElementById("decrease-text");
const contrastButton = document.getElementById("contrast-btn");

let currentFontSize = Number(localStorage.getItem("fontSize")) || 16;

function applyFontSize() {
  body.style.fontSize = `${currentFontSize}px`;
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

if (localStorage.getItem("contrast") === "on") {
  body.classList.add("high-contrast");
}

applyFontSize();

increaseButton?.addEventListener("click", () => {
  currentFontSize = Math.min(currentFontSize + 2, 24);
  localStorage.setItem("fontSize", currentFontSize);
  applyFontSize();
});

decreaseButton?.addEventListener("click", () => {
  currentFontSize = Math.max(currentFontSize - 2, 14);
  localStorage.setItem("fontSize", currentFontSize);
  applyFontSize();
});

contrastButton?.addEventListener("click", () => {
  const active = body.classList.toggle("high-contrast");
  localStorage.setItem("contrast", active ? "on" : "off");
});

// Vier certificaten in dezelfde pop-up.
const certificates = [
  {
    image: "certificaat.jpg",
    alt: "Front-end Development-certificaat van Winc Academy voor Armine Vardanyan - Mnatsian",
    caption:
      "Front-end Development — Winc Academy. Afgerond op 12 september 2025.",
  },
  {
    image: "certificaten/deque-web-accessibility-testing-2021.png?v=2",
    alt: "Web Accessibility Testing-certificaat van Deque University voor Armine Vardanyan",
    caption:
      "Web Accessibility Testing: Basic Methods and Tools — Deque University. Afgerond op 13 december 2021.",
  },
  {
    image: "certificaten/deque-basic-pdf-accessibility-2021.png?v=2",
    alt: "Basic PDF Accessibility-certificaat van Deque University voor Armine Vardanyan",
    caption:
      "Basic PDF Accessibility 2.0 — Deque University. Afgerond op 19 november 2021.",
  },
  {
    image: "certificaten/deque-advanced-pdf-accessibility-2021.png?v=2",
    alt: "Advanced PDF Accessibility-certificaat van Deque University voor Armine Vardanyan",
    caption:
      "Advanced PDF Accessibility: Complex Tables and Forms — Deque University. Afgerond op 19 november 2021.",
  },
];

const certificateModal = document.getElementById("cert-modal");
const certificateImage = document.getElementById("cert-image");
const certificateCaption = document.getElementById("cert-caption");
const certificateCounter = document.getElementById("cert-counter");
const previousButton = document.getElementById("previous-cert");
const nextButton = document.getElementById("next-cert");
const closeCertificateButton = document.getElementById("close-cert");

let certificateIndex = 0;
let certificateOpener;
let previousOverflow = "";

function showCertificate(index) {
  certificateIndex = Math.max(0, Math.min(index, certificates.length - 1));

  const certificate = certificates[certificateIndex];

  certificateImage.src = certificate.image;
  certificateImage.alt = certificate.alt;
  certificateCaption.textContent = certificate.caption;

  certificateCounter.textContent = `Certificaat ${certificateIndex + 1} van ${certificates.length}`;

  previousButton.disabled = certificateIndex === 0;
  nextButton.disabled = certificateIndex === certificates.length - 1;

  if (document.activeElement === nextButton && nextButton.disabled) {
    previousButton.focus();
  } else if (
    document.activeElement === previousButton &&
    previousButton.disabled
  ) {
    nextButton.focus();
  }
}

function openCertificates(index, opener) {
  certificateOpener = opener;
  showCertificate(index);

  previousOverflow = body.style.overflow;
  certificateModal.showModal();
  body.style.overflow = "hidden";
  closeCertificateButton.focus();
}

document.getElementById("open-cert").addEventListener("click", (event) => {
  openCertificates(0, event.currentTarget);
});

document.querySelectorAll("[data-certificate]").forEach((button) => {
  button.addEventListener("click", (event) => {
    openCertificates(Number(button.dataset.certificate), event.currentTarget);
  });
});

previousButton.addEventListener("click", () => {
  showCertificate(certificateIndex - 1);
});

nextButton.addEventListener("click", () => {
  showCertificate(certificateIndex + 1);
});

closeCertificateButton.addEventListener("click", () => {
  certificateModal.close();
});

certificateModal.addEventListener("close", () => {
  body.style.overflow = previousOverflow;

  if (certificateOpener?.isConnected) {
    certificateOpener.focus();
  }
});

certificateModal.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();

    showCertificate(certificateIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});

certificateModal.addEventListener("click", (event) => {
  if (event.target !== certificateModal) return;

  const rect = certificateModal.getBoundingClientRect();

  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  ) {
    certificateModal.close();
  }
});

// De bestaande profielfoto-pop-up.
const openProfileButton = document.getElementById("open-profile");
const profileModal = document.getElementById("profile-modal");
const closeProfileButton = document.getElementById("close-profile");

function openProfile() {
  if (!profileModal || !closeProfileButton) return;

  profileModal.style.display = "flex";
  profileModal.setAttribute("aria-hidden", "false");
  closeProfileButton.focus();
}

function closeProfile() {
  if (!profileModal || !openProfileButton) return;

  profileModal.style.display = "none";
  profileModal.setAttribute("aria-hidden", "true");
  openProfileButton.focus();
}

openProfileButton?.addEventListener("click", openProfile);
closeProfileButton?.addEventListener("click", closeProfile);

profileModal?.addEventListener("click", (event) => {
  if (event.target === profileModal) closeProfile();
});

document.addEventListener("keydown", (event) => {
  if (profileModal?.getAttribute("aria-hidden") !== "false") return;

  if (event.key === "Escape") closeProfile();

  if (event.key === "Tab") {
    event.preventDefault();
    closeProfileButton.focus();
  }
});
