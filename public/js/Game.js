// get canvas and context
const canvas = document.getElementById("cvs")
const ctx = canvas.getContext("2d")

// Resize canvas to full screen
canvas.width  = window.innerWidth
canvas.height = window.innerHeight

// Frames
let frames = 0

// States
let gameState = 1                           /* 0 == endgame, 1 == running, 2 == pause */

// Objects
let bord = {
    x: 50,
    y: canvas.height/2,
    r: 20,
    gravity: 0.3,
    speed: 0,
    draw: function() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.fillStyle = "#fff"
        ctx.fill()
        ctx.closePath()
    },
    // increases speed of the bird downwards
    update: function() {
        if(this.y > canvas.height - this.r) {
            gameState = 0
        }else{
            this.speed += this.gravity 
            this.y += this.speed
        }
    },
    jump: function() {
        this.speed = -7.0
    }
}

let warps = {
    position: [],
    gap: 120,
    maxY: -380,
    minY: 0,
    h: 500,
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

// Event listener
document.addEventListener("keydown", action)

function action(e) {
    switch(e.keyCode) {
        case 32:                            /* space bar = bord jump*/
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
            }
            break
        case 27:                            /* escape (pause) */
            // Toggle states
            if(gameState == 1)
                gameState = 2
            else if(gameState == 2)
                gameState = 1
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

    }
}

function update() {
    bord.update()
    warps.update()
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    bord.draw()
    warps.draw()
}

function loop() {
    if(gameState == 1) {
        update()
        draw()
        frames++
        if(hasCollided())
            gameState = 0
    }
    requestAnimationFrame(loop)
}

loop()
