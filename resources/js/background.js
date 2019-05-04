// --------------------------------------------------------------------
// ►►► </> with ♥ by Vittorio Retrivi ◄◄◄ -----------------------------
// --------------------------------------------------------------------

const background = document.getElementById("background");
const canvasTop = document.getElementById('canvasTop');
const ctxTop = canvasTop.getContext('2d');

const canvasBot = document.getElementById('canvasBot');
const ctxBot = canvasBot.getContext('2d');

const canvasSky = document.getElementById('canvasSky');
const ctxSky = canvasSky.getContext('2d');

const colorsTop = ["#343d4655","#4f5b6655", "#65737e55","#a7adba55"];
const colorsBot = ["#105B6388", "#FFFAD588", "#FFD34E88", "#DB9E3688", "#BD493288"];

let systemTop;
let systemBot;

let width;
let height;

// --------------------------------------------------------------------

window.addEventListener('resize', function() {
  reset();
});

document.addEventListener('mousemove', (e) => {
  systemTop.setMousePos(e.pageX, e.pageY);
  systemBot.setMousePos(e.pageX, e.pageY);
});

document.addEventListener('mousedown', () => {
  systemTop.forceFieldActive = true;
  systemBot.forceFieldActive = true;
});

document.addEventListener('mouseup', () => {
  systemTop.forceFieldActive = false;
  systemBot.forceFieldActive = false;
});

// --------------------------------------------------------------------

class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  static add(vec1, vec2) {
    let vec = new Vector();
    vec.add(vec1);
    vec.add(vec2);
    return vec;
  };

  static sub(vec1, vec2) {
    let vec = new Vector();
    vec.add(vec1);
    vec.sub(vec2);
    return vec;
  };

  static mult(vec, n) {
    let vector = new  Vector(0,0);
    vector.add(vec);
    vector.mult(n);
    return vector;
  };

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
  };

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
  }

  mult(n) {
    this.x *= n;
    this.y *= n;
  }

  setMag(n){
    this.normalize();
    this.mult(n);
  }

  limit(n){
    if (this.mag() > n) {
      this.setMag(n);
    }
  }

  normalize() {
    let mag = this.mag();
    this.x /= mag;
    this.y /= mag;
  };

  rotate(angle) {
    let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = x;
    this.y = y;
  }

  mag(){
    return Math.hypot(this.x, this.y);
  }
}

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

    if (this.pos.x < -100) this.pos.x = width+100;
    else if (this.pos.x > width+100) this.pos.x = -100;

    if (this.pos.y < -100) this.pos.y = height+100;
    else if (this.pos.y > height+100) this.pos.y = -100;

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
    for (let i = 0; i < particles; i++) {
      let color = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
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
      if (this.forceFieldActive && desired.mag() < this.forceFieldRadius) {
          desired.setMag(-this.maxSpeed);
          let steering = Vector.sub(desired, particle.velocity);
          steering.limit(this.maxForce);
          particle.aceleration = steering;
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

const drawSky = () => {
  // https://codepen.io/AlienPiglet/pen/hvekG
	let starsAmount = Math.round((width + height)*0.25);
	for(let i=0; i<=starsAmount; i++) {
	  let randomX = Math.floor((Math.random()*width)+1);
	  let randomY = Math.floor((Math.random()*height)+1);
	  let randomSize = Math.floor((Math.random()*2)+1);
	  let randomOpacityOne = Math.floor((Math.random()*9)+1);
	  let randomOpacityTwo = Math.floor((Math.random()*9)+1);
	  let randomHue = Math.floor((Math.random()*360)+1);
    if(randomSize>1) {
      ctxSky.shadowBlur = Math.floor((Math.random()*15)+5);
      ctxSky.shadowColor = "white";
	  }
    ctxSky.fillStyle = "hsla("+randomHue+", 30%, 80%, ."+randomOpacityOne+randomOpacityTwo+")";
	  ctxSky.fillRect(randomX, randomY, randomSize, randomSize);
	}
}

const reset = () => {
  width = canvasTop.width = canvasBot.width = canvasSky.width = background.clientWidth;
  height = canvasTop.height = canvasBot.height = canvasSky.height = background.clientHeight;
  systemTop = new ParticleSystem(8, ctxTop, colorsTop , 40, 40);
  systemBot = new ParticleSystem(20, ctxBot, colorsBot, 20, 8);
  drawSky();
}

const loop = () => {
  requestAnimationFrame(loop);
  systemTop.step();
  systemBot.step();
  systemTop.draw();
  systemBot.draw();
}

// --------------------------------------------------------------------

reset();
loop();
