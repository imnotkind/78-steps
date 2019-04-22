//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  utils = PIXI.utils;

var pos = 1
var lightning = new Array(78).fill(-1)
  


function initpixi(){
  let type = "WebGL"
  if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
  }

  PIXI.utils.sayHello(type)


  //Create a Pixi Application
  let app = new Application({
    width: 1024, 
    height: 1024,
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  });

  //Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(app.view);

  //load an image and run the `setup` function when it's done
  loader
  .add("baba","/static/sprite/baba.jpg")
  .load(() => {
    
  });
}

function setup(){
  //Create the cat sprite
  let baba = new Sprite(resources["baba"].texture);
  
  //Add the cat to the stage
  app.stage.addChild(baba);
}


let beattest = async() => {
  const start = await fetch("/start")
  console.log(await start.text())
  setTimeout(async() => {
    setInterval(async() => {
      const raw = await fetch("/pos", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({pos: pos, lightning: lightning})
      })
      console.log(await raw.json())
      pos += 1
    }, 1000)
  }, 2000)
}


window.onload = function(){
  initpixi();
}



