window.addEventListener("load", function() {	
	var Q = window.Q = Quintus()
	.include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, Audio, 2D")
	.setup({
		width: 1600,
		height: 600
	})
	.controls()
	.touch()
	.enableSound()
	
	Q.input.keyboardControls({
	  W: "up2",
	  A: 'left2',
	  S: 'down2',
	  D: 'right2'
	});

	Q.SPRITE_PLAYER = 1;
    Q.SPRITE_BALON = 2;
    Q.SPRITE_PORTERIA = 4;
	  
	Q.load(["player.png","player2.png", "player.json","player2.json", "ball.png","porteria.png", "futbol.ogg", "futbol.mp3", "kick.ogg","kick.mp3"], function(){
		Q.compileSheets("player.png", "player.json");
		Q.compileSheets("player2.png", "player2.json");
	});
	
	Q.Sprite.extend("Player",{
		init: function(p){
			this._super(p, {
				sheet: 'player',
				sprite: "PlayerAnimation",
				x: 200,
				y: 380,
				jumpSpeed: -550,
				speed: 500,
				player: 1,
				type: Q.SPRITE_PLAYER
			});
			this.add('2d, animation')
			if(this.p.player == 2) this.add('platformerControls');
			if(this.p.player == 1) this.add('platformerControls2');
		},
		step: function(dt) {
			if(this.p.vy < 0) this.play("jump_right");
			else {
				if(this.p.vx > 0) this.play("run_right");
				if(this.p.vx < 0) this.play("run_left");
				if(this.p.vx == 0) this.play("stand_up");
			}				
		}
	});
	

	Q.animations("PlayerAnimation", {
		stand_up: { frames: [0], rate: 1 },
		run_right: { frames: [0, 1, 2], rate: 1/5, loop: true, flip: false },
		run_left: { frames: [0, 1, 2],  rate: 1/5, loop: true, flip: 'x'},
		jump_right: { frames: [3], rate: 1},
		jump_left: { frames: [3], rate: 1, flip: 'x' }
	});
	
	Q.Sprite.extend("Ball",{
		init: function(p){
			this._super(p, {
				asset: "ball.png",
				scale: 0.5,
				x: 250,
				y: 450,
				potencial: 0,
				type: Q.SPRITE_BALON,
				collisionMask: Q.SPRITE_PLAYER | Q.SPRITE_PORTERIA
			});
			this.add('2d, aiBounce');
			this.on("bump.left",this,"kickLeft");
			this.on("bump.right",this,"kickRight");
			this.on("bump.bottom",this,"rebotar");
			this.on("bump.top",this,"frenar");
		},
		kickLeft: function(collision) {
			if(collision.obj.isA("Player")){
				Q.audio.play("kick.ogg");
				this.p.vx = 450;
				this.p.vy = - collision.obj.p.y * 1.5;
				this.p.potencial = collision.obj.p.y;
			}
			else {
				if(collision.obj.isA("Porteria") && collision.obj.p.porteria == 1) {
					Q.state.inc("goles2", 1);
				}
				this.p.vx -= 100;
			}
		},
		kickRight: function(collision) {
			if(collision.obj.isA("Player")){
				Q.audio.play("kick.ogg");
				this.p.vx = -450;
				this.p.vy = - collision.obj.p.y * 1.5;
				this.p.potencial = collision.obj.p.y;
			}
			else {
				if(collision.obj.isA("Porteria") && collision.obj.p.porteria == 2) {
					Q.state.inc("goles1", 1);
				}
				this.p.vx += 100;
			}
		},
		rebotar: function(collision) {
			if(collision.obj.isA("Player")){
				this.p.vy = -collision.obj.p.vy;
			}
			else{
				this.p.vy = -this.p.potencial;
				this.p.potencial = this.p.potencial / 1.2;
				this.p.vx = this.p.vx / 1.25;
			}
		},
		frenar: function(collision) {
			if(collision.obj.isA("Player")){
				this.p.vx = this.p.vx / 1.1;
			}
		}
	});
	
	Q.Sprite.extend("Porteria",{
		init: function(p){
			this._super(p, {
				asset: "porteria.png",
				gravity: 0,
				x: 10,
				y: 350,
				scale: 1.6,
				porteria: 1,
				type: Q.SPRITE_PORTERIA,
				collisionMask: Q.SPRITE_BALON
			});
		}
	});
	
	Q.scene("mapa", function(stage) {
		//Q.audio.play("futbol.ogg", { loop: true});
		Q.stageTMX("mapa.tmx",stage);
		stage.insert(new Q.Player());
		stage.insert(new Q.Player({x:1400, y:380, sheet:'player2', player:2}));
		stage.insert(new Q.Ball({x:800, y:100}));
		stage.insert(new Q.Porteria({x:10, y: 350, porteria: 1}));
		stage.insert(new Q.Porteria({x:1590, y: 350, porteria: 2, flip:'x'}));
	});
	
	//MARCADOR DE PUNTUACIÓN
	Q.scene('goles1', function(stage){
		stage.insert(new Q.UI.Text({
			x: 100, 
			y: 20, 
			size: 24,
			align: 'left',
			color: '#aaa',
			family: 'emulogic',
			label: 'Player 1'
		}));
		var p1 = stage.insert(new Q.UI.Text({
			x: 100, 
			y: 20, 
			size: 24,
			align: 'left',
			color: '#aaa',
			family: 'emulogic',
			label: '\n' + Q.state.p.goles1
		}));
		Q.state.on("change.goles1", this, function(goles1) {
			p1.p.label = '\n' + goles1;
			if(goles1 <= 6) initGame();
			else {
				Q.stageScene("victoria",1, { label: "Player 1 Wins!" });
			}
		});
	});	
	
	Q.scene('goles2', function(stage){	
		stage.insert(new Q.UI.Text({
			x: 1300, 
			y: 20, 
			size: 24,
			align: 'left',
			color: '#aaa',
			family: 'emulogic',
			label: 'Player 2'
		}));
		var p2 = stage.insert(new Q.UI.Text({
			x: 1300, 
			y: 20, 
			size: 24,
			align: 'left',
			color: '#aaa',
			family: 'emulogic',
			label: '\n' + Q.state.p.goles2
		}));
		Q.state.on("change.goles2", this, function(goles2) {
			p2.p.label = '\n' + goles2;
			if(goles2 <= 6) initGame();
			else {
				Q.stageScene("victoria",1, { label: "Player 2 Wins!" });
			}
		});	
	});

	Q.scene("victoria", function(stage) {
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2
		}));
		
		var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCC",
			label: "Continue" }));
			
		var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, color: "#000",
			label: stage.options.label }));
			
		button.on("click",function() {
			startGame();
		});
	});
	
	
	//CARGA INICIAL DEL JUEGO
	function startGame() {
		Q.state.reset({goles1: 0, goles2: 0});
		Q.loadTMX("mapa.tmx", function() {
			initGame();
		});
	}
	
	function initGame() {
		Q.audio.stop();
		Q.clearStages();
		Q.stageScene("mapa");
		Q.stageScene("goles1", 2);
		Q.stageScene("goles2", 3);
	}
	
	startGame();
});