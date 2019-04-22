const express  = require("express");
const session = require('express-session');
const bodyParser = require('body-parser')
const fs = require("fs")
const url = require("url");
const nconf = require("nconf");
const mustache = require("mustache");
const moment = require("moment");
const MongoStore = require('connect-mongo')(session);

const MongoUrl = 'mongodb://mongo:27017/mydb';


let start = async() => {


  let app = express();

  app.use(bodyParser.json())

  app.use(session({
    secret: 'SUPER_DUPER_SECRET',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: MongoUrl,
      collection: "sessions"
    })
  }));

  app.use('/static', express.static('static'));
  app.use('/vol', express.static('vol'));
  
  app.get("/", (req, res) => {
    let view = {}
    let template = fs.readFileSync('./static/index.html', 'utf8');
    let output = mustache.to_html(template, view);
    res.send(output);
  })

  app.get("/start", (req, res) => {
    req.session.pos = 0
    req.session.time = moment().valueOf() + 2000
    req.session.bomb = new Array(78).fill(-1)
    req.session.start = true
    res.send("start")
  })

  app.post("/pos", (req, res) => {
    
    let prev_pos = req.session.pos
    let curr_pos = req.body.pos
    let prev_time = req.session.time
    let curr_time = moment().valueOf()
    let bomb = req.session.bomb;
    let lightning = req.body.lightning;

    

    let response = {};
    response.info = {
      message: "",
      bomb: bomb,
      prev_pos: prev_pos,
      curr_pos: curr_pos,
      prev_time: prev_time,
      curr_time: curr_time,
    }

    if(req.session.start === false){
      response.status = "error"
      response.info.message = "game not started"
      return res.send(response)
    }
    else if(Math.abs(curr_pos - prev_pos) != 1 || curr_pos < 0){
      response.status = "error"
      response.info.message = "invalid position"
      req.session.start = false
      return res.send(response)
    }
    else if(curr_time - prev_time < 700 || curr_time - prev_time > 1300){
      response.status = "error"
      response.info.message = "invalid timing"
      req.session.start = false
      return res.send(response)
    }
    else if (curr_pos < 78){
      req.session.pos = curr_pos;
      req.session.time = curr_time;

      for(let i = 0; i < 78; i++){
        if(lightning[i] == 0){
          if(i == curr_pos){
            response.status = "game over"
            response.info.message = "you got hit by lightning"
            req.session.start = false
            return res.send(response)
          }
          if(bomb[i] != -1){
            response.status = "game over"
            response.info.message = "lightning hit the bomb"
            req.session.start = false
            return res.send(response)
          }
        }
      }
      

      if(bomb[curr_pos] != -1){
        bomb[curr_pos] = -1 //diffuse bomb
      }
      

      for(let i = 0; i < 78; i++){
        if(bomb[i] != -1){
          bomb[i] -= 1 //decay

          if(bomb[i] == 0){
            response.status = "game over"
            response.info.message = "bomb exploded"
            req.session.start = false
            return res.send(response)
          }
        }
      }
      
      for(let i = -2; i <= 2; i++){
        if(i != 0 && curr_pos+i >= 0 && curr_pos+i < 78 && bomb[curr_pos+i] == -1){
          if(Math.random() > 0.9){
            //bomb[curr_pos+i] = 5 //deploy bomb
          }
        }
      }

      if(curr_pos == 77 - 2 && bomb[77] == -1){
        //bomb[77] = 5 //going to strike a 1 sec lightning in client hehe
      }

      response.status = "ok"
      return res.send(response)
      
    }
    else{
      response.status = "clear"
      response.info.message = "PLUS{78_steps_are_so_exhausting}"
      req.session.start = false
      return res.send(response)
    }
  })


	app.listen(3080,"0.0.0.0",() => console.log('listening'));
};



start();