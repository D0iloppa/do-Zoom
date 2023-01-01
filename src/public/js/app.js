const socket = io();

const myFace = $("myFace");
let myStream;

async function getMedia(){
    try {
        myStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        
        myFace.srcObject = myStream;

    } catch(e){
        alert(e);
    }
}

getMedia();