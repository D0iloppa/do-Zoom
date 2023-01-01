'use strict'

// socket.io init
const socket = io();
socket.on("connection",(socket)=>{
    console.log("your id : ", socket.id);
});

socket.on("welcome", (user) => {
    const data = {...user};
    console.log(data);
   
    const msg =  `${data.nickname} arrived!`;
    addMessage(msg);
});

socket.on("bye", (user) => {
    const data = {...user};
    console.log(data);

    const msg = `${data.nickname} left.`;
    addMessage(msg);
});

socket.on("new_message",(args)=>{
    const data = {...args};

    addMessage(data.msg);
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

let roomName;
let nickName = false;
function initEvents(){    

      // 닉네임 save
      const nameForm = $("#name");
      nameForm.on("submit" , function(event){
          event.preventDefault();

          const input = $(this).find("input");
          nickName = input.val();
          socket.emit(
              "setNickname" ,  // event명
              {   // server로 보낼 data
                  nickName : nickName,
                  roomName : roomName 
              } ,
              (res) => {  // done callback
              console.log(res);
          });
      });
  

    // arrow function this : function을 실제 실행시키는 객체 (window)
    // function 내부에서의 this : 해당 function을 실행 시키는 객체 (form)
    welcomeForm.on("submit", function (event) {
        event.preventDefault();

        if(!nickName) {
            alert("you have to set the nickname");
            return;
        }
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
            (res) => {  // done callback
                console.log(res);
                console.log("server processing is DONE ✅")
                console.log("callback : clear the input value");
                roomName = input.val();
                input.val("");
                showRoom();
                //callback(input) ;
        });
    });
}




/**
 * room div show
 */
function showRoom(){
    welcome.css("display","none");
    room.css("display","");
    const roomTitle = room.find("h3");
    roomTitle.text(`Room ${roomName}`);

    // 메세지 sending form
    const msgForm = room.find("#msg");
    msgForm.on("submit" , function(event){
        event.preventDefault();

        const input = $(this).find("input");

        socket.emit(
            "new_message" ,  // event명
            {   // server로 보낼 data
                msg      : input.val(),
                roomName : roomName 
            } ,
            (res) => {  // done callback
            console.log(res);
            addMessage(`You: ${input.val()}`);
            input.val("");
        });
    });


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