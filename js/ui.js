import { state, setTotalSeconds, setMode } from './timer-core.js';

export function initUI(handlers) {
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timerDisplay = document.getElementById('timer-display');
    const statusLabel = document.getElementById('status-label');
    const setupHint = document.getElementById('setup-hint');
    const roundInfo = document.getElementById('round-info');

    const keypadOverlay = document.getElementById('keypad-overlay');
    const keypadDisplay = document.getElementById('keypad-display');
    const keypadClose = document.getElementById('keypad-close');
    const keypadClear = document.getElementById('key-clear');
    const keypadDone = document.getElementById('key-done');
    const keyNums = document.querySelectorAll('.key-num');

    let inputBuffer = "0500";

    function openKeypad() {
        keypadOverlay.classList.remove('hidden');
        setTimeout(() => {
            keypadOverlay.classList.remove('translate-y-full');
            keypadOverlay.classList.add('translate-y-0');
        }, 10);
        updateKeypadDisplay();
    }

    function closeKeypad() {
        keypadOverlay.classList.add('translate-y-full');
        keypadOverlay.classList.remove('translate-y-0');
        setTimeout(() => keypadOverlay.classList.add('hidden'), 300);
    }

    function updateKeypadDisplay() {
        const padded = inputBuffer.padStart(4, '0');
        const m = padded.substring(0, 2);
        const s = padded.substring(2, 4);
        keypadDisplay.textContent = `${m}:${s}`;
    }

    timerDisplay.addEventListener('click', () => {
        if (!state.isRunning && state.mode === 'COUNTDOWN') {
            openKeypad();
        }
    });

    keyNums.forEach(btn => {
        btn.addEventListener('click', () => {
            if (inputBuffer.length < 4) {
                inputBuffer = (inputBuffer === "0") ? btn.textContent : inputBuffer + btn.textContent;
                updateKeypadDisplay();
                playBeep(600, 0.05);
            }
        });
    });

    keypadClear.addEventListener('click', () => { inputBuffer = "0"; updateKeypadDisplay(); });
    keypadClose.addEventListener('click', closeKeypad);
    keypadDone.addEventListener('click', () => {
        const padded = inputBuffer.padStart(4, '0');
        const total = (parseInt(padded.substring(0, 2)) * 60) + parseInt(padded.substring(2, 4));
        if (total > 0) { 
            setTotalSeconds(total); 
            updateTimeDisplay(total); 
            closeKeypad(); 
        }
    });

    const modeTabs = {
        'COUNTDOWN': document.getElementById('mode-countdown'),
        'TABATA': document.getElementById('mode-tabata'),
        'EMOM': document.getElementById('mode-emom')
    };

    Object.entries(modeTabs).forEach(([mode, el]) => {
        if (!el) return;
        el.addEventListener('click', () => {
            if (state.isRunning) return;
            Object.values(modeTabs).forEach(tab => {
                if (tab) {
                    tab.classList.remove('bg-emerald-500', 'text-black');
                    tab.classList.add('text-white/40');
                }
            });
            el.classList.add('bg-emerald-500', 'text-black');
            el.classList.remove('text-white/40');
            setMode(mode);
            if (mode === 'COUNTDOWN') {
                roundInfo.style.opacity = "0";
                updateTimeDisplay(state.totalSeconds);
            } else {
                roundInfo.style.opacity = "1";
                updateRoundUI(1, state.rounds);
                updateTimeDisplay(state.remainingSeconds);
            }
            updateStatusUI('READY');
        });
    });

    startBtn.addEventListener('click', () => {
        toggleButtons(true);
        setupHint.style.opacity = "0";
        handlers.start();
    });

    pauseBtn.addEventListener('click', () => {
        toggleButtons(false);
        handlers.pause();
    });

    resetBtn.addEventListener('click', () => {
        toggleButtons(false);
        setupHint.style.opacity = "1";
        updateStatusUI('READY');
        handlers.reset();
    });

    updateTimeDisplay(state.totalSeconds);
}

export function updateStatusUI(status) {
    const statusLabel = document.getElementById('status-label');
    const body = document.body;
    statusLabel.textContent = status;
    if (status === 'WORK') {
        statusLabel.className = "text-emerald-400 text-xl font-black tracking-[0.3em] mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]";
        body.style.backgroundColor = "#09090b";
    } else if (status === 'REST') {
        statusLabel.className = "text-orange-500 text-xl font-black tracking-[0.3em] mb-2 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]";
        body.style.backgroundColor = "#450a0a";
    } else if (status === 'READY') {
        statusLabel.className = "text-emerald-400 text-xl font-black tracking-[0.3em] mb-2";
        body.style.backgroundColor = "#09090b";
    }
}

export function updateRoundUI(current, total) {
    const roundText = document.querySelector('#round-info span:nth-child(2)');
    if (roundText) roundText.textContent = `ROUND ${current.toString().padStart(2, '0')}/${total.toString().padStart(2, '0')}`;
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
export function playBeep(frequency = 440, duration = 0.1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}

export function playFinishSound() { playBeep(110, 1.5); }

export function showClearButton(onClear) {
    const btn = document.getElementById('clear-btn');
    btn.classList.remove('hidden');
    btn.onclick = () => { 
        btn.classList.add('hidden'); 
        document.getElementById('start-btn').classList.remove('hidden'); 
        onClear(); 
    };
}

export function updateTimeDisplay(seconds) {
    const display = document.getElementById('timer-display');
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    display.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function toggleButtons(isRunning) {
    const s = document.getElementById('start-btn'), p = document.getElementById('pause-btn');
    if (isRunning) { s.classList.add('hidden'); p.classList.remove('hidden'); }
    else { s.classList.remove('hidden'); p.classList.add('hidden'); }
}
