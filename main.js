let ctx,
    mouseX,
    mouseY,
    clicked,
    anzBowls    = 12,
    anzPieces   = 50,
    score       = 0,
    pieces      = [],
    running     = true,
    workWithOld = false,
    bowls

document.addEventListener('mousemove', mouseMoved)

function mouseMoved(e) {
  mouseX = e.clientX,
  mouseY = e.clientY
}

window.onload = function() {
  ctx = document.getElementById('C').getContext('2d')
  ctx.textBaseline = 'middle'
  ctx.lineWidth    = 3
  ai = new AI()

  init()
  ai.action()
  show()
}

function init() {
 
  let data = localStorage.getItem('PIECES') 
  for (let i = 0; i < anzPieces; i++) {
    if (data != "null" && workWithOld)
      pieces[i] = new Piece(i, JSON.parse(data)[i])
    else 
      pieces[i] = new Piece(i)
  }
  localStorage.setItem('PIECES', JSON.stringify(pieces))
}

function write(text, x, y, size, col, align = 'center') {
  ctx.fillStyle = col
  ctx.font = `${size}px Arial`
  ctx.textAlign = align
  ctx.fillText(text, x, y)
}

function rect(x, y, w, h, col) {
  ctx.fillStyle = col
  ctx.fillRect(x, y, w, h)
}

function circle(x, y, rad, fillColor, strokeColor) {
  ctx.fillStyle = fillColor
  ctx.beginPath()
  ctx.arc(x, y, rad, 0, Math.PI * 2)
  ctx.fill()
  if (!strokeColor)
    return
  ctx.strokeStyle = strokeColor
  ctx.stroke() 
}

function background() {
  rect(0, 0, 800, 650, 'black')
  for (let i = 0; i < anzBowls; i++)
    rect(20 + (i % 4) * 195, 70 + (Math.floor(i / 4) * 195), 175, 175, '#333')
}

function show() {
  makeBowls()
  background()

  for (let p of pieces)
    p.show()
  write(ai.topTwo[0].score, 30, 30, 25, '#aaa')
}

function makeBowls() {
  bowls = ai.topTwo[0].bowls
  for (let bowl of bowls)
    for (let nr of bowl)
      pieces.find(p => p.id == nr).myBowl = bowls.indexOf(bowl)
}

class Piece {
  constructor(i, data = {}) {

    this.id            = data.id           || i
    this.size          = data.size         || [16, 20, 24, 28][Math.floor(Math.random() * 4)]
    this.contentColor  = data.contentColor ||['pink', 'lightblue', 'green', 'brown'][Math.floor(Math.random() * 4)]
    this.content       = data.content      || ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)]
    this.frameColor    = data.frameColor   || ['#fff', '#777', 'yellow', 'red'][Math.floor(Math.random() * 4)]
    this.fontColor     = data.fontColor    || ['#fff', 'blue', '#000'][Math.floor(Math.random() * 3)]
    this.pos           = {x: 0,
                          y: 0}
  }

  findPos() {
    let  nr     = bowls[this.myBowl].indexOf(this.id)
    this.pos.x = 48 + (this.myBowl % 4) * 195 + (nr % 4) * 40
    this.pos.y = 98 + (Math.floor(this.myBowl / 4) * 195 + (Math.floor(nr / 4) * 40))
  }

  show() {
    this.findPos()
    circle(this.pos.x, this.pos.y, this.size, this.contentColor, this.frameColor)
    write(this.content, this.pos.x, this.pos.y + 2, this.size * 1.4, this.fontColor)
  }
}