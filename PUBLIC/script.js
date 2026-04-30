async function Create_Results() {
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

async function createCodeCard(code) {
  const container = document.getElementById("result_container");

  const card = document.createElement("div");
  card.className = "code-card";
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.alignItems = "center";
  card.style.gap = "18px";


  const label = document.createElement("div");
  label.className = "code-text";
  label.textContent = code;

  const qrCanvas = document.createElement("canvas");

  const barcodeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // QR container (qrcodejs creates its own canvas/img inside)
  const qrDiv = document.createElement("div");


  new QRCode(qrDiv, {
    text: code,
    width: 180,
    height: 180,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });

  JsBarcode(barcodeSvg, code, {
    format: "CODE128",
    width: 2,
    height: 70,
    displayValue: true,
    lineColor: "#000000",
    background: "#ffffff"
  });
  barcodeSvg.style.marginTop = "18px";

  card.appendChild(label);
  card.appendChild(qrDiv);
  card.appendChild(barcodeSvg);
  container.appendChild(card);
}
