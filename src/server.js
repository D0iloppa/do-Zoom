import express from "express";
import fs from "fs";

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
 * ROUTING SECTION
 */
dZoom_server.get("/", (req,res)=>{
  res.render("index");
});

/**
 * http server open
 */
const httpServer = dZoom_server.listen(d_Conf["port"] , ()=>{ // HANDLE LISTEN
  console.log(`
    ##########################################################
      😎 Wellcome to DOIL's dev SERVER (by express) 😎
      🐳 Server listening on port ${d_Conf.port}
      site : http://${d_Conf.domain}:${d_Conf.port}/
      ##########################################################
    `);
});


