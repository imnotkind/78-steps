
function initpixi(){
  let type = "WebGL"
  if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
  }

  PIXI.utils.sayHello(type)

  //Create a Pixi Application
  let app = new PIXI.Application({
    width: 256, 
    height: 256,
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  });

  //Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(app.view);
}



initpixi();

var pos = 1
var lightning = new Array(78).fill(-1)

setTimeout(async() => {
  const r = await fetch("/start")
  console.log(await r.text())
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
}, 3000)