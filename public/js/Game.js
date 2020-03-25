// get canvas and context
const canvas = document.getElementById("cvs")
const ctx = canvas.getContext("2d")

// Resize canvas to full screen
canvas.width  = window.innerWidth
canvas.height = window.innerHeight

// Frames
let frames = 0

// Event listener
canvas.addEventListener("click", () =>{
    bord.jump()
})
// canvas.onkeyup = function(e) {
//     if(e.keyCode == 32) {
//         bord.jump()
//     }
// }

// Objects
let bord = {
    x: 50,
    y: 50,
    r: 20,
    gravity: 0.25,
    speed: 0,
    draw: function() {
        ctx.save()
        ctx.fillStyle = "#fff"
        ctx.ellipse(this.x, this.y, this.r, this.r, 0, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
    },
    update: function() {
        this.speed += this.gravity 
        this.y += this.speed
    },
    jump: function() {
        this.speed -= 4.5
    }
}

let warp = {
    gap: 130,
    x: 100,
    y: 0,
    h: 400,
    w: 50,
    draw: function() {
        ctx.fillStyle = "#fff"
        ctx.fillRect(this.x, this.y, this.w, this.h)

        ctx.fillStyle = "#fff"
        ctx.fillRect(this.x, this.y + this.h + this.gap, this.w, this.h)

    },
    update: function() {

    }
}

function update() {
    bord.update()
}

function draw() {
    ctx.fillStyle = "#333"
    ctx.fillRect(0,0,canvas.width, canvas.height)

    bord.draw()
    warp.draw()
}

function loop() {
    update()
    draw()
    frames++
    requestAnimationFrame(loop)
}

loop()
