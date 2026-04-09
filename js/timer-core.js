// Core logic for CrossTimer
export let state = {
    mode: 'COUNTDOWN',
    status: 'READY',
    totalSeconds: 300,
    remainingSeconds: 300,
    currentRound: 1,
    totalRounds: 1,
    isRunning: false,
    timerInterval: null,
    endTime: null,
    workTime: 20,
    restTime: 10,
    rounds: 8
};

export function setMode(newMode) {
    state.mode = newMode;
    resetTimer();
}

export function setTotalSeconds(seconds) {
    state.totalSeconds = seconds;
    state.remainingSeconds = state.totalSeconds;
}

export function startTimer(onTick, onFinish, onPhaseChange) {
    if (state.isRunning) return;
    state.isRunning = true;
    state.status = 'WORK';
    
    if (state.mode === 'TABATA') {
        state.remainingSeconds = state.workTime;
        state.currentRound = 1;
        state.totalRounds = state.rounds;
    } else {
        state.remainingSeconds = state.totalSeconds;
    }

    state.endTime = Date.now() + (state.remainingSeconds * 1000);
    
    state.timerInterval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, (state.endTime - now) / 1000);
        state.remainingSeconds = timeLeft;
        onTick(state.remainingSeconds, state.status, state.currentRound);

        if (state.remainingSeconds <= 0) {
            handlePhaseTransition(onTick, onFinish, onPhaseChange);
        }
    }, 30);
}

function handlePhaseTransition(onTick, onFinish, onPhaseChange) {
    if (state.mode === 'COUNTDOWN') {
        stopTimer();
        state.remainingSeconds = 0;
        onTick(0, 'FINISHED', 1);
        onFinish();
        return;
    }

    if (state.mode === 'TABATA') {
        if (state.status === 'WORK') {
            state.status = 'REST';
            state.remainingSeconds = state.restTime;
            onPhaseChange('REST');
        } else {
            state.currentRound++;
            if (state.currentRound > state.totalRounds) {
                stopTimer();
                state.remainingSeconds = 0;
                onTick(0, 'FINISHED', state.totalRounds);
                onFinish();
                return;
            }
            state.status = 'WORK';
            state.remainingSeconds = state.workTime;
            onPhaseChange('WORK');
        }
        state.endTime = Date.now() + (state.remainingSeconds * 1000);
    }
}

export function pauseTimer() {
    if (!state.isRunning) return;
    stopTimer();
    state.status = 'PAUSE';
}

export function resetTimer() {
    stopTimer();
    state.status = 'READY';
    state.currentRound = 1;
    if (state.mode === 'COUNTDOWN') {
        state.remainingSeconds = state.totalSeconds;
    } else if (state.mode === 'TABATA') {
        state.remainingSeconds = state.workTime;
        state.totalRounds = state.rounds;
    }
}

function stopTimer() {
    state.isRunning = false;
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

export function initTimer() {
    console.log('Timer Core Initialized');
}
