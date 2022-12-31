'use strict'

// socket.io init
const socket = io();
socket.on("connection",(socket)=>{
    console.log("your id : ", socket.id);
});

socket.on("welcome", (args) => {
    const data = {...args};
    console.log(data);

    const msg = "Someone joined!";
    addMessage(msg);
});



$(function(){
    console.log("dcmt ready");
    // 이벤트 init
    initEvents();
  
});

/**
 * onclick events init
 */
const welcome = $("#welcome");
const welcomeForm = welcome.find("form");
const room = $("#room");

function initEvents(){    

    // arrow function this : function을 실제 실행시키는 객체 (window)
    // function 내부에서의 this : 해당 function을 실행 시키는 객체 (form)
    welcomeForm.on("submit", function (event) {
        event.preventDefault();

        const input = $(this).find("input");

        const eventName = "enter_room";
        const sendingData = {
            roomName : input.val()
        };
        function callback(input){
            console.log("server processing is DONE ✅")
            console.log("callback : input value clear");
            input.val("");
        };

        /*
        * [socket.io 함수 description]
        * socket.send -> socket.emit으로 변경
        * emit : 방출하다
        * - args description : 
        * emit( [event 명] , ...arg[] (sending Data) , done-callback)
        * 마지막은 함수일 경우에만 callback으로 작동
        */
        socket.emit(
            eventName ,  // event명
            sendingData ,  // server로 보낼 data
            (obj) => {  // done callback
                console.log(obj);
                console.log("server processing is DONE ✅")
                console.log("callback : clear the input value");
                roomName = input.val();
                input.val("");
                showRoom();
                //callback(input) ;
        });
    });
}

let roomName;


/**
 * room div show
 */
function showRoom(){
    welcome.css("display","none");
    room.css("display","");
    const roomTitle = room.find("h3");
    roomTitle.text(`Room ${roomName}`);
}
function addMessage(msg){
    const roomLogUl = room.find("ul");
    const itemLi = $("<li>",{
        text : msg,
    });
    roomLogUl.append(itemLi);
}





/*
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
*/