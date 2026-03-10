function aiMessage(){

let last=localStorage.getItem("lastDhikr")

let today=new Date().toDateString()

let msg=""

if(last!==today){

msg="You haven't made dhikr today. Start with 33 SubhanAllah."

}else{

msg="Great job! Keep remembering Allah."

}

document.getElementById("aiMessage").innerText=msg

}

aiMessage()
