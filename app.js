// ============================================================
//  APP.JS — Planner Logic
// ============================================================

// ── Storage ─────────────────────────────────────────────────
const STORAGE_KEY = 'planner_state_v2';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveState(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

let state = loadState();
// state shape: { tasks: { [id]: { status:'pending'|'done'|'failed', rescheduledTo: dateStr|null } }, custom: [ taskObj ] }
if (!state.tasks)  state.tasks  = {};
if (!state.custom) state.custom = [];

// ── Helpers ──────────────────────────────────────────────────
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function weekStart(weekIndex) {
  return addDays(PLAN_START, weekIndex * 7);
}
function dateStr(d) {
  return d.toISOString().slice(0, 10);
}
function parseDate(s) {
  const [y,m,d] = s.split('-').map(Number);
  return new Date(y, m-1, d);
}
function formatDay(d) {
  return d.getDate();
}
function formatMonth(d) {
  const names = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  return names[d.getMonth()];
}
const DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const DAY_NAMES_FULL = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];

// Get phase info for a given week index
function getPhase(weekIdx) {
  let acc = 0;
  for (const ph of PHASES) {
    acc += ph.weeks;
    if (weekIdx < acc) return ph;
  }
  return PHASES[PHASES.length - 1];
}
function getWeekOfPhase(weekIdx) {
  let acc = 0, phaseNum = 0;
  for (const ph of PHASES) {
    if (weekIdx < acc + ph.weeks) return { phase: ph, weekInPhase: weekIdx - acc + 1, phaseNum };
    acc += ph.weeks;
    phaseNum++;
  }
  return { phase: PHASES[PHASES.length-1], weekInPhase: weekIdx - (26 - PHASES[PHASES.length-1].weeks) + 1, phaseNum: PHASES.length-1 };
}

// Build a unique id for a scheduled task
function schedId(task) {
  return `sched_${task.week}_${task.day}_${encodeURIComponent(task.title.slice(0,20))}`;
}

// Get all tasks for a given date (as dateStr 'YYYY-MM-DD')
function getTasksForDate(ds) {
  const tasks = [];
  // Scheduled tasks that were originally on this date
  for (const t of SCHEDULE) {
    const ws = weekStart(t.week);
    const orig = addDays(ws, t.day);
    const id = schedId(t);
    const taskState = state.tasks[id] || {};
    // Rescheduled to another date? skip original slot
    if (taskState.rescheduledTo && taskState.rescheduledTo !== dateStr(orig)) {
      if (taskState.rescheduledTo === ds) {
        tasks.push({ ...t, id, status: taskState.status || 'pending', rescheduled: true, origDate: dateStr(orig) });
      }
      continue;
    }
    if (dateStr(orig) === ds) {
      tasks.push({ ...t, id, status: taskState.status || 'pending', rescheduled: false });
    }
  }
  // Custom tasks added by user on this date
  for (const ct of state.custom) {
    if (ct.date === ds) {
      tasks.push({ ...ct, status: state.tasks[ct.id]?.status || 'pending' });
    }
  }
  return tasks;
}

// ── Progress ─────────────────────────────────────────────────
function calcProgress() {
  const total = SCHEDULE.length;
  let done = 0;
  for (const t of SCHEDULE) {
    const id = schedId(t);
    if (state.tasks[id]?.status === 'done') done++;
  }
  // also count custom done
  for (const ct of state.custom) {
    if (state.tasks[ct.id]?.status === 'done') done++;
  }
  return total ? Math.round((done / total) * 100) : 0;
}

function updateProgress() {
  const pct = calcProgress();
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressPercent').textContent = pct + '%';
}

// ── State: current week index ─────────────────────────────────
// Default to current week
function currentWeekIndex() {
  const today = new Date();
  today.setHours(0,0,0,0);
  const start = new Date(PLAN_START);
  start.setHours(0,0,0,0);
  const diff = Math.floor((today - start) / (7 * 24 * 3600 * 1000));
  return Math.max(0, Math.min(25, diff));
}

let visibleWeek = currentWeekIndex();

// ── Render ────────────────────────────────────────────────────
function renderWeek() {
  const grid = document.getElementById('weekGrid');
  grid.innerHTML = '';

  const ws = weekStart(visibleWeek);
  const { phase, weekInPhase } = getWeekOfPhase(visibleWeek);
  const we = addDays(ws, 6);

  // Update nav
  const label = `Неделя ${visibleWeek+1} · ${formatDay(ws)} ${formatMonth(ws)} – ${formatDay(we)} ${formatMonth(we)}`;
  document.getElementById('weekLabel').textContent = label;
  document.getElementById('phaseBadge').textContent = `${phase.name} · нед. ${weekInPhase}`;
  document.getElementById('phaseBadge').style.background = phase.color + '18';
  document.getElementById('phaseBadge').style.color = phase.color;
  document.getElementById('phaseBadge').style.borderColor = phase.color + '55';

  const today = dateStr(new Date());

  for (let d = 0; d < 7; d++) {
    const date = addDays(ws, d);
    const ds = dateStr(date);
    const tasks = getTasksForDate(ds);
    const isToday = ds === today;
    const isWeekend = d >= 5;

    const col = document.createElement('div');
    col.className = 'day-col' + (isToday ? ' today' : '') + (isWeekend ? ' weekend' : '');
    col.dataset.date = ds;

    // Header
    col.innerHTML = `
      <div class="day-header">
        <div class="day-name">${DAY_NAMES[d]}</div>
        <div class="day-date">${formatDay(date)} ${formatMonth(date)}</div>
      </div>
      <div class="day-tasks" id="tasks_${ds}"></div>
      <button class="add-task-btn" data-date="${ds}">+ добавить</button>
    `;
    grid.appendChild(col);

    // Render tasks
    const tasksEl = col.querySelector(`#tasks_${ds}`);
    for (const task of tasks) {
      tasksEl.appendChild(renderTaskCard(task, ds));
    }
  }

  // Bind add-task buttons
  grid.querySelectorAll('.add-task-btn').forEach(btn => {
    btn.addEventListener('click', () => openAddModal(btn.dataset.date));
  });

  updateProgress();
}

function renderTaskCard(task, ds) {
  const card = document.createElement('div');
  card.className = 'task-card' +
    (task.status === 'done' ? ' done' : '') +
    (task.status === 'failed' ? ' failed' : '') +
    (task.rescheduled ? ' rescheduled' : '');
  card.dataset.type = task.type || 'custom';

  const icon = task.status === 'done' ? '✅' : task.status === 'failed' ? '❌' : '';

  let actionBtns = '';
  if (task.status === 'pending') {
    actionBtns = `
      <button class="task-btn done-btn" data-id="${task.id}" data-action="done">✓ Выполнено</button>
      <button class="task-btn fail-btn" data-id="${task.id}" data-action="failed">✗ Не выполнено</button>
    `;
    // Only show reschedule for lecture/mentor/assignment
    if (task.type !== 'custom') {
      actionBtns += `<button class="task-btn reschedule-btn" data-id="${task.id}" data-date="${ds}" data-action="reschedule">↷ Перенести</button>`;
    }
  } else {
    actionBtns = `<button class="task-btn delete-btn" data-id="${task.id}" data-action="undo">↩ Сбросить</button>`;
  }

  // Reschedule note
  const rescheduleNote = task.rescheduled
    ? `<div class="task-meta" style="color:var(--yellow)">↷ Перенесено с ${task.origDate}</div>`
    : '';

  card.innerHTML = `
    ${icon ? `<span class="task-status-icon">${icon}</span>` : ''}
    <div class="task-title">${task.title}</div>
    ${task.meta ? `<div class="task-meta">${task.meta}</div>` : ''}
    ${rescheduleNote}
    <div class="task-actions">${actionBtns}</div>
  `;

  // Bind actions
  card.querySelectorAll('.task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const { id, action, date } = btn.dataset;
      handleTaskAction(id, action, date);
    });
  });

  return card;
}

// ── Task Actions ──────────────────────────────────────────────
function handleTaskAction(id, action, date) {
  if (action === 'done') {
    state.tasks[id] = { ...state.tasks[id], status: 'done' };
  } else if (action === 'failed') {
    state.tasks[id] = { ...state.tasks[id], status: 'failed' };
  } else if (action === 'undo') {
    state.tasks[id] = { ...state.tasks[id], status: 'pending' };
  } else if (action === 'reschedule') {
    openRescheduleModal(id, date);
    return;
  } else if (action === 'delete') {
    state.custom = state.custom.filter(c => c.id !== id);
    delete state.tasks[id];
  }
  saveState(state);
  renderWeek();
}

// ── Add Task Modal ────────────────────────────────────────────
function openAddModal(date) {
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  const d = parseDate(date);
  title.textContent = `Добавить задачу · ${formatDay(d)} ${formatMonth(d)}`;

  body.innerHTML = `
    <div class="form-group">
      <label class="form-label">Название *</label>
      <input class="form-input" id="newTaskTitle" placeholder="Например: Посмотреть урок по Figma" />
    </div>
    <div class="form-group">
      <label class="form-label">Доп. инфо / время</label>
      <input class="form-input" id="newTaskMeta" placeholder="~1 ч · Figma" />
    </div>
    <div class="form-group">
      <label class="form-label">Тип</label>
      <select class="form-select" id="newTaskType">
        <option value="custom">Обычная задача</option>
        <option value="lecture">Лекция</option>
        <option value="assignment">Задание</option>
        <option value="mentor">Ментор</option>
      </select>
    </div>
    <button class="submit-btn" id="submitNewTask">Добавить задачу</button>
  `;

  overlay.classList.add('open');

  document.getElementById('submitNewTask').addEventListener('click', () => {
    const titleVal = document.getElementById('newTaskTitle').value.trim();
    if (!titleVal) return;
    const id = 'custom_' + Date.now();
    const task = {
      id,
      date,
      title: titleVal,
      meta: document.getElementById('newTaskMeta').value.trim(),
      type: document.getElementById('newTaskType').value,
    };
    state.custom.push(task);
    state.tasks[id] = { status: 'pending' };
    saveState(state);
    overlay.classList.remove('open');
    renderWeek();
  });
}

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('open');
});
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay'))
    document.getElementById('modalOverlay').classList.remove('open');
});

// ── Reschedule Modal ──────────────────────────────────────────
function openRescheduleModal(taskId, currentDate) {
  const overlay = document.getElementById('rescheduleOverlay');
  const body = document.getElementById('rescheduleBody');

  body.innerHTML = `
    <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:14px;">
      Выбери новую дату для задачи:
    </p>
    <div class="form-group">
      <label class="form-label">Выбрать дату</label>
      <input type="date" class="form-input" id="rescheduleDate" value="${currentDate}" />
    </div>
    <button class="submit-btn" id="submitReschedule">Перенести</button>
  `;

  overlay.classList.add('open');

  document.getElementById('submitReschedule').addEventListener('click', () => {
    const newDate = document.getElementById('rescheduleDate').value;
    if (!newDate) return;
    state.tasks[taskId] = { ...state.tasks[taskId], status: 'pending', rescheduledTo: newDate };
    saveState(state);
    overlay.classList.remove('open');
    renderWeek();
  });
}

document.getElementById('rescheduleClose').addEventListener('click', () => {
  document.getElementById('rescheduleOverlay').classList.remove('open');
});
document.getElementById('rescheduleOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('rescheduleOverlay'))
    document.getElementById('rescheduleOverlay').classList.remove('open');
});

// ── Nav ───────────────────────────────────────────────────────
document.getElementById('prevWeek').addEventListener('click', () => {
  if (visibleWeek > 0) { visibleWeek--; renderWeek(); }
});
document.getElementById('nextWeek').addEventListener('click', () => {
  if (visibleWeek < 25) { visibleWeek++; renderWeek(); }
});

// Keyboard arrows
document.addEventListener('keydown', (e) => {
  if (document.querySelector('.modal-overlay.open')) return;
  if (e.key === 'ArrowLeft'  && visibleWeek > 0)  { visibleWeek--; renderWeek(); }
  if (e.key === 'ArrowRight' && visibleWeek < 25) { visibleWeek++; renderWeek(); }
});

// ── Init ──────────────────────────────────────────────────────
renderWeek();
