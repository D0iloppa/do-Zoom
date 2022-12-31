const messageList = $("ul");
const messageForm = $("form");
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
});

messageForm.on("submit", (event) => {
    event.preventDefault();
    const input = $(this).find("input");
    console.log(input.val());
   // const input = $(this).input.val();
});