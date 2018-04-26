/*
 * Práctica de Laboratorio 3
 * Desarollo de videojuegos mediante tecnologías web
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Daniel García Baameiro
 *
 */

Quintus.SMBSprites = function(Q) {
	//JUGADOR MARIO
	Q.Sprite.extend("Mario",{
		init: function(p){
			this._super(p, {
				sheet: 'marioR',
				sprite: "MarioAnimation",
				jumpSpeed: -525,
				speed: 235,
				dead: 0,
				limLeft: 0,
				limRight: 0
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
			if(this.p.x < 180) {
				Q.stage().viewport.offsetX = this.p.x - 162;
			}
			if(this.p.x > 102) {
				Q.stage().viewport.offsetX = -50;
			}
			//Limite izquierdo del mapa
			if(this.p.x <= this.p.limLeft) {
				this.p.x = this.p.limLeft + 1;
			}
			//Limite derecho del mapa
			if(this.p.x >= this.p.limRight) {
				this.p.x = this.p.limRight - 1;
			}
			//Limite inferior del mapa
			if(this.p.y > 500 && this.p.dead == 0){
				this.marioDeath();
			}
			if(this.p.dead == 1) this.play("death");
			else if(this.p.jumping && this.p.landed < 0){
				this.play("jump_" + this.p.direction);
			}
			else if(this.p.vx > 0) {
				this.p.ax = 0;
				this.play("run_right");
			}
			else if(this.p.vx < 0) {
				this.p.ax = 0;
				this.play("run_left"); 
			}
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
				vx: 100,
				limLeft: 0,
				limRight: 0
			});
			this.add('2d, aiBounce, animation, defaultEnemy');
			this.play("walk");
		},
		step: function(dt) {
			if(this.p.limLeft != 0) {
				if(this.p.x < this.p.limLeft) {
					this.p.vx = 100;
				}
			}
			if(this.p.limRight != 0){
				if(this.p.x > this.p.limRight) {
					this.p.vx = -100;
				}
			}
		}
	});
	
	//ANIMACION GOOMBA
	Q.animations("GoombaAnimation", {
		walk: { frames: [0, 1], rate: 1/6},
		death: { frames: [2], loop: false, rate : 1/10, trigger: "destroy"}
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
	
	//ENEMIGO KOOPA
	Q.Sprite.extend("Koopa",{
		init: function(p){
			this._super(p, {
				sheet: 'koopaWalk',
				sprite: "KoopaaAnimation",
				vx: 50,
				limLeft: 0,
				limRight: 0
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
		},
		step: function(dt) {
			if(this.p.limLeft != 0) {
				if(this.p.x < this.p.limLeft) {
					this.p.vx = 50;
					this.play("walkRight");
				}
			}
			if(this.p.limRight != 0){
				if(this.p.x > this.p.limRight) {
					this.p.vx = -50;
					this.play("walkLeft");
				}
			}
		}
	});
	
	//ANIMACION KOOPA VERDE
	Q.animations("KoopaaAnimation", {
		walkLeft: { frames: [0, 1], rate: 1/3, flip: false, loop: true},
		walkRight: { frames: [0, 1], rate: 1/3, flip: 'x', loop: true},
		death: { frames: [4], loop: false, rate : 1/3, trigger: "destroy"},
	});
	
	//ANIMACION KOOPA ROJO
	Q.animations("KoopaaAnimationRed", {
		walkLeft: { frames: [5, 6], rate: 1/3, flip: false, loop: true},
		walkRight: { frames: [5, 6], rate: 1/3, flip:"x",loop: true},
		death: { frames: [9], loop: false, rate : 1/3, trigger: "destroy"}
	});

	//DEFAULT ENEMY
	Q.component("defaultEnemy", {
		added: function(){
			this.entity.on("bump.top", function(collision) {
				if(collision.obj.isA("Mario")) {
					var points = Q.stage().insert(new Q.Points100({x: (this.p.x),y: (this.p.y - 17)}));
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

	//PRINCESS
	Q.Sprite.extend("Princess",{
		init: function(p){
			this._super(p, {
				asset: 'princess.png',
				sensor: true
			});
			this.add('2d');
			this.on("bump.left, bump.right, bump.top", function(collision) {
				if(collision.obj.isA("Mario")) {
					this.del('2d');
					Q.stage().pause();
					Q.stageScene("victoria",1, { label: "You Win" });
				}
			});
		}
		
	});
	
	//HUD VIDAS
	Q.Sprite.extend("MarioVidas",{
		init: function(p){
			this._super(p, {
				asset: 'lives.png'
			});
		}
	});
	
	//COIN_SPINNER
	Q.Sprite.extend("CoinSpinner",{
		init: function(p){
			this._super(p, {
				asset: 'coin_spinner.png',
				sensor: true
			});
			this.add('tween');
			this.animate({y: this.p.y - 50 }, 0.15, Q.Easing.Quadratic.In, { callback: function() {
						this.destroy();}
				});
		}
	});
	
	//100point
	Q.Sprite.extend("Points100",{
		init: function(p){
			this._super(p, {
				asset: '100.png',
				sensor: true
			});
			this.add('tween');
			this.animate({y: this.p.y - 50 }, 0.3, Q.Easing.Quadratic.In, { callback: function() {
						this.destroy();}
				});
		}
	});
	
	//200point
	Q.Sprite.extend("Points200",{
		init: function(p){
			this._super(p, {
				asset: '200.png',
				sensor: true
			});
			this.add('tween');
			this.animate({y: this.p.y - 50 }, 0.3, Q.Easing.Quadratic.In, { callback: function() {
						this.destroy();}
				});
		}
	});
	
	//1up
	Q.Sprite.extend("Live1up",{
		init: function(p){
			this._super(p, {
				asset: '1up.png',
				sensor: true
			});
			this.add('tween');
			this.animate({y: this.p.y - 50 }, 0.3, Q.Easing.Quadratic.In, { callback: function() {
						this.destroy();}
				});
		}
	});
	
	
	//COINS
	Q.Sprite.extend("Coin",{
		init: function(p){
			this._super(p, {
				sheet: 'coin',
				sprite: "CoinAnimation",
				skipCollide: true,
				gravity: 0,
				sensor: true
			});
			this.add('2d, animation, tween');
			this.play('shine');
			
			this.on("bump.left, bump.right, bump.top, bump.bottom", function(collision) {
				if(collision.obj.isA("Mario")) {
					Q.audio.play("coin.ogg");
					this.del('2d');
					this.animate({y: this.p.y - 70 }, 0.1, Q.Easing.Quadratic.In, { callback: function() {
						this.destroy();}
					});
					var points = Q.stage().insert(new Q.Points200({x: (this.p.x),y: (this.p.y - 17)}));
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
				coinsInside: 1,
				mushroom: 0
			});
			this.add('2d, aiBounce, animation, tween');
			this.play('shine');
			this.on("bump.bottom", function(collision) {
				if(this.p.mushroom == 0){
					if(collision.obj.isA("Mario") && this.p.coinsInside > 0) {
						this.animate({y: this.p.y - 5 }, 0.05, Q.Easing.Quadratic.In, { callback: function() {
							this.animate({y: this.p.y + 5}, 0.05, Q.Easing.Quadratic.In, { callback: function() { 
								Q.audio.play("coin.ogg");
								Q.state.inc("coins", 1);
								Q.state.inc("score", 200);
								this.p.coinsInside -= 1;
								var coinSpinner = Q.stage().insert(new Q.CoinSpinner({x: (this.p.x),y: (this.p.y - 34)}));
								var points = Q.stage().insert(new Q.Points200({x: (this.p.x),y: (this.p.y - 17)}));
								if(this.p.coinsInside < 1) this.play('used'); 
							}});
						}});	
					}
				}
				else {
					this.animate({y: this.p.y - 5 }, 0.05, Q.Easing.Quadratic.In, { callback: function() {
						this.animate({y: this.p.y + 5}, 0.05, Q.Easing.Quadratic.In, { callback: function() { 
								Q.audio.play("item_rise.ogg");
								var mushroom = Q.stage().insert(new Q.Mushroom({x: this.p.x, y: this.p.y -34}));
								var points = Q.stage().insert(new Q.Points200({x: (this.p.x),y: (this.p.y - 17)}));
								Q.state.inc("score", 200);
								this.play('used');
								this.p.mushroom = 0;
						}});
					}});
				}
			});
		}
		
	});
	
	//ANIMACION COINBOX
	Q.animations("CoinBoxAnimation", {
		shine: { frames: [0, 1, 2], rate: 1/2 },
		used: { frames: [3], rate: 1 }
	});

	//MUSHROOMS
	Q.Sprite.extend("Mushroom",{
		init: function(p){
			this._super(p, {
				asset: '1up_mushroom.png',
				vx: 150,
				sensor: true
			});
			this.add('2d, aiBounce');
			this.on("bump.left, bump.right, bump.top, bump.bottom", function(collision) {
				if(collision.obj.isA("Mario")) {
					var liveup = Q.stage().insert(new Q.Live1up({x: (this.p.x),y: (this.p.y - 34)}));
					Q.audio.play("1up.ogg");
					this.del('2d');
					this.destroy();
					Q.state.inc("lives", 1);
					Q.state.inc("score", 1000);
				}
			});
		}
	});
	
	//PLATFORM
	Q.Sprite.extend("Platform",{
		init: function(p){
			this._super(p, {
				asset: 'platform.png',
				vx: 100,
				gravity:0,
				limLeft:0,
				limRight:0
			});
			this.add('2d, aiBounce');
			this.on("bump.top", function(collision) {
				if(collision.obj.isA("Mario")) {
					collision.obj.p.x = collision.obj.p.x + this.p.vx/60;
				}
			});
		},
		step: function(dt) {
			if(this.p.x < this.p.limLeft) {
				this.p.vx = 100;
			}
			if(this.p.x > this.p.limRight) {
				this.p.vx = -100;
			}
		}
	});
}