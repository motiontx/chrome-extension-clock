const canvasTop = document.getElementById('canvasTop');
const ctxTop = canvasTop.getContext('2d');

// --------------------------------------------------------------------

const canvasBot = document.getElementById('canvasBot');
const ctxBot = canvasBot.getContext('2d');

// --------------------------------------------------------------------

const canvas_container = document.getElementById("canvas_container");
width = canvasTop.width = canvasBot.width =  canvas_container.clientWidth;
height = canvasTop.height = canvasBot.height = canvas_container.clientHeight;

window.addEventListener('resize', function() {
  width = canvasTop.width = canvasBot.width =  canvas_container.clientWidth;
  height = canvasTop.height = canvasBot.height =  canvas_container.clientHeight;
  reset();
});

// --------------------------------------------------------------------

const colorsTop = ["#343d4655","#4f5b6655", "#65737e55","#a7adba55"];
const colorsBot = ["#105B6388", "#FFFAD588", "#FFD34E88", "#DB9E3688", "#BD493288"];

// --------------------------------------------------------------------

const randomColor = (colorPalette) => colorPalette[Math.floor(Math.random() * colorPalette.length)];

document.addEventListener('mousemove', (e) => {
  let mouseX = e.pageX;
  let mouseY = e.pageY;
  systemTop.setMousePos(mouseX, mouseY);
  systemBot.setMousePos(mouseX, mouseY);
});
document.addEventListener('mousedown', () => {
  systemTop.forceFieldActive = true;
  systemBot.forceFieldActive = true;
});
document.addEventListener('mouseup', () => {
  systemTop.forceFieldActive = false;
  systemBot.forceFieldActive = false;
});

class Particle {
  constructor(color, r, minr) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    this.pos = new Vector(x, y);
    let angle = Math.random() * 2 * Math.PI;
    let speedX = Math.cos(angle);
    let speedY = Math.sin(angle);
    this.velocity = new Vector(speedX, speedY);
    this.aceleration = new Vector(0, 0);
    this.radius = Math.random() * r + minr;
    this.radius2 = 0;
    this.color = color;
  }

  step() {
    this.velocity.add(this.aceleration);
    this.pos.add(this.velocity);

    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }

    this.aceleration = new Vector(0, 0);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 100;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius + this.radius2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class ParticleSystem {
  constructor(particles, ctx, colorPalette, r, minr) {
    this.ctx = ctx;
    this.colorPalette = colorPalette
    this.mousePos = new Vector(0, 0);
    this.forceFieldActive = false;
    this.maxSpeed = 3;
    this.maxForce = 0.05;
    this.forceFieldRadius = 200;
    this.particles = [];
    for (var i = 0; i < particles; i++) {
      let color = randomColor(this.colorPalette);
      this.particles.push(new Particle(color, r, minr));
    }
  }

  setMousePos(x, y) {
    this.mousePos = new Vector(x, y);
  }

  step() {
    for (let particle of this.particles) {
      let desired = Vector.sub(this.mousePos, particle.pos);
      let rescaledDistance = Vector.mult(desired, 0.005);
      let radius2 = 30 / Math.exp(rescaledDistance.mag());
      particle.radius2 = radius2;
      if (desired.mag() < this.forceFieldRadius) {
        if (this.forceFieldActive) {
          desired.setMag(-this.maxSpeed);
          let steering = Vector.sub(desired, particle.velocity);
          steering.limit(this.maxForce);
          particle.aceleration = steering;
        }
      }
    }
    for (let particle of this.particles) {
      particle.step();
    }
  }

  draw() {
    this.ctx.globalCompositeOperation = "lighter"
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = "#fff"
    for (let particle of this.particles) {
      particle.draw(this.ctx);
    }
  }
}

// --------------------------------------------------------------------

let systemTop;
let systemBot;

function reset(){
  systemTop = new ParticleSystem(8, ctxTop, colorsTop , 40, 40);
  systemBot = new ParticleSystem(20, ctxBot, colorsBot, 20, 8);
}

function loop() {
  requestAnimationFrame(loop);
  systemTop.step();
  systemBot.step();
  systemTop.draw();
  systemBot.draw();
}

reset();
loop();
