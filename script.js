// DOM Elements
const timerDisplay = document.getElementById('timer');
const timerMode = document.getElementById('timer-mode');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workDurationInput = document.getElementById('work-duration');
const shortBreakInput = document.getElementById('short-break');
const longBreakInput = document.getElementById('long-break');
const pomodorosBeforeLongBreakInput = document.getElementById('pomodoros-before-long-break');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const completedPomodorosEl = document.getElementById('completed-pomodoros');
const completedTasksEl = document.getElementById('completed-tasks');
const focusTimeEl = document.getElementById('focus-time');

// Timer Variables
let timeLeft = 25 * 60;
let timerInterval;
let isRunning = false;
let isWorkTime = true;
let pomodoroCount = 0;
let completedTasks = 0;
let focusTimeSeconds = 0;
let focusTimeInterval;

// Initialize Timer
function initializeTimer() {
    updateDisplay();
    updateStats();
}

// Update Timer Display
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // Add pulse animation when time is running
    if (isRunning) {
        timerDisplay.classList.add('animate-pulse-slow');
    } else {
        timerDisplay.classList.remove('animate-pulse-slow');
    }
}

// Update Stats
function updateStats() {
    completedPomodorosEl.textContent = pomodoroCount;
    completedTasksEl.textContent = completedTasks;
    const focusMinutes = Math.floor(focusTimeSeconds / 60);
    const focusSeconds = focusTimeSeconds % 60;
    focusTimeEl.textContent = `${focusMinutes}:${focusSeconds.toString().padStart(2, '0')}`;
}

// Start Timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        // Start focus time tracking
        if (isWorkTime) {
            focusTimeInterval = setInterval(() => {
                focusTimeSeconds++;
                updateStats();
            }, 1000);
        }
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                // Play sound
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play();
                // Stop focus time tracking
                if (isWorkTime) {
                    clearInterval(focusTimeInterval);
                }
                // Switch mode
                if (isWorkTime) {
                    pomodoroCount++;
                    const isLongBreak = pomodoroCount % parseInt(pomodorosBeforeLongBreakInput.value) === 0;
                    timeLeft = isLongBreak 
                        ? parseInt(longBreakInput.value) * 60 
                        : parseInt(shortBreakInput.value) * 60;
                    timerMode.textContent = isLongBreak ? "Long Break Time!" : "Short Break Time!";
                } else {
                    timeLeft = parseInt(workDurationInput.value) * 60;
                    timerMode.textContent = "Work Time!";
                    // Start focus time tracking again
                    focusTimeInterval = setInterval(() => {
                        focusTimeSeconds++;
                        updateStats();
                    }, 1000);
                }
                isWorkTime = !isWorkTime;
                updateDisplay();
                updateStats();
            }
        }, 1000);
    }
}

// Pause Timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        // Pause focus time tracking
        if (isWorkTime) {
            clearInterval(focusTimeInterval);
        }
    }
}

// Reset Timer
function resetTimer() {
    pauseTimer();
    isWorkTime = true;
    timeLeft = parseInt(workDurationInput.value) * 60;
    timerMode.textContent = "Ready to work";
    updateDisplay();
}

// Add Task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = document.createElement('li');
        taskItem.className = 'py-3 flex items-center group';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'mr-3 h-5 w-5 text-pomodoro-primary dark:text-pomodoro-secondary rounded focus:ring-pomodoro-primary dark:focus:ring-pomodoro-secondary bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600';
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'flex-grow text-gray-800 dark:text-gray-200';
        taskTextSpan.textContent = taskText;
        const taskActions = document.createElement('div');
        taskActions.className = 'flex space-x-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity';
        const pomodoroBtn = document.createElement('button');
        pomodoroBtn.innerHTML = '🍅';
        pomodoroBtn.className = 'p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-pomodoro-primary dark:hover:text-pomodoro-secondary transition-colors';
        pomodoroBtn.title = 'Start Pomodoro for this task';
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.className = 'p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors';
        deleteBtn.title = 'Delete task';
        // Event Listeners
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            taskTextSpan.classList.toggle('line-through', isChecked);
            taskTextSpan.classList.toggle('text-gray-400', isChecked);
            taskTextSpan.classList.toggle('dark:text-gray-500', isChecked);
            if (isChecked) {
                completedTasks++;
                updateStats();
            } else {
                completedTasks--;
                updateStats();
            }
        });
        pomodoroBtn.addEventListener('click', function() {
            timeLeft = parseInt(workDurationInput.value) * 60;
            isWorkTime = true;
            updateDisplay();
            timerMode.textContent = `Working on: ${taskText}`;
            if (!isRunning) {
                startTimer();
            }
        });
        deleteBtn.addEventListener('click', function() {
            taskItem.remove();
        });
        // Append elements
        taskActions.appendChild(pomodoroBtn);
        taskActions.appendChild(deleteBtn);
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
        taskInput.value = '';
    }
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    sunIcon.classList.toggle('hidden', isDark);
    moonIcon.classList.toggle('hidden', !isDark);
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
darkModeToggle.addEventListener('click', toggleDarkMode);

// Settings Change Listeners
workDurationInput.addEventListener('change', function() {
    if (!isRunning && isWorkTime) {
        timeLeft = parseInt(this.value) * 60;
        updateDisplay();
    }
});
shortBreakInput.addEventListener('change', function() {
    if (!isRunning && !isWorkTime && pomodoroCount % parseInt(pomodorosBeforeLongBreakInput.value) !== 0) {
        timeLeft = parseInt(this.value) * 60;
        updateDisplay();
    }
});
longBreakInput.addEventListener('change', function() {
    if (!isRunning && !isWorkTime && pomodoroCount % parseInt(pomodorosBeforeLongBreakInput.value) === 0) {
        timeLeft = parseInt(this.value) * 60;
        updateDisplay();
    }
});

// Initialize
initializeTimer(); 