// get canvas and context
const canvas = document.getElementById("cvs")
const ctx = canvas.getContext("2d")

// Frames
let frames = 0

// Objects
let bord = {
    x: 10,
    y: 50,
    r: 10,
    draw: function() {
        ctx.fillStyle = "#fff"
        ctx.ellipse(this.x, this.y, this.r, this.r,0,0,2* Math.PI)
        ctx.fill()
    },
    update: function() {

    }
}

function update() {
    
}

function draw() {
    ctx.fillStyle = "#333"
    ctx.fillRect(0,0,canvas.width, canvas.height)

    bord.draw()
    
}

function loop() {
    update()
    draw()
    frames++
    requestAnimationFrame(loop)
}

loop()
