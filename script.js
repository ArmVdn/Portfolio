const html = document.documentElement;
const body = document.body;
const links = document.querySelectorAll(".nav-links a");
const increaseButton = document.getElementById("increase-text");
const decreaseButton = document.getElementById("decrease-text");
const contrastButton = document.getElementById("contrast-btn");
const openCertificateButton = document.getElementById("open-cert");
const certificateModal = document.getElementById("cert-modal");
const closeCertificateButton = document.getElementById("close-cert");

let currentFontSize = Number(localStorage.getItem("fontSize")) || 16;

function applyFontSize() {
  body.style.fontSize = `${currentFontSize}px`;
}

function openCertificate() {
  if (!certificateModal || !closeCertificateButton) {
    return;
  }

  certificateModal.style.display = "flex";
  certificateModal.setAttribute("aria-hidden", "false");
  closeCertificateButton.focus();
}

function closeCertificate() {
  if (!certificateModal || !openCertificateButton) {
    return;
  }

  certificateModal.style.display = "none";
  certificateModal.setAttribute("aria-hidden", "true");
  openCertificateButton.focus();
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((navLink) => navLink.classList.remove("active"));
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
  const isActive = body.classList.toggle("high-contrast");
  localStorage.setItem("contrast", isActive ? "on" : "off");
});

openCertificateButton?.addEventListener("click", openCertificate);
closeCertificateButton?.addEventListener("click", closeCertificate);

certificateModal?.addEventListener("click", (event) => {
  if (event.target === certificateModal) {
    closeCertificate();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    certificateModal?.getAttribute("aria-hidden") === "false"
  ) {
    closeCertificate();
  }
});
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
  if (event.target === profileModal) {
    closeProfile();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    profileModal?.getAttribute("aria-hidden") === "false"
  ) {
    closeProfile();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;

  if (profileModal?.getAttribute("aria-hidden") === "false") {
    event.preventDefault();
    closeProfileButton.focus();
  } else if (certificateModal?.getAttribute("aria-hidden") === "false") {
    event.preventDefault();
    closeCertificateButton.focus();
  }
});
