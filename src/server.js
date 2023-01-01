import http from "http";
import https from "https";

//import WebSocket from "ws";
import {Server} from "socket.io"
import {instrument} from "@socket.io/admin-ui";

import express from "express";




// 설정파일
// const d_Conf = require("./conf");
const conf_dir = __dirname + "/";
const conf_file = "conf.json";
// const fs = require("fs");

const d_Conf = {
  // @ do-zoom's Protocol
  "protocol"   : "http",
  // @ do-zoom's domain
  "domain"     : "doiloppa.chickenkiller.com",
  // @ do-zoom's http port
  "port"       : 3939,
  // @ do-zoom's outter port
  "oPort"      : 5000,
  // @ do-zoom's https port (secure)
  "ssl_Port"   : 443,
  // @ do-zoom's cert directory
  "cert_Path"  : "/ssl/"
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
dZoom_server.get("/tset", (req,res)=>{
  res.render("testHome");
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
        site : http://${d_Conf.domain}:${d_Conf.oPort}/
      ##########################################################
      `);
      default:
        break;
  }
}

const server = (d_Conf["protocol"] == "http") ? http.createServer(dZoom_server) : https.createServer(dZoom_server);
// websocket server
const wsServer = new Server(server,{
  cors:{
    origin:["https:/admin.socket.io"],
    credentials : false,
  }
});
instrument(wsServer , {
  auth:{
    type:"basic",
    username:"admin",
    password:"$2b$10$xnm4EGwDhHQbVXYzz2AsXO4716EH6J2lDuE0ihaOOkWWb.Ig92G0."
    // require("bcrypt").hashSync("password", 10) : password 생성
  },
  serverId:`${require("os").hostname()}#${process.pid}`
});

//SocketIO(server);

/**
 * public room의 리스트 리턴(names)
 * @returns publicRooms
 */
function publicRooms(){

  // Destructuring assignment
  const { sockets : {
        adapter : { sids , rooms}
    }
  } = wsServer;

  const publicRooms = [];
  
  rooms.forEach( (_,key)=>{
    if(!sids.get(key)) publicRooms.push(key)
  });
  return publicRooms;
}

/**
 * 해당 방의 user size를 구한다
 * @param {*} roomName : 방의 이름
 */
function countRoom(roomName){
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}



wsServer.on("connection", (socket) => {
  // any event listener [like middleware]
  socket.onAny((event)=>{
    console.log(`Socket Event:${event}`);
  });

  // socket.rooms : [set]

  // default nickname-set
  const now = new Date();
  socket["nickname"] = `anonymous_${now.getTime()}`;


  // 이벤트 리스너 정의
  // [enter_room]
  socket.on("enter_room" , (args , done) => {
    const data = {...args};
    const roomNm = data.roomName;
    socket.join(roomNm);

    // callback이 명백하게 선언된 경우에만 실행
    if(typeof(done) == "function") done({ id : socket.id});

    socket.to(roomNm).emit("welcome", { 
        id       : socket.id,
        nickname : socket.nickname,
        roomSize : countRoom(roomNm),
        msg      : "hi"
      });
    wsServer.sockets.emit("room_change" , publicRooms());

  });
  /////////////////  enter_room END  ////////////////////

  // [nickname]
  socket.on("setNickname" , (args , done) => {
    const data = {...args};
    const nickName = data.nickName;

    socket["nickname"] = nickName;
  
    // callback이 명백하게 선언된 경우에만 실행
    if(typeof(done) == "function") done({ id : socket.id});
  });
    /////////////////  enter_room END  ////////////////////

   // [new_message]
   socket.on("new_message" , (args , done) => {
    const data = {...args};
    const msg  = data.msg;
    const room = data.roomName;

    socket.to(room).emit("new_message", { 
      id  : socket.id,
      msg : `${socket.nickname}: ${msg}`
    });

    // callback이 명백하게 선언된 경우에만 실행
    if(typeof(done) == "function") done({ id : socket.id});
  });
  /////////////////  new_message END  ////////////////////


  /*
  // [disconnecting]
  *  완전히 disconnected 된 것이 아니라,
  *  disconnect되는 중에 대한 이벤트
  */
  socket.on("disconnecting", ()=>{
      socket.rooms.forEach( room => {
        socket.to(room).emit("bye",{ 
            id       : socket.id,
            nickname : socket.nickname,
            roomSize : countRoom(room) -1 ,
            msg      : "bye"
          });
      });

  });


  // [disconnect]
  socket.on("disconnect", ()=>{    
    wsServer.sockets.emit("room_change" , publicRooms());
  });
  /////////////////  disconnect END  ////////////////////

});


server.listen(d_Conf["port"] , handleListen);