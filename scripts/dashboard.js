document.addEventListener("DOMContentLoaded", () => {

// ─── Dados ───────────────────────────────────────────────────────────────────

const data = {
  materias: {
    dia:    { titulo: "Materias Estudadas Hoje",            ranking: [{ nome: "Português", val: 12 }, { nome: "Matemática", val: 9 }, { nome: "Física", val: 6 }, { nome: "Química", val: 4 }, { nome: "Biologia", val: 2 }] },
    semana: { titulo: "Materias Estudadas na Semana",       ranking: [{ nome: "Português", val: 30 }, { nome: "Matemática", val: 25 }, { nome: "Física", val: 20 }, { nome: "Química", val: 15 }, { nome: "Biologia", val: 10 }] },
    mes:    { titulo: "Materias Estudadas no Mês",          ranking: [{ nome: "Português", val: 45 }, { nome: "Matemática", val: 40 }, { nome: "Física", val: 32 }, { nome: "Química", val: 28 }, { nome: "Biologia", val: 20 }] },
    ano:    { titulo: "Materias Estudadas ao Longo do Ano", ranking: [{ nome: "Português", val: 80 }, { nome: "Matemática", val: 78 }, { nome: "Física", val: 56 }, { nome: "Química", val: 50 }, { nome: "Biologia", val: 38 }, { nome: "Geografia", val: 25 }] },
  },
  horas: {
    dia:    { titulo: "Horas Estudadas Hoje",               ranking: [{ nome: "Matemática", val: 2 }, { nome: "Física", val: 1.5 }, { nome: "Química", val: 1 }, { nome: "Biologia", val: 0.5 }, { nome: "Geografia", val: 0.3 }] },
    semana: { titulo: "Horas Estudadas na Semana",          ranking: [{ nome: "Matemática", val: 10 }, { nome: "Física", val: 8 }, { nome: "Química", val: 6 }, { nome: "Biologia", val: 4 }, { nome: "Geografia", val: 2 }] },
    mes:    { titulo: "Horas Estudadas no Mês",             ranking: [{ nome: "Matemática", val: 40 }, { nome: "Física", val: 35 }, { nome: "Química", val: 28 }, { nome: "Biologia", val: 20 }, { nome: "Geografia", val: 12 }] },
    ano:    { titulo: "Horas Estudadas ao Longo do Ano",    ranking: [{ nome: "Matemática", val: 120 }, { nome: "Física", val: 100 }, { nome: "Química", val: 80 }, { nome: "Biologia", val: 60 }, { nome: "Geografia", val: 40 }] },
  },
  questoes: {
    dia:    { titulo: "Questões Respondidas Hoje",            ranking: [{ nome: "Matemática", val: 15 }, { nome: "Física", val: 12 }, { nome: "Química", val: 8 }, { nome: "Biologia", val: 5 }, { nome: "Geografia", val: 3 }] },
    semana: { titulo: "Questões Respondidas na Semana",       ranking: [{ nome: "Matemática", val: 50 }, { nome: "Física", val: 42 }, { nome: "Química", val: 30 }, { nome: "Biologia", val: 22 }, { nome: "Geografia", val: 15 }] },
    mes:    { titulo: "Questões Respondidas no Mês",          ranking: [{ nome: "Matemática", val: 180 }, { nome: "Física", val: 160 }, { nome: "Química", val: 130 }, { nome: "Biologia", val: 100 }, { nome: "Geografia", val: 70 }] },
    ano:    { titulo: "Questões Respondidas ao Longo do Ano", ranking: [{ nome: "Matemática", val: 500 }, { nome: "Física", val: 420 }, { nome: "Química", val: 340 }, { nome: "Biologia", val: 260 }, { nome: "Geografia", val: 180 }] },
  },
};

// ─── Estado ───────────────────────────────────────────────────────────────────

let activeTab    = "materias";
let activePeriod = "ano";
let chart        = null;

// ─── Elementos ────────────────────────────────────────────────────────────────

const tabEls       = document.querySelectorAll("[data-tab]");
const periodEls    = document.querySelectorAll("[data-period]");
const chartTitle   = document.getElementById("chart-title");
const rankTitle    = document.getElementById("rank-title");
const rankList     = document.getElementById("rank-list");
const chartWrapper = document.getElementById("chart-wrapper");
const chartCanvas  = document.getElementById("materias-chart");

// ─── Gráfico (Chart.js — barras horizontais animadas) ────────────────────────

function renderChart(ranking) {
  const labels = ranking.map(r => r.nome);
  const values = ranking.map(r => r.val);
  const max    = Math.max(...values);
  const colors = values.map((_, i) => i < 3 ? "#3b82f6" : "#bfdbfe");

  // se já existe, atualiza com animação
  if (chart) {
    chart.data.labels                      = labels;
    chart.data.datasets[0].data            = values;
    chart.data.datasets[0].backgroundColor = colors;
    chart.options.scales.x.max             = Math.ceil(max * 1.15);
    chart.update();
    return;
  }

  // cria o gráfico pela primeira vez
  chart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 18,
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
        easing: "easeInOutQuart",
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e293b",
          titleColor: "#94a3b8",
          bodyColor: "#f1f5f9",
          padding: 10,
          callbacks: { label: ctx => `  ${ctx.parsed.x}` }
        }
      },
      scales: {
        x: {
          max: Math.ceil(max * 1.15),
          grid: { color: "#f3f4f6" },
          ticks: { color: "#9ca3af", font: { size: 11 } },
          border: { display: false },
        },
        y: {
          grid: { display: false },
          ticks: { color: "#374151", font: { size: 12 } },
          border: { display: false },
        }
      }
    }
  });
}

// ─── Render geral ─────────────────────────────────────────────────────────────

function render() {
  const d = data[activeTab][activePeriod];

  chartTitle.textContent = d.titulo;
  rankTitle.textContent  = "Ranking — " + d.titulo;

  // todas as abas usam o mesmo gráfico Chart.js
  chartWrapper.style.display = "block";
  renderChart(d.ranking);

  // ranking lateral
  rankList.innerHTML = d.ranking.map((item, i) => {
    const destaque = i < 3;
    return `
      <li class="flex justify-between items-center ${destaque ? "" : "opacity-60"}">
        <div class="flex items-center gap-4">
          <span class="w-5 h-5 ${destaque ? "bg-slate-800 text-white" : "bg-gray-200 text-gray-600"} text-[10px] flex items-center justify-center rounded-full">${i + 1}</span>
          <span class="text-sm text-gray-600">${item.nome}</span>
        </div>
        <span class="text-sm text-gray-500">${item.val}</span>
      </li>`;
  }).join("");
}

// ─── Eventos: abas ────────────────────────────────────────────────────────────

tabEls.forEach(el => {
  el.addEventListener("click", () => {
    tabEls.forEach(t => {
      t.classList.remove("text-blue-500", "border-b-2", "border-blue-500");
      t.classList.add("text-gray-400");
    });
    el.classList.add("text-blue-500", "border-b-2", "border-blue-500");
    el.classList.remove("text-gray-400");
    activeTab = el.dataset.tab;
    render();
  });
});

// ─── Eventos: períodos ────────────────────────────────────────────────────────

periodEls.forEach(el => {
  el.addEventListener("click", () => {
    periodEls.forEach(p => {
      p.classList.remove("text-blue-500");
      p.classList.add("text-gray-500");
    });
    el.classList.add("text-blue-500");
    el.classList.remove("text-gray-500");
    activePeriod = el.dataset.period;
    render();
  });
});

// ─── Init ─────────────────────────────────────────────────────────────────────

render();

}); // DOMContentLoaded