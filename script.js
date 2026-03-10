let count=0
let target=33

const countEl=document.getElementById("count")
const progress=document.getElementById("progressBar")
const rocket=document.getElementById("rocket")

function tap(){

count++

countEl.innerText=count

progress.style.width=(count/target*100)+"%"

saveStats()

if(count===target){

rocket.style.display="block"

setTimeout(()=>{
rocket.style.display="none"
alert("Dhikr completed!")
count=0
},3000)

}

}

document.getElementById("tapBtn").onclick=tap

function saveStats(){

let today=new Date().toDateString()

localStorage.setItem("lastDhikr",today)

}

if("serviceWorker" in navigator){

navigator.serviceWorker.register("sw.js")

}
