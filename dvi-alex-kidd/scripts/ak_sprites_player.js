/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

Quintus.AKSpritesPlayer = function(Q) {
	Q.SPRITE_NONE = 0
	
	Q.Sprite.extend("Alex",{
		init: function(p){
			this._super(p, {
				sheet: 'alex',
				sprite: 'AlexAnimation',
				jumpSpeed: -450,
				speed: 200,
				punching: 0
			});
			this.add('2d, platformerControls, animation, tween');
			this.on('noPunch', function(){ 
				this.play("stand_" + this.p.direction);
				
			});
		},
		step: function(dt) {
			//GOLPEAR
			if(Q.inputs['fire'] && this.p.punching == 0) {
				fist = Q.stage().insert(new Q.AlexFist());
				this.p.punching = 1;
				Q.audio.play("punch.ogg");
				this.play("punch");
				this.p.punching = 2;
			}
			else {
				if(!Q.inputs['fire'] && this.p.punching == 2) {
					this.p.punching = 0;
					fist.destroy();
				}
				//MOVIMIENTOS
				if(Q.inputs['up'] && !this.p.jumping) {
					Q.audio.play("jump.ogg");
				}
				else if(Q.inputs['down']) this.play("crouch_" + this.p.direction);
				else if(this.p.jumping && this.p.landed < 0){
					this.play("jump_" + this.p.direction);
				}
				else if(this.p.vx < 0 || this.p.vx > 0) {
					this.play("run_" + this.p.direction); 
				}
				else {
					if(this.p.vy != 0) this.play("jump_" + this.p.direction);
					if(this.p.vy == 0 && this.p.vx == 0 && this.p.punching == 0) this.play("stand_" + this.p.direction);
				}
			}
		}
	}); 

	Q.animations("AlexAnimation", {
		run_right: { frames: [0, 1, 2, 3], flip: false, rate: 1/4},
		run_left: { frames: [0, 1, 2, 3], flip: 'x', rate: 1/4},
		stand_right: { frames: [8], flip: false, loop: false },
		stand_left: { frames: [8], flip: 'x', loop: false },
		jump_right: { frames: [9], flip: false, loop: false },
		jump_left: { frames: [9], flip: 'x', loop: false },
		punch: { frames: [15], loop: false, rate: 1/6, trigger: "noPunch"},
		crouch_right: { frames: [10], flip: false, loop: false},
		crouch_left: { frames: [10], flip: 'x', loop: false},
		fist: { frames: [16], loop: false, rate: 1/6, trigger: "destroy"}
	});
	
	//SPRITE DEL PUÑO DE ALEX
	Q.Sprite.extend("AlexFist",{
		init: function(p){
			this._super(p, {
				sheet: 'alex',
				sprite: 'AlexAnimation',
				gravity: 0,
				sensor: true,
				type: Q.SPRITE_NONE,
				collisionMask:''
			});
			this.add('2d, animation');
			this.play('fist');
			this.on('destroy', function(){ 
				this.destroy();
			});
		},
		step: function(dt) {
			if(true) {
				alex = Q.stage().lists.Alex[0];
				this.p.y = alex.p.y;
				if(alex.p.direction == 'right') {
					this.p.x = alex.p.x + 32;
				}
				else if(alex.p.direction == 'left') {
					this.p.x = alex.p.x - 16;
				}
			}
		}
	});
}