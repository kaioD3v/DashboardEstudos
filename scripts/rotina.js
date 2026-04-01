// ——————————————————————————————————————————
// State
// ——————————————————————————————————————————
const DAY_ORDER = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
const TODAY_MAP = { 0:'Domingo', 1:'Segunda', 2:'Terça', 3:'Quarta', 4:'Quinta', 5:'Sexta', 6:'Sábado' };

let selectedDays = [];
let schedule = {}; // { "Segunda": [{materia, start, end}] }
let routine = null; // saved
let currentStep = 1;

let timerInterval = null;
let timerSeconds = 0;
let timerTotal = 0;
let timerPaused = false;
let activeCard = null; // { materia, start, end }

// ——————————————————————————————————————————
// Sidebar
// ——————————————————————————————————————————
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('closed');
}

// ——————————————————————————————————————————
// Screen management
// ——————————————————————————————————————————
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function startCreation() {
    showScreen('screen-create');
    goToStep1Internal();
}

function resetRoutine() {
    routine = null;
    selectedDays = [];
    schedule = {};
    document.getElementById('btn-reset').classList.add('hidden');
    showScreen('screen-empty');
}

// ——————————————————————————————————————————
// Step navigation
// ——————————————————————————————————————————
function setStep(n) {
    currentStep = n;
    ['step-1','step-2','step-3'].forEach((id, i) => {
        document.getElementById(id).classList.toggle('hidden', i+1 !== n);
    });
    [1,2,3].forEach(i => {
        const dot = document.getElementById('dot-'+i);
        const label = document.getElementById('label-'+i);
        dot.className = 'step-dot ' + (i < n ? 'done' : i === n ? 'active' : 'pending');
        if (i < n) dot.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        else dot.textContent = i;
        label.className = (i === n ? 'text-blue-500 ' : 'text-gray-400 ') + 'flex-1 text-center';
        if (i < n) label.classList.add('text-green-500');
    });
    [1,2].forEach(i => {
        document.getElementById('line-'+i).className = 'step-line ' + (n > i ? 'done' : '');
    });
    lucide.createIcons();
}

function goToStep1() { setStep(1); }
function goToStep1Internal() { setStep(1); }

function goToStep2() {
    if (selectedDays.length === 0) { alert('Selecione pelo menos um dia!'); return; }
    buildScheduleForm();
    setStep(2);
}

function goToStep3() {
    // Validate
    for (const day of selectedDays) {
        const items = schedule[day] || [];
        if (items.length === 0) { alert(`Adicione pelo menos uma matéria para ${day}.`); return; }
        for (const item of items) {
            if (!item.materia || !item.start || !item.end) { alert(`Preencha todos os campos de ${day}.`); return; }
        }
    }
    buildSummary();
    setStep(3);
}

// ——————————————————————————————————————————
// Day selection
// ——————————————————————————————————————————
document.getElementById('days-container').addEventListener('click', e => {
    const btn = e.target.closest('.day-btn');
    if (!btn) return;
    const day = btn.dataset.day;
    if (selectedDays.includes(day)) {
        selectedDays = selectedDays.filter(d => d !== day);
        btn.classList.remove('selected');
    } else {
        selectedDays.push(day);
        btn.classList.add('selected');
    }
});

// ——————————————————————————————————————————
// Schedule form builder
// ——————————————————————————————————————————
function buildScheduleForm() {
    const container = document.getElementById('schedule-days');
    container.innerHTML = '';
    const ordered = DAY_ORDER.filter(d => selectedDays.includes(d));
    ordered.forEach(day => {
        if (!schedule[day]) schedule[day] = [{ materia: '', start: '', end: '' }];
        const section = document.createElement('div');
        section.className = 'border border-gray-100 rounded-xl p-4';
        section.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <span class="font-display font-bold text-gray-800" style="font-family:'Syne',sans-serif">${day}</span>
                <button onclick="addMateria('${day}')" class="text-blue-500 text-sm font-semibold hover:text-blue-700 flex items-center gap-1 transition">
                    <i data-lucide="plus" class="w-3 h-3"></i> Adicionar matéria
                </button>
            </div>
            <div id="materias-${day}" class="space-y-2"></div>
        `;
        container.appendChild(section);
        renderMaterias(day);
    });
    lucide.createIcons();
}

function renderMaterias(day) {
    const container = document.getElementById('materias-' + day);
    if (!container) return;
    container.innerHTML = '';
    (schedule[day] || []).forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'materia-entry flex flex-col sm:flex-row gap-3 items-start sm:items-end';
        div.innerHTML = `
            <div class="flex-1">
                <label class="text-xs text-gray-500 mb-1 block">Matéria</label>
                <input type="text" class="text-input-styled w-full" placeholder="Ex: Matemática" value="${item.materia}"
                    onchange="updateSchedule('${day}',${idx},'materia',this.value)">
            </div>
            <div>
                <label class="text-xs text-gray-500 mb-1 block">Início</label>
                <input type="time" class="time-input" value="${item.start}"
                    onchange="updateSchedule('${day}',${idx},'start',this.value)">
            </div>
            <div>
                <label class="text-xs text-gray-500 mb-1 block">Término</label>
                <input type="time" class="time-input" value="${item.end}"
                    onchange="updateSchedule('${day}',${idx},'end',this.value)">
            </div>
            ${schedule[day].length > 1 ? `<button onclick="removeMateria('${day}',${idx})" class="btn-danger mb-1">Remover</button>` : ''}
        `;
        container.appendChild(div);
    });
    lucide.createIcons();
}

function addMateria(day) {
    schedule[day].push({ materia: '', start: '', end: '' });
    renderMaterias(day);
}

function removeMateria(day, idx) {
    schedule[day].splice(idx, 1);
    renderMaterias(day);
}

function updateSchedule(day, idx, field, value) {
    if (!schedule[day]) return;
    schedule[day][idx][field] = value;
}

// ——————————————————————————————————————————
// Summary
// ——————————————————————————————————————————
function buildSummary() {
    const c = document.getElementById('summary-container');
    c.innerHTML = '';
    const ordered = DAY_ORDER.filter(d => selectedDays.includes(d));
    ordered.forEach(day => {
        const items = schedule[day] || [];
        const div = document.createElement('div');
        div.className = 'border border-gray-100 rounded-xl p-4';
        div.innerHTML = `<p class="font-display font-bold text-gray-800 mb-2" style="font-family:'Syne',sans-serif">${day}</p>
            ${items.map(i => `<div class="flex items-center gap-3 text-sm text-gray-600 mb-1">
                <span class="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                <span class="font-medium">${i.materia}</span>
                <span class="text-gray-400">${i.start} – ${i.end}</span>
                <span class="badge badge-blue">${calcDuration(i.start, i.end)}</span>
            </div>`).join('')}`;
        c.appendChild(div);
    });
}

function calcDuration(start, end) {
    if (!start || !end) return '--';
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins <= 0) return '--';
    if (mins < 60) return mins + 'min';
    return Math.floor(mins/60) + 'h' + (mins%60 ? (mins%60)+'min' : '');
}

// ——————————————————————————————————————————
// Save & Dashboard
// ——————————————————————————————————————————
function saveRoutine() {
    routine = JSON.parse(JSON.stringify(schedule));
    document.getElementById('btn-reset').classList.remove('hidden');
    buildDashboard();
    showScreen('screen-dashboard');
    lucide.createIcons();
}

function buildDashboard() {
    const today = TODAY_MAP[new Date().getDay()];
    const todayItems = routine[today] || [];

    // Banner
    const titleEl = document.getElementById('today-title');
    const countEl = document.getElementById('today-count');
    const totalEl = document.getElementById('today-total');
    const noStudyEl = document.getElementById('today-no-studies');

    titleEl.textContent = today + ', ' + new Date().toLocaleDateString('pt-BR', { day:'numeric', month:'long' });

    if (todayItems.length > 0) {
        countEl.textContent = todayItems.length + ' matéria' + (todayItems.length > 1 ? 's' : '') + ' hoje';
        const totalMins = todayItems.reduce((acc, i) => acc + minsFromRange(i.start, i.end), 0);
        totalEl.textContent = formatMins(totalMins) + ' de estudo';
        noStudyEl.classList.add('hidden');
        countEl.parentElement.classList.remove('hidden');
        totalEl.parentElement.classList.remove('hidden');
    } else {
        noStudyEl.classList.remove('hidden');
        countEl.parentElement.classList.add('hidden');
        totalEl.parentElement.classList.add('hidden');
    }

    // Today cards
    const todayCards = document.getElementById('today-cards');
    const todayEmptyMsg = document.getElementById('today-empty-msg');
    todayCards.innerHTML = '';
    if (todayItems.length === 0) {
        todayEmptyMsg.classList.remove('hidden');
    } else {
        todayEmptyMsg.classList.add('hidden');
        todayItems.forEach(item => {
            todayCards.appendChild(buildCard(item, today, true));
        });
    }

    // Week cards
    const weekCards = document.getElementById('week-cards');
    weekCards.innerHTML = '';
    const ordered = DAY_ORDER.filter(d => routine[d] && d !== today);
    ordered.forEach(day => {
        const card = document.createElement('div');
        card.className = 'study-card';
        const items = routine[day];
        const totalMins = items.reduce((acc, i) => acc + minsFromRange(i.start, i.end), 0);
        card.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <span class="font-display font-bold text-gray-800" style="font-family:'Syne',sans-serif">${day}</span>
                <span class="badge badge-blue">${formatMins(totalMins)}</span>
            </div>
            <div class="space-y-2">
                ${items.map(i => `<div class="flex items-center gap-2 text-sm text-gray-600">
                    <i data-lucide="book" class="w-3 h-3 text-blue-400 flex-shrink-0"></i>
                    <span class="font-medium">${i.materia}</span>
                    <span class="text-gray-400 ml-auto">${i.start}–${i.end}</span>
                </div>`).join('')}
            </div>
        `;
        weekCards.appendChild(card);
    });

    lucide.createIcons();
}

function buildCard(item, day, isToday) {
    const div = document.createElement('div');
    div.className = 'study-card';
    const mins = minsFromRange(item.start, item.end);
    div.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <div>
                <h4 class="font-display font-bold text-gray-900" style="font-family:'Syne',sans-serif">${item.materia}</h4>
                <p class="text-xs text-gray-400 mt-0.5">${day}</p>
            </div>
            ${isToday ? '<span class="badge badge-green">Hoje</span>' : ''}
        </div>
        <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${item.start}–${item.end}</span>
            <span class="flex items-center gap-1"><i data-lucide="timer" class="w-3 h-3"></i> ${formatMins(mins)}</span>
        </div>
        <div class="progress-bar mb-3">
            <div class="progress-fill" style="width:0%" id="card-progress-${item.materia.replace(/\s/g,'')}${item.start.replace(':','')}"></div>
        </div>
        ${isToday ? `<button onclick='startSession(${JSON.stringify(item)})' class="btn-primary w-full flex items-center justify-center gap-2 py-2 text-sm">
            <i data-lucide="play" class="w-4 h-4"></i> Começar a estudar
        </button>` : ''}
    `;
    return div;
}

// ——————————————————————————————————————————
// Timer
// ——————————————————————————————————————————
function startSession(item) {
    if (timerInterval) clearInterval(timerInterval);
    activeCard = item;
    timerSeconds = 0;
    timerPaused = false;
    timerTotal = minsFromRange(item.start, item.end) * 60;
    document.getElementById('session-title').textContent = item.materia;
    document.getElementById('session-time-label').textContent = item.start + ' – ' + item.end;
    document.getElementById('active-session-panel').classList.remove('hidden');
    document.getElementById('active-session-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Update pause icon
    updatePauseBtn(false);
    tickTimer();
    timerInterval = setInterval(tickTimer, 1000);
}

function tickTimer() {
    if (timerPaused) return;
    timerSeconds++;
    const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const s = String(timerSeconds % 60).padStart(2, '0');
    document.getElementById('timer-display').textContent = m + ':' + s;

    // Ring
    const circumference = 326.7;
    const ratio = timerTotal > 0 ? Math.min(timerSeconds / timerTotal, 1) : 0;
    document.getElementById('timer-progress').style.strokeDashoffset = circumference * (1 - ratio);

    // Progress bar
    const pct = Math.min(ratio * 100, 100);
    document.getElementById('session-progress').style.width = pct + '%';
}

function togglePause() {
    timerPaused = !timerPaused;
    updatePauseBtn(timerPaused);
}

function updatePauseBtn(paused) {
    const btn = document.getElementById('btn-pause');
    if (paused) {
        btn.innerHTML = '<i data-lucide="play" class="w-4 h-4 inline mr-1"></i> Retomar';
    } else {
        btn.innerHTML = '<i data-lucide="pause" class="w-4 h-4 inline mr-1"></i> Pausar';
    }
    lucide.createIcons();
}

function endSession() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerPaused = false;
    activeCard = null;
    document.getElementById('active-session-panel').classList.add('hidden');
    document.getElementById('timer-display').textContent = '00:00';
    document.getElementById('timer-progress').style.strokeDashoffset = 326.7;
    document.getElementById('session-progress').style.width = '0%';
}

// ——————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————
function minsFromRange(start, end) {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
}

function formatMins(mins) {
    if (mins <= 0) return '--';
    if (mins < 60) return mins + 'min';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h + 'h' + (m ? m + 'min' : '');
}

// ——————————————————————————————————————————
// Init
// ——————————————————————————————————————————
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});
