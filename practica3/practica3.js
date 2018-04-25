/*
 * Práctica de Laboratorio 3
 * Desarollo de videojuegos mediante tecnologías web
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Daniel García Baameiro
 * http://localhost:8080/dvi/practica3/
 */

window.addEventListener("load", function() {
	var Q = window.Q = Quintus()
	.include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D, Audio")
	.setup({
		width: 320,
		height: 480
	})
	.controls()
	.touch()
	.enableSound()
	
	Q.load(["mario_small.png","mario_small.json", "goomba.png", "goomba.json", "bloopa.png", "bloopa.json", "piranha.png", "piranha.json",
	"koopa.png", "koopa.json", "princess.png", "coin.png", "coin.json","coinbox.png", "coinbox.json", "lives.png", "music_main.ogg",
	"music_die.ogg", "music_level_complete.ogg", "music_game_over.ogg", "coin.ogg", "jump.ogg", "kick.ogg", "bump.ogg","gameover.png","mainTitle2.png"], function(){
		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png", "goomba.json");
		Q.compileSheets("bloopa.png", "bloopa.json");
		Q.compileSheets("piranha.png","piranha.json");
		Q.compileSheets("coin.png","coin.json");
		Q.compileSheets("coinbox.png","coinbox.json");
		Q.compileSheets("koopa.png","koopa.json");
	});
	
	//JUGADOR MARIO
	Q.Sprite.extend("Mario",{
		init: function(p){
			this._super(p, {
				sheet: 'marioR',
				sprite: "MarioAnimation",
				jumpSpeed: -525,
				speed: 235,
				dead: 0
			});
			this.add('2d, platformerControls, animation, tween');
			this.on("bump.top", function(collision) {
				if(collision.obj.className != "Coin" && collision.obj.className != "CoinBox"){
					Q.audio.play("bump.ogg")
				}
			});
		},
		step: function(dt) {
			if(Q.inputs['up'] && !this.p.jumping) {
				Q.audio.play("jump.ogg")
			}
			//Ajusto el viewport a límite izquierdo de la pantalla
			if(this.p.x < 102) {
				Q.stage().viewport.offsetX = this.p.x - 162;
			}
			if(this.p.x > 102) {
				Q.stage().viewport.offsetX = -50;
			}
			//Limite izquierdo del mapa
			if(this.p.x <= 17) {
				this.p.x = 18
			}
			//Limite derecho del mapa
			if(this.p.x >= 6700) {
				this.p.x = 6700
			}
			//Limite inferior del mapa
			if(this.p.y > 900 && this.p.dead == 0){
				this.marioDeath();
			}
			if(this.p.dead == 1) this.play("death");
			else if(this.p.jumping && this.p.landed < 0){
				this.play("jump_" + this.p.direction);
			}
			else if(this.p.vx > 0) this.play("run_right");
			else if(this.p.vx < 0) this.play("run_left"); 
			else this.play("stand_" + this.p.direction);

			
		},
		
		marioDeath: function() {
			this.p.dead = 1;
			this.del('2d, platformerControls');
			Q.state.dec("lives", 1);
			this.animate({y: this.p.y - 70 }, 0.3, Q.Easing.Quadratic.In, { callback: function() {
						this.animate({y: this.p.y + 300}, 0.7, Q.Easing.Quadratic.In, { callback: function() { this.destroy(); } });
					}
				}
			);
			Q.stageScene("muerte", 1, { label: "You Died" });
		}
	});
	
	
	Q.animations("MarioAnimation", {
		stand_right: { frames: [0], loop: false },
		stand_left: { frames: [14], loop: false },
		run_right: { frames: [1, 2, 3], rate: 1/8 },
		run_left: { frames: [15,16,17], rate: 1/8 },
		jump_right: { frames: [4], loop: false },
		jump_left: { frames: [18], loop: false },
		death: { frames: [12], loop: false, rate: 1/4 }
	});
	
	//ENEMIGO GOOMBA
	Q.Sprite.extend("Goomba",{
		init: function(p){
			this._super(p, {
				sheet: 'goomba',
				sprite: "GoombaAnimation",
				vx: 100
			});
			this.add('2d, aiBounce, animation, defaultEnemy');
			this.play("walk");
		}
	});
	
	//ANIMACION GOOMBA
	Q.animations("GoombaAnimation", {
		walk: { frames: [0, 1], rate: 1/6},
		death: { frames: [2], loop: false, rate : 1/10, trigger: "destroy"}
	});
	
	//ENEMIGO KOOPA
	Q.Sprite.extend("Koopa",{
		init: function(p){
			this._super(p, {
				sheet: 'koopaleft',
				sprite: "KoopaaAnimation",
				vx: 50
			});
			this.add('2d, aiBounce, animation, defaultEnemy');
			this.play("walkLeft");
			this.on("bump.left",this,"turnRight");
			this.on("bump.right",this,"turnLeft");
		},
		turnRight: function(collision) {
			this.play("walkRight");	
		},
		turnLeft: function(collision) {
			this.play("walkLeft");	
		}
	});
	
	//ANIMACION KOOPA
	Q.animations("KoopaaAnimation", {
		walkLeft: { frames: [0, 1], rate: 1/3},
		walkRight: { frames: [3, 4], rate: 1/3},
		death: { frames: [2], loop: false, rate : 1/10, trigger: "destroy"},
	});


	//ENEMIGO BLOOPA
	Q.Sprite.extend("Bloopa",{
		init: function(p){
			this._super(p, {
				sheet: 'bloopa',
				sprite: "BloopaAnimation"
			});
			this.add('2d, aiBounce, animation, defaultEnemy');
			this.on("bump.bottom",this,"stomp");
		},
		
		stomp: function(collision) {
			this.p.vy = -400;
			this.play("jump");	
		}

	});
	
	//ANIMACION BLOOPA
	Q.animations("BloopaAnimation", {
		jump: { frames: [0, 1, 0], rate: 1/4, loop: false },
		death: { frames: [0, 1, 2], loop: false, rate : 1/8, trigger: "destroy"}
	});
	
	//ENEMIGO PIRANHA
	Q.Sprite.extend("Piranha",{
		init: function(p){
			this._super(p, {
				sheet: 'piranha',
				sprite: "PiranhaAnimation",
				vy: -100
			});
			this.add('2d, aiBounce, animation');
			this.play("eat");
			this.on("bump.left, bump.right, bump.bottom, bump.top", function(collision) {
				if(collision.obj.isA("Mario") && collision.obj.p.dead == 0) {
					this.del('2d');
					collision.obj.marioDeath();
				}
			});
		}
	});
	
	//ANIMACION PIRANHA
	Q.animations("PiranhaAnimation", {
		eat: { frames: [0, 1], rate: 1/2 },
		death: { frames: [0], loop: false, rate : 1, trigger: "destroy"}
	});
	
	//DEFAULT ENEMY
	Q.component("defaultEnemy", {
		added: function(){
			this.entity.on("bump.top", function(collision) {
				if(collision.obj.isA("Mario")) {
					this.play("death");
					collision.obj.p.vy = -300;
					Q.audio.play("kick.ogg");
					Q.state.inc("score", 100);
				}
			});
			this.entity.on("bump.left, bump.right, bump.bottom", function(collision) {
				if(collision.obj.isA("Mario") && collision.obj.p.dead == 0) {
					collision.obj.marioDeath();
				}
			});
			
			this.entity.on("destroy", function(){ 
				this.destroy(); 
			});
		}
	});
	
	//PRINCESS
	Q.Sprite.extend("Princess",{
		init: function(p){
			this._super(p, {
				asset: 'princess.png'
			});
			this.add('2d');
			this.on("bump.left, bump.right, bump.top", function(collision) {
				if(collision.obj.isA("Mario")) {
					Q.stage().pause();
					Q.stageScene("victoria",1, { label: "You Win" });
				}
			});
		}
		
	});
	
	//MARCADOR VIDAS
	Q.Sprite.extend("MarioVidas",{
		init: function(p){
			this._super(p, {
				asset: 'lives.png'
			});
		}
	});
	
	//COIN
	Q.Sprite.extend("Coin",{
		init: function(p){
			this._super(p, {
				sheet: 'coin',
				sprite: "CoinAnimation",
				gravity: 0
			});
			this.add('2d, animation, tween');
			this.play('shine');
			
			this.on("bump.left, bump.right, bump.top, bump.bottom", function(collision) {
				if(collision.obj.isA("Mario")) {
					Q.audio.play("coin.ogg");
					this.del('2d');
					this.p.type = Q.SPRITE_NONE;
					this.animate({y: this.p.y - 70 }, 0.1, Q.Easing.Quadratic.In, { callback: function() {
						this.destroy();}
					});
					Q.state.inc("coins", 1);
					Q.state.inc("score", 200);
				}
			});
		}
		
	});
	
	//ANIMACION COINS
	Q.animations("CoinAnimation", {
		shine: { frames: [0, 1, 2], rate: 1/4 }
	});
	
	
	//COINBOX
	Q.Sprite.extend("CoinBox",{
		init: function(p){
			this._super(p, {
				sheet: 'coinbox',
				sprite: "CoinBoxAnimation",
				gravity: 0,
				coinsInside: 1
			});
			this.add('2d, aiBounce, animation, tween');
			this.play('shine');
			this.on("bump.bottom", function(collision) {
				if(collision.obj.isA("Mario") && this.p.coinsInside > 0) {
					this.animate({y: this.p.y - 5 }, 0.05, Q.Easing.Quadratic.In, { callback: function() {
								this.animate({y: this.p.y + 5}, 0.05, Q.Easing.Quadratic.In, { 
									callback: function() { 
										Q.audio.play("coin.ogg");
										Q.state.inc("coins", 1);
										Q.state.inc("score", 200);
										this.p.coinsInside -= 1;
										if(this.p.coinsInside < 1) this.play('used'); 
									} 
								});
							}
						}
					);
				}
			});
		}
		
	});
	//ANIMACION COINBOX
	Q.animations("CoinBoxAnimation", {
		shine: { frames: [0, 1, 2], rate: 1/2 },
		used: { frames: [3], rate: 1 }
	});

	
	//ESCENAS
	
	//LEVEL 1
	Q.scene("level1", function(stage) {
		Q.stageTMX("level1.tmx",stage);
		var mario = stage.insert(new Q.Mario({x: 112, y: 849}));
		var koopa = stage.insert(new Q.Koopa({x: 748, y: 849}));
		var koopa2 = stage.insert(new Q.Koopa({x: 1428, y: 849}));
		var koopa3 = stage.insert(new Q.Koopa({x: 5814, y: 849}));
		var piranha = stage.insert(new Q.Piranha({x: 986, y: 700}));
		var piranha2 = stage.insert(new Q.Piranha({x: 5474, y: 700}));
		var bloopa = stage.insert(new Q.Bloopa({x: 1088, y: 849}));
		var bloopa2 = stage.insert(new Q.Bloopa({x: 1190, y: 849}));
		var bloopa3 = stage.insert(new Q.Bloopa({x: 5355, y: 849}));
		var goomba = stage.insert(new Q.Goomba({x: 1600, y: 849}));
		var goomba2 = stage.insert(new Q.Goomba({x: 1634, y: 849}));
		var goomba3 = stage.insert(new Q.Goomba({x: 4862, y: 849}));
		var princess = stage.insert(new Q.Princess({x: 6732, y: 800}));
		
		var coins = [[8,20],[28, 17],[41,17],[116,15],[124,15]];
		for(c in coins) {
			var coin = stage.insert(new Q.Coin(coinsToMap(coins[c])));
		}
		var coinBoxes = [[16,21,1],[22,17,1],[21,21,1],[23,21,1],[63,21,1],[77,21,1],[92,17,1],[99,21,10],[104,21,1],[107,21,1],[110,21,1],[107,17,1],[167,21,1]]
		for(c in coinBoxes){
			var coinBox = stage.insert(new Q.CoinBox(coinboxesToMap(coinBoxes[c])));
		}
		stage.add("viewport").follow(mario,{ x: true, y: false });
		stage.centerOn(115,675);
		stage.viewport.offsetX = -50;
		stage.viewport.offsetY = 0;
	});
	
	function coinsToMap([a, b]) {
		return {x: + a*35 + 8.5, y: b*34+17};
	}
	
	function coinboxesToMap([a, b, c]) {
		return {x: + a*34+17, y: b*34+18,coinsInside: c};
	}
	//MUERTE
	Q.scene("muerte", function(stage) {
		Q.audio.stop();
		Q.audio.play('music_die.ogg');
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
		}));

		var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCC",
			label: "Continue" }));
		var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, color: "#000",
			label: stage.options.label }));
			
		button.on("click",function() {
			if(Q.state.p.lives > 0) initGame();
			else Q.stageScene("derrota",1);
		});
		box.fit(20);
	});
	
	//VICTORIA
	Q.scene("victoria", function(stage) {
		Q.audio.stop();
		Q.audio.play("music_level_complete.ogg");
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
		}));

		var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCC",
			label: "Play Again" }));
		var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, color: "#000",
			label: stage.options.label }));
		button.on("click",function() {
			Q.state.reset({ lives: 3, score: 0, coins:0});
			startGame();
		});
		box.fit(20);
	});
	
	//DERROTA
	Q.scene("derrota", function(stage) {
		Q.audio.stop();
		Q.audio.play("music_game_over.ogg");
		
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2
		}));
		
		var button = box.insert(new Q.UI.Button({ asset: "gameover.png" }));
		
		button.on("click",function() {
			Q.state.reset({ lives: 3, score: 0, coins:0});
			startGame();
		});
	});
	
	//MARCADOR DE PUNTUACIÓN
	Q.scene('score', function(stage){
		var punt1 = stage.insert(new Q.UI.Text({
			x: 20, 
			y: 20, 
			size: 14,
			align: 'left',
			color: '#fff',
			family: 'emulogic',
			label: 'Mario'
		}));
		var punt2 = stage.insert(new Q.UI.Text({
			x: 20, 
			y: 20, 
			size: 14,
			align: 'left',
			color: '#fff',
			family: 'emulogic',
			label: '\n' + Q.state.p.score
		}));
		Q.state.on("change.score", this, function(score) {
			punt2.p.label = '\n' + score;
		});	
	});
	
	//MARCADOR DE MONEDAS
	Q.scene('coins', function(stage){
		var coin = stage.insert(new Q.Coin({
			x: 130,
			y: 45,
			scale: 0.7
		}));
		var monedas = stage.insert(new Q.UI.Text({
			x: 135,
			y: 20, 
			size: 14,
			align: 'left',
			color: '#fff',
			family: 'emulogic',
			label: '\n x ' + Q.state.p.coins
		}));
		Q.state.on("change.coins", this, function( coins ) {
			monedas.p.label = '\n x ' + coins;
		});	
	});
	
	//MARCADOR DE VIDAS RESTANTES
	Q.scene('lives', function(stage){
		var lives = stage.insert(new Q.MarioVidas({
			x: 240,
			y: 45,
			scale: 0.7
		}));
		var lives2 = stage.insert(new Q.UI.Text({
			x: 245,
			y: 20, 
			size: 14,
			align: 'left',
			color: '#fff',
			family: 'emulogic',
			label: '\n x ' + Q.state.p.lives
		}));
		Q.state.on("change.lives", this, function( lives ) {
			lives2.p.label = '\n x ' + lives;
		});	
	});
	
	//MENU
	Q.scene("menu", function(stage) {
		
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2
		}));
		
		var button = box.insert(new Q.UI.Button({ asset: "mainTitle2.png" }));
		
		button.on("click",function() {
			Q.state.reset({ lives: 3, score: 0, coins:0});
			initGame();
		});
	});

	//CARGA INICIO
	function startGame() {
		Q.loadTMX("level1.tmx", function() {
			Q.audio.stop();
			Q.clearStages();
			Q.stageScene("menu");
		});
	}
	
	function initGame() {
		Q.clearStages();
		Q.audio.stop();
		Q.audio.play("music_main.ogg", { loop: true});
		Q.stageScene("level1");
		Q.stageScene("score", 2);
		Q.stageScene("coins", 3);
		Q.stageScene("lives", 4);
	}

	startGame();
});