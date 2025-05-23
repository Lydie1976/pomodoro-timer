const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

let isRunning = false;
let isWorkMode = true;
let timer = null;
let timeLeft = WORK_MINUTES * 60;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeLabel = document.getElementById('mode-label');
const beepAudio = document.getElementById('beep');

// --- Task List -----
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let tasks = []; // {text, done}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  modeLabel.textContent = isWorkMode ? '專注 25 分鐘' : '休息 5 分鐘';
  modeLabel.style.color = isWorkMode ? '#3ea377' : '#e05253';
}

// -------- 番茄鐘核心 ---------
function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateDisplay();
  } else {
    // 鬧鐘提醒
    beepAudio.play();
    if ('vibrate' in navigator) navigator.vibrate([400, 200, 400]); // 行動裝置震動
    showNotification(isWorkMode ? '專注結束！開始休息吧！' : '休息結束！準備下一輪專注！');
    switchMode();
  }
}

function switchMode() {
  isWorkMode = !isWorkMode;
  timeLeft = (isWorkMode ? WORK_MINUTES : BREAK_MINUTES) * 60;
  updateDisplay();
  // 自動接續計時
}

startBtn.onclick = function () {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(tick, 1000);
  }
};

pauseBtn.onclick = function () {
  isRunning = false;
  clearInterval(timer);
};

resetBtn.onclick = function () {
  isRunning = false;
  clearInterval(timer);
  isWorkMode = true;
  timeLeft = WORK_MINUTES * 60;
  updateDisplay();
};

updateDisplay();

// --------- 桌面通知 ---------------
function showNotification(msg) {
  if (window.Notification && Notification.permission === "granted") {
    new Notification('番茄鐘提醒', { body: msg, icon: '' });
  } else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        new Notification('番茄鐘提醒', { body: msg, icon: '' });
      }
    });
  }
}
// 第一次加載就請求通知權限
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// --------- 任務清單（本地儲存） -------------------
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTask(i));
    // 標籤
    const label = document.createElement('span');
    label.className = 'task-label';
    label.textContent = task.text;
    // 刪除按鈕
    const del = document.createElement('button');
    del.className = 'task-delete';
    del.innerHTML = '🗑️';
    del.addEventListener('click', () => deleteTask(i));

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(del);
    taskList.appendChild(li);
  });
  saveTasks();
}

function addTask(text) {
  if (!text.trim()) return;
  tasks.push({ text: text.trim(), done: false });
  renderTasks();
}

function toggleTask(idx) {
  tasks[idx].done = !tasks[idx].done;
  renderTasks();
}

function deleteTask(idx) {
  tasks.splice(idx, 1);
  renderTasks();
}

// 表單新增任務
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
});

// 本地儲存
function saveTasks() {
  localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
}
function loadTasks() {
  const t = localStorage.getItem('pomodoro-tasks');
  if (t) tasks = JSON.parse(t);
}
loadTasks();
renderTasks();
