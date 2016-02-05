var c = document.getElementById("renderWindow");
var cx = c.getContext("2d");
var m_pos = [0,0];

function rad(deg){
	//console.log("Rad: " + deg * Math.PI / 180 + " deg: " + deg);
	return deg * Math.PI / 180;
}

function resize(x, y){
	//console.log("resizing to [" + x + " " + y + "]");
	c.width = x;
	c.height = y;
}

function dist(a, b){
	x = (a[0]-b[0]);
	x *= x;
	y = (a[1]-b[1]);
	y *= y;
	return Math.sqrt(x+y);
}

function line_circle_collision(Ax, Ay, Bx, By, Cx, Cy, Cr){
	var Ax = Ax - Cx;
	var Ay = Ay - Cy;
	var Bx = Bx - Cx;
	var By = By - Cy;
	var dx = Bx-Ax;
	var dy = By-Ay;
	var dr = Math.sqrt(dx*dx+dy*dy);
	var d = Ax*By-Bx*Ay;
	var i = Cr*Cr*dr*dr-d*d;
	if(i < 0){
		return false;
	}
	return true;
}

function SealSamurai(){
	this.mountains = new Image();
	this.mountains.src = './mountains.svg';
	this.seal_circle = new Image();
	this.seal_circle.src = './seal_circle.svg';
	this.kanji = [[[0.0, 0.5388365866621421], [0.07281434697297719, 0.5357150877438126], [0.1345207636292068, 0.4982620911298031], [0.2325240199674366, 0.4379929585372123], [0.3258515085911268, 0.37766643627625895]], [[0.19942984261031885, 0.19485539051174117], [0.3091881221186476, 0.18321027824008343], [0.40496382840409606, 0.1731321534350212]], [[0.527165971861898, 0.13665228598020307], [0.5510726234993112, 0.16157437326739343], [0.567712154014063, 0.258809937894398], [0.5857442760611429, 0.373641673881962]], [[0.22764249461749952, 0.0], [0.25117937891014047, 0.06372997911515114], [0.25278965605672943, 0.31910402251671166], [0.25260477238434326, 0.5694926503796451], [0.255446613348601, 0.6942527989939342], [0.146705194038396, 0.7141270906681904]], [[0.5758440536043371, 0.4073368948197091], [0.6859929744204494, 0.3997764298136832], [0.8324417169132776, 0.3942445648241257], [0.9603931461833448, 0.38901960980015926]], [[0.5625622491396945, 0.19792948057359724], [0.6947540748957793, 0.18447285094406005], [0.8567121719060314, 0.16998320728399655], [0.9515246938982425, 0.16287187881298207], [0.9846785111496785, 0.19290414178741375], [0.9625610563418083, 0.27175255571164436], [0.934312620398037, 0.3730353395596966]], [[0.5673006387432682, 0.5172331193280917], [0.5757993236835985, 0.5474076088719437], [0.5763539747007569, 0.6554099743243614], [0.5772903210415512, 0.8650519376498682], [0.5768072378975746, 1.0]], [[0.5988113769062402, 0.5371298678290986], [0.7035539413024161, 0.5270267909943135], [0.8607975046668218, 0.5108354189071511], [0.9549987177422722, 0.5013860852511048], [1.0, 0.5307571194378808], [0.9968361036064243, 0.6351863542339853], [0.992780590792793, 0.8207046952234329], [0.9915162250332492, 0.9467024645119757]], [[0.5798578184919455, 0.7044382175268047], [0.6983026486077066, 0.6942278469642114], [0.8323105091457779, 0.6794362837445013], [0.9215467010192459, 0.6725170859023527]], [[0.5728918788355908, 0.9032784471852864], [0.689789053693797, 0.8958577135457084], [0.8298414175210083, 0.8852555961164661]]];

	this.k_ind = 0;
	this.touch_size = 20;
	this.state = -1;


	this.dim = [640, 320];
	resize(this.dim[0], this.dim[1]);

	a=this;
	this.renderer = setInterval(function(){a.drawFrame();}, 33.333); // draw new frame every 1/24s

	this.drawFrame = function(){ // draws one frame for game
		p1 = [this.kanji[this.k_ind][0][0]*this.dim[1]+(this.dim[0]-this.dim[1])/2,this.kanji[this.k_ind][0][1]*this.dim[1]+(this.dim[1]-this.dim[1])/2];
		p2 = [this.kanji[this.k_ind][this.kanji[this.k_ind].length-1][0]*this.dim[1]+(this.dim[0]-this.dim[1])/2, this.kanji[this.k_ind][this.kanji[this.k_ind].length-1][1]*this.dim[1]+(this.dim[1]-this.dim[1])/2];

		d1 = dist(m_pos, p1);
		d2 = dist(m_pos, p2);

		if(d1 < this.touch_size){
			if(this.state == -1){
				this.state = 0;
				console.log(this.state);
			}else if(this.state == 1){
				this.state = -1;
				console.log(this.state);
				this.k_ind++;
				if(this.k_ind >= this.kanji.length){
					this.k_ind = 0;
				}
			}
		}else if(d2 < this.touch_size){
			if(this.state == -1){
				this.state = 1;
				console.log(this.state);
			}else if(this.state == 0){
				this.state = -1;
				console.log(this.state);
				this.k_ind++;
				if(this.k_ind >= this.kanji.length){
					this.k_ind = 0;
				}
			}
		}else if(this.state != -1){
			var colided = false;
			for(i = 1; i < this.kanji[this.k_ind].length; i++){
				var a = this.kanji[this.k_ind][i-1];
				var b = this.kanji[this.k_ind][i];

				if(line_circle_collision(a[0]*this.dim[1]+(this.dim[0]-this.dim[1])/2, a[1]*this.dim[1]+(this.dim[1]-this.dim[1])/2, b[0]*this.dim[1]+(this.dim[0]-this.dim[1])/2, b[1]*this.dim[1]+(this.dim[1]-this.dim[1])/2, m_pos[0], m_pos[1], this.touch_size)){
					colided = true;
					break;
				}
			}
			if(!colided){
				this.state = -1;
				console.log(this.state);
			}
		}



		//console.log("drawing frame");
		cx.clearRect(0, 0, this.dim[0], this.dim[1]); // clear enough canvas for game
		/*
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.dim[0], this.dim[1]); // background
		*/
		// debug tools
		cx.fillStyle = "#C6AB83";
		cx.fillRect(0, 0, this.dim[0], this.dim[1]);
		cx.font = "12px Optima";
		cx.drawImage(this.mountains, 0, this.dim[1]*(4/7), this.dim[0], this.dim[1]/3);
		cx.translate((this.dim[0]-this.dim[1])/2,(this.dim[1]-this.dim[1])/2);
			cx.drawImage(this.seal_circle, 0, 0, this.dim[1], this.dim[1]);
			cx.beginPath();
			cx.lineWidth='7';
			for(i = 0; i <= this.k_ind; i++){
				cx.moveTo(this.kanji[i][0][0]*this.dim[1],this.kanji[i][0][1]*this.dim[1]);
				for(j = 1; j < this.kanji[i].length; j++){
					cx.lineTo(this.kanji[i][j][0]*this.dim[1],this.kanji[i][j][1]*this.dim[1]);
				}
			}
			cx.stroke();
		cx.translate(-(this.dim[0]-this.dim[1])/2,-(this.dim[1]-this.dim[1])/2);

		cx.beginPath();
		cx.arc(m_pos[0]-10, m_pos[1]-10, this.touch_size, 0, 2*Math.PI);
		cx.stroke();
	}
}

var ss = new SealSamurai();

c.onmousemove = mouseMove;

function mouseMove(event){
	m_pos = [event.clientX,event.clientY];
}