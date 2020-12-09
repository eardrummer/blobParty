class Blob {
  constructor(x, y, r){
    this.hu = 0;
    this.lapse = 0;
    this.xPos = x;
    this.yPos = y;
    this.r = 80;
    this.c = color(this.hu%255, 255, 255);
  }

  init(x = windowWidth/2,y = windowHeight/2){
    this.xPos = x;
    this.yPos = y;
  }

  draw(){
    colorMode(HSB, 255);
    fill(this.c);
    noStroke();
			beginShape();
			for (let i = 0; i < TAU; i += TAU / 360) {
				let xx = this.xPos + this.r * cos(i);
				let yy = this.yPos + this.r * sin(i);
				let p = res(xx, yy);
				curveVertex(p.x, p.y);
			}
			endShape(CLOSE);
  }

  update(){
    this.hu += .1;
    this.c =	color(this.hu%255, 255, 255);
  }
}

//-------------------------------------------------------
function res(x, y) {
	let p = createVector(x, y);
	let scl = 0.0001;
	let ang = noise(p.x * scl, p.y * scl, frameCount * 0.001) * 200;
	let off = noise(p.x * scl, p.y * scl, frameCount * 0.001) * 50;
	p.x += cos(ang) * off;
	p.y += sin(ang) * off;
	return p;
}
