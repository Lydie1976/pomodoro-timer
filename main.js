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

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
  modeLabel.textContent = isWorkMode ? '工作時間' : '休息時間';
  modeLabel.style.color = isWorkMode ? '#47a36c' : '#e15b5b';
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateDisplay();
  } else {
    beepAudio.play();
    alert(isWorkMode ? '工作時間結束！休息一下吧！' : '休息時間結束！回來繼續努力！');
    switchMode();
  }
}

function switchMode() {
  isWorkMode = !isWorkMode;
  timeLeft = (isWorkMode ? WORK_MINUTES : BREAK_MINUTES) * 60;
  updateDisplay();
  if (isRunning) {
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  }
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
