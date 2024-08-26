// Select elements
const semicircles = document.querySelectorAll('.semicircle');
const timer = document.querySelector('.timer');
const stopSound = new Audio('assets/alarmSound.mp3');
stopSound.volume = 1.0;

let hr = 0;
let min = 25;
let sec = 0;
let breakTime ; // Default break time in minutes
let breakCategory; // Default break category

let startTime;
let futureTime;
let timerLoop;

let isPaused = false;
let pauseTime = 0;

let breakHr = 0;
let breakMin = 0;  // Default break time is 5 minutes
let breakSec = 0;

let breakFutureTime;
let breakTimerLoop;
let isBreakPaused = false;
let breakPauseTime = 0;


const formCont = document.getElementById('taskForm');

formCont.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const formData = {
        hours: parseInt(document.querySelector('.hours').value, 10) || 0,
        minutes: parseInt(document.querySelector('.minutes').value, 10) || 0,
        seconds: parseInt(document.querySelector('.seconds').value, 10) || 0,
        breakTime: parseInt(document.querySelector(".breakTime").value, 10) || 0,
        breakCategory: document.getElementById("breakTimeCategory").value
    };

    hr = formData.hours;
    min = formData.minutes;
    sec = formData.seconds;
    breakTime = formData.breakTime;
    breakCategory = formData.breakCategory;

    console.log(breakTime, breakCategory)
    if(breakCategory === 'minutes'){
      breakMin = breakTime 
    }else{
      breakHr = breakTime 
    }
    
    // Calculate total time in milliseconds
    const hours = hr * 3600000;
    const minutes = min * 60000;
    const seconds = sec * 1000;
    const setTime = hours + minutes + seconds;

   


    startTime = Date.now();
    futureTime = startTime + setTime;

    // Stop any existing timer
    clearInterval(timerLoop);

    // Start the timer
    startTimer();

    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    resumeBtn.style.display = 'none';
    pauseBtn.style.display = 'block';

    document.querySelector('.hours').value = ''
    document.querySelector('.minutes').value = ''
    document.querySelector('.seconds').value = ''
    document.querySelector('.hours').value = ''
    document.querySelector('.breakTime').value = ''
    document.getElementById('breakTimeCategory').value = ''
    
});

// Function to start the timer
export function startTimer() {
    if (timerLoop) {
        clearInterval(timerLoop);
    }

    // Reset semicircles to be visible and default color
    semicircles[0].style.display = 'block';
    semicircles[1].style.display = 'block';
    semicircles[2].style.display = 'block';
    semicircles[0].style.backgroundColor = '#f28b82';
    semicircles[1].style.backgroundColor = '#f28b82';
    timer.style.color = '#f28b82';

    timerLoop = setInterval(countDownTimer); // 1000ms interval for 1 second
}

// Function to handle the countdown timer logic
function countDownTimer() {
  if (isPaused) return;

  const currentTime = Date.now();
  const remainingTime = futureTime - currentTime;
  const totalSetTime = (hr * 3600000) + (min * 60000) + (sec * 1000);
  const angle = (remainingTime / totalSetTime) * 360;

  if (remainingTime <= 0) {
      clearInterval(timerLoop);
      stopTimer();
      setTimeout((startBreakTimer()), 12000)
      // setTimeout(startBreakTimer(), 12000)
      // startBreakTimer();  // Start break timer after the main timer ends
      return;
  }

  updateTimerDisplay(remainingTime, angle);
}

// Function to update the timer display
function updateTimerDisplay(remainingTime, angle) {
    if (angle > 180) {
        semicircles[2].style.display = 'none';
        semicircles[0].style.transform = 'rotate(180deg)';
        semicircles[1].style.transform = `rotate(${angle}deg)`;
    } else {
        semicircles[2].style.display = 'block';
        semicircles[0].style.transform = `rotate(${angle}deg)`;
        semicircles[1].style.transform = `rotate(${angle}deg)`;
    }

    const hrs = Math.floor((remainingTime / (1000 * 60 * 60)) % 24).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const mins = Math.floor((remainingTime / (1000 * 60)) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const secs = Math.floor((remainingTime / 1000) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

    timer.innerHTML = `
        <div>${isNaN(hrs) ? '00' : hrs}</div>
        <div class="colon">:</div>
        <div>${isNaN(mins) ? '00' : mins}</div>
        <div class="colon">:</div>
        <div>${isNaN(secs) ? '00' : secs}</div>
    `;

    if (remainingTime <= 60000) { // Update color when less than or equal to 1 minute
        semicircles[0].style.backgroundColor = 'red';
        semicircles[1].style.backgroundColor = 'red';
        timer.style.color = 'red';
    }
}

// Function to start the break timer
export function startBreakTimer() {
  if (breakTimerLoop) {
      clearInterval(breakTimerLoop);
  }

  // Reset semicircles to be visible and default color for the break timer
  semicircles[0].style.display = 'block';
  semicircles[1].style.display = 'block';
  semicircles[2].style.display = 'block';
  semicircles[0].style.backgroundColor = '#2ecc71';  // Change color for break timer
  semicircles[1].style.backgroundColor = '#2ecc71';
  timer.style.color = '#2ecc71';

  breakFutureTime = Date.now() + (breakHr * 3600000) + (breakMin * 60000) + (breakSec * 1000);
  breakTimerLoop = setInterval(countDownBreakTimer);  // 1000ms interval for 1 second
}

// Function to handle the countdown timer logic for the break
function countDownBreakTimer() {

    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
  if (isBreakPaused) return;

  const currentTime = Date.now();
  const remainingTime = breakFutureTime - currentTime;
  const totalSetTime = (breakHr * 3600000) + (breakMin * 60000) + (breakSec * 1000);
  const angle = (remainingTime / totalSetTime) * 360;

  if (remainingTime <= 0) {
      clearInterval(breakTimerLoop);
      resumeBtn.style.display = 'block'
        pauseBtn.style.display = 'none'
      stopBreakTimer();
      return;
  }

  updateBreakTimerDisplay(remainingTime, angle);
}

// Function to update the break timer display
function updateBreakTimerDisplay(remainingTime, angle) {
  if (angle > 180) {
      semicircles[2].style.display = 'none';
      semicircles[0].style.transform = 'rotate(180deg)';
      semicircles[1].style.transform = `rotate(${angle}deg)`;
  } else {
      semicircles[2].style.display = 'block';
      semicircles[0].style.transform = `rotate(${angle}deg)`;
      semicircles[1].style.transform = `rotate(${angle}deg)`;
  }

  const hrs = Math.floor((remainingTime / (1000 * 60 * 60)) % 24).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  const mins = Math.floor((remainingTime / (1000 * 60)) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  const secs = Math.floor((remainingTime / 1000) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

  timer.innerHTML = `
      <div>${isNaN(hrs) ? '00' : hrs}</div>
      <div class="colon">:</div>
      <div>${isNaN(mins) ? '00' : mins}</div>
      <div class="colon">:</div>
      <div>${isNaN(secs) ? '00' : secs}</div>
  `;
}

// Function to stop the break timer and reset the display
function stopBreakTimer() {
  semicircles[0].style.display = 'none';
  semicircles[1].style.display = 'none';
  semicircles[2].style.display = 'none';

  timer.innerHTML = `
      <div>00</div>
      <div class="colon">:</div>
      <div>00</div>
      <div class="colon">:</div>
      <div>00</div>
  `;
  timer.style.color = '#ddd';
  playStopSound();  // Optional: Play a sound when break ends
}

// Function to pause the break timer
export function pauseBreakTimer() {
  if (isBreakPaused) return;
  isBreakPaused = true;
  clearInterval(breakTimerLoop);

  // Calculate the remaining time when paused
  breakPauseTime = breakFutureTime - Date.now();
}

// Function to resume the break timer
export function resumeBreakTimer() {
  if (!isBreakPaused) return;
  isBreakPaused = false;

  // Set the future time based on the paused duration
  breakFutureTime = Date.now() + breakPauseTime;

  // Resume the interval without calling startBreakTimer()
  breakTimerLoop = setInterval(countDownBreakTimer);
}
// Function to stop the timer and reset the display
function stopTimer() {
    semicircles[0].style.display = 'none';
    semicircles[1].style.display = 'none';
    semicircles[2].style.display = 'none';

    timer.innerHTML = `
        <div>00</div>
        <div class="colon">:</div>
        <div>00</div>
        <div class="colon">:</div>
        <div>00</div>
    `;
    timer.style.color = '#ddd';
    playStopSound();
}

// Function to play the stop sound
function playStopSound() {
    stopSound.play().catch(error => {
        console.error('Audio playback error:', error);
    });
}

// Function to pause the timer
export function pauseTimer() {
    if (isPaused) return;
    isPaused = true;
    clearInterval(timerLoop);

    // Calculate the remaining time when paused
    pauseTime = futureTime - Date.now();
}

// Function to resume the timer
export function resumeTimer() {
    if (!isPaused) return;
    isPaused = false;

    // Set the future time based on the paused duration
    futureTime = Date.now() + pauseTime;
    startTimer();
}

// Function to setup timer controls (pause/resume)
export function setupTimerControls() {
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const clockCircle = document.querySelector('.outermost-circle');

    // Debugging: Check if clockCircle is correctly selected
    if (!clockCircle) {
        console.error('clockCircle element not found');
        return;
    }

    // Initialize button states
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'block';

    pauseBtn.addEventListener('click', () => {
      if (isBreakPaused || breakTimerLoop) {
          pauseBreakTimer();
      } else {
          pauseTimer();
      }
      resumeBtn.style.display = 'block';
      pauseBtn.style.display = 'none';
  });
  
  resumeBtn.addEventListener('click', () => {
      if (isBreakPaused || breakTimerLoop) {
          resumeBreakTimer();
      } else {
          resumeTimer();
      }
      resumeBtn.style.display = 'none';
      pauseBtn.style.display = 'block';
  });
  

    const pause = true
    clockCircle.addEventListener('click', () => {
        console.log('circle clicked');

        if (!pause) {
            resumeTimer();
            resumeBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        } else {
            pauseTimer();
            resumeBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }

        pause = !pause
    });
}

// Make sure to call setupTimerControls to initialize everything
setupTimerControls();
