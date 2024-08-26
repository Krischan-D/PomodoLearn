// scripts.js
import { setupMenuToggle } from './menuToggle.js';
import { startTimer, setupTimerControls } from './timer.js';
import { setupTaskManager } from './taskManager.js';
import { themeToggle } from './themeToggle.js';

document.addEventListener('DOMContentLoaded', () => {
    setupMenuToggle();
    setupTimerControls();
    setupTaskManager();
    themeToggle()
    // Start the timer when the document is loaded
    startTimer();
});
