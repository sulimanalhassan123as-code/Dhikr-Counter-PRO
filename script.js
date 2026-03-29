// Service Worker Initialization
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Failed', err));
}

// Elements Setup
const setupScreen = document.getElementById('setup-screen');
const counterScreen = document.getElementById('counter-screen');
const presetButtons = document.querySelectorAll('.preset-btn');
const customTargetInput = document.getElementById('custom-target-input');
const useCustomBtn = document.getElementById('use-custom-btn');
const resetBtn = document.getElementById('reset-btn');
const manualResetBtn = document.getElementById('manual-reset-btn');
const lockBtn = document.getElementById('lock-btn');
const shareBtn = document.getElementById('share-btn');
const tapArea = document.getElementById('tap-area');
const tapCircle = document.querySelector('.tap-circle');
const countDisplay = document.getElementById('count-display');
const targetDisplay = document.getElementById('target-display');
const currentDhikrText = document.getElementById('current-dhikr-text');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const dailyStats = document.getElementById('daily-stats');
const lifetimeStats = document.getElementById('lifetime-stats');
const streakStats = document.getElementById('streak-stats');
const dailyReminder = document.getElementById('daily-reminder');
const tasbihSound = document.getElementById("tasbih-sound");

// State Variables
let currentCount = 0;
let targetCount = 100;
let dhikrText = "";
let isLocked = false;

// Initialize Statistics
function updateStats() {
    let today = parseInt(localStorage.getItem("dhikr_today") || 0);
    let lifetime = parseInt(localStorage.getItem("dhikr_lifetime") || 0);
    let streak = parseInt(localStorage.getItem("dhikr_streak") || 0);
    
    // Simple streak logic: check if last date was yesterday
    let lastDate = localStorage.getItem("last_dhikr_date");
    let currentDate = new Date().toDateString();
    
    if (lastDate && lastDate !== currentDate) {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate === yesterday.toDateString()) {
            // Keep streak going
        } else {
            streak = 0; // Lost streak
            localStorage.setItem("dhikr_streak", 0);
        }
    }

    dailyStats.textContent = today;
    lifetimeStats.textContent = lifetime;
    streakStats.textContent = streak + " 🔥";
}
updateStats();

// Core Functions
function startCounter(target, text) {
    targetCount = target;
    dhikrText = text;
    currentCount = 0;
    isLocked = false;
    updateLockUI();
    updateDisplay();
    
    localStorage.setItem("target", target);
    localStorage.setItem("text", text);
    localStorage.setItem("count", 0);
    
    setupScreen.classList.remove("active");
    counterScreen.classList.add("active");
}

function updateDisplay() {
    countDisplay.textContent = currentCount;
    targetDisplay.textContent = "/ " + targetCount;
    currentDhikrText.textContent = dhikrText;
}

function handleTap() {
    if (currentCount < targetCount) {
        currentCount++;
        
        // Update Local Storage stats
        let today = parseInt(localStorage.getItem("dhikr_today") || 0) + 1;
        let lifetime = parseInt(localStorage.getItem("dhikr_lifetime") || 0) + 1;
        let streak = parseInt(localStorage.getItem("dhikr_streak") || 0);
        
        let lastDate = localStorage.getItem("last_dhikr_date");
        let currentDate = new Date().toDateString();
        
        if (lastDate !== currentDate) {
            streak++;
            localStorage.setItem("dhikr_streak", streak);
            localStorage.setItem("dhikr_today", 1); // Reset daily if new day
        } else {
            localStorage.setItem("dhikr_today", today);
        }
        
        localStorage.setItem("count", currentCount);
        localStorage.setItem("dhikr_lifetime", lifetime);
        localStorage.setItem("last_dhikr_date", currentDate);
        
        updateDisplay();
        updateStats();

        // Premium Haptics & Sound
        if(tasbihSound) { tasbihSound.currentTime = 0; tasbihSound.play(); }
        
        // Milestone Vibrations
        if (navigator.vibrate) {
            if (currentCount === 33 || currentCount === 66) {
                navigator.vibrate([100, 50, 100]); // Double pulse
            } else if (currentCount === targetCount) {
                navigator.vibrate([200, 100, 200, 100, 200]); // Long celebration
            } else {
                navigator.vibrate(40); // Standard light tap
            }
        }

        // Visual Animation
        tapCircle.classList.add("tap");
        setTimeout(() => tapCircle.classList.remove("tap"), 100);

        if(currentCount === targetCount) {
            setTimeout(() => alert("✅ Target Completed! May Allah accept it."), 300);
        }
    }
}

// Lock Functionality (Prevents accidental reset)
function toggleLock() {
    isLocked = !isLocked;
    updateLockUI();
}

function updateLockUI() {
    if (isLocked) {
        lockBtn.textContent = "🔒";
        resetBtn.style.visibility = "hidden";
        manualResetBtn.style.display = "none";
    } else {
        lockBtn.textContent = "🔓";
        resetBtn.style.visibility = "visible";
        manualResetBtn.style.display = "inline-block";
    }
}

function goBack() { 
    if(!isLocked) {
        counterScreen.classList.remove("active"); 
        setupScreen.classList.add("active");
        updateStats();
    }
}

function resetCount() { 
    if(!isLocked && confirm("Reset current progress to 0?")) {
        currentCount = 0; 
        updateDisplay(); 
        localStorage.setItem("count", 0);
    }
}

// Share Function
function shareProgress() {
    let today = localStorage.getItem("dhikr_today") || 0;
    let text = `🌙 Alhamdullilah! I have completed ${today} Dhikr today using *Never Hide Dhikr PRO*. May Allah accept our prayers. 🤲`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Event Listeners
presetButtons.forEach(btn => {
    btn.onclick = () => { startCounter(parseInt(btn.dataset.target), btn.dataset.text); }
});

useCustomBtn.onclick = () => {
    const custom = parseInt(customTargetInput.value); 
    if(custom > 0) { startCounter(custom, "Custom Dhikr"); } 
};

tapArea.onclick = handleTap;
resetBtn.onclick = goBack;
manualResetBtn.onclick = resetCount;
lockBtn.onclick = toggleLock;
shareBtn.onclick = shareProgress;

// Dark Mode Toggle
darkModeToggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark", document.body.classList.contains("dark-mode"));
    darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

// Restore settings on load
if(localStorage.getItem("dark") === "true") { 
    document.body.classList.add("dark-mode"); 
    darkModeToggle.textContent = "☀️";
}

const savedTarget = localStorage.getItem("target");
if(savedTarget) {
    targetCount = parseInt(savedTarget);
    dhikrText = localStorage.getItem("text");
    currentCount = parseInt(localStorage.getItem("count") || 0);
    updateDisplay();
    setupScreen.classList.remove("active");
    counterScreen.classList.add("active");
}

// Daily Inspiration Reminder
const reminders = [
    "“And remember your Lord within yourself...” (Quran 7:205)",
    "Hearts find rest in the remembrance of Allah.",
    "A heavy scale on the Day of Judgement: SubhanAllahi wa bihamdihi.",
    "Keep your tongue moist with the remembrance of Allah."
];
dailyReminder.textContent = reminders[Math.floor(Math.random() * reminders.length)];