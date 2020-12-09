
var blobMain ;
var tempoSlider, volSlider;
var value, radius;
var radiusMain = 80;

var ready = false;
var section = 0, newSectionFlag = true;
var maxSections = 4;

var shifter, player, loops, leadPattern, vol;
var randomVar = 2;
var counter = 0;

var newPos = [];

var socket;

var mic;

//--------------------------------------------
function setup() {
	createCanvas(windowWidth, windowHeight);

	blobMain = new Blob(windowWidth/2, windowHeight/2, radiusMain);

	// Drawing stuff
	colorMode(HSB, 255);
	background( 64 )
  noFill()
  stroke( 10,0,0,127 )

	//xPos = random(width*0.45, width*0.65);
	//yPos = random(height*0.45, height*0.65);

	tempoSlider = createSlider(0, 100, 50);
	tempoSlider.position(width*0.47, height * 0.9);

	volSlider = createSlider(0,100, 40);
	volSlider.position(width*0.47, height*0.92);

	socket = io.connect('http://localhost:3000');
	socket.on('msg', newBlob);
}

//----------------------------------------------
function newBlob(data){

	if(section != 4){
		return;
	}

	let posX = random(10,800);
	let d = {
		id:data.id,
		pX:posX,
		pY:data.y,
		hu:data.hu
	}

  var index = newPos.findIndex(x => x.id==String(data.id));
	index === -1 ? newPos.push(d) : 0;

	if(index == -1){
		index = newPos.length - 1;
	}
	else{
		newPos[index].hu = data.hu;
		newPos[index].pY = data.y;
	}
}

//----------------------------------------------
function draw() {

	if(ready == false){ // Wait for a click to be ready
		//Gibber.Master.amp = 0;
		rectMode(CENTER);
		fill(0,0,100,50);
		rect(width*0.5, height*0.5, width, height);
		stroke(10,0,0,127);
		strokeWeight(1);
		textSize(30);
		fill(200 + 50*sin(frameCount/10), 100, 100)
		text("CLICK TO ENTER THE BLOB PARTY", width*0.37, height*0.5);
	}
	else{  // Ready

		// Go through different Sections of the performance

		// Music Stuff
		Gibber.Master.amp = volSlider.value()/100;
		musicVariations();

		// Visual Stuff

		strokeWeight( value * 50 )

		if(section == 4){
			colorMode(RGB)
			background( 100 + follow2.getValue() * 155 )
			if(volSlider.value() == 0){
				background(0);
				Tone.Master.volume = 0;
			}
			colorMode(HSB, 255);
		}
		else{
			colorMode(HSB, 255);
	    background( 64,64,64, 80 );
	  }

		noFill();
		stroke(10,0,0,127);
		ellipse(width*0.5, height*0.7, radius*3, radius*1.0);

		if(follow2.getValue() >= 1){
				ellipse(100,100,50);
			}

		blobMain.update();
		blobMain.draw();

		if(section == 4){

				for(let i = 0; i < newPos.length; i++){
					colorMode(HSB, 255);
					fill(color(newPos[i].hu%255, 255, 255));
					noStroke();
					posX = newPos[i].pX;
					posY = newPos[i].pY;

					let r = 30;
						beginShape();
						for (let i = 0; i < TAU; i += TAU / 360) {
							let xx = posX + r * cos(i);
							let yy = posY + r * sin(i);
							let p = res(xx, yy);
							curveVertex(p.x, p.y);
						}
						endShape(CLOSE);
				}
		}
	}

}


//----------------------------------------
function musicVariations(){

	if(section == 0){
		Gibber.Master.amp = 0;

		value = follow.getValue(),
		radius = ( ww2 > wh2 ? wh2 : ww2 ) * value;


		if(mic.getLevel() > 0.008){
			blobMain.r = 80 + (1000*mic.getLevel());
			blobMain.yPos = windowHeight*3/5 - (5000*mic.getLevel());
			shifter.pitch = (6)*sin((frameCount + 500)/100)*sin(frameCount/10) - 12*sin((frameCount + 1000)/2000);

		}
		else{
			blobMain.r = 80;
			blobMain.yPos = windowHeight*3/5;
			shifter.pitch = 4;
		}

		if(newSectionFlag == true){
			Tone.Master.volume = 0.4;
			newSectionFlag = false;
		}
	}
	else if(section == 1){
		Gibber.Master.amp = 0.03;

		value = follow.getValue(),
		radius = ( ww2 > wh2 ? wh2 : ww2 ) * value;

		shifter.pitch = (2*counter)*sin((frameCount + 500)/100)*sin(frameCount/10) - 12*sin((frameCount + 1000)/2000);


		if(mic.getLevel() > 0.008){
			blobMain.r = 80 + (1000*mic.getLevel());
			blobMain.yPos = windowHeight*3/5 - (5000*mic.getLevel());
		}
		else{
			blobMain.r = 80;
			blobMain.yPos = windowHeight*3/5;
		}

		if(newSectionFlag == 1){
			player.volume.value = -12;
			shifter.pitch = (2*counter)*sin((frameCount + 500)/100)*sin(frameCount/10) - 12*sin((frameCount + 1000)/2000);
		}
	}
	else if(section == 2){ // 1st section

		 var x = mouseX / windowWidth,
		      y = mouseY / windowHeight,
		      ww2 = windowWidth / 2,
		      wh2 = windowHeight / 2;

			value = follow.getValue(),
		  radius = ( ww2 > wh2 ? wh2 : ww2 ) * value;

			shifter.pitch = (2*counter)*sin((frameCount + 500)/100)*sin(frameCount/10) - 12*sin((frameCount + 1000)/2000);


		  bass.resonance = (1 - x) * 5
		  bass.cutoff = (1 - y) / 2

			let v = tempoSlider.value();
			let tempoVal = map(v,0,100,0.5,1.5);
			Gibber.Clock.rate = tempoVal;

		  sampler.fx[0].feedback = x < .85 ? x : .85

			if(newSectionFlag == true){
 			 Gibber.scale.root.seq( ['c4','eb4'], 1 )

			 loops.interval = 16;
 			 newSectionFlag = false;
 		 }

		 if(mic.getLevel() > 0.008){
			 blobMain.r = 80 + (1000*mic.getLevel());
			 blobMain.yPos = windowHeight*3/5 - (5000*mic.getLevel());
		 }
		 else{
			 blobMain.r = 80;
			 blobMain.yPos = windowHeight*3/5;
		 }

	}
	else if (section == 3){
		var x = mouseX / windowWidth,
				 y = mouseY / windowHeight,
				 ww2 = windowWidth / 2,
				 wh2 = windowHeight / 2;

		 value = follow.getValue(),
		 radius = ( ww2 > wh2 ? wh2 : ww2 ) * value;

		 loops.interval = 16;
		 shifter.pitch = (2*counter)*sin((frameCount + 500)/100)*sin(frameCount/10) - 12*sin((frameCount + 1000)/2000);

		 bass.resonance = (1 - x) * 5
		 bass.cutoff = (1 - y) / 2

		 let v = tempoSlider.value();
		 let tempoVal = map(v,0,100,0.5,1.5);
		 Gibber.Clock.rate = tempoVal;

		 sampler.fx[0].feedback = x < .85 ? x : .85

		 if(newSectionFlag == true){
			 Gibber.scale.root.seq( ['d4','bb4', 'g4', 'f4', 'c4'], 1 )

			 synth.chord.seq( [ [0,1,2,4] ], 1/2 )
	  	 synth.cutoff.seq( [.1,.2,.3,.4], 1/2 )
			 synth.pan.seq(Rndf(-1,1))

			 loops.interval = 16;
			 newSectionFlag = false;
		 }

		 if(mic.getLevel() > 0.005){
			 blobMain.r = 80 + (1000*mic.getLevel());
			 blobMain.yPos = windowHeight*3/5 - (5000*mic.getLevel());
		 }
		 else{
			 blobMain.r = 80;
			 blobMain.yPos = windowHeight*3/5;
		 }
	}
	else if (section == 4){

		var x = mouseX / windowWidth,
				 y = mouseY / windowHeight,
				 ww2 = windowWidth / 2,
				 wh2 = windowHeight / 2;

		 value = follow.getValue(),
		 radius = ( ww2 > wh2 ? wh2 : ww2 ) * value;

		 loops.interval = 16;
		 shifter.pitch = (2*counter)*sin((frameCount + 500)/100)*sin(frameCount/10) - 12*sin((frameCount + 1000)/2000);

		 bass.resonance = (1 - x) * 5
		 bass.cutoff = (1 - y) / 2

		 let v = tempoSlider.value();
		 let tempoVal = map(v,0,100,0.5,1.5);
		 Gibber.Clock.rate = tempoVal;

		 sampler.fx[0].feedback = x < .85 ? x : .85

		 if(newSectionFlag == true){
			 Gibber.scale.root.seq( ['d4','bb4', 'g4', 'f4', 'c4'], 1 )

			 synth.chord.seq( [ [0,1,2,4] ], 1/2 )
	  	 synth.cutoff.seq( [.1,.2,.3,.4], 1/2 )
			 synth.pan.seq(Rndf(-1,1))

			 loops.interval = 16;
			 newSectionFlag = false;

		 }

		 if(mic.getLevel() > 0.005){
			 blobMain.r = 80 + (1000*mic.getLevel());
			 blobMain.yPos = windowHeight*3/5 - (5000*mic.getLevel());
		 }
		 else{
			 blobMain.r = 80;
			 blobMain.yPos = windowHeight*3/5;
		 }

		 sendBlob();

		 // Server Stuff
		 // Send this Blob Info to socket and Draw all other received Sockets

	}
}

//----------------------------------------------
function setupBeat(){
	drums = EDrums( 'x*o*x*o-' )
	drums2 = EDrums('x', 1/2)
	//drums.amp = 0;

  sampler = Sampler().record( drums, 1 )
    .note.seq( [.25,.5,1,2].rnd(), [1/4,1/8,1/2].rnd() )
    .fx.add( Delay(1/64))
    .pan.seq( Rndf(-1,1) )

  bass = Mono('bass')
    .note.seq( [0,7], 1/8 )

  Gibber.scale.root.seq( ['c4','eb4'], 1 )

	synth = Synth2({ maxVoices:6, amp:.8, resonance:4 })

  // follow Gibber's Master bus output
  follow = Follow( Gibber.Master, 1024 )
	follow2 = Gibber.Analysis.Follow( drums2 );
}

//----------------------------------------------------
function setupTone(){

	shifter = new Tone.PitchShift(2).toMaster();
	player = new Tone.Player('data/lidSample.mp3').connect(shifter);
	shifter.pitch = 0;
	player.volume.value = -24;


	loops = new Tone.Loop(() =>{
		if(player.state){
			player.start();
			counter++;
			blobMain.hu += 50;
			if(counter > 12){
				counter = 1;
			}
		}
	}, 4).start();
}

//------------------------------------------------------
function mousePressed(){

	if(ready == false){
		ready = true;
		//Gibberish.context = new audioContext()

		getAudioContext().resume();
		Tone.context.resume();
		//Gibber.context.resume();

		mic = new p5.AudioIn();
		mic.start();

		setupBeat();
		setupTone();
		Tone.Transport.start();
	}
}

//----------------------------------------------
function sendBlob(){
	var data = {
		y: blobMain.yPos,
		hu: blobMain.hu
	}

	socket.emit('msg', data);
}

//----------------------------------------------
// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

	blobMain.init(windowWidth/2, windowHeight/2);

	tempoSlider.position(width*0.47, height * 0.9);
	volSlider.position(width*0.47, height*0.92);

}

//-----------------------------------------------

function keyPressed(){
	if(keyCode == 32){
		section++;
		newSectionFlag = true;

		if(section > maxSections){
			section = 2;
		}
	}
}
