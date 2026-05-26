let currentIndex = -1;

const barcodeOnlyToggle = document.getElementById("barcode_only_toggle");
const toggleText = document.getElementById("toggle_text");

barcodeOnlyToggle.addEventListener("change", () => {
  toggleText.textContent = barcodeOnlyToggle.checked
    ? "Solo código de barras"
    : "QR + Código de barras";
});

async function Create_Results() {
  currentIndex = -1;

  const textarea = document.getElementById("lista_guias");
  const container = document.getElementById("result_container");

  container.innerHTML = "";

  const codes = textarea.value
    .split("\n")
    .map(code => code.trim())
    .filter(code => code !== "");

  for (const code of codes) {
    await createCodeCard(code);
  }
}

function focusCard(index) {
  const cards = document.querySelectorAll(".code-card");

  if (cards.length === 0) return;

  if (index < 0) index = 0;
  if (index >= cards.length) index = cards.length - 1;

  currentIndex = index;

  const card = cards[currentIndex];

  card.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  card.style.boxShadow = "0 0 0 3px #ff8c42";

  setTimeout(() => {
    card.style.boxShadow = "";
  }, 500);
}

async function createCodeCard(code) {

  const container = document.getElementById("result_container");

  const barcodeOnly = document.getElementById("barcode_only_toggle").checked;

  const card = document.createElement("div");

  card.className = "code-card";

  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.alignItems = "center";
  card.style.gap = "18px";

  const label = document.createElement("div");

  label.className = "code-text";
  label.textContent = code;

  const barcodeSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  card.appendChild(label);

  // Only generate QR when toggle is OFF
  if (!barcodeOnly) {

    const qrDiv = document.createElement("div");

    new QRCode(qrDiv, {
      text: code,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    card.appendChild(qrDiv);
  }

  JsBarcode(barcodeSvg, code, {
    format: "CODE128",
    width: 2,
    height: 70,
    displayValue: true,
    lineColor: "#000000",
    background: "#ffffff"
  });

  barcodeSvg.style.marginTop = "18px";

  card.appendChild(barcodeSvg);

  const selected_codes = document.getElementById("selected_codes");

  card.addEventListener("click", () => {

    card.classList.toggle("active");

    if (card.classList.contains("active")) {

      selected_codes.value += code + "\n";

    } else {

      const lines = selected_codes.value
        .split("\n")
        .filter(line => line.trim() !== code);

      selected_codes.value = lines.join("\n");
    }
  });

  container.appendChild(card);
}

document.getElementById("scroll_down").onclick = () => {
  focusCard(currentIndex + 1);
};

document.getElementById("scroll_up").onclick = () => {
  focusCard(currentIndex - 1);
};

window.addEventListener("keydown", (e) => {

  const activeElement = document.activeElement;

  const typingInTextarea =
    activeElement.tagName === "TEXTAREA";

  if (!typingInTextarea) {

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusCard(currentIndex + 1);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusCard(currentIndex - 1);
    }
  }
});
