const groups = ["DAW1A", "DAW1B", "ASIX1"];

let surveyResponses = [
  { id: 1, group: "DAW1A", score: 5, comment: "La clase ha sido clara y practica." },
  { id: 2, group: "DAW1A", score: 4, comment: "Buen ritmo, aunque faltaria mas tiempo para dudas." },
  { id: 3, group: "DAW1A", score: 4, comment: "" },
  { id: 4, group: "DAW1A", score: 3, comment: "Me ha costado seguir la parte final." },
  { id: 5, group: "DAW1A", score: 5, comment: "Los ejemplos ayudan mucho." },
  { id: 6, group: "DAW1A", score: 2, comment: "Necesitaria una explicacion mas pausada." },
  { id: 7, group: "DAW1A", score: 4, comment: "La actividad de arrays ha sido util." },
  { id: 8, group: "DAW1A", score: 3, comment: "" },
  { id: 9, group: "DAW1A", score: 5, comment: "Muy buena sesion." },
  { id: 10, group: "DAW1A", score: 4, comment: "Me gustaria repasar funciones." },
  { id: 11, group: "DAW1A", score: 3, comment: "Correcta, pero con muchos conceptos nuevos." },
  { id: 12, group: "DAW1A", score: 2, comment: "" },

  { id: 13, group: "DAW1B", score: 4, comment: "La explicacion ha sido ordenada." },
  { id: 14, group: "DAW1B", score: 4, comment: "Bien, pero iria mejor con mas ejemplos visuales." },
  { id: 15, group: "DAW1B", score: 3, comment: "" },
  { id: 16, group: "DAW1B", score: 5, comment: "Me ha gustado trabajar con datos simulados." },
  { id: 17, group: "DAW1B", score: 3, comment: "Algunas partes iban rapido." },
  { id: 18, group: "DAW1B", score: 4, comment: "Buen ambiente de trabajo." },
  { id: 19, group: "DAW1B", score: 2, comment: "Faltaba mas tiempo para practicar." },
  { id: 20, group: "DAW1B", score: 5, comment: "" },

  { id: 21, group: "ASIX1", score: 5, comment: "Muy interesante para entender estadisticas." },
  { id: 22, group: "ASIX1", score: 4, comment: "La parte del panel se entiende bien." },
  { id: 23, group: "ASIX1", score: 4, comment: "" },
  { id: 24, group: "ASIX1", score: 3, comment: "Necesito practicar mas JavaScript." },
  { id: 25, group: "ASIX1", score: 1, comment: "Me he perdido bastante." },
  { id: 26, group: "ASIX1", score: 5, comment: "Me gusta ver resultados al momento." },
  { id: 27, group: "ASIX1", score: 2, comment: "" },
  { id: 28, group: "ASIX1", score: 4, comment: "Sesion completa." }
];

const ratingColors = {
  1: "#ef4444",
  2: "#f97316",
  3: "#f5a20c",
  4: "#2ec866",
  5: "#18a957"
};

const surveyForm = document.querySelector("#surveyForm");
const panelGroup = document.querySelector("#panelGroup");
const formMessage = document.querySelector("#formMessage");

surveyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(surveyForm);
  const score = Number(formData.get("score"));
  const group = formData.get("studentGroup");
  const comment = formData.get("comment").trim();

  if (score < 1 || score > 5) {
    formMessage.textContent = "La puntuacion debe estar entre 1 y 5.";
    formMessage.style.color = "#ef4444";
    return;
  }

  surveyResponses.unshift({
    id: Date.now(),
    group,
    score,
    comment
  });

  panelGroup.value = group;
  surveyForm.reset();
  document.querySelector("#score").value = 4;
  document.querySelector("#studentGroup").value = group;
  formMessage.textContent = "Respuesta guardada correctamente.";
  formMessage.style.color = "#18a957";
  renderDashboard();
});

panelGroup.addEventListener("change", renderDashboard);

function getFilteredResponses() {
  const selectedGroup = panelGroup.value;

  if (selectedGroup === "TODOS") {
    return surveyResponses;
  }

  return surveyResponses.filter((response) => response.group === selectedGroup);
}

function calculateStats(responses) {
  const total = responses.length;
  const sum = responses.reduce((acc, response) => acc + response.score, 0);
  const average = total === 0 ? 0 : sum / total;
  const positiveCount = responses.filter((response) => response.score >= 4).length;
  const positivePercent = total === 0 ? 0 : (positiveCount / total) * 100;

  return { total, average, positiveCount, positivePercent };
}

function getRatingCounts(responses) {
  return [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: responses.filter((response) => response.score === rating).length
  }));
}

function renderDashboard() {
  const selectedGroup = panelGroup.value;
  const responses = getFilteredResponses();
  const stats = calculateStats(responses);
  const ratingCounts = getRatingCounts(responses);

  document.querySelector("#panelNote").innerHTML =
    selectedGroup === "TODOS"
      ? "Mostrando datos de <strong>todos los grupos</strong>."
      : `Mostrando datos del grupo seleccionado: <strong>${selectedGroup}</strong>`;

  document.querySelector("#kpiResponses").textContent = stats.total;
  document.querySelector("#kpiAverage").textContent = stats.average.toFixed(2);
  document.querySelector("#kpiPositive").textContent = `${stats.positivePercent.toFixed(1)}%`;
  document.querySelector("#kpiGroup").textContent = selectedGroup;

  renderBars(ratingCounts, stats.total);
  renderScorePie(ratingCounts, stats.total);
  renderPositivePie(stats);
  renderGroupComparison(selectedGroup);
  renderResponseList(responses);
}

function renderBars(ratingCounts, total) {
  const container = document.querySelector("#ratingBars");

  container.innerHTML = ratingCounts
    .map(({ rating, count }) => {
      const width = total === 0 ? 0 : (count / total) * 100;

      return `
        <div class="bar-row">
          <div class="bar-meta">
            <span>${rating} estrellas</span>
            <strong>${count}</strong>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${width}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderScorePie(ratingCounts, total) {
  const pie = document.querySelector("#scorePie");
  const legend = document.querySelector("#scoreLegend");
  let start = 0;

  if (total === 0) {
    pie.style.background = "conic-gradient(#e4e8ee 0deg 360deg)";
  } else {
    const slices = ratingCounts.map(({ rating, count }) => {
      const degrees = (count / total) * 360;
      const slice = `${ratingColors[rating]} ${start}deg ${start + degrees}deg`;
      start += degrees;
      return slice;
    });

    pie.style.background = `conic-gradient(${slices.join(", ")})`;
  }

  legend.innerHTML = ratingCounts
    .map(({ rating, count }) => {
      const percent = total === 0 ? 0 : (count / total) * 100;

      return `
        <li>
          <span class="dot" style="background: ${ratingColors[rating]}"></span>
          ${rating}/5: ${count} (${percent.toFixed(1)}%)
        </li>
      `;
    })
    .join("");
}

function renderPositivePie(stats) {
  const pie = document.querySelector("#positivePie");
  const legend = document.querySelector("#positiveLegend");
  const negativePercent = 100 - stats.positivePercent;

  pie.style.background =
    stats.total === 0
      ? "conic-gradient(#e4e8ee 0deg 360deg)"
      : `conic-gradient(#18a957 0deg ${stats.positivePercent * 3.6}deg, #f5a20c ${stats.positivePercent * 3.6}deg 360deg)`;

  legend.innerHTML = `
    <li><span class="dot" style="background: #18a957"></span>Positivas (4-5): ${stats.positivePercent.toFixed(1)}%</li>
    <li><span class="dot" style="background: #f5a20c"></span>No positivas (1-3): ${negativePercent.toFixed(1)}%</li>
  `;
}

function renderGroupComparison(selectedGroup) {
  const container = document.querySelector("#groupComparison");

  container.innerHTML = groups
    .map((group) => {
      const groupResponses = surveyResponses.filter((response) => response.group === group);
      const stats = calculateStats(groupResponses);
      const width = (stats.average / 5) * 100;
      const selectedClass = selectedGroup === group ? " selected" : "";

      return `
        <div class="compare-row${selectedClass}">
          <div class="compare-meta">
            <span>${group}${selectedClass ? " (seleccionat)" : ""}</span>
            <strong>${stats.average.toFixed(2)}/5</strong>
          </div>
          <div class="compare-track">
            <div class="compare-fill" style="width: ${width}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderResponseList(responses) {
  const container = document.querySelector("#responsesList");
  const count = document.querySelector("#listCount");

  count.textContent = `${responses.length} respuestas`;

  if (responses.length === 0) {
    container.innerHTML = `<div class="empty-state">Todavia no hay respuestas para este filtro.</div>`;
    return;
  }

  container.innerHTML = responses
    .map((response) => {
      const tone = response.score <= 2 ? "low" : response.score === 3 ? "mid" : "high";
      const comment = response.comment || "Sin comentario adicional.";

      return `
        <article class="response-card ${tone}">
          <div class="card-top">
            <span>${response.group}</span>
            <span class="score-badge">${response.score}/5</span>
          </div>
          <p>${escapeHtml(comment)}</p>
        </article>
      `;
    })
    .join("");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderDashboard();
