// --- DIGITAL CLOCK LOGIC ---
let is24HourMode = false;
const clockDisplay = document.getElementById('clock');
const formatToggleBtn = document.getElementById('format-toggle');

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  let period = '';

  if (!is24HourMode) {
    period = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12 || 12;
  }

  const formattedHours = String(hours).padStart(2, '0');
  clockDisplay.textContent = `${formattedHours}:${minutes}:${seconds}${period}`;
}

formatToggleBtn.addEventListener('click', () => {
  is24HourMode = !is24HourMode;
  formatToggleBtn.textContent = is24HourMode
    ? 'Switch to 12-Hour Format'
    : 'Switch to 24-Hour Format';
  updateClock();
});

// Update clock every second
setInterval(updateClock, 1000);
updateClock();


// --- COUNTDOWN TIMER LOGIC ---
let timerInterval = null;
let remainingTime = 0; // stored in total seconds

const timerDisplay = document.getElementById('timer');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

function renderTimer() {
  const h = String(Math.floor(remainingTime / 3600)).padStart(2, '0');
  const m = String(Math.floor((remainingTime % 3600) / 60)).padStart(2, '0');
  const s = String(remainingTime % 60).padStart(2, '0');
  timerDisplay.textContent = `${h}:${m}:${s}`;
}

function playAlertSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Pitch (880Hz = A5)
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1.2); // Play beep for 1.2s
}

startBtn.addEventListener('click', () => {
  if (timerInterval) return;

  // Read inputs if timer is started fresh
  if (remainingTime === 0) {
    const hrs = parseInt(hoursInput.value) || 0;
    const mins = parseInt(minutesInput.value) || 0;
    const secs = parseInt(secondsInput.value) || 0;
    remainingTime = hrs * 3600 + mins * 60 + secs;
  }

  if (remainingTime <= 0) return;

  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerInterval = setInterval(() => {
    remainingTime--;
    renderTimer();

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      playAlertSound();
    }
  }, 1000);
});

pauseBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingTime = 0;
  hoursInput.value = '';
  minutesInput.value = '';
  secondsInput.value = '';
  renderTimer();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});
