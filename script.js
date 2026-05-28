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
const campPuntuacio = document.querySelector("#puntuacio");
const titolComentaris = document.querySelector("#titolComentaris");
let hiHaComentariRecent = false;

formulari.addEventListener("submit", (event) => {
  event.preventDefault();

  const grup = document.querySelector("#grup").value;
  const puntuacioText = campPuntuacio.value;
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
  campPuntuacio.value = "1";
  hiHaComentariRecent = true;
  refrescarPanell();
});

filtreGrup.addEventListener("change", refrescarPanell);

function calcularEstadistiques(dades, grupFiltre) {
  const respostesFiltrades = grupFiltre === "Tots els grups"
    ? dades
    : dades.filter((resposta) => resposta.grup === grupFiltre);

  const total = respostesFiltrades.length;
  const suma = respostesFiltrades.reduce((acumulat, resposta) => acumulat + resposta["puntuació"], 0);
  const mitjana = total === 0 ? 0 : suma / total;
  const positives = respostesFiltrades.filter((resposta) => resposta["puntuació"] >= 4).length;
  const positivesPercent = total === 0 ? 0 : (positives / total) * 100;

  return {
    respostes: respostesFiltrades,
    total,
    mitjana,
    positivesPercent
  };
}

function refrescarPanell() {
  const grupFiltre = filtreGrup.value;
  const estadistiques = calcularEstadistiques(respostes, grupFiltre);

  document.querySelector("#notaPanell").textContent =
    grupFiltre === "Tots els grups"
      ? "Mostrant totes les dades."
      : `Mostrant dades del grup seleccionat al formulari: ${grupFiltre}`;
  document.querySelector("#kpiRespostes").textContent = estadistiques.total;
  document.querySelector("#kpiMitjana").textContent =
    estadistiques.total === 0 ? "-" : estadistiques.mitjana.toFixed(2);
  document.querySelector("#kpiPositives").textContent =
    estadistiques.total === 0 ? "0%" : `${estadistiques.positivesPercent.toFixed(1)}%`;
  document.querySelector("#kpiGrup").textContent = grupFiltre;
  titolComentaris.textContent = hiHaComentariRecent ? "Comentaris més recents" : "Comentaris";

  refrescarGrafica(estadistiques.respostes);
  refrescarLlistat(estadistiques.respostes);
}

function refrescarGrafica(respostesFiltrades) {
  const grafica = document.querySelector("#graficaPuntuacions");
  const total = respostesFiltrades.length;
  const recompte = calcularRecomptePuntuacions(respostesFiltrades);

  grafica.innerHTML = recompte.map(({ puntuacio, quantitat }) => {
    const amplada = total === 0 ? 0 : (quantitat / total) * 100;

    return `
      <div class="barra valoracio-${puntuacio}">
        <span>${puntuacio} ${puntuacio === 1 ? "estrella" : "estrelles"}</span>
        <div class="barra-pista">
          <div class="barra-farciment" style="width: ${amplada}%"></div>
        </div>
        <strong>${quantitat}</strong>
      </div>
    `;
  }).join("");
}

function calcularRecomptePuntuacions(respostesFiltrades) {
  return [1, 2, 3, 4, 5].map((puntuacio) => ({
    puntuacio,
    quantitat: respostesFiltrades.filter((resposta) => resposta["puntuació"] === puntuacio).length
  }));
}

function refrescarLlistat(respostesFiltrades) {
  const llista = document.querySelector("#llistaRespostes");

  if (respostesFiltrades.length === 0) {
    llista.innerHTML = "<article>No hi ha respostes.</article>";
    return;
  }

  const respostesOrdenades = [...respostesFiltrades].sort((a, b) => new Date(b.data) - new Date(a.data));

  llista.innerHTML = respostesOrdenades.map((resposta) => `
    <article class="comentari-card valoracio-${resposta["puntuació"]}">
      <span class="comentari-grup">${escaparHtml(resposta.grup)}</span>
      <strong class="comentari-puntuacio">Puntuació: ${resposta["puntuació"]}/5</strong>
      ${resposta.comentari ? `<p><strong>Comentari:</strong> ${escaparHtml(resposta.comentari)}</p>` : ""}
    </article>
  `).join("");
}

function escaparHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

refrescarPanell();
