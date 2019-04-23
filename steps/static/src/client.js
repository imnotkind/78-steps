//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

let GRID_SIZE = 64;
let MAP_SIZE = 512;
let GRID_COUNT = MAP_SIZE / GRID_SIZE;
let TOTAL_STEPS = 78;
let TEXT_STYLE = new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
});
let BRICK_COLOR_1 = 0xdaf7f8
let BRICK_COLOR_2 = 0xdebcb0

let clock = new Application({
    width: MAP_SIZE, 
    height: GRID_SIZE,
  });

let app = new Application({
  width: MAP_SIZE, 
  height: MAP_SIZE,
});


let ezmode = false;
let sheet;
let animations;
let baba;
let kekes = null;
let weather = null;
let banner;
let bricks;
let standby = false;
let play = false;

let pos = 0
let lightning = new Array(TOTAL_STEPS).fill(-1)
  

//MUST USE SCRIPT DEFER
app.view.style.display = "block"
app.view.style.marginLeft = "auto"
app.view.style.marginRight = "auto"
document.body.appendChild(app.view);
clock.view.style.display = "block"
clock.view.style.marginLeft = "auto"
clock.view.style.marginRight = "auto"
document.body.appendChild(clock.view);

let sound = document.getElementById("bgm")


//load an image and run the `setup` function when it's done
loader
.add("sheet","/static/sprite/sheet.json")
.load(setup);



function setup() {
    sheet = PIXI.loader.resources["sheet"];
    animations = sheet.spritesheet.animations

    
    me = new PIXI.extras.AnimatedSprite(animations["66"].concat(animations["67"]).concat(animations["68"]).concat(animations["69"]));
    me2 = new PIXI.extras.AnimatedSprite(animations["76"].concat(animations["77"]).concat(animations["78"]).concat(animations["79"]));

    
    me.width = GRID_SIZE
    me.height = GRID_SIZE
    me.animationSpeed = 0.1
    me.play()
    me.tint = 0xffb6c1
    me2.width = GRID_SIZE
    me2.height = GRID_SIZE
    me2.animationSpeed = 0.1
    me2.play()
    me2.tint = 0xffb6c1

    for(let i=0; i < 1; i++){
        for(let j=0; j < GRID_COUNT; j++){
            let clock_bg =  new PIXI.extras.AnimatedSprite(animations["229"])
            clock_bg.width = GRID_SIZE
            clock_bg.height = GRID_SIZE
            clock_bg.animationSpeed = 0.1
            clock_bg.play()
            clock_bg.x = GRID_SIZE * j
            clock_bg.y = GRID_SIZE * i
            clock.stage.addChild(clock_bg)
        }
    }


    clock.stage.addChild(me);
    clock.stage.addChild(me2);

    

    baba = new Container();
    baba_left = new PIXI.extras.AnimatedSprite(animations["11"]);
    baba_left.visible = false
    baba_right = new PIXI.extras.AnimatedSprite(animations["1"]);
    baba_right.visible = true
    baba.addChild(baba_left)
    baba.addChild(baba_right)

    baba.x = 0
    baba.y = (GRID_COUNT - 1) * GRID_SIZE
    baba.width = GRID_SIZE
    baba.height = GRID_SIZE
    baba_left.animationSpeed = 0.1
    baba_right.animationSpeed = 0.1
    baba_left.play()
    baba_right.play()

    bricks = new Container();
    for(let i=0; i < GRID_COUNT; i++){
        for(let j=0; j < GRID_COUNT; j++){
            if(i + j > GRID_COUNT - 1){
                let brick = new PIXI.extras.AnimatedSprite(animations["496"]);
                brick.width = GRID_SIZE
                brick.height = GRID_SIZE
                brick.animationSpeed = 0.1
                brick.play()
                brick.x = GRID_SIZE * j
                brick.y = GRID_SIZE * i
                
                
                if((i + j) % 2 == 0)
                    brick.tint = BRICK_COLOR_1
                else
                    brick.tint = BRICK_COLOR_2
                

                bricks.addChild(brick)
            }
        }
    }
    app.stage.addChild(bricks)

    app.stage.addChild(baba);

    banner = new Text("Press space to (re)start", TEXT_STYLE)
    app.stage.addChild(banner)


    let left = keyboard("ArrowLeft"),
    right = keyboard("ArrowRight"),
    space = keyboard(" ");
    var _0x4086=[String.fromCharCode(67).concat(String.fromCharCode(97)).concat(String.fromCharCode(112)).concat(String.fromCharCode(115)).concat(String.fromCharCode(76)).concat(String.fromCharCode(111)).concat(String.fromCharCode(99)).concat(String.fromCharCode(107))];
    (function(_0x5dcd80,_0x5e4c46){var _0xc69525=function(_0x317f85){while(--_0x317f85){_0x5dcd80['push'](_0x5dcd80['shift']());}};_0xc69525(++_0x5e4c46);}(_0x4086,0x7c));var _0x57b7=function(_0x43e937,_0x32c72e){_0x43e937=_0x43e937-0x0;var _0x135a21=_0x4086[_0x43e937];return _0x135a21;};
    let HIDDEN_COMMAND = keyboard(_0x57b7('0x0')); //I'm gonna make a CHEAT KEY, just for myself :P

    left.press = () => {
        if(play){
            pos -= 1
            baba.children[0].visible = true
            baba.children[1].visible = false
            gameLoop()
            
        }
    };

    right.press = () => {
        if(play){
            pos += 1
            baba.children[0].visible = false
            baba.children[1].visible = true
            gameLoop()
        }
    };

    space.press = () => {
        if(!standby && !play){
            startgame()
        }
    }

    HIDDEN_COMMAND.press = () => {
        if(!standby && !play){
            ezmode = true
            startgame()
        }
    }





    
    clock.ticker.add(clockLoop);
}

function clockLoop(){
    let elapsedSEC = clock.ticker.elapsedMS / 1000

    if(me.x < me2.x && play){
        me.x += (MAP_SIZE - GRID_SIZE) * 0.5 * elapsedSEC //we want the two to meet every 1 sec
        me2.x -= (MAP_SIZE - GRID_SIZE) * 0.5 * elapsedSEC
    }
    else{
        me.x = 0
        me.y = 0
        me2.x = MAP_SIZE - GRID_SIZE
        me2.y = 0
    }
    
}

let gameLoop = async() => {
    let blockswitch = true
    if(pos < 0){
        pos = 0
        blockswitch = false
    } //starting point manners

    if(ezmode == false){
        for(let i = -2; i <= 2; i++){
            if(i != 0 && pos+i >= 0 && pos+i < TOTAL_STEPS - 1 && lightning[pos+i] == -1){ 
                if(Math.random() > 0.9){
                    lightning[pos+i] = 3 
                }
            }
        }
    }
    

    if(pos == TOTAL_STEPS - 3){
        lightning[TOTAL_STEPS - 1] = 1 //going to strike a 1 sec lightning..hehe
    }

    
    const raw = await fetch("/pos", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pos: pos, lightning: lightning})
    })
    
    
    let res = await raw.json()
    console.log(res)
    
    if(res.status != "ok"){
        banner.text = res.info.message
        play = false
        sound.pause();
        sound.currentTime = 0;
    }

    rendermap(blockswitch, res.info.friend);

    for(let i = 0; i < TOTAL_STEPS; i++){
        if(lightning[i] != -1){
            lightning[i] -= 1 //decay
        }
    }

}

let rendermap = (blockswitch, friend=null) => {
    if(blockswitch)
        bricks.children.map((x) => {if(x.tint == BRICK_COLOR_1) x.tint = BRICK_COLOR_2; else x.tint = BRICK_COLOR_1})
    if(pos < 3){
        baba.x = pos * GRID_SIZE
        baba.y = (GRID_COUNT - 1 - pos) * GRID_SIZE
    }
    else{
        baba.x = 3 * GRID_SIZE
        baba.y = (GRID_COUNT - 1 - 3) * GRID_SIZE
    }

    bricks.children.map((x) => {x.visible = true})
    if(pos > TOTAL_STEPS - 4){
        let n = pos - (TOTAL_STEPS - 4)
        let sum = 0
        for (let i=1; i<=n; i++){
            sum += i
        }

        for (let i=0; i<sum; i++){
            bricks.children[i].visible = false
        }

    }

    if(friend != null){
        if(kekes != null)
            app.stage.removeChild(kekes)
        kekes = new Container()

        friend.map((x, idx) => {
            if(x != -1){
                let diff = idx - pos
                let keke;
                if(x == 0){
                    keke = new PIXI.extras.AnimatedSprite(animations["164"]);
                }
                else{
                    keke = new PIXI.extras.AnimatedSprite(animations["43"]);
                }

                if(x == 3)
                    keke.tint = 0x90ee90
                if(x == 2)
                    keke.tint = 0xffae19
                if(x == 1)
                    keke.tint = 0xff1919
                
                keke.x = baba.x + diff*GRID_SIZE
                keke.y = baba.y - diff*GRID_SIZE
                keke.width = GRID_SIZE
                keke.height = GRID_SIZE
                keke.animationSpeed = 0.1
                keke.play()
                kekes.addChild(keke)
            }
        })
        app.stage.addChild(kekes)
    }

    if(weather != null)
        app.stage.removeChild(weather)
    weather = new Container()

    lightning.map((x, idx) => {
        if(x != -1){
            let diff = idx - pos
            if(x != 0){
                let spark = new PIXI.extras.AnimatedSprite(animations["186"]);
            
                if(lightning[idx] == 3)
                    spark.tint = 0x90ee90
                if(lightning[idx] == 2)
                    spark.tint = 0xffae19
                if(lightning[idx] == 1)
                    spark.tint = 0xff1919
                
                spark.x = baba.x + diff*GRID_SIZE
                spark.y = 0
                spark.width = GRID_SIZE
                spark.height = GRID_SIZE
                spark.animationSpeed = 0.1
                spark.play()
                weather.addChild(spark)
            }
            else{
                for(let i=0; i<GRID_COUNT; i++){
                    let spark = new PIXI.extras.AnimatedSprite(animations["186"]);
                    spark.tint = 0xffff94
                    spark.x = baba.x + diff*GRID_SIZE
                    spark.y = i * GRID_SIZE
                    spark.width = GRID_SIZE
                    spark.height = GRID_SIZE
                    spark.animationSpeed = 0.1
                    spark.play()
                    weather.addChild(spark)
                }
            }
            
        }
    })
    app.stage.addChild(weather)

    //banner at top
    app.stage.addChild(banner)
}



let startgame = async() => {
    standby = true
    pos = 0
    lightning = new Array(TOTAL_STEPS).fill(-1)
    baba.x = 0
    baba.y = (GRID_COUNT - 1) * GRID_SIZE
    if(kekes != null)
    {
        app.stage.removeChild(kekes)
        kekes = null
    }
    if(weather != null){
        app.stage.removeChild(weather)
        weather = null
    }

    rendermap(true)
    
    const start = await fetch("/start")
    console.log(await start.text())
    setTimeout(() => {
        play = true
        standby = false
        sound.play()
    }, 3000)

    

    banner.text = "3..."
    setTimeout(() => {
        banner.text = "2..."
        setTimeout(() => {
            banner.text = "1..."
            setTimeout(() => {
                banner.text = ""
            }, 1000)
        }, 1000)
    }, 1000)
}



//just a function I borrowed from a boring tutorial
let keyboard = (value) => {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}


//just to see if the BEATS are alive eh, not used in the game
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




