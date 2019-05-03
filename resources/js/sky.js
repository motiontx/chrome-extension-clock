function drawSky() {
  let canvasSky = document.getElementById('canvasSky');
  let ctxSky = canvasSky.getContext('2d');
  let xMax = canvasSky.width = window.screen.availWidth;
  let yMax = canvasSky.height = window.screen.availHeight;
	let starsAmount = Math.round((xMax + yMax)*0.25);

	for(let i=0; i<=starsAmount; i++) {
	  let randomX = Math.floor((Math.random()*xMax)+1);
	  let randomY = Math.floor((Math.random()*yMax)+1);
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
drawSky();

// https://codepen.io/AlienPiglet/pen/hvekG
