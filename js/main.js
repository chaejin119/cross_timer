import { initTimer, startTimer, pauseTimer, resetTimer, state } from './timer-core.js';
import { initUI, updateTimeDisplay, playBeep, playFinishSound, updateStatusUI, updateRoundUI, showClearButton } from './ui.js';

initTimer();

let lastSecond = -1;

const handlers = {
    start: () => {
        startTimer(
            (time, status, round) => {
                updateTimeDisplay(time);
                updateStatusUI(status);
                if (state.mode !== 'COUNTDOWN') updateRoundUI(round, state.totalRounds);
                
                const currentSecond = Math.ceil(time);
                if (currentSecond <= 3 && currentSecond > 0 && currentSecond !== lastSecond) {
                    playBeep(status === 'WORK' ? 440 : 660, 0.1); 
                    lastSecond = currentSecond;
                }
            },
            () => {
                playFinishSound(); 
                showClearButton(() => {
                    resetTimer();
                    updateTimeDisplay(state.remainingSeconds);
                    updateStatusUI('READY');
                });
            },
            (newPhase) => {
                playBeep(newPhase === 'WORK' ? 880 : 220, 0.3);
                lastSecond = -1;
            }
        );
    },
    pause: () => {
        pauseTimer();
    },
    reset: () => {
        resetTimer();
        updateTimeDisplay(state.remainingSeconds);
        updateStatusUI('READY');
    }
};

initUI(handlers);
