// 서버로 연결하는 socket
const socket = new WebSocket(`ws://${window.location.host}`);



socket.addEventListener("open" , ()=>{
    console.log("Wellcome! Connected to Server ✅");
});

socket.addEventListener("message", (msg)=>{
    console.log("Just got this : ", msg.data , " from server");
    
    const html = `<div style="float:left">서버 : ${msg.data} </div><br>`;
    $("#chatArea").append(html);
});

socket.addEventListener("close", ()=>{
    console.log("Bye! Disconnected from Server ❌");
});

function sendMsgToServer(msg){
    socket.send(msg);
}

function sendBtn(){
    const msg = $("#inputBox").val();
    if(!msg) return;

    const html = `<div style="float:right">나 : ${msg}</div><br>`;
    $("#chatArea").append(html);
    sendMsgToServer(msg);
    // 클리어
    $("#inputBox").val('');
}


const badWords = [
    "시발","미친놈","꺼져","병신"
];
let fromMsg = "안녕 시발롬아";
  

let isBadWordsContains = false;

function bc(){
    const chk = fromMsg.split(" ");
    for(let idx in chk){
        const word = chk[idx];
        const findIdx =  badWords.findIndex( w => word.indexOf(w) > -1);
         if( findIdx > -1 ){
           console.log(findIdx);
           isBadWordsContains = true;
           break;
         };
       }
}
 