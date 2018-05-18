/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

Quintus.AKSpritesPlayer = function(Q) {
    Q.SPRITE_NONE = 0

    Q.Sprite.extend("Alex", {
        init: function(p) {
            this._super(p, {
                sheet: 'alex',
                sprite: 'AlexAnimation',
                jumpSpeed: -450,
                speed: 200,
                scale: 0.9,
                punching: 0,
                muerto: false,
                llamado: false
            });
            this.add('2d, platformerControls, animation, tween');
            this.on('noPunch', function() {
                this.play("stand_" + this.p.direction);
            });

            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Frog") || collision.obj.isA("Scorpion") || collision.obj.isA("Ghost") || collision.obj.isA("Bird")) {
                    this.p.muerto = true;
                    if (Q.stages[0].lists["AlexFist"] !== undefined) {
                        Q.stages[0].lists["AlexFist"][0].destroy();
                    }
                }
            });
        },
        step: function(dt) {
            if (this.p.y > 3340) {
                Q.stages[0].unfollow();
            }
            if (!this.p.muerto) {
                //GOLPEAR
                if (Q.inputs['fire'] && this.p.punching == 0) {
                    fist = Q.stage().insert(new Q.AlexFist());
                    this.p.punching = 1;
                    Q.audio.play("punch.ogg");
                    this.play("punch");
                    this.p.punching = 2;
                } else {
                    if (!Q.inputs['fire'] && this.p.punching == 2) {
                        this.p.punching = 0;
                        fist.destroy();
                    }
                    //MOVIMIENTOS
                    if (Q.inputs['up'] && !this.p.jumping) {
                        Q.audio.play("jump.ogg");
                    } else if (Q.inputs['down']) this.play("crouch_" + this.p.direction);
                    else if (this.p.jumping && this.p.landed < 0) {
                        this.play("jump_" + this.p.direction);
                    } else if (this.p.vx < 0 || this.p.vx > 0) {
                        this.play("run_" + this.p.direction);
                    } else {
                        if (this.p.vy != 0) this.play("jump_" + this.p.direction);
                        if (this.p.vy == 0 && this.p.vx == 0 && this.p.punching == 0) this.play("stand_" + this.p.direction);
                    }
                }
            } else {
                if (!this.p.llamado) {
                    Q.stages[0].unfollow();
                    this.del('platformerControls');
                    this.p.vx = 0;
                    this.p.gravity = 0;
                    this.p.collisionMask = '';
                    this.p.sensor = true;
                    this.play("stand_" + this.p.direction);
                    this.p.llamado = true;
                    this.die();
                } else {
                    this.p.vx = 0;
                    this.p.vy = -40;
                }
            }

        },

        die: function() {
            this.p.opacity = .75;
            this.play("dying");
            this.p.vy = -40;
        }

    });

    Q.animations("AlexAnimation", {
        run_right: { frames: [0, 1, 2, 3], flip: false, rate: 1 / 4 },
        run_left: { frames: [0, 1, 2, 3], flip: 'x', rate: 1 / 4 },
        stand_right: { frames: [8], flip: false, loop: false },
        stand_left: { frames: [8], flip: 'x', loop: false },
        jump_right: { frames: [9], flip: false, loop: false },
        jump_left: { frames: [9], flip: 'x', loop: false },
        punch: { frames: [15], loop: false, rate: 1, trigger: "noPunch" },
        crouch_right: { frames: [10], flip: false, loop: false },
        crouch_left: { frames: [10], flip: 'x', loop: false },
        dying: { frames: [11, 12, 13], flip: false, loop: true, rate: 1 / 2 }
    });

    //SPRITE DEL PUÑO DE ALEX
    Q.Sprite.extend("AlexFist", {
        init: function(p) {
            this._super(p, {
                asset: 'fist.png',
                gravity: 0,
                sensor: true,
                collisionMask: ''
            });
            this.add('2d, animation');
            this.on('destroy', function() {
                this.destroy();
            });
            /*this.on("hit.sprite", function(collision) {
				if (!collision.obj.isA("Alex")) {
					this.destroy();
				}
            });*/
        },
        step: function(dt) {
            if (true) {
                alex = Q.stage().lists.Alex[0];
                this.p.y = alex.p.y;
                if (alex.p.direction == 'right') {
                    this.p.x = alex.p.x + 24;
                } else if (alex.p.direction == 'left') {
                    this.p.x = alex.p.x - 24;
                }
            }
        }
    });

    //SPRITE DE ALEX EN EL MENU DEL MAPA
    Q.Sprite.extend("AlexMap", {
        init: function(p) {
            this._super(p, {
                sheet: "alexmap",
                sprite: "AlexMapAnimation",
                x: 450,
                y: 300,
                gravity: 0
            });
            this.add("animation, tween");
            this.play("eating");
        },
        step: function(dt) {
            if (Q.inputs['action']) {
                Q.clearStages();
                Q.stageScene("level1");
            }
        }
    });

    Q.animations("AlexMapAnimation", {
        eating: { frames: [0, 1], rate: 1 / 2 }
    });
}