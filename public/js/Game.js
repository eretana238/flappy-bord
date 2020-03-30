// get canvas and context
const canvas = document.getElementById("cvs")
const ctx = canvas.getContext("2d")

// Resize canvas to full screen
canvas.width  = window.innerWidth
canvas.height = window.innerHeight

// Frames
let frames = 0

// States
let gameState = 4                           /* 0 == endgame, 1 == running, 2 == pause */

// Buttons
document.querySelector(".play-btn").onclick = function(){
    gameState = 1
    document.getElementById("main-menu").style.display = "none"
}
// Sound FX
let diedFX = document.querySelector(".died-fx")

let jumpFX = document.querySelector(".jump-fx")
jumpFX.load()

let passFX = document.querySelector(".pass-fx")
passFX.volume = "0.4"

let themeSong = document.querySelector(".theme")
themeSong.load()
themeSong.volume = "0.3"
themeSong.play()

// Objects
let bord = {
    x: 50,
    y: canvas.height/2,
    r: 21,
    gravity: 0.4,
    speed: 0,
    draw: function() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r-1, 0, 2 * Math.PI)
        ctx.fillStyle = "#fff"
        ctx.fill()
        ctx.closePath()
    },
    // increases speed of the bird downwards
    update: function() {
        this.speed += this.gravity 
        this.y += this.speed
    },
    jump: function() {
        this.speed = -8.0
        jumpFX.load()
        jumpFX.play()
    },
    die: function() {
        diedFX.load()
        diedFX.play()
        gameState = 0
    }
}

let warps = {
    position: [],
    gap: 124,
    maxY: -420,
    minY: 0,
    h: 600,
    w: 50,
    dx: 3,
    draw: function() {
        for(let i = 0; i < this.position.length; i++) {
            let p = this.position[i]

            // Top pipe
            ctx.fillStyle = "#fff"
            ctx.fillRect(p.x, p.y, this.w, this.h)

            // Bottom pipe
            ctx.fillStyle = "#fff"
            ctx.fillRect(p.x, p.y + this.h + this.gap, this.w, this.h)
        }
    },
    update: function() {
        if(frames % 100 == 0) {
            this.position.push({
                x: canvas.width,
                y: Math.random() * this.maxY
            })
        }
        for(let i = 0; i < this.position.length; i++) {
            let p = this.position[i]

            p.x -= this.dx
            if(p.x + this.w <= 0) {
                this.position.shift()
            }
        }
    }
}

let score = {
    number: 0,
    trigger: false,                         // tells the score when to start counting
    draw: function() {
        ctx.fillStyle = "#999";
        ctx.font = "30px Sans Serif";
        ctx.textAlign = "center";
        ctx.fillText(this.number,canvas.width/2, "30");
    },
    update: function() {
        // find first pipe in front of bord
        if(!this.trigger && bord.x > warps.position[0].x + warps.w) {
            this.trigger = true
            this.number++
            passFX.load()
            passFX.play()
        }
        else if(this.trigger) {
            if(frames % 100 == 0) {
                this.number++
                passFX.load()
                passFX.play()
            }
        }

    }
}

// screens
let gameOver = document.querySelector('.gameover-screen')

let gamePause = document.querySelector('.gamepause-screen')

// Event listener
document.addEventListener("keydown", action)

function action(e) {
    switch(e.keyCode) {
        case 32:                            /* space bar = bord jump*/
            if(gameState == 1)
                bord.jump()  
            break
        case 13:                            /* enter = restart game*/
            if(gameState == 0) {
                gameState = 1
                // reset frames
                frames = 0
                // Reset bord
                bord.y = 150
                bord.speed = 0

                // Reset warps
                warps.position = []

                // remove game over screen
                gameOver.style.display = "none"
            }
            break
        case 27:                            /* escape (pause) */
            // Toggle states
            if(gameState == 1) {
                gameState = 2
                gamePause.style.display = "block"
                themeSong.volume = "0.1"
            }
            else if(gameState == 2) {
                gameState = 1
                gamePause.style.display = "none"
                themeSong.volume = "0.3"
            }
    }
}

function hasCollided() {
    for(let i = 0; i < warps.position.length; i++) {
        let p = warps.position[i]
        // check top and botom warps inside x boundaries
        if(bord.x >= p.x && bord.x <= p.x + warps.w && (bord.y - bord.r <= p.y + warps.h || bord.y + bord.r >= p.y + warps.h + warps.gap)) 
            return true

        if(bord.x + bord.r >= p.x && bord.x - bord.r <= p.x && (bord.y < p.y + warps.h || bord.y > p.y + warps.h + warps.gap))
            return true

        if(bord.y + bord.r > canvas.height) 
            return true
    }
}

function update() {
    bord.update()
    warps.update()
    score.update()
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    bord.draw()
    warps.draw()
    score.draw()
}

function loop() {
    if(gameState == 0) {
        gameOver.style.display = "block"
        score.number = 0
        score.trigger = false
    }

    else if(gameState == 1) {
        update()
        draw()
        frames++
        if(hasCollided())
            bord.die()
        
    }

    requestAnimationFrame(loop)
}

loop()
