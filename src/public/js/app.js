'use strict'

let messageList;
let messageForm;
let nickForm;
// 서버로 연결하는 socket
const socket = new WebSocket(`ws://${window.location.host}`);



socket.addEventListener("open" , ()=>{
    console.log("Wellcome! Connected to Server ✅");
});
socket.addEventListener("close", ()=>{
    console.log("Bye! Disconnected from Server ❌");
});
socket.addEventListener("message", (msg)=>{
    
    console.log("New message:", msg.data);

    const li = $("<li>",{
        text : msg.data,
    });

    messageList.append(li);
});


$(function(){
    console.log("dcmt ready");
    // 이벤트 init
    initEvents();
  
});

function initEvents(){

    messageList = $("#messageList");
    messageForm = $("form#message");
    nickForm    = $("form#nick");

    messageForm.on("submit", (event) => {
        event.preventDefault();
        const input = $("#message input");

        
        socket.send(JSON.stringify(makeMessage("new_message",input.val())));

        const li = $("<li>",{
            text : `You : ${input.val()}`,
        });
        messageList.append(li);
        
        input.val("");
    });

    nickForm.on("submit",(event)=>{
        event.preventDefault();
        const input = $("#nick input");

        socket.send(JSON.stringify(makeMessage("nickname",input.val())));

    });

}

function makeMessage(type,payload){
    const out = {type, payload};
    return out; 
}