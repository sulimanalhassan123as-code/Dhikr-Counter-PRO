// Service Worker
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}

// Tasbih sound
const tasbihSound=document.getElementById("tasbih-sound");

// Install button
let deferredPrompt;
const installBtn=document.createElement("button");
installBtn.id="install-btn";
installBtn.textContent="Install App";
document.body.appendChild(installBtn);
window.addEventListener('beforeinstallprompt', e=>{
e.preventDefault();
deferredPrompt=e;
installBtn.style.display="block";
});
installBtn.onclick=async()=>{
deferredPrompt.prompt();
await deferredPrompt.userChoice;
installBtn.style.display="none";
};

// Elements
const setupScreen=document.getElementById('setup-screen');
const counterScreen=document.getElementById('counter-screen');
const presetButtons=document.querySelectorAll('.preset-btn');
const customTargetInput=document.getElementById('custom-target-input');
const useCustomBtn=document.getElementById('use-custom-btn');
const resetBtn=document.getElementById('reset-btn');
const manualResetBtn=document.getElementById('manual-reset-btn');
const tapArea=document.getElementById('tap-area');
const countDisplay=document.getElementById('count-display');
const targetDisplay=document.getElementById('target-display');
const currentDhikrText=document.getElementById('current-dhikr-text');
const darkModeToggle=document.getElementById('dark-mode-toggle');
const dailyStats=document.getElementById('daily-stats');
const dailyReminder=document.getElementById('daily-reminder');

let currentCount=0;
let targetCount=100;
let dhikrText="";

// Daily stats
function updateStats(){
let today=localStorage.getItem("dhikr_today")||0;
dailyStats.textContent="Today's Dhikr: "+today;
}

// Functions
function startCounter(target,text){
targetCount=target;
dhikrText=text;
currentCount=0;
updateDisplay();
localStorage.setItem("target",target);
localStorage.setItem("text",text);
localStorage.setItem("count",0);
setupScreen.classList.remove("active");
counterScreen.classList.add("active");
}

function updateDisplay(){
countDisplay.textContent=currentCount;
targetDisplay.textContent="/ "+targetCount;
currentDhikrText.textContent=dhikrText;
updateStats();
}

function handleTap(){
if(currentCount<targetCount){
currentCount++;
updateDisplay();
localStorage.setItem("count",currentCount);
localStorage.setItem("dhikr_today",(parseInt(localStorage.getItem("dhikr_today")||0)+1));
if(tasbihSound){tasbihSound.currentTime=0; tasbihSound.play();}
if(navigator.vibrate){navigator.vibrate(60);}
tapArea.classList.add("tap");
setTimeout(()=>tapArea.classList.remove("tap"),100);
if(currentCount===targetCount){
alert("✅ Dhikr completed! Now recite the recommended prayers.");
}
}
}

function goBack(){counterScreen.classList.remove("active"); setupScreen.classList.add("active");}
function resetCount(){currentCount=0; updateDisplay(); localStorage.setItem("count",0);}

// Events
presetButtons.forEach(btn=>{btn.onclick=()=>{startCounter(parseInt(btn.dataset.target),btn.dataset.text);}});
useCustomBtn.onclick=()=>{const custom=parseInt(customTargetInput.value); if(custom>0){startCounter(custom,"Custom ("+custom+")");} };
tapArea.onclick=handleTap;
resetBtn.onclick=goBack;
manualResetBtn.onclick=resetCount;

// Dark Mode
darkModeToggle.onclick=()=>{
document.body.classList.toggle("dark-mode");
localStorage.setItem("dark",document.body.classList.contains("dark-mode"));
}
if(localStorage.getItem("dark")==="true"){document.body.classList.add("dark-mode");}

// Restore session
const savedTarget=localStorage.getItem("target");
if(savedTarget){
targetCount=parseInt(savedTarget);
dhikrText=localStorage.getItem("text");
currentCount=parseInt(localStorage.getItem("count")||0);
updateDisplay();
setupScreen.classList.remove("active");
counterScreen.classList.add("active");
}

// Daily Reminder
const reminders=[
"Remember Allah often. Hearts find peace in dhikr.",
"Tonight could be Laylatul Qadr. Increase your dhikr.",
"Start your day with remembrance of Allah.",
"Keep your tongue moist with dhikr."
];
dailyReminder.textContent=reminders[Math.floor(Math.random()*reminders.length)];

// Ramadan Mode Example
const now=new Date();
const month=now.getMonth()+1;
if(month===3){document.body.classList.add("ramadan");} // Example: March as Ramadan

// Optional: Request Notification Permission
if("Notification" in window){
Notification.requestPermission().then(permission=>{
if(permission==="granted"){
setInterval(()=>{
new Notification("🌙 Time for dhikr!", {body:"Tap your Dhikr Counter and remember Allah."});
},3600000); // every 1 hour
}
});
}
