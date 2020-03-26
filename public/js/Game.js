// get canvas and context
const canvas = document.getElementById("cvs")
const ctx = canvas.getContext("2d")

// Resize canvas to full screen
canvas.width  = window.innerWidth
canvas.height = window.innerHeight

// Frames
let frames = 0

// Objects
let bord = {
    x: 50,
    y: 150,
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
        if(this.y > canvas.height - 25){
            this.resetSpeed()
        }else{
            this.speed += this.gravity 
            this.y += this.speed
        }

        
        
    },
    jump: function() {
        this.speed = -7.0
    },

    resetSpeed: function(){
        this.y = canvas.height - 25
        this.speed = 0
    }
}

let warps = {
    position: [],
    gap: 150,
    maxY: -300,
    h: 500,
    w: 50,
    dx: 2,
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
        if(frames % 200 == 0) {
            this.position.push({
                x: canvas.width,
                y: this.maxY 
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
        case 32:
            bord.jump()
            break
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
    update()
    draw()
    frames++
    requestAnimationFrame(loop)
}

loop()
