'use strict';

/* ==========================================================================
   LEDGER — Student Study Toolkit
   Vanilla JS. All data persisted to localStorage under STORAGE_KEY.
   ========================================================================== */

const STORAGE_KEY = 'ledger_student_toolkit_v1';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const GRADE_POINTS = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 };
const QUOTES = [
  "Small, consistent effort beats last-minute cramming.",
  "Discipline is choosing between what you want now and what you want most.",
  "Every page you read today is a page you won't panic about tomorrow.",
  "Progress, not perfection.",
  "Your future self is watching you right now through memories.",
  "A little progress each day adds up to big results.",
  "Focus on being productive instead of busy.",
  "Small progress every day becomes extraordinary achievement.",
  "Your future is built by what you study today.",
  "Consistency beats motivation when motivation fades.",
  "The subject you avoid the most is usually the one worth an hour today.",
  "Done is better than perfect, especially the night before a deadline.",
  "You don't need more time — you need a clearer next step.",
  "One focused hour beats four distracted ones.",
  "Grades fade, but the habit of showing up doesn't.",
  "Start before you feel ready. Readiness comes from starting.",
  "A tidy plan turns a scary syllabus into a short list.",
  "Every expert was once a beginner staring at the same blank page.",
  "The best time to review your notes is before you need them.",
  "Rest is part of the plan, not a break from it.",
  "You are not behind. You are exactly where your effort has taken you so far.",
  "Study like the exam is tomorrow, rest like it's next month.",
  "Understanding beats memorizing, every single time.",
  "Ask the question in class. Someone else has it too.",
  "Your GPA is a number. Your habits are a system. Build the system.",
  "The syllabus is a map, not a mountain.",
  "Ten focused minutes now save an hour of panic later.",
  "You can't pour from an empty notebook — review before you build.",
  "Confidence on exam day is just practice you don't remember doing.",
  "Break the big task down until it's almost too easy to skip.",
  "A clear desk makes room for a clear mind.",
  "Learning is a rehearsal for the moment you actually need it.",
  "Today's flashcards are tomorrow's shortcuts.",
  "You don't rise to the level of your goals — you fall to the level of your habits.",
  "Momentum is built in five-minute starts, not two-hour heroics.",
  "Nobody remembers the all-nighter. Everyone remembers the grade.",
  "The plan doesn't have to be perfect. It has to exist.",
  "Every subject gets easier once you stop avoiding it.",
  "Your notes today are a letter to the you who has an exam tomorrow.",
  "Progress hides in boring repetition.",
  "Show up on the days you don't feel like it — that's the whole game.",
  "A question answered honestly beats an answer guessed confidently.",
  "The version of you a month from now is built this week.",
  "Study smarter by studying sooner.",
  "You're not behind everyone else. You're just mid-chapter.",
  "Effort compounds quietly until, one day, it doesn't.",
  "Clarity comes from starting, not from waiting to feel ready.",
  "Revisit it once, twice, three times — that's how it sticks.",
  "The hardest part of any assignment is opening the document.",
  "Small wins today build the discipline for the bigger ones tomorrow.",
  "You don't have to see the whole staircase, just the next step.",
  "A short daily habit beats a long occasional binge.",
  "Focus is a skill. Practice it like one.",
  "The best note-taking system is the one you actually use.",
  "Today's discomfort is tomorrow's confidence.",
  "One more flashcard. One more page. One more rep.",
  "Nothing about studying gets easier — you just get stronger.",
  "Track it, and you'll trust it. Guess it, and you'll doubt it.",
  "Consistency is a quiet kind of talent.",
  "Every completed task is proof you can finish the next one.",
  "Study time is an investment, not an expense.",
  "The goal isn't to feel motivated. It's to feel done.",
  "Your attendance record is a promise you make to future you.",
  "A pomodoro a day keeps the deadline panic away.",
  "You already know more than you did yesterday — keep going.",
  "The exam doesn't test what you know. It tests what you practiced.",
  "Some days you study for grades, some days for growth. Both count.",
  "The blank page gets less scary the moment you write one line.",
  "Deadlines are just decisions you haven't made yet.",
  "A calm plan beats a frantic scramble every time.",
  "Study today so tomorrow can be easier, not harder.",
  "The habit matters more than the mood.",
  "Even fifteen minutes moves the needle.",
  "You can't control the exam. You can control the preparation.",
  "Progress is loud in hindsight and quiet in the moment.",
  "The classroom rewards curiosity more than it rewards cramming.",
  "Every subject has a version of itself that makes sense — find it.",
  "The best revision plan is the one written down, not the one in your head.",
  "You're allowed to go slow, as long as you don't stop.",
  "One organized folder saves an hour of searching later.",
  "The work you do quietly today shows up loudly on results day.",
  "Learning sticks when you explain it in your own words.",
  "A streak isn't about perfection — it's about not quitting twice in a row.",
  "Your best study session starts with your worst first draft.",
  "The library doesn't care how you feel. Neither does the deadline. Show up anyway.",
  "Tired is not the same as done.",
  "Every past exam you passed started as an assignment you almost skipped.",
  "You're one focused session away from feeling in control again.",
  "The syllabus gets shorter every week you take seriously.",
  "Small habits, repeated daily, outperform big plans, abandoned quickly.",
  "Study now, so free time later actually feels free.",
  "The goal is fluency, not just familiarity.",
  "You don't need a perfect plan — you need today's plan.",
  "Practice tests are just future exams with lower stakes.",
  "What you review tonight, you won't panic about tomorrow.",
  "Your attention is the scarcest resource you have — spend it on purpose.",
  "Discipline looks boring in the moment and brilliant in the results.",
  "A finished task is worth more than a perfect intention.",
  "Every chapter you understand today is one less to fear later.",
  "The version of the plan you follow beats the version you admire.",
  "Study the way you'd coach a friend — with patience, not panic.",
  "Momentum forgives a slow start. It doesn't forgive no start.",
  "You'll never regret the extra review session — only the skipped one.",
  "Growth happens in the sessions nobody applauds.",
  "Today's checklist is tomorrow's peace of mind."
];

/* ---------------------------- Daily quote ---------------------------- */
const DAILY_QUOTE_KEY = 'ledger_daily_quote_v1';

function todayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Small deterministic string hash — same date always maps to the same
// quote index, so the "daily" quote is stable across reloads without
// needing a server, and changes automatically once the date rolls over.
function hashToIndex(str, mod) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

function getDailyQuoteIndex() {
  const today = todayDateKey();
  try {
    const raw = localStorage.getItem(DAILY_QUOTE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.date === today && Number.isInteger(saved.index)) {
        return saved.index;
      }
    }
  } catch (e) { /* corrupted entry — fall through to a fresh pick */ }
  const index = hashToIndex(today, QUOTES.length);
  try { localStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify({ date: today, index })); } catch (e) {}
  return index;
}

function setDailyQuoteIndex(index) {
  try { localStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify({ date: todayDateKey(), index })); } catch (e) {}
}

function showQuote(index, animate = false) {
  const el = qs('#motivationQuote');
  if (!el) return;
  el.textContent = `"${QUOTES[index]}"`;
  if (animate) {
    el.classList.remove('is-swapping');
    void el.offsetWidth; // restart the CSS animation
    el.classList.add('is-swapping');
  }
}

// The refresh button swaps today's displayed quote and remembers the
// choice for the rest of the day, so repeated page reloads stay stable —
// only a new calendar date (or another click) changes it again.
function initQuoteRefresh() {
  const btn = qs('#quoteRefreshBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = getDailyQuoteIndex();
    let next = current;
    if (QUOTES.length > 1) {
      while (next === current) next = Math.floor(Math.random() * QUOTES.length);
    }
    setDailyQuoteIndex(next);
    showQuote(next, true);
    btn.classList.remove('is-spinning');
    void btn.offsetWidth;
    btn.classList.add('is-spinning');
  });
}

/* ---------------------------- Utilities ---------------------------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const pad2 = (n) => String(n).padStart(2, '0');

function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ', ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function daysUntil(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  return (target - now) / (1000 * 60 * 60 * 24);
}

/* ---------------------------- Toasts ---------------------------- */
function toast(message, type = 'default', duration = 3200) {
  const container = qs('#toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 220);
  }, duration);
}

/* ---------------------------- Confirm modal ---------------------------- */
function confirmAction(message, onConfirm) {
  const modal = qs('#confirmModal');
  const previouslyFocused = document.activeElement;
  qs('#confirmMessage').textContent = message;
  modal.hidden = false;
  const okBtn = qs('#confirmOkBtn');
  const cancelBtn = qs('#confirmCancelBtn');
  const cleanup = () => {
    modal.hidden = true;
    okBtn.removeEventListener('click', okHandler);
    cancelBtn.removeEventListener('click', cancelHandler);
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  };
  const okHandler = () => { cleanup(); onConfirm(); };
  const cancelHandler = () => cleanup();
  okBtn.addEventListener('click', okHandler);
  cancelBtn.addEventListener('click', cancelHandler);
  // Default focus to Cancel — the safer action — for keyboard users.
  cancelBtn.focus();
}

/* Escape key closes whichever modal is open, without triggering the
   destructive/confirm action (Cancel semantics). */
function initModalEscapeHandling() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const confirmModal = qs('#confirmModal');
    const noteModal = qs('#noteModal');
    if (confirmModal && !confirmModal.hidden) {
      qs('#confirmCancelBtn').click();
    } else if (noteModal && !noteModal.hidden) {
      closeNoteModal();
    }
  });
}

/* ==========================================================================
   STATE
   ========================================================================== */
function defaultState() {
  return {
    theme: 'light',
    onboardingDismissed: false,
    profile: { name: 'Student', targetAttendance: 75 },
    tasks: [],
    assignments: [],
    classes: [],
    exams: [],
    gpaRows: [
      { id: uid(), subject: '', credits: 3, grade: 'A' },
    ],
    cgpaHistory: [],
    attendanceRecord: { total: 0, attended: 0 },
    notes: [],
    flashcards: [],
    quizAttempts: [],
    pomodoro: { focusMin: 25, shortMin: 5, longMin: 15, sessionsToday: 0, lastSessionDate: null, streak: 0, lastStreakDate: null },
    studyHours: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
  };
}

let state = loadState();

/* Deep-merge saved data onto fresh defaults so a corrupted, partial, or
   older-version localStorage payload can never leave a nested object
   (profile, pomodoro, attendanceRecord, studyHours) with missing keys —
   that used to be able to turn into NaN/undefined shown across the UI. */
function mergeDefaults(defaults, saved) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return defaults;
  const out = { ...defaults };
  Object.keys(defaults).forEach(key => {
    const defVal = defaults[key];
    const savedVal = saved[key];
    if (savedVal === undefined || savedVal === null) return;
    if (Array.isArray(defVal)) {
      out[key] = Array.isArray(savedVal) ? savedVal : defVal;
    } else if (defVal && typeof defVal === 'object') {
      out[key] = mergeDefaults(defVal, savedVal);
    } else {
      out[key] = savedVal;
    }
  });
  return out;
}

let stateLoadWarning = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return mergeDefaults(defaultState(), parsed);
  } catch (e) {
    console.warn('Failed to load state, using defaults', e);
    stateLoadWarning = true;
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state', e);
    toast('Could not save data — storage may be full.', 'danger');
  }
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
const SECTION_META = {
  dashboard: { title: 'Dashboard', sub: "Here's where your semester stands today." },
  planner: { title: 'Study Planner', sub: 'Plan focused study sessions and track them to done.' },
  assignments: { title: 'Assignments', sub: 'Keep every deadline visible before it becomes urgent.' },
  timetable: { title: 'Timetable', sub: 'Your weekly class schedule at a glance.' },
  exams: { title: 'Exam Countdown', sub: 'Know exactly how much time is left to prepare.' },
  gpa: { title: 'GPA / CGPA Calculator', sub: 'Track semester GPA and cumulative CGPA.' },
  percentage: { title: 'Percentage Calculator', sub: 'Convert marks into percentage and grade instantly.' },
  attendance: { title: 'Attendance Calculator', sub: 'Stay above the minimum attendance requirement.' },
  notes: { title: 'Notes', sub: 'Capture and organize everything worth remembering.' },
  flashcards: { title: 'Flashcards', sub: 'Active recall for faster, longer-lasting memory.' },
  quiz: { title: 'Quiz Practice', sub: 'Test your knowledge under light time pressure.' },
  pomodoro: { title: 'Pomodoro Timer', sub: 'Work in focused sprints with real breaks.' },
  progress: { title: 'Academic Progress', sub: 'A visual look at how your semester is trending.' },
  settings: { title: 'Settings', sub: 'Personalize Ledger and manage your data.' },
};

function goToSection(name) {
  qsa('.view').forEach(v => v.classList.toggle('is-active', v.dataset.view === name));
  qsa('.nav-item').forEach(b => {
    const active = b.dataset.section === name;
    b.classList.toggle('is-active', active);
    if (active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  const meta = SECTION_META[name];
  if (meta) {
    qs('#sectionTitle').textContent = meta.title;
    qs('#sectionSubtitle').textContent = meta.sub;
  }
  qs('#content').scrollTop = 0;
  window.scrollTo(0, 0);
  closeMobileSidebar();
  if (name === 'progress') renderProgress();
}

function initNav() {
  qsa('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => goToSection(btn.dataset.section));
  });
  // Delegated (not queried once at startup) so buttons rendered later —
  // like the onboarding checklist — work without extra wiring.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-goto]');
    if (btn) goToSection(btn.dataset.goto);
  });
}

function closeMobileSidebar() {
  qs('#sidebar').classList.remove('is-open');
  qs('#mobileOverlay').hidden = true;
}

function initMobileNav() {
  const sidebar = qs('#sidebar');
  const overlay = qs('#mobileOverlay');
  qs('#hamburgerBtn').addEventListener('click', () => {
    sidebar.classList.add('is-open');
    overlay.hidden = false;
  });
  overlay.addEventListener('click', closeMobileSidebar);
}

/* ==========================================================================
   CLOCK
   ========================================================================== */
function tickClock() {
  const timeEl = qs('#clockTime');
  const dateEl = qs('#clockDate');
  if (!timeEl || !dateEl) return;
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function initClock() {
  tickClock();
  setInterval(tickClock, 1000);
}

/* ==========================================================================
   THEME
   ========================================================================== */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  qs('#themeIconSun').hidden = state.theme === 'dark';
  qs('#themeIconMoon').hidden = state.theme !== 'dark';
  qs('#darkModeSwitch').checked = state.theme === 'dark';
  qs('#themeToggle').setAttribute('aria-pressed', String(state.theme === 'dark'));
}

function initTheme() {
  applyTheme();
  qs('#themeToggle').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveState();
  });
  qs('#darkModeSwitch').addEventListener('change', (e) => {
    state.theme = e.target.checked ? 'dark' : 'light';
    applyTheme();
    saveState();
  });
}

/* ==========================================================================
   DASHBOARD
   ========================================================================== */
function computeGPA(rows) {
  let totalPoints = 0, totalCredits = 0;
  rows.forEach(r => {
    const credits = Number(r.credits) || 0;
    const points = GRADE_POINTS[r.grade] ?? 0;
    totalPoints += credits * points;
    totalCredits += credits;
  });
  return totalCredits ? totalPoints / totalCredits : 0;
}

function computeCGPA() {
  let totalPoints = 0, totalCredits = 0;
  state.cgpaHistory.forEach(s => {
    totalPoints += s.gpa * s.credits;
    totalCredits += s.credits;
  });
  return totalCredits ? totalPoints / totalCredits : 0;
}

function computeAttendancePct() {
  const { total, attended } = state.attendanceRecord;
  return total ? (attended / total) * 100 : 0;
}

function computeStudyStreak() {
  return state.pomodoro.streak || 0;
}

function computeTodayStudyHours() {
  const todayKey = DAYS[(new Date().getDay() + 6) % 7].slice(0, 3);
  return state.studyHours[todayKey] || 0;
}

function pendingTasksCount() {
  const pendingTasks = state.tasks.filter(t => !t.completed).length;
  const pendingAsg = state.assignments.filter(a => !a.completed).length;
  return pendingTasks + pendingAsg;
}

function iconSvg(path) {
  return `<svg viewBox="0 0 24 24">${path}</svg>`;
}

function renderStatGrid() {
  const gpa = computeGPA(state.gpaRows);
  const cgpa = computeCGPA();
  const att = computeAttendancePct();
  const streak = computeStudyStreak();
  const progressPct = clamp(Math.round(((state.tasks.filter(t=>t.completed).length + state.assignments.filter(a=>a.completed).length) /
    Math.max(1, state.tasks.length + state.assignments.length)) * 100), 0, 100);

  const cards = [
    { label: 'Attendance', value: att.toFixed(1) + '%', bar: att, cls: att < state.profile.targetAttendance ? 'danger' : 'success', icon: iconSvg('<path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>') },
    { label: 'Current GPA', value: gpa.toFixed(2), bar: (gpa/4)*100, cls: 'success', icon: iconSvg('<path d="M4 20V10m7 10V4m7 16v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>') },
    { label: 'CGPA', value: cgpa.toFixed(2), bar: (cgpa/4)*100, cls: 'success', icon: iconSvg('<path d="M4 20V10m7 10V4m7 16v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>') },
    { label: 'Study Streak', value: streak + ' days', bar: clamp(streak*10,0,100), cls: 'warning', icon: iconSvg('<path d="M12 2c1 4-4 5-4 9a4 4 0 0 0 8 0c0-1.5-.7-2-1-3 1.5.5 3 2.4 3 5a6 6 0 0 1-12 0C6 8 10 6 12 2Z"/>') },
    { label: "Today's Study Hours", value: computeTodayStudyHours() + 'h', bar: clamp(computeTodayStudyHours()*20,0,100), cls: 'success', icon: iconSvg('<circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v4l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>') },
    { label: 'Pending Tasks', value: pendingTasksCount(), bar: clamp(100-pendingTasksCount()*8,0,100), cls: 'warning', icon: iconSvg('<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>') },
    { label: 'Academic Progress', value: progressPct + '%', bar: progressPct, cls: 'success', icon: iconSvg('<path d="M4 19h16M7 19V9m5 10V5m5 14v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>') },
  ];

  qs('#statGrid').innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="stat-icon">${c.icon}</div>
      <span class="stat-value">${c.value}</span>
      <span class="stat-label">${c.label}</span>
      <div class="progress-bar-track"><div class="progress-bar-fill ${c.cls}" style="width:${clamp(c.bar,0,100)}%"></div></div>
    </div>
  `).join('');
}

function renderHero() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  qs('#heroGreeting').textContent = greeting;
  qs('#heroWelcome').textContent = `Welcome back, ${escapeHTML(state.profile.name || 'Student')}`;
  showQuote(getDailyQuoteIndex());

  const nextTask = [...state.tasks].filter(t => !t.completed).sort((a,b) => new Date(a.date) - new Date(b.date))[0];
  const nextAsg = [...state.assignments].filter(a => !a.completed).sort((a,b) => new Date(a.deadline) - new Date(b.deadline))[0];
  let focusText = 'No task set — add one from Study Planner';
  if (nextTask && (!nextAsg || new Date(nextTask.date) <= new Date(nextAsg.deadline))) {
    focusText = `${nextTask.goal} (${nextTask.subject})`;
  } else if (nextAsg) {
    focusText = `Finish "${nextAsg.title}" (${nextAsg.subject})`;
  }
  qs('#todaysFocusValue').textContent = focusText;
}

/* ---------- First-time onboarding checklist ---------- */
function getOnboardingSteps() {
  return [
    { done: Boolean(state.profile.name && state.profile.name.trim() && state.profile.name.trim() !== 'Student'), label: 'Add your name in Settings', goto: 'settings' },
    { done: state.gpaRows.some(r => r.subject && r.subject.trim()), label: 'Add a subject to the GPA Calculator', goto: 'gpa' },
    { done: state.tasks.length > 0, label: 'Add your first study task', goto: 'planner' },
    { done: state.exams.length > 0, label: 'Add an upcoming exam countdown', goto: 'exams' },
    { done: Object.values(state.studyHours).some(h => h > 0), label: 'Try a Pomodoro focus session', goto: 'pomodoro' },
  ];
}

function renderOnboarding() {
  const card = qs('#onboardingCard');
  if (!card) return;
  if (state.onboardingDismissed) { card.hidden = true; return; }
  const steps = getOnboardingSteps();
  if (steps.every(s => s.done)) { card.hidden = true; return; }
  card.hidden = false;
  qs('#onboardingChecklist').innerHTML = steps.map(s => `
    <button type="button" class="onboarding-step ${s.done ? 'is-done' : ''}" data-goto="${s.goto}">
      <span class="onboarding-step-icon" aria-hidden="true">${s.done ? iconSvg('<path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>') : ''}</span>
      <span>${s.label}</span>
    </button>
  `).join('');
}

function initOnboarding() {
  const card = qs('#onboardingCard');
  if (!card) return;
  qs('#onboardingDismissBtn').addEventListener('click', () => {
    state.onboardingDismissed = true;
    saveState();
    card.hidden = true;
    toast("Got it — you can always explore each tool from the sidebar.", 'default');
  });
}

function emptyState(message) {
  return `<div class="empty-state">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 10h.01M15 10h.01M8 15c1 1.2 2.4 2 4 2s3-.8 4-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    <p>${message}</p>
  </div>`;
}

function renderDashboardLists() {
  const todayName = DAYS[(new Date().getDay() + 6) % 7];
  const todaysClasses = state.classes.filter(c => c.day === todayName).sort((a,b) => a.time.localeCompare(b.time));
  qs('#todayClassesList').innerHTML = todaysClasses.length ? todaysClasses.map(c => `
    <div class="list-item">
      <div class="list-item-main">
        <span class="list-item-title">${escapeHTML(c.subject)}</span>
        <span class="list-item-sub">${c.time} · ${escapeHTML(c.room || 'TBA')} · ${escapeHTML(c.teacher || '')}</span>
      </div>
    </div>`).join('') : emptyState('No classes today. Enjoy the free time!');

  const upcomingAsg = [...state.assignments].filter(a => !a.completed).sort((a,b) => new Date(a.deadline)-new Date(b.deadline)).slice(0,4);
  qs('#upcomingAssignmentsList').innerHTML = upcomingAsg.length ? upcomingAsg.map(a => `
    <div class="list-item">
      <div class="list-item-main">
        <span class="list-item-title">${escapeHTML(a.title)}</span>
        <span class="list-item-sub">${escapeHTML(a.subject)} · Due ${formatDateShort(a.deadline)}</span>
      </div>
      <span class="badge ${daysUntil(a.deadline) < 0 ? 'overdue' : a.priority}">${daysUntil(a.deadline) < 0 ? 'Overdue' : a.priority}</span>
    </div>`).join('') : emptyState('No pending assignments. Nicely done!');

  const upcomingExams = [...state.exams].sort((a,b) => new Date(a.date)-new Date(b.date)).slice(0,4);
  qs('#upcomingExamsList').innerHTML = upcomingExams.length ? upcomingExams.map(ex => `
    <div class="list-item">
      <div class="list-item-main">
        <span class="list-item-title">${escapeHTML(ex.name)}</span>
        <span class="list-item-sub">${escapeHTML(ex.subject)} · ${formatDateShort(ex.date)}</span>
      </div>
      <span class="badge pending">${Math.max(0, Math.ceil(daysUntil(ex.date)))}d</span>
    </div>`).join('') : emptyState('No exams scheduled yet.');

  const pending = [...state.tasks].filter(t => !t.completed).sort((a,b) => new Date(a.date)-new Date(b.date)).slice(0,4);
  qs('#pendingTasksList').innerHTML = pending.length ? pending.map(t => `
    <div class="list-item">
      <div class="list-item-main">
        <span class="list-item-title">${escapeHTML(t.goal)}</span>
        <span class="list-item-sub">${escapeHTML(t.subject)} · ${formatDateShort(t.date)}</span>
      </div>
      <span class="badge ${t.priority}">${t.priority}</span>
    </div>`).join('') : emptyState('All tasks complete. Great work!');

  qs('#sidebarStreak').textContent = `${computeStudyStreak()} day streak`;
}

function renderDashboard() {
  renderHero();
  renderOnboarding();
  renderStatGrid();
  renderDashboardLists();
}

/* ==========================================================================
   STUDY PLANNER
   ========================================================================== */
let taskFilter = 'all';

function renderTasks() {
  let items = [...state.tasks].sort((a,b) => new Date(a.date) - new Date(b.date));
  if (taskFilter === 'pending') items = items.filter(t => !t.completed);
  if (taskFilter === 'completed') items = items.filter(t => t.completed);

  qs('#taskList').innerHTML = items.length ? items.map(t => `
    <div class="list-item">
      <div class="list-item-main">
        <span class="list-item-title" style="${t.completed ? 'text-decoration:line-through;color:var(--text-muted)' : ''}">${escapeHTML(t.goal)}</span>
        <span class="list-item-sub">${escapeHTML(t.subject)} · ${formatDateShort(t.date)}</span>
      </div>
      <div class="list-item-actions">
        <span class="badge ${t.priority}">${t.priority}</span>
        <button class="icon-action" data-action="toggle-task" data-id="${t.id}" title="${t.completed ? 'Mark pending' : 'Mark complete'}" aria-label="${t.completed ? 'Mark pending' : 'Mark complete'}: ${escapeHTML(t.goal)}">${iconSvg('<path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>')}</button>
        <button class="icon-action danger" data-action="delete-task" data-id="${t.id}" title="Delete" aria-label="Delete task: ${escapeHTML(t.goal)}">${iconSvg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')}</button>
      </div>
    </div>`).join('') : emptyState('No tasks here yet.');
}

function initPlanner() {
  qs('#taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = qs('#taskSubject').value.trim();
    const goal = qs('#taskGoal').value.trim();
    const date = qs('#taskDate').value;
    const priority = qs('#taskPriority').value;
    if (!subject || !goal || !date) return;
    state.tasks.push({ id: uid(), subject, goal, date, priority, completed: false });
    saveState();
    e.target.reset();
    renderTasks();
    renderDashboard();
    toast('Task added to your planner.', 'success');
  });

  qs('#taskFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    qsa('#taskFilters .chip').forEach(c => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    taskFilter = btn.dataset.filter;
    renderTasks();
  });

  qs('#taskList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'toggle-task') {
      const task = state.tasks.find(t => t.id === id);
      task.completed = !task.completed;
      saveState();
      renderTasks();
      renderDashboard();
    }
    if (btn.dataset.action === 'delete-task') {
      confirmAction('Delete this task permanently?', () => {
        state.tasks = state.tasks.filter(t => t.id !== id);
        saveState();
        renderTasks();
        renderDashboard();
        toast('Task deleted.', 'default');
      });
    }
  });
}

/* ==========================================================================
   ASSIGNMENTS
   ========================================================================== */
let assignmentFilter = 'all';

function assignmentStatus(a) {
  if (a.completed) return 'completed';
  if (daysUntil(a.deadline) < 0) return 'overdue';
  return 'pending';
}

function renderAssignments() {
  let items = [...state.assignments].sort((a,b) => new Date(a.deadline)-new Date(b.deadline));
  if (assignmentFilter !== 'all') items = items.filter(a => assignmentStatus(a) === assignmentFilter);

  qs('#assignmentList').innerHTML = items.length ? items.map(a => {
    const status = assignmentStatus(a);
    return `
    <div class="list-item">
      <div class="list-item-main">
        <span class="list-item-title" style="${a.completed ? 'text-decoration:line-through;color:var(--text-muted)' : ''}">${escapeHTML(a.title)}</span>
        <span class="list-item-sub">${escapeHTML(a.subject)} · Due ${formatDateShort(a.deadline)}${a.description ? ' · ' + escapeHTML(a.description) : ''}</span>
      </div>
      <div class="list-item-actions">
        <span class="badge ${status === 'overdue' ? 'overdue' : status === 'completed' ? 'completed' : a.priority}">${status === 'pending' ? a.priority : status}</span>
        <button class="icon-action" data-action="toggle-asg" data-id="${a.id}" title="Toggle complete" aria-label="Toggle complete: ${escapeHTML(a.title)}">${iconSvg('<path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>')}</button>
        <button class="icon-action danger" data-action="delete-asg" data-id="${a.id}" title="Delete" aria-label="Delete assignment: ${escapeHTML(a.title)}">${iconSvg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')}</button>
      </div>
    </div>`;
  }).join('') : emptyState('Nothing here. Add an assignment to get started.');
}

function initAssignments() {
  qs('#assignmentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = qs('#asgTitle').value.trim();
    const subject = qs('#asgSubject').value.trim();
    const description = qs('#asgDesc').value.trim();
    const deadline = qs('#asgDeadline').value;
    const priority = qs('#asgPriority').value;
    if (!title || !subject || !deadline) return;
    state.assignments.push({ id: uid(), title, subject, description, deadline, priority, completed: false });
    saveState();
    e.target.reset();
    renderAssignments();
    renderDashboard();
    toast('Assignment added.', 'success');
  });

  qs('#assignmentFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    qsa('#assignmentFilters .chip').forEach(c => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    assignmentFilter = btn.dataset.filter;
    renderAssignments();
  });

  qs('#assignmentList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'toggle-asg') {
      const a = state.assignments.find(x => x.id === id);
      a.completed = !a.completed;
      saveState();
      renderAssignments();
      renderDashboard();
    }
    if (btn.dataset.action === 'delete-asg') {
      confirmAction('Delete this assignment permanently?', () => {
        state.assignments = state.assignments.filter(x => x.id !== id);
        saveState();
        renderAssignments();
        renderDashboard();
        toast('Assignment deleted.', 'default');
      });
    }
  });
}

/* ==========================================================================
   TIMETABLE
   ========================================================================== */
function formatTime12(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad2(m)} ${period}`;
}

function renderTimetable() {
  qs('#timetableGrid').innerHTML = DAYS.map(day => {
    const classes = state.classes.filter(c => c.day === day).sort((a,b) => a.time.localeCompare(b.time));
    return `
    <div class="day-col">
      <h4>${day}</h4>
      ${classes.length ? classes.map(c => `
        <div class="class-chip">
          <strong>${escapeHTML(c.subject)}</strong>
          ${formatTime12(c.time)}${c.room ? ' · ' + escapeHTML(c.room) : ''}${c.teacher ? ' · ' + escapeHTML(c.teacher) : ''}
          <button class="icon-action danger" data-action="delete-class" data-id="${c.id}" title="Delete" aria-label="Delete class: ${escapeHTML(c.subject)}">${iconSvg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')}</button>
        </div>`).join('') : '<p class="muted" style="font-size:0.78rem;">No classes</p>'}
    </div>`;
  }).join('');
}

function initTimetable() {
  qs('#classForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const day = qs('#classDay').value;
    const subject = qs('#classSubject').value.trim();
    const time = qs('#classTime').value;
    const room = qs('#classRoom').value.trim();
    const teacher = qs('#classTeacher').value.trim();
    if (!subject || !time) return;
    state.classes.push({ id: uid(), day, subject, time, room, teacher });
    saveState();
    e.target.reset();
    renderTimetable();
    renderDashboard();
    toast('Class added to timetable.', 'success');
  });

  qs('#timetableGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="delete-class"]');
    if (!btn) return;
    confirmAction('Remove this class from your timetable?', () => {
      state.classes = state.classes.filter(c => c.id !== btn.dataset.id);
      saveState();
      renderTimetable();
      renderDashboard();
      toast('Class removed.', 'default');
    });
  });
}

/* ==========================================================================
   EXAM COUNTDOWN
   ========================================================================== */
function renderExamCountdowns() {
  const items = [...state.exams].sort((a,b) => new Date(a.date)-new Date(b.date));
  qs('#examList').innerHTML = items.length ? items.map(ex => `
    <div class="countdown-card" data-exam-id="${ex.id}">
      <button class="icon-action danger" data-action="delete-exam" data-id="${ex.id}" title="Delete" aria-label="Delete exam: ${escapeHTML(ex.name)}">${iconSvg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')}</button>
      <h4>${escapeHTML(ex.name)}</h4>
      <p class="muted">${escapeHTML(ex.subject)} · ${formatDateShort(ex.date)}</p>
      <div class="countdown-timer" data-target="${ex.date}">
        <div class="countdown-unit"><span class="cd-d">0</span><label>Days</label></div>
        <div class="countdown-unit"><span class="cd-h">0</span><label>Hrs</label></div>
        <div class="countdown-unit"><span class="cd-m">0</span><label>Min</label></div>
        <div class="countdown-unit"><span class="cd-s">0</span><label>Sec</label></div>
      </div>
    </div>`).join('') : emptyState('No exams added yet.');
  updateCountdowns();
}

function updateCountdowns() {
  qsa('.countdown-timer').forEach(el => {
    const target = new Date(el.dataset.target).getTime();
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.querySelector('.cd-d').textContent = d;
    el.querySelector('.cd-h').textContent = pad2(h);
    el.querySelector('.cd-m').textContent = pad2(m);
    el.querySelector('.cd-s').textContent = pad2(s);
  });
}

function initExams() {
  qs('#examForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = qs('#examName').value.trim();
    const subject = qs('#examSubject').value.trim();
    const date = qs('#examDate').value;
    if (!name || !subject || !date) return;
    state.exams.push({ id: uid(), name, subject, date });
    saveState();
    e.target.reset();
    renderExamCountdowns();
    renderDashboard();
    toast('Exam added. Countdown started.', 'success');
  });

  qs('#examList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="delete-exam"]');
    if (!btn) return;
    confirmAction('Remove this exam countdown?', () => {
      state.exams = state.exams.filter(x => x.id !== btn.dataset.id);
      saveState();
      renderExamCountdowns();
      renderDashboard();
      toast('Exam removed.', 'default');
    });
  });

  setInterval(updateCountdowns, 1000);
}

/* ==========================================================================
   GPA / CGPA CALCULATOR
   ========================================================================== */
const debouncedRenderDashboard = debounce(() => renderDashboard(), 400);

function renderGpaTable() {
  qs('#gpaTbody').innerHTML = state.gpaRows.map(r => `
    <tr data-id="${r.id}">
      <td><input type="text" class="gpa-subject" value="${escapeHTML(r.subject)}" placeholder="Subject name"></td>
      <td><input type="number" class="gpa-credits" min="0" max="10" value="${r.credits}" style="max-width:80px"></td>
      <td>
        <select class="gpa-grade">
          ${Object.keys(GRADE_POINTS).map(g => `<option value="${g}" ${g === r.grade ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      </td>
      <td><button class="icon-action danger" data-action="delete-gpa-row" title="Remove" aria-label="Remove subject${r.subject ? ': ' + escapeHTML(r.subject) : ''}">${iconSvg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')}</button></td>
    </tr>
  `).join('');
  updateGpaResult();
}

function updateGpaResult() {
  qs('#gpaResult').textContent = computeGPA(state.gpaRows).toFixed(2);
}

function renderCgpaHistory() {
  qs('#cgpaHistoryList').innerHTML = state.cgpaHistory.length ? state.cgpaHistory.map(s => `
    <div class="list-item">
      <div class="list-item-main">
        <span class="list-item-title">${escapeHTML(s.label)}</span>
        <span class="list-item-sub">GPA ${s.gpa.toFixed(2)} · ${s.credits} credit hours</span>
      </div>
      <button class="icon-action danger" data-action="delete-cgpa" data-id="${s.id}" title="Remove" aria-label="Remove semester: ${escapeHTML(s.label)}">${iconSvg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>')}</button>
    </div>`).join('') : emptyState('No semesters saved yet.');
  qs('#cgpaResult').textContent = computeCGPA().toFixed(2);
}

function initGpa() {
  // Rendering happens once via renderEverything() at the end of init() —
  // no need to render twice on startup.
  qs('#gpaTbody').addEventListener('input', (e) => {
    const row = e.target.closest('tr');
    const item = state.gpaRows.find(r => r.id === row.dataset.id);
    if (!item) return;
    if (e.target.classList.contains('gpa-subject')) item.subject = e.target.value;
    if (e.target.classList.contains('gpa-credits')) item.credits = clamp(Number(e.target.value) || 0, 0, 10);
    if (e.target.classList.contains('gpa-grade')) item.grade = e.target.value;
    saveState();
    updateGpaResult();
    // Full dashboard re-render is deferred to blur, not fired on every
    // keystroke — it's wasted work while the Dashboard view isn't visible.
    debouncedRenderDashboard();
  });

  qs('#gpaTbody').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="delete-gpa-row"]');
    if (!btn) return;
    const row = btn.closest('tr');
    if (state.gpaRows.length <= 1) { toast('Keep at least one subject.', 'warning'); return; }
    state.gpaRows = state.gpaRows.filter(r => r.id !== row.dataset.id);
    saveState();
    renderGpaTable();
    renderDashboard();
  });

  qs('#addGpaRowBtn').addEventListener('click', () => {
    state.gpaRows.push({ id: uid(), subject: '', credits: 3, grade: 'A' });
    saveState();
    renderGpaTable();
  });

  qs('#gpaResetBtn').addEventListener('click', () => {
    confirmAction('Reset the GPA calculator? This clears all current subjects.', () => {
      state.gpaRows = [{ id: uid(), subject: '', credits: 3, grade: 'A' }];
      saveState();
      renderGpaTable();
      renderDashboard();
      toast('GPA calculator reset.', 'default');
    });
  });

  qs('#saveSemesterBtn').addEventListener('click', () => {
    const gpa = computeGPA(state.gpaRows);
    const credits = state.gpaRows.reduce((sum, r) => sum + (Number(r.credits) || 0), 0);
    if (!credits) { toast('Add at least one subject with credit hours first.', 'warning'); return; }
    state.cgpaHistory.push({ id: uid(), label: `Semester ${state.cgpaHistory.length + 1}`, gpa, credits });
    saveState();
    renderCgpaHistory();
    renderDashboard();
    toast('Semester saved to your CGPA history.', 'success');
  });

  qs('#cgpaHistoryList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="delete-cgpa"]');
    if (!btn) return;
    confirmAction('Remove this semester from your CGPA history?', () => {
      state.cgpaHistory = state.cgpaHistory.filter(s => s.id !== btn.dataset.id);
      saveState();
      renderCgpaHistory();
      renderDashboard();
    });
  });
}

/* ==========================================================================
   PERCENTAGE CALCULATOR
   ========================================================================== */
function gradeFromPercent(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

function initPercentage() {
  qs('#percentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const obtained = Number(qs('#marksObtained').value);
    const total = Number(qs('#marksTotal').value);
    if (!total || total <= 0 || obtained < 0) { toast('Enter valid marks.', 'warning'); return; }
    if (obtained > total) { toast('Marks obtained cannot exceed total marks.', 'warning'); return; }
    const pct = (obtained / total) * 100;
    qs('#percentResult').textContent = pct.toFixed(2) + '%';
    qs('#percentGrade').textContent = gradeFromPercent(pct);
    qs('#percentResultBanner').hidden = false;
  });
}

/* ==========================================================================
   ATTENDANCE CALCULATOR
   ========================================================================== */
function renderAttendanceResult(total, attended, target) {
  const currentPct = (attended / total) * 100;
  const missed = total - attended;

  let extraNeeded = 0;
  let unreachable = false;
  if (currentPct < target) {
    if (target >= 100) {
      // 100% can never be recovered once a class has been missed.
      unreachable = true;
    } else {
      // (attended + x) / (total + x) >= target/100
      extraNeeded = Math.ceil((target * total - 100 * attended) / (100 - target));
      extraNeeded = Math.max(0, extraNeeded);
    }
  }

  let maxCanMiss = 0;
  if (currentPct >= target) {
    // (attended) / (total + x) >= target/100 => x <= attended*100/target - total
    maxCanMiss = Math.floor((attended * 100) / target - total);
    maxCanMiss = Math.max(0, maxCanMiss);
  }

  const resultsEl = qs('#attendanceResults');
  resultsEl.hidden = false;
  resultsEl.innerHTML = `
    <div class="mini-stat"><span>${currentPct.toFixed(1)}%</span><label>Current Attendance</label></div>
    <div class="mini-stat"><span>${missed}</span><label>Classes Missed</label></div>
    <div class="mini-stat"><span>${currentPct >= target ? maxCanMiss : 0}</span><label>Can Still Miss</label></div>
    <div class="mini-stat"><span>${currentPct < target ? (unreachable ? '—' : extraNeeded) : 0}</span><label>Classes Needed</label></div>
    ${currentPct < target
      ? (unreachable
          ? `<div class="attendance-warning">⚠ A 100% target can't be recovered once a class is missed. Aim for a slightly lower target instead.</div>`
          : `<div class="attendance-warning">⚠ You're below your ${target}% target. Attend the next ${extraNeeded} class${extraNeeded === 1 ? '' : 'es'} in a row to reach it.</div>`)
      : `<div class="attendance-ok">✓ You're on track. You can miss up to ${maxCanMiss} more class${maxCanMiss === 1 ? '' : 'es'} and stay at or above ${target}%.</div>`
    }
  `;
}

function initAttendance() {
  // Restore the learner's last saved numbers so refreshing the page (or
  // revisiting the section) doesn't silently reset a calculation they
  // already ran, and default the target to their Settings preference.
  qs('#attTarget').value = state.profile.targetAttendance;
  if (state.attendanceRecord.total) {
    qs('#attTotal').value = state.attendanceRecord.total;
    qs('#attAttended').value = state.attendanceRecord.attended;
    renderAttendanceResult(state.attendanceRecord.total, state.attendanceRecord.attended, state.profile.targetAttendance);
  }

  qs('#attendanceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const total = Number(qs('#attTotal').value);
    const attended = Number(qs('#attAttended').value);
    const target = clamp(Number(qs('#attTarget').value), 1, 100);
    if (total <= 0 || attended < 0 || attended > total) { toast('Check your numbers — attended can\'t exceed total.', 'warning'); return; }

    state.attendanceRecord = { total, attended };
    state.profile.targetAttendance = target;
    saveState();
    renderAttendanceResult(total, attended, target);
    renderDashboard();
  });
}

/* ==========================================================================
   NOTES
   ========================================================================== */
let noteSearchTerm = '';

function renderNotes() {
  // Guard every field individually: a note edited directly in localStorage
  // (or restored from an older export) might be missing a key entirely.
  let items = [...state.notes].map(n => ({
    id: n.id, updatedAt: n.updatedAt || 0,
    title: n.title || '', subject: n.subject || '', content: n.content || '',
    tags: Array.isArray(n.tags) ? n.tags : [],
  })).sort((a,b) => b.updatedAt - a.updatedAt);
  if (noteSearchTerm) {
    const term = noteSearchTerm.toLowerCase();
    items = items.filter(n => n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term) ||
      n.subject.toLowerCase().includes(term) || n.tags.some(t => t.toLowerCase().includes(term)));
  }
  qs('#notesGrid').innerHTML = items.length ? items.map(n => `
    <div class="note-card" data-id="${n.id}">
      <h4>${escapeHTML(n.title)}</h4>
      <span class="muted" style="font-size:0.76rem;">${escapeHTML(n.subject)}</span>
      <p>${escapeHTML(n.content)}</p>
      <div class="note-tags">${n.tags.map(t => `<span class="note-tag">${escapeHTML(t)}</span>`).join('')}</div>
      <div class="note-card-actions">
        <button class="btn btn-ghost btn-sm" data-action="edit-note" data-id="${n.id}">Edit</button>
        <button class="btn btn-danger btn-sm" data-action="delete-note" data-id="${n.id}">Delete</button>
      </div>
    </div>`).join('') : emptyState(noteSearchTerm ? 'No notes match your search.' : 'No notes yet — create your first one.');
}

let noteModalTrigger = null;

function openNoteModal(note = null) {
  noteModalTrigger = document.activeElement;
  qs('#noteModalTitle').textContent = note ? 'Edit Note' : 'New Note';
  qs('#noteId').value = note ? note.id : '';
  qs('#noteTitle').value = note ? note.title : '';
  qs('#noteSubject').value = note ? note.subject : '';
  qs('#noteTags').value = note ? (note.tags || []).join(', ') : '';
  qs('#noteContent').value = note ? note.content : '';
  qs('#noteModal').hidden = false;
  qs('#noteTitle').focus();
}

function closeNoteModal() {
  qs('#noteModal').hidden = true;
  if (noteModalTrigger && noteModalTrigger.focus) noteModalTrigger.focus();
}

function initNotes() {
  qs('#newNoteBtn').addEventListener('click', () => openNoteModal());
  qs('#noteCancelBtn').addEventListener('click', closeNoteModal);
  qs('#noteModal').addEventListener('click', (e) => { if (e.target.id === 'noteModal') closeNoteModal(); });

  qs('#noteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = qs('#noteId').value;
    const title = qs('#noteTitle').value.trim();
    const subject = qs('#noteSubject').value.trim();
    const content = qs('#noteContent').value.trim();
    const tags = qs('#noteTags').value.split(',').map(t => t.trim()).filter(Boolean);
    if (!title || !subject || !content) return;

    if (id) {
      const note = state.notes.find(n => n.id === id);
      Object.assign(note, { title, subject, content, tags, updatedAt: Date.now() });
      toast('Note updated.', 'success');
    } else {
      state.notes.push({ id: uid(), title, subject, content, tags, updatedAt: Date.now() });
      toast('Note saved.', 'success');
    }
    saveState();
    closeNoteModal();
    renderNotes();
  });

  qs('#notesGrid').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-action="edit-note"]');
    const delBtn = e.target.closest('[data-action="delete-note"]');
    if (editBtn) openNoteModal(state.notes.find(n => n.id === editBtn.dataset.id));
    if (delBtn) {
      confirmAction('Delete this note permanently?', () => {
        state.notes = state.notes.filter(n => n.id !== delBtn.dataset.id);
        saveState();
        renderNotes();
        toast('Note deleted.', 'default');
      });
    }
  });

  qs('#noteSearch').addEventListener('input', (e) => {
    noteSearchTerm = e.target.value;
    renderNotes();
  });
}

/* ==========================================================================
   FLASHCARDS
   ========================================================================== */
let fcIndex = 0;

function renderFlashcards() {
  const cards = state.flashcards;
  const el = qs('#flashcardEl');
  el.classList.remove('is-flipped');
  if (!cards.length) {
    qs('#fcFrontText').textContent = 'Add your first flashcard to begin.';
    qs('#fcBackText').textContent = '';
    qs('#fcCounter').textContent = '0 / 0';
    return;
  }
  fcIndex = clamp(fcIndex, 0, cards.length - 1);
  const card = cards[fcIndex];
  qs('#fcFrontText').textContent = card.question;
  qs('#fcBackText').textContent = card.answer;
  qs('#fcCounter').textContent = `${fcIndex + 1} / ${cards.length}`;
}

function initFlashcards() {
  qs('#flashcardForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const question = qs('#fcQuestion').value.trim();
    const answer = qs('#fcAnswer').value.trim();
    if (!question || !answer) return;
    state.flashcards.push({ id: uid(), question, answer });
    fcIndex = state.flashcards.length - 1;
    saveState();
    e.target.reset();
    renderFlashcards();
    toast('Flashcard added.', 'success');
  });

  qs('#fcFlipBtn').addEventListener('click', () => qs('#flashcardEl').classList.toggle('is-flipped'));
  qs('#fcNextBtn').addEventListener('click', () => {
    if (!state.flashcards.length) return;
    fcIndex = (fcIndex + 1) % state.flashcards.length;
    renderFlashcards();
  });
  qs('#fcPrevBtn').addEventListener('click', () => {
    if (!state.flashcards.length) return;
    fcIndex = (fcIndex - 1 + state.flashcards.length) % state.flashcards.length;
    renderFlashcards();
  });
  qs('#fcDeleteBtn').addEventListener('click', () => {
    if (!state.flashcards.length) return;
    confirmAction('Delete this flashcard?', () => {
      state.flashcards.splice(fcIndex, 1);
      fcIndex = Math.max(0, fcIndex - 1);
      saveState();
      renderFlashcards();
      toast('Flashcard deleted.', 'default');
    });
  });
}

/* ==========================================================================
   QUIZ PRACTICE
   ========================================================================== */
const QUIZ_BANK = [
  { q: 'What is the average time complexity of Quick Sort?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correct: 1 },
  { q: 'Which data structure uses FIFO order?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correct: 1 },
  { q: 'A DFA differs from an NFA because it has:', options: ['Multiple start states', 'Exactly one transition per input symbol per state', 'No accept states', 'Infinite states'], correct: 1 },
  { q: 'Which sorting algorithm is stable and works by dividing the array in half?', options: ['Quick Sort', 'Merge Sort', 'Selection Sort', 'Heap Sort'], correct: 1 },
  { q: 'In probability, P(A|B) refers to:', options: ['Joint probability', 'Marginal probability', 'Conditional probability', 'Union probability'], correct: 2 },
  { q: 'Binary Search requires the array to be:', options: ['Sorted', 'Unsorted', 'Circular', 'Doubly linked'], correct: 0 },
  { q: 'Which phase of the SDLC involves writing the SRS document?', options: ['Design', 'Requirements', 'Testing', 'Deployment'], correct: 1 },
];

let quizState = null;

function startQuiz() {
  const questions = [...QUIZ_BANK].sort(() => Math.random() - 0.5).slice(0, 5);
  quizState = { questions, index: 0, score: 0, timer: null, timeLeft: 20 };
  qs('#quizIntroCard').hidden = true;
  qs('#quizResultCard').hidden = true;
  qs('#quizActiveCard').hidden = false;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const { questions, index } = quizState;
  const q = questions[index];
  qs('#quizProgress').textContent = `Question ${index + 1} / ${questions.length}`;
  qs('#quizScoreLive').textContent = `Score: ${quizState.score}`;
  qs('#quizQuestionText').textContent = q.q;
  qs('#quizFeedback').hidden = true;
  qs('#quizOptions').innerHTML = q.options.map((opt, i) => `
    <button class="quiz-option" data-index="${i}">${escapeHTML(opt)}</button>
  `).join('');

  quizState.timeLeft = 20;
  qs('#quizTimer').textContent = quizState.timeLeft + 's';
  clearInterval(quizState.timer);
  quizState.timer = setInterval(() => {
    quizState.timeLeft--;
    qs('#quizTimer').textContent = quizState.timeLeft + 's';
    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timer);
      handleQuizAnswer(-1);
    }
  }, 1000);
}

function handleQuizAnswer(selectedIndex) {
  clearInterval(quizState.timer);
  const q = quizState.questions[quizState.index];
  const buttons = qsa('#quizOptions .quiz-option');
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.correct) b.classList.add('correct');
    else if (i === selectedIndex) b.classList.add('incorrect');
  });
  const feedback = qs('#quizFeedback');
  feedback.hidden = false;
  if (selectedIndex === q.correct) {
    quizState.score++;
    feedback.textContent = '✓ Correct!';
    feedback.style.color = 'var(--success)';
  } else if (selectedIndex === -1) {
    feedback.textContent = `⏱ Time's up! Correct answer: ${q.options[q.correct]}`;
    feedback.style.color = 'var(--danger)';
  } else {
    feedback.textContent = `✗ Not quite. Correct answer: ${q.options[q.correct]}`;
    feedback.style.color = 'var(--danger)';
  }
  qs('#quizScoreLive').textContent = `Score: ${quizState.score}`;

  setTimeout(() => {
    quizState.index++;
    if (quizState.index >= quizState.questions.length) {
      finishQuiz();
    } else {
      renderQuizQuestion();
    }
  }, 1400);
}

function finishQuiz() {
  qs('#quizActiveCard').hidden = true;
  qs('#quizResultCard').hidden = false;
  qs('#quizFinalScore').textContent = `${quizState.score} / ${quizState.questions.length}`;
  const pct = (quizState.score / quizState.questions.length) * 100;
  qs('#quizResultMsg').textContent = pct >= 80 ? 'Excellent work — you know this material well.' :
    pct >= 50 ? 'Good effort. A bit more revision will help.' : 'Keep practicing — review the topics and try again.';
  state.quizAttempts.push({ score: quizState.score, total: quizState.questions.length, date: Date.now() });
  saveState();
  renderDashboard();
}

function initQuiz() {
  qs('#startQuizBtn').addEventListener('click', startQuiz);
  qs('#restartQuizBtn').addEventListener('click', () => {
    qs('#quizResultCard').hidden = true;
    qs('#quizIntroCard').hidden = false;
  });
  qs('#quizOptions').addEventListener('click', (e) => {
    const btn = e.target.closest('.quiz-option');
    if (!btn || btn.disabled) return;
    handleQuizAnswer(Number(btn.dataset.index));
  });
}

/* ==========================================================================
   POMODORO TIMER
   ========================================================================== */
const RING_CIRCUMFERENCE = 2 * Math.PI * 88;
let pomodoroTimer = { mode: 'focus', secondsLeft: 25 * 60, totalSeconds: 25 * 60, running: false, intervalId: null };

function pomodoroModeMinutes(mode) {
  return { focus: state.pomodoro.focusMin, short: state.pomodoro.shortMin, long: state.pomodoro.longMin }[mode];
}

function setPomodoroMode(mode) {
  clearInterval(pomodoroTimer.intervalId);
  pomodoroTimer.running = false;
  pomodoroTimer.mode = mode;
  const minutes = pomodoroModeMinutes(mode);
  pomodoroTimer.totalSeconds = minutes * 60;
  pomodoroTimer.secondsLeft = minutes * 60;
  qsa('#pomodoroModes .chip').forEach(c => c.classList.toggle('is-active', c.dataset.mode === mode));
  renderPomodoroDisplay();
}

function renderPomodoroDisplay() {
  const m = Math.floor(pomodoroTimer.secondsLeft / 60);
  const s = pomodoroTimer.secondsLeft % 60;
  qs('#pomodoroTime').textContent = `${pad2(m)}:${pad2(s)}`;
  const progress = 1 - (pomodoroTimer.secondsLeft / pomodoroTimer.totalSeconds);
  qs('#pomodoroRingProgress').style.strokeDasharray = RING_CIRCUMFERENCE;
  qs('#pomodoroRingProgress').style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - progress);
  qs('#pomodoroSessions').textContent = state.pomodoro.sessionsToday;
  qs('#pomodoroStreak').textContent = state.pomodoro.streak;
}

function startPomodoro() {
  if (pomodoroTimer.running) return;
  pomodoroTimer.running = true;
  pomodoroTimer.intervalId = setInterval(() => {
    pomodoroTimer.secondsLeft--;
    if (pomodoroTimer.secondsLeft <= 0) {
      clearInterval(pomodoroTimer.intervalId);
      pomodoroTimer.running = false;
      onPomodoroComplete();
      return;
    }
    renderPomodoroDisplay();
  }, 1000);
}

function pausePomodoro() {
  pomodoroTimer.running = false;
  clearInterval(pomodoroTimer.intervalId);
}

function resetPomodoro() {
  setPomodoroMode(pomodoroTimer.mode);
}

function onPomodoroComplete() {
  const todayStr = new Date().toDateString();
  if (pomodoroTimer.mode === 'focus') {
    if (state.pomodoro.lastSessionDate !== todayStr) {
      state.pomodoro.sessionsToday = 0;
    }
    state.pomodoro.sessionsToday++;
    state.pomodoro.lastSessionDate = todayStr;

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.pomodoro.lastStreakDate === todayStr) {
      // already counted today
    } else if (state.pomodoro.lastStreakDate === yesterday) {
      state.pomodoro.streak++;
      state.pomodoro.lastStreakDate = todayStr;
    } else {
      state.pomodoro.streak = 1;
      state.pomodoro.lastStreakDate = todayStr;
    }

    const dayKey = DAYS[(new Date().getDay() + 6) % 7].slice(0,3);
    state.studyHours[dayKey] = +(((state.studyHours[dayKey] || 0) + state.pomodoro.focusMin / 60).toFixed(2));

    toast('Focus session complete! Time for a break.', 'success', 4000);
  } else {
    toast('Break finished. Ready for another focus session?', 'default', 4000);
  }
  saveState();
  renderPomodoroDisplay();
  renderDashboard();
  qs('#pomodoroTime').textContent = '00:00';
}

function initPomodoro() {
  qs('#focusMinutes').value = state.pomodoro.focusMin;
  qs('#shortMinutes').value = state.pomodoro.shortMin;
  qs('#longMinutes').value = state.pomodoro.longMin;
  setPomodoroMode('focus');

  qs('#pomodoroModes').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    setPomodoroMode(btn.dataset.mode);
  });

  qs('#pomodoroStartBtn').addEventListener('click', startPomodoro);
  qs('#pomodoroPauseBtn').addEventListener('click', pausePomodoro);
  qs('#pomodoroResetBtn').addEventListener('click', resetPomodoro);

  qs('#pomodoroSettingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.pomodoro.focusMin = clamp(Number(qs('#focusMinutes').value) || 25, 1, 180);
    state.pomodoro.shortMin = clamp(Number(qs('#shortMinutes').value) || 5, 1, 60);
    state.pomodoro.longMin = clamp(Number(qs('#longMinutes').value) || 15, 1, 90);
    saveState();
    setPomodoroMode(pomodoroTimer.mode);
    toast('Timer durations saved.', 'success');
  });
}

/* ==========================================================================
   PROGRESS
   ========================================================================== */
function renderProgress() {
  const hours = state.studyHours;
  const maxHours = Math.max(1, ...Object.values(hours));
  qs('#studyHoursChart').innerHTML = Object.entries(hours).map(([day, val]) => `
    <div class="bar-col">
      <span class="bar-val">${val}h</span>
      <div class="bar-fill" style="height:${(val / maxHours) * 100}%"></div>
      <label>${day}</label>
    </div>`).join('');

  const doneTasks = state.tasks.filter(t => t.completed).length;
  const doneAsg = state.assignments.filter(a => a.completed).length;
  qs('#progressCompletionList').innerHTML = `
    <div class="list-item"><div class="list-item-main"><span class="list-item-title">Tasks completed</span></div><span class="badge completed">${doneTasks} / ${state.tasks.length}</span></div>
    <div class="list-item"><div class="list-item-main"><span class="list-item-title">Assignments completed</span></div><span class="badge completed">${doneAsg} / ${state.assignments.length}</span></div>
    <div class="list-item"><div class="list-item-main"><span class="list-item-title">Notes created</span></div><span class="badge pending">${state.notes.length}</span></div>
    <div class="list-item"><div class="list-item-main"><span class="list-item-title">Flashcards made</span></div><span class="badge pending">${state.flashcards.length}</span></div>
  `;

  const attempts = state.quizAttempts.slice(-6);
  const maxQuiz = Math.max(1, ...attempts.map(a => a.total));
  qs('#quizChart').innerHTML = attempts.length ? attempts.map((a, i) => `
    <div class="bar-col">
      <span class="bar-val">${a.score}/${a.total}</span>
      <div class="bar-fill" style="height:${(a.score / maxQuiz) * 100}%"></div>
      <label>#${i + 1}</label>
    </div>`).join('') : emptyState('Take a quiz to see performance here.');

  const rings = [
    { label: 'Attendance', value: computeAttendancePct(), color: 'var(--success)' },
    { label: 'GPA', value: (computeGPA(state.gpaRows) / 4) * 100, color: 'var(--accent)' },
    { label: 'CGPA', value: (computeCGPA() / 4) * 100, color: 'var(--primary)' },
    { label: 'Tasks Done', value: (state.tasks.filter(t=>t.completed).length / Math.max(1,state.tasks.length)) * 100, color: 'var(--warning)' },
  ];
  const circ = 2 * Math.PI * 40;
  qs('#overviewRings').innerHTML = rings.map(r => `
    <div class="mini-ring-wrap">
      <div style="position:relative;width:92px;height:92px;">
        <svg viewBox="0 0 100 100" class="mini-ring">
          <circle cx="50" cy="50" r="40" class="mini-ring-track"/>
          <circle cx="50" cy="50" r="40" class="mini-ring-progress" style="stroke:${r.color};stroke-dasharray:${circ};stroke-dashoffset:${circ * (1 - clamp(r.value,0,100)/100)}"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
          <span class="mini-ring-value">${Math.round(r.value)}%</span>
        </div>
      </div>
      <span class="mini-ring-label">${r.label}</span>
    </div>
  `).join('');
}

/* ==========================================================================
   AUTH (DEMO ONLY)
   --------------------------------------------------------------------------
   Ledger is a frontend-only prototype with no server, so this is a demo
   authentication experience: it never verifies a real password, and it
   never stores one. "Remember me" keeps a session in localStorage; without
   it, the session lives only in sessionStorage and ends when the tab/
   browser session closes. Swap this module out first when a real backend
   is added — everything else in the app only reads state.profile.name.
   ========================================================================== */
const AUTH_SESSION_KEY = 'ledger_auth_remember_v1';
const AUTH_SESSION_TEMP_KEY = 'ledger_auth_session_v1';
const AUTH_ACCOUNTS_KEY = 'ledger_demo_accounts_v1';

function getRememberedSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function getTempSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_TEMP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function getActiveSession() {
  return getRememberedSession() || getTempSession();
}

function setSession(name, email, remember) {
  const payload = { name, email, ts: Date.now() };
  if (remember) {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(payload));
    sessionStorage.removeItem(AUTH_SESSION_TEMP_KEY);
  } else {
    sessionStorage.setItem(AUTH_SESSION_TEMP_KEY, JSON.stringify(payload));
    localStorage.removeItem(AUTH_SESSION_KEY);
  }
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_TEMP_KEY);
}

function showLoginScreen() {
  qs('#loginScreen').hidden = false;
  qs('#appShell').hidden = true;
}

function showAppShell() {
  qs('#loginScreen').hidden = true;
  qs('#appShell').hidden = false;
}

function applySessionToProfile(session) {
  if (!session) return;
  const name = (session.name || '').trim();
  if (name) {
    state.profile.name = name;
    saveState();
  }
  const emailEl = qs('#accountEmailDisplay');
  const modeEl = qs('#accountModeDisplay');
  if (emailEl) emailEl.textContent = session.email || session.name || 'Signed in';
  if (modeEl) modeEl.textContent = getRememberedSession() ? 'Signed in · remembered on this device' : 'Signed in for this browser session';
}

function establishSession(name, email, remember) {
  setSession(name, email, remember);
  applySessionToProfile({ name, email });
  showAppShell();
  renderEverything();
}

function loginWithIdentity(nameOrEmail, remember) {
  const trimmed = (nameOrEmail || '').trim();
  const isEmail = trimmed.includes('@');
  const rawName = isEmail ? (trimmed.split('@')[0] || 'Student') : (trimmed || 'Student');
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  establishSession(displayName, isEmail ? trimmed : '', remember);
  toast(`Welcome back, ${displayName}.`, 'success');
}

function initAuth() {
  const session = getActiveSession();
  if (session) {
    applySessionToProfile(session);
    showAppShell();
  } else {
    showLoginScreen();
  }

  // Log in <-> Create account panel switching
  const loginPanel = qs('#loginPanel');
  const signupPanel = qs('#signupPanel');
  qs('#showSignupBtn').addEventListener('click', () => { loginPanel.hidden = true; signupPanel.hidden = false; });
  qs('#showLoginBtn').addEventListener('click', () => { signupPanel.hidden = true; loginPanel.hidden = false; });

  // Show/hide password toggles, shared behavior for both password fields
  [['loginPasswordToggle', 'loginPassword'], ['signupPasswordToggle', 'signupPassword']].forEach(([btnId, inputId]) => {
    const btn = qs('#' + btnId);
    const input = qs('#' + inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const willShow = input.type === 'password';
      input.type = willShow ? 'text' : 'password';
      qs('.pw-eye-open', btn).hidden = willShow;
      qs('.pw-eye-closed', btn).hidden = !willShow;
      btn.setAttribute('aria-label', willShow ? 'Hide password' : 'Show password');
    });
  });

  qs('#forgotPasswordBtn').addEventListener('click', () => {
    toast("Password reset isn't available in this demo — it's a frontend-only prototype with no backend yet. Try Demo Login, or create a new account instead.", 'warning', 5400);
  });

  qs('#demoLoginBtn').addEventListener('click', () => {
    qs('#rememberMeCheck').checked = true;
    establishSession('Demo Student', '', true);
    toast('Signed in with the demo account.', 'success');
  });

  qs('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const identifier = qs('#loginIdentifier').value.trim();
    if (!identifier) { toast('Enter a name or email to continue.', 'warning'); return; }
    const remember = qs('#rememberMeCheck').checked;
    loginWithIdentity(identifier, remember);
  });

  qs('#signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = qs('#signupName').value.trim();
    const email = qs('#signupEmail').value.trim();
    const password = qs('#signupPassword').value;
    if (!name || !email || !password) { toast('Fill in every field to create an account.', 'warning'); return; }
    // Demo-only "account creation": we remember the name/email locally so
    // this device recognizes the account next time. No password is ever
    // stored — this frontend-only build has no real way to verify one.
    try {
      const accounts = JSON.parse(localStorage.getItem(AUTH_ACCOUNTS_KEY) || '[]');
      if (!accounts.some(a => a.email === email)) {
        accounts.push({ name, email });
        localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
      }
    } catch (err) { /* non-fatal — account list is a local convenience only */ }
    establishSession(name, email, true);
    toast(`Account created — welcome, ${name}.`, 'success');
  });

  qs('#logoutBtn').addEventListener('click', () => {
    clearSession();
    qs('#loginForm').reset();
    qs('#signupForm').reset();
    signupPanel.hidden = true;
    loginPanel.hidden = false;
    showLoginScreen();
    toast('Logged out.', 'default');
  });
}

/* ==========================================================================
   SETTINGS
   ========================================================================== */
function initSettings() {
  qs('#studentName').value = state.profile.name;
  qs('#targetAttendance').value = state.profile.targetAttendance;

  qs('#profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.profile.name = qs('#studentName').value.trim() || 'Student';
    state.profile.targetAttendance = clamp(Number(qs('#targetAttendance').value) || 75, 1, 100);
    saveState();
    renderDashboard();
    toast('Profile saved.', 'success');
  });

  qs('#exportDataBtn').addEventListener('click', () => {
    const exportable = JSON.parse(JSON.stringify(state));
    const blob = new Blob([JSON.stringify(exportable, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledger-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported.', 'success', 4200);
  });

  qs('#clearDataBtn').addEventListener('click', () => {
    confirmAction('This will permanently delete ALL your saved data. Continue?', () => {
      localStorage.removeItem(STORAGE_KEY);
      state = defaultState();
      saveState();
      renderEverything();
      toast('All data cleared.', 'default');
    });
  });
}

/* ==========================================================================
   INIT
   ========================================================================== */
function renderEverything() {
  renderDashboard();
  renderTasks();
  renderAssignments();
  renderTimetable();
  renderExamCountdowns();
  renderGpaTable();
  renderCgpaHistory();
  renderNotes();
  renderFlashcards();
  renderProgress();
  renderAISubjectChips();
  applyTheme();
}

function init() {
  // Start the clock first so it remains visible even if another optional
  // feature throws during startup.
  initClock();
  try {
    if (stateLoadWarning) {
      toast('Saved data looked corrupted, so Ledger started fresh.', 'warning', 5000);
    }
    initAuth();
    initNav();
    initMobileNav();
    initTheme();
    initQuoteRefresh();
    initOnboarding();
    initPlanner();
    initAssignments();
    initTimetable();
    initExams();
    initGpa();
    initPercentage();
    initAttendance();
    initNotes();
    initFlashcards();
    initQuiz();
    initPomodoro();
    initSettings();
    initModalEscapeHandling();
    initAIAssistant(); // AI Study Assistant chatbot — see AI STUDY ASSISTANT block below

    renderEverything();

  } catch (e) {
    // A single unexpected error should never leave the user staring at the
    // loading screen forever — surface it and still reveal the app shell.
    console.error('Ledger failed to initialize cleanly', e);
  } finally {
    setTimeout(() => {
      qs('#loadingScreen').classList.add('is-hidden');
    }, 450);
  }
}

document.addEventListener('DOMContentLoaded', init);
/* ==========================================================================
   AI STUDY ASSISTANT (CHATBOT)
   --------------------------------------------------------------------------
   Fully self-contained: reuses existing helpers (qs, qsa, uid, escapeHTML,
   toast, confirmAction) but does not modify any existing function above.

   ARCHITECTURE (per project requirements):
     Student → this chat UI → backend (/api/chat) → AI model (e.g. Ollama)
   The frontend NEVER talks to an AI provider or holds an API key directly.
   It only ever calls the small backend endpoints below, so the AI provider
   behind the backend can be swapped (Ollama → OpenAI-compatible API → etc.)
   without touching this file at all.
   ========================================================================== */

/* ---- Configuration -------------------------------------------------------
   Change AI_CONFIG.apiBaseUrl if your backend runs somewhere else (a
   different port, a deployed URL, etc). Nothing else in this file needs
   to change to point at a different backend. */
const AI_CONFIG = {
  apiBaseUrl: 'http://localhost:3000',   // backend server root
  chatPath: '/api/chat',                 // POST { message, history } -> { reply }
  healthPath: '/api/health',             // GET -> { ok, provider }
  historyStorageKey: 'ledger_ai_chat_history_v1',
  maxContextMessages: 20,                // how many past turns we send back for context
};

// In-memory conversation (also mirrored to localStorage so a refresh
// doesn't lose the chat, same "everything stays on this device" spirit
// as the rest of Ledger).
let aiChatHistory = [];
let aiIsWaitingForReply = false;

/* ---- Persistence ---------------------------------------------------------
   Stored separately from STORAGE_KEY on purpose: chat history is disposable
   scratch data, not part of the student's core planner/notes state, so it
   should never be able to interfere with loadState()/mergeDefaults(). */
function loadAIChatHistory() {
  try {
    const raw = localStorage.getItem(AI_CONFIG.historyStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveAIChatHistory() {
  try {
    localStorage.setItem(AI_CONFIG.historyStorageKey, JSON.stringify(aiChatHistory));
  } catch (e) {
    // Non-fatal — chat still works for the current session even if storage
    // is full or unavailable (e.g. private browsing).
  }
}

/* ---- Light, safe formatting -----------------------------------------------
   We escape HTML first (via the existing escapeHTML helper) so the model's
   response can never inject markup, then layer a tiny bit of Markdown-like
   formatting on top for readability (bold, inline code, fenced code blocks). */
function formatAIMessage(rawText) {
  const escaped = escapeHTML(rawText);
  let html = escaped
    // fenced code blocks ```...```
    .replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`)
    // inline code `...`
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    // **bold**
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    // *italic*
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  return html;
}

/* ---- Rendering ------------------------------------------------------------ */
function renderAIChatHistory() {
  const body = qs('#aiChatBody');
  if (!body) return;
  const emptyState = qs('#aiEmptyState');

  // Remove previously rendered bubbles/typing indicator, keep the empty state node.
  qsa('.ai-msg, .ai-msg-typing-row', body).forEach((el) => el.remove());

  if (aiChatHistory.length === 0) {
    if (emptyState) emptyState.hidden = false;
    return;
  }
  if (emptyState) emptyState.hidden = true;

  aiChatHistory.forEach((msg) => appendAIMessageToDOM(msg));
  body.scrollTop = body.scrollHeight;
}

function appendAIMessageToDOM(msg) {
  const body = qs('#aiChatBody');
  if (!body) return;

  const row = document.createElement('div');
  row.className = `ai-msg ${msg.role}${msg.isError ? ' ai-msg-error' : ''}`;

  const avatar = document.createElement('div');
  avatar.className = 'ai-msg-avatar';
  avatar.textContent = msg.role === 'user' ? '🎓' : '🤖';
  avatar.setAttribute('aria-hidden', 'true');

  const wrap = document.createElement('div');
  wrap.className = 'ai-msg-bubble-wrap';

  const bubble = document.createElement('div');
  bubble.className = 'ai-msg-bubble';
  bubble.innerHTML = formatAIMessage(msg.content);

  wrap.appendChild(bubble);

  // Copy button — assistant messages only, so students can paste answers
  // into their own notes.
  if (msg.role === 'assistant' && !msg.isError) {
    const actions = document.createElement('div');
    actions.className = 'ai-msg-actions';
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'ai-msg-copy-btn';
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg> Copy';
    copyBtn.addEventListener('click', () => copyAIMessage(msg.content, copyBtn));
    actions.appendChild(copyBtn);
    wrap.appendChild(actions);
  }

  row.appendChild(avatar);
  row.appendChild(wrap);
  body.appendChild(row);
}

function copyAIMessage(text, btnEl) {
  const done = () => {
    const original = btnEl.innerHTML;
    btnEl.innerHTML = '✓ Copied';
    toast('Answer copied to clipboard.', 'success', 1800);
    setTimeout(() => { btnEl.innerHTML = original; }, 1400);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => {
      toast('Could not copy — please copy manually.', 'danger');
    });
  } else {
    // Fallback for browsers without the async Clipboard API.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); }
    catch (e) { toast('Could not copy — please copy manually.', 'danger'); }
    document.body.removeChild(ta);
  }
}

function showAITypingIndicator() {
  const body = qs('#aiChatBody');
  if (!body || qs('.ai-msg-typing-row', body)) return;
  const row = document.createElement('div');
  row.className = 'ai-msg assistant ai-msg-typing-row';
  row.innerHTML = `
    <div class="ai-msg-avatar" aria-hidden="true">🤖</div>
    <div class="ai-msg-bubble-wrap">
      <div class="ai-msg-bubble ai-typing" role="status" aria-label="AI is typing">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  body.appendChild(row);
  body.scrollTop = body.scrollHeight;
}

function hideAITypingIndicator() {
  const row = qs('.ai-msg-typing-row');
  if (row) row.remove();
}

/* ---- Backend communication -------------------------------------------------
   This is the ONLY place that knows a backend URL exists — everything else
   in this file just deals with plain message objects. Swapping AI providers
   later only ever requires backend-side changes. */
async function sendMessageToBackend(message, historyForContext) {
  const url = AI_CONFIG.apiBaseUrl + AI_CONFIG.chatPath;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000); // avoid an infinite spinner if the model hangs

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: historyForContext }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let serverMsg = '';
      try { serverMsg = (await res.json()).error || ''; } catch (e) { /* ignore */ }
      throw new Error(serverMsg || `Server responded with status ${res.status}`);
    }

    const data = await res.json();
    if (!data || typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error('The assistant returned an empty response. Please try rephrasing your question.');
    }
    return data.reply;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The assistant took too long to respond. Please try again.');
    }
    if (err instanceof TypeError) {
      // fetch() throws a generic TypeError on network failure / CORS / server down.
      throw new Error('Could not reach the AI Study Assistant backend. Is the server running?');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkAIBackendHealth() {
  const dot = qs('#aiStatusDot');
  const text = qs('#aiStatusText');
  if (!dot || !text) return;
  try {
    const res = await fetch(AI_CONFIG.apiBaseUrl + AI_CONFIG.healthPath, { method: 'GET' });
    if (!res.ok) throw new Error('unhealthy');
    const data = await res.json().catch(() => ({}));
    dot.className = 'ai-status-dot is-online';
    text.textContent = data.provider ? `Online · ${data.provider}` : 'Online';
  } catch (e) {
    dot.className = 'ai-status-dot is-offline';
    text.textContent = 'Backend offline';
  }
}

/* ---- Quick-action prompt scaffolds ----------------------------------------
   Clicking a quick action drops a starter prompt into the input box (rather
   than sending immediately) so the student can fill in their actual topic
   before it's sent — avoids firing a useless generic request. */
const AI_QUICK_PROMPTS = {
  explain: 'Explain this topic simply, with an example: ',
  notes: 'Make short, clear study notes on: ',
  quiz: 'Generate a 5-question multiple choice quiz on: ',
  solve: 'Solve this problem step-by-step and explain each step: ',
  summarize: 'Summarize the following in a few bullet points: ',
};

function handleAIQuickAction(key) {
  const input = qs('#aiChatInput');
  if (!input) return;
  input.value = AI_QUICK_PROMPTS[key] || '';
  input.focus();
  // Move the cursor to the end so the student can type right after the scaffold.
  input.selectionStart = input.selectionEnd = input.value.length;
  autoResizeAIInput(input);
}

/* ---- Sending a message ----------------------------------------------------- */
async function submitAIChatMessage() {
  const input = qs('#aiChatInput');
  if (!input || aiIsWaitingForReply) return;

  const text = input.value.trim();
  if (!text) return;

  // 1. Render + persist the student's message immediately.
  const userMsg = { id: uid(), role: 'user', content: text };
  aiChatHistory.push(userMsg);
  qs('#aiEmptyState') && (qs('#aiEmptyState').hidden = true);
  appendAIMessageToDOM(userMsg);
  saveAIChatHistory();

  input.value = '';
  autoResizeAIInput(input);

  const body = qs('#aiChatBody');
  if (body) body.scrollTop = body.scrollHeight;

  // 2. Show typing indicator + lock the send button while we wait.
  aiIsWaitingForReply = true;
  toggleAISendState(true);
  showAITypingIndicator();

  // 3. Build recent context (role/content only — no ids/flags) so the
  //    backend/model can follow up on earlier turns.
  const context = aiChatHistory
    .slice(-AI_CONFIG.maxContextMessages)
    .filter((m) => !m.isError)
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const reply = await sendMessageToBackend(text, context);
    hideAITypingIndicator();
    const assistantMsg = { id: uid(), role: 'assistant', content: reply };
    aiChatHistory.push(assistantMsg);
    appendAIMessageToDOM(assistantMsg);
    saveAIChatHistory();
  } catch (err) {
    hideAITypingIndicator();
    const errorMsg = {
      id: uid(),
      role: 'assistant',
      isError: true,
      content: `⚠️ ${err.message || 'Something went wrong talking to the AI assistant.'}`,
    };
    aiChatHistory.push(errorMsg);
    appendAIMessageToDOM(errorMsg);
    saveAIChatHistory();
    toast('The AI Study Assistant could not respond. See the chat for details.', 'danger', 4200);
  } finally {
    aiIsWaitingForReply = false;
    toggleAISendState(false);
    if (body) body.scrollTop = body.scrollHeight;
  }
}

function toggleAISendState(isSending) {
  const sendBtn = qs('#aiSendBtn');
  const input = qs('#aiChatInput');
  if (sendBtn) sendBtn.disabled = isSending;
  if (input) input.disabled = isSending;
}

function autoResizeAIInput(input) {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 110) + 'px';
}

/* ---- Clear chat ------------------------------------------------------------ */
function clearAIChat() {
  if (aiChatHistory.length === 0) {
    toast('Chat is already empty.', 'default', 2000);
    return;
  }
  confirmAction('Clear the entire AI Study Assistant conversation? This cannot be undone.', () => {
    aiChatHistory = [];
    saveAIChatHistory();
    renderAIChatHistory();
    toast('Chat cleared.', 'success', 2000);
  });
}

/* ---- Open / close window --------------------------------------------------- */
function setAIChatOpen(open) {
  const win = qs('#aiChatWindow');
  const fabBtn = qs('#aiFabBtn');
  const openIcon = qs('.ai-fab-icon-open');
  const closeIcon = qs('.ai-fab-icon-close');
  if (!win || !fabBtn) return;

  win.hidden = !open;
  fabBtn.setAttribute('aria-expanded', String(open));
  if (openIcon) openIcon.hidden = open;
  if (closeIcon) closeIcon.hidden = !open;

  if (open) {
    qs('#aiFabBadge') && (qs('#aiFabBadge').hidden = true);
    checkAIBackendHealth();
    // Focus the input for keyboard users, after the open animation settles.
    setTimeout(() => { const i = qs('#aiChatInput'); if (i) i.focus(); }, 60);
  } else {
    fabBtn.focus();
  }
}

/* ---- Wire everything up ---------------------------------------------------- */
function initAIAssistant() {
  aiChatHistory = loadAIChatHistory();
  renderAIChatHistory();

  const fabBtn = qs('#aiFabBtn');
  const closeBtn = qs('#aiCloseBtn');
  const clearBtn = qs('#aiClearBtn');
  const form = qs('#aiChatForm');
  const input = qs('#aiChatInput');
  const quickActions = qs('#aiQuickActions');
  const chatWindow = qs('#aiChatWindow');

  if (fabBtn) {
    fabBtn.addEventListener('click', () => {
      const isOpen = !qs('#aiChatWindow').hidden;
      setAIChatOpen(!isOpen);
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', () => setAIChatOpen(false));
  if (clearBtn) clearBtn.addEventListener('click', clearAIChat);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitAIChatMessage();
    });
  }

  if (input) {
    input.addEventListener('input', () => autoResizeAIInput(input));
    // Enter sends, Shift+Enter inserts a newline — standard chat UX.
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitAIChatMessage();
      }
    });
  }

  if (quickActions) {
    quickActions.addEventListener('click', (e) => {
      const btn = e.target.closest('.ai-quick-btn');
      if (!btn) return;
      handleAIQuickAction(btn.dataset.prompt);
    });
  }

  // Escape closes the chat window specifically (kept independent from
  // initModalEscapeHandling(), which only knows about the confirm/note
  // modals, so we don't need to touch that existing function).
  if (chatWindow) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !chatWindow.hidden) {
        setAIChatOpen(false);
      }
    });
  }

  // A gentle one-time nudge so first-time students notice the assistant.
  if (aiChatHistory.length === 0) {
    setTimeout(() => {
      const fab = qs('#aiFabBtn');
      if (fab && qs('#aiChatWindow').hidden) fab.classList.add('is-pulsing');
    }, 1500);
  }
}
