const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
};

const sessionCount = document.getElementById("session-count");

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
    sessionCount.textContent = timer.sessions;
  });

const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    if (action === 'start') {
      startTimer();
    } else {
        stopTimer();
    }
  });

const modeButtons = document.getElementById("js-mode-buttons");
modeButtons.addEventListener("click", handleMode);

// declaring an interval
let interval;

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    // parseInt converts variable to integer of base 10(decimal number)
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    // return an object
    // same structure as timer.remainingTime
    return {
      total,
      minutes,
      seconds,
    };
  }

function startTimer() {
    let { total } = timer.remainingTime;

    // Date object is in miliseconds
    // endTime variable is a timestamp of the current total time
    const endTime = Date.parse(new Date()) + total * 1000;


    sessionCount.textContent = timer.sessions;

    if (timer.mode === 'pomodoro') timer.sessions++;
    
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(function() {
        // store return value of getRemainingTime() in timer.remainingTimer
        timer.remainingTime = getRemainingTime(endTime);

        //update the countdown to latest value
        updateClock();

        total = timer.remainingTime.total;
        if (total <= 0) {
            // end countdown once remaining time is less than or equal to 0
            clearInterval(interval);

            switch (timer.mode) {
              case 'pomodoro':
                // take long break after 4 sessions
                if(timer.sessions % timer.longBreakInterval == 0) {
                  switchMode("longBreak");
                } else {
                  switchMode("shortBreak");
                }
                break;
              default:
                switchMode("pomodoro");
            }

            //execute startTimer again
            startTimer();
          }
    }, 1000);

}

function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'Start';
    mainButton.textContent = 'Start';
    mainButton.classList.remove('active');
  }

function updateClock() {
    // destructure remaining time from timer object
    const { remainingTime }  = timer;

    // `` are template literals, same as strings
    // ${ variables inside brackets here }
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const minutesDisplay = document.getElementById('js-minutes');
    const secondsDisplay = document.getElementById('js-seconds');

    minutesDisplay.textContent = minutes;
    secondsDisplay.textContent = seconds;

    document.title = `Remaining Time: ${minutes}:${seconds}`;
}

function switchMode(mode) {
    // new mode attribute for timer object
    // mode can be pomodoro, longBreak or shortBreak
    timer.mode = mode;

    // new remainingTime attribute for timer object
    timer.remainingTime = {
        // total remaining time in seconds
        total: timer[mode] * 60,
        // total remianing time in minutes
        minutes: timer[mode],
        // seconds that have passed is set to 0 initially
        seconds: 0,
    };

    const modeList = document.querySelectorAll('button[data-mode]');
    modeList.forEach(e => e.classList.remove('active'));

    // set the selected mode to active
    const selectedMode = document.querySelector(`[data-mode="${mode}"]`);
    selectedMode.classList.add('active');

    // function to update timer to match selected mode
    updateClock();
}

function handleMode(e) {
    //destructuring data-mode attribute from target element
    const { mode } = e.target.dataset;
    
    // if data-mode doesnt exist, then the button clicked is not a mode button
    // function will exit
    if (!mode) return;

    // otherwise switch the mode to match the clicked mode button
    switchMode(mode);
    stopTimer();
}

const restartButton = document.getElementById("restart-btn");
restartButton.addEventListener("click", resetTimer);

function resetTimer() {
  clearInterval(interval);
  const { remainingTime }  = timer;

  remainingTime.minutes = timer[timer.mode];
  remainingTime.seconds = `00`
  updateClock();

  mainButton.dataset.action = 'Start';
  mainButton.textContent = 'Start';
  mainButton.classList.remove('active');
}
