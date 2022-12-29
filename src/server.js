import http from "http";
import https from "https";

import WebSocket from "ws";
import express from "express";


// 설정파일
// const d_Conf = require("./conf");
const conf_dir = __dirname + "/";
const conf_file = "conf.json";
// const fs = require("fs");

const d_Conf = {
  // @ do-zoom's Protocol
  "protocol" : "http",
  // @ do-zoom's domain
  "domain" : "127.0.0.1",
  // @ do-zoom's http port
  "port" : 3939,
  // @ do-zoom's https port (secure)
  "ssl_Port" : 443,
  // @ do-zoom's cert directory
  "cert_Path" : "/ssl/"
};


const dZoom_server = express();
/**
 * [view,static resources] set-up
 */
dZoom_server.set('view engine', "pug");
dZoom_server.set("views",__dirname + "/views");
dZoom_server.use("/public",express.static(__dirname + "/public"));

/**

                                                                                                                 
8 888888888o.       ,o888888o.     8 8888      88 8888888 8888888888  8 8888 b.             8      ,o888888o.    
8 8888    `88.   . 8888     `88.   8 8888      88       8 8888        8 8888 888o.          8     8888     `88.  
8 8888     `88  ,8 8888       `8b  8 8888      88       8 8888        8 8888 Y88888o.       8  ,8 8888       `8. 
8 8888     ,88  88 8888        `8b 8 8888      88       8 8888        8 8888 .`Y888888o.    8  88 8888           
8 8888.   ,88'  88 8888         88 8 8888      88       8 8888        8 8888 8o. `Y888888o. 8  88 8888           
8 888888888P'   88 8888         88 8 8888      88       8 8888        8 8888 8`Y8o. `Y88888o8  88 8888           
8 8888`8b       88 8888        ,8P 8 8888      88       8 8888        8 8888 8   `Y8o. `Y8888  88 8888   8888888 
8 8888 `8b.     `8 8888       ,8P  ` 8888     ,8P       8 8888        8 8888 8      `Y8o. `Y8  `8 8888       .8' 
8 8888   `8b.    ` 8888     ,88'     8888   ,d8P        8 8888        8 8888 8         `Y8o.`     8888     ,88'  
8 8888     `88.     `8888888P'        `Y88888P'         8 8888        8 8888 8            `Yo      `8888888P'    



                                                                                                               
   d888888o.   8 8888888888       ,o888888o.    8888888 8888888888  8 8888     ,o888888o.     b.             8 
 .`8888:' `88. 8 8888            8888     `88.        8 8888        8 8888  . 8888     `88.   888o.          8 
 8.`8888.   Y8 8 8888         ,8 8888       `8.       8 8888        8 8888 ,8 8888       `8b  Y88888o.       8 
 `8.`8888.     8 8888         88 8888                 8 8888        8 8888 88 8888        `8b .`Y888888o.    8 
  `8.`8888.    8 888888888888 88 8888                 8 8888        8 8888 88 8888         88 8o. `Y888888o. 8 
   `8.`8888.   8 8888         88 8888                 8 8888        8 8888 88 8888         88 8`Y8o. `Y88888o8 
    `8.`8888.  8 8888         88 8888                 8 8888        8 8888 88 8888        ,8P 8   `Y8o. `Y8888 
8b   `8.`8888. 8 8888         `8 8888       .8'       8 8888        8 8888 `8 8888       ,8P  8      `Y8o. `Y8 
`8b.  ;8.`8888 8 8888            8888     ,88'        8 8888        8 8888  ` 8888     ,88'   8         `Y8o.` 
 `Y8888P ,88P' 8 888888888888     `8888888P'          8 8888        8 8888     `8888888P'     8            `Yo 

 

 */

dZoom_server.get("/", (req,res)=>{
  res.render("index");
});
// catchall
dZoom_server.get("/*", (req,res) => res.redirect("/"));




// listen handler
const handleListen = () =>{
  switch(d_Conf["protocol"]){
    case "https":
      break;
    case "http":
      console.log(`
      ##########################################################
        😎 Wellcome to DOIL's dev SERVER (by express) 😎
        🐳 Server listening on port ${d_Conf.port}
        site : http://${d_Conf.domain}:${d_Conf.port}/
      ##########################################################
      `);
      default:
        break;
  }
}

const server = (d_Conf["protocol"] == "http") ? http.createServer(dZoom_server) : https.createServer(dZoom_server);
// webSocket과 server를 모두 같은 포트에 가동시키는 경우 server를 넘겨준다.
const wss = new WebSocket.Server({ server });

// socket : 연결된 브라우저
// 해당 나쁜말에 서버는 참지않는다.
let angryMode = false;
const badWords = [
  "시발","미친놈","꺼져","병신"
];
const persevereStack = [];
const randomMsg = [
  "ㅁㄴㅇ러미ㅏ러마ㅣㄴㅇ러ㅏㅣㅁㄴㅇ러미ㅏㅇㄹ?",
  "나랏말싸미 듕귁에달아",
  "피카츄보다 뽀미가 더더더더더 귀여워~",
  "참새가 봉황의 뜻을 어찌 알리요",
];




wss.on("connection",(socket)=>{
  console.log("Connected to Browser ✅");
  socket.send("hello");

  // 해당 소켓이 닫힌 경우
  socket.on("close", ()=>{
    console.log("Disconnected from the Browser ❌");
  });

  socket.on("message", (msg)=>{
    const fromMsg = msg.toString();
    console.log("client : " , fromMsg);
    //bad word check
    const chk = fromMsg.split(" ");
    let isBadWordsContains = false;
    for(let idx in chk){
      const word = chk[idx];
      const findBadWordIdx =  badWords.findIndex( w => word.indexOf(w) > -1);
         if( findBadWordIdx > -1 ){
           isBadWordsContains = true;
           break;
         };
    }
    // 서버는 화나면 무조건 분노만 표출한다.
    if(angryMode){
      // 10회 이하로 분노를 표출한다.
      const count = Math.floor(Math.random() * 10) + 1;
      for(let i=0; i<count;i++){
        const randomTime = Math.floor(Math.random() * 100) + 1;
        setTimeout(()=>{
          // 분노의 단어
          const aw = ["적당히 할것이지 뭔 난리야 ㅈ같은색기야" , "개열받네 진짜 븅신같은놈이" , "야이 슈벌럼아 ai가 만만하냐?"];
          const randomIdx = Math.floor(Math.random() * aw.length);
          socket.send(aw[randomIdx]);
          console.log("-" , aw[randomIdx]);
        }, randomTime * 100);
      }
     
    }else{
      if(isBadWordsContains){
        // 인내의 단어
        const pw = ["뭐라고했냐...?", "적당히 해라??", "하... 못참는다 진짜"];
        const randomIdx = Math.floor(Math.random() * pw.length);
        socket.send(pw[randomIdx]);
        console.log("-" , pw[randomIdx]);
        persevereStack.push(msg);
        if(persevereStack.length > 4) angryMode = true;
      }else{
        const randomIdx = Math.floor(Math.random() * randomMsg.length);
        socket.send(`나는 그냥 아무말이나 해. 예를 들면 ${randomMsg[randomIdx]} 과 같은 말..?`);
        console.log("-" , `나는 그냥 아무말이나 해. 예를 들면 ${randomMsg[randomIdx]} 과 같은 말..?`);
      }
    }
  })
});



server.listen(d_Conf["port"] , handleListen);