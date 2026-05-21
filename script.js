const respostes = [
  {
    grup: "DAW1A",
    "puntuació": 4,
    comentari: "La part de conclusions és interessant.",
    data: "2026-05-21"
  },
  {
    grup: "DAW1B",
    "puntuació": 3,
    comentari: "Em va costar la part de gràfics.",
    data: "2026-05-21"
  },
  {
    grup: "ASIX1",
    "puntuació": 5,
    comentari: "Els exemples han ajudat molt.",
    data: "2026-05-21"
  }
];

const formulari = document.querySelector("#formulariEnquesta");
const filtreGrup = document.querySelector("#filtreGrup");
const missatgeFormulari = document.querySelector("#missatgeFormulari");

formulari.addEventListener("submit", (event) => {
  event.preventDefault();

  const grup = document.querySelector("#grup").value;
  const puntuacioText = document.querySelector("#puntuacio").value;
  const comentari = document.querySelector("#comentari").value.trim();

  if (!/^[1-5]$/.test(puntuacioText)) {
    missatgeFormulari.textContent = "La puntuació ha de ser un número del 1 al 5.";
    return;
  }

  respostes.push({
    id: Date.now(),
    grup,
    "puntuació": Number(puntuacioText),
    comentari,
    data: new Date().toISOString()
  });

  missatgeFormulari.textContent = "";
  filtreGrup.value = grup;
  formulari.reset();
  refrescarPanell();
});

filtreGrup.addEventListener("change", refrescarPanell);

function refrescarPanell() {
  const grupSeleccionat = filtreGrup.value;
  const respostesFiltrades = respostes.filter((resposta) => resposta.grup === grupSeleccionat);
  const total = respostesFiltrades.length;
  const suma = respostesFiltrades.reduce((acumulat, resposta) => acumulat + resposta["puntuació"], 0);
  const mitjana = total === 0 ? 0 : suma / total;
  const positives = respostesFiltrades.filter((resposta) => resposta["puntuació"] >= 4).length;
  const percentatgePositives = total === 0 ? 0 : (positives / total) * 100;

  document.querySelector("#notaPanell").textContent =
    `Mostrant dades del grup seleccionat al formulari: ${grupSeleccionat}`;
  document.querySelector("#kpiRespostes").textContent = total;
  document.querySelector("#kpiMitjana").textContent = mitjana.toFixed(2);
  document.querySelector("#kpiPositives").textContent = `${percentatgePositives.toFixed(1)}%`;
  document.querySelector("#kpiGrup").textContent = grupSeleccionat;

  refrescarGrafica(respostesFiltrades);
  refrescarLlistat(respostesFiltrades);
}

function refrescarGrafica(respostesFiltrades) {
  const grafica = document.querySelector("#graficaPuntuacions");
  const total = respostesFiltrades.length;

  grafica.innerHTML = [1, 2, 3, 4, 5].map((puntuacio) => {
    const quantitat = respostesFiltrades.filter((resposta) => resposta["puntuació"] === puntuacio).length;
    const amplada = total === 0 ? 0 : (quantitat / total) * 100;

    return `
      <div class="barra">
        <span>${puntuacio}/5</span>
        <div class="barra-pista">
          <div class="barra-farciment" style="width: ${amplada}%"></div>
        </div>
        <strong>${quantitat}</strong>
      </div>
    `;
  }).join("");
}

function refrescarLlistat(respostesFiltrades) {
  const llista = document.querySelector("#llistaRespostes");

  llista.innerHTML = respostesFiltrades.map((resposta) => `
    <article>
      <strong>${resposta.grup} · ${resposta["puntuació"]}/5</strong>
      <p>${resposta.comentari || "Sense comentari"}</p>
      <p>${resposta.data}</p>
    </article>
  `).join("");
}

refrescarPanell();
