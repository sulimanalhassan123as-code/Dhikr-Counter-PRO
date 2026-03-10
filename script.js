let count=0
let target=33

const dhikr={
name:"SubhanAllah",
arabic:"سُبْحَانَ ٱللَّٰهِ",
meaning:"Glory be to Allah"
}

const countEl=document.getElementById("counter-number")
const progressBar=document.getElementById("progress-bar")
const rocket=document.getElementById("rocket")

const todayEl=document.getElementById("today-count")
const streakEl=document.getElementById("streak")
const levelEl=document.getElementById("level")

const leaderboard=document.getElementById("leaderboard")

document.getElementById("dhikr-title").innerText=dhikr.name
document.getElementById("dhikr-arabic").innerText=dhikr.arabic
document.getElementById("dhikr-meaning").innerText=dhikr.meaning

function updateCounter(){

count++

countEl.innerText=count

let progress=(count/target)*100

progressBar.style.width=progress+"%"

localStorage.setItem("today",count)

updateLevel()

if(count===target){

showRocket()

}

}

function showRocket(){

rocket.style.display="block"

setTimeout(()=>{

rocket.style.display="none"

alert("Dhikr completed! May Allah accept it")

count=0

},3000)

}

function updateLevel(){

let total=count

let level="Beginner"

if(total>200) level="Seeker"
if(total>500) level="Dhikr Warrior"
if(total>1000) level="Heart of Dhikr"

levelEl.innerText=level

}

document.getElementById("tap-btn").addEventListener("click",updateCounter)

document.getElementById("start-btn").onclick=()=>{

document.getElementById("home-screen").style.display="none"
document.getElementById("counter-screen").style.display="block"

}

document.getElementById("back-btn").onclick=()=>{

document.getElementById("home-screen").style.display="block"
document.getElementById("counter-screen").style.display="none"

}

function loadStats(){

let today=localStorage.getItem("today")||0

todayEl.innerText=today

}

loadStats()

const fakeUsers=[
{ name:"Ahmed",count:420 },
{ name:"Fatima",count:390 },
{ name:"Yusuf",count:350 },
{ name:"Aisha",count:300 },
{ name:"Omar",count:280 },
{ name:"Ali",count:250 }
]

fakeUsers.forEach(user=>{

let li=document.createElement("li")

li.innerText=user.name+" — "+user.count+" dhikr"

leaderboard.appendChild(li)

})
