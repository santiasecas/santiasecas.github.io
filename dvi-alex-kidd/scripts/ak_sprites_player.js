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
                llamado: false,
                paralizado: false,
                contParalisis: 0,
                izquierda: true,
                final: 0,
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
                    //} else if (collision.obj.isA("Rice")) {
                } else if (this.p.y == 3434.4) {
                    this.p.boss = true;
                }
            });
        },
        step: function(dt) {
            if (this.p.paralizado) {
                if (this.p.izquierda) {
                    this.p.x += 1;
                    this.p.izquierda = false;
                } else {
                    this.p.x += -1;
                    this.p.izquierda = true;
                }
                this.del('platformerControls');
                this.p.contParalisis += dt;
                if (this.p.contParalisis > 2) {
                    this.add('platformerControls');
                    this.p.paralizado = false;
                    this.p.contParalisis = 0;
                }
            }

            if (this.p.y > 3340) {
                Q.stages[0].unfollow();
            }
            if (this.p.y < Q.stages[0].viewport.y) {
                Q.clearStages();
                Q.stageScene("die");
            }
            if (!this.p.muerto) {
                // Apartado del BOSS
                if (this.p.boss) {
                    Q.audio.stop();
                    Q.stages[0].unfollow();
                    this.del('platformerControls');
                    this.p.vx = 0;
                    this.p.gravity = 0;
                    this.p.collisionMask = '';
                    this.p.sensor = true;
                    this.play("stand_" + 'right');
                    this.p.x = 160;
                    bossEnemy = this.stage.insert(new Q.Boss({ x: this.p.x + 200, y: this.p.y - 8 }));
                    //console.log("Altura enemigo: " + this.p.y);
                    if (!Q.inputs['fire'] && this.p.final == 0) {
                        Q.audio.play("boss_speak.ogg");
                        tfinal = this.stage.insert(new Q.TitleFinalGame({ x: 250, y: this.p.y - 200, frame: 0 }));
                        this.p.final = 1;
                        sleep(2000);
                    } else if (Q.inputs['fire'] && this.p.final == 1) {
                        Q.audio.play("boss_speak.ogg");
                        tfinal.destroy();
                        tfinal = this.stage.insert(new Q.TitleFinalGame({ x: 250, y: this.p.y - 200, frame: 1 }));
                        this.p.final = 2;
                        sleep(2000);
                    } else if (Q.inputs['fire'] && this.p.final == 2) {
                        tfinal.destroy();
                        this.p.final = 3;
                        alexHand = this.stage.insert(new Q.AlexFinalGame());
                    }
                } else {
                    if (!Q.inputs['down']) { //GOLPEAR
                        this.add('platformerControls');
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
                            } else if (this.p.jumping && this.p.landed < 0) {
                                this.play("jump_" + this.p.direction);
                            } else if (this.p.vx < 0 || this.p.vx > 0) {
                                this.play("run_" + this.p.direction);
                            } else {
                                if (this.p.vy != 0) this.play("jump_" + this.p.direction);
                                if (this.p.vy == 0 && this.p.vx == 0 && this.p.punching == 0) this.play("stand_" + this.p.direction);
                            }
                        }
                    } else if (Q.inputs['down']) {
                        this.del('platformerControls');
                        this.p.vx = 0;
                        this.play("crouch_" + this.p.direction);
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
                    this.p.vy = -65;
                }
            }

        },

        die: function() {
            Q.audio.stop();
            Q.audio.play("die_alex.ogg");
            this.play("dying");
            Q.state.dec("lives", 1);
            this.p.vy = -65;
        },

        paralisis: function() {
            this.p.paralizado = true;
        }

    });

    Q.animations("AlexAnimation", {
        run_right: { frames: [0, 1, 2, 3], flip: false, rate: 1 / 4 },
        run_left: { frames: [0, 1, 2, 3], flip: 'x', rate: 1 / 4 },
        stand_right: { frames: [4], flip: false, loop: false },
        stand_left: { frames: [4], flip: 'x', loop: false },
        jump_right: { frames: [5], flip: false, loop: false },
        jump_left: { frames: [5], flip: 'x', loop: false },
        punch: { frames: [11], loop: false, rate: 1, trigger: "noPunch" },
        crouch_right: { frames: [6], flip: false, loop: false },
        crouch_left: { frames: [6], flip: 'x', loop: false },
        dying: { frames: [8, 9, 10], flip: false, loop: true, rate: 1 / 6 }
    });

    //SPRITE DEL PUÑO DE ALEX
    Q.Sprite.extend("AlexFist", {
        init: function(p) {
            this._super(p, {
                asset: 'fist.png',
                gravity: 0,
                sensor: true,
                collisionMask: '',
                duration: 0.5,
                count: 0
            });
            this.add('2d, animation');
            this.on('destroy', function() {
                this.destroy();
            });
            this.on("hit.sprite", function(collision) {
                if (!collision.obj.isA("Alex")) {
                    this.destroy();
                }
            });
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
            this.p.count += dt;
            if (this.p.count > this.p.duration) {
                this.destroy();
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

    //SPRITE DEL JUEGO FINAL
    Q.Sprite.extend("AlexFinalGame", {
        init: function(p) {
            this._super(p, {
                sheet: 'final-game',
                sprite: 'final-game',
                gravity: 0,
                count: 0,
                frame: 0,
                duration: 7.5,
                sound: 0,
                enemyHand: 0,
            });
            this.add('2d, platformerControls, animation, tween');
            //this.play("movement");
        },
        step: function(dt) {
            this.add('platformerControls');
            if (true) {
                alex = Q.stage().lists.Alex[0];
                this.p.y = alex.p.y - 100;
                this.p.x = alex.p.x - 5;
            }

            if (this.p.sound == 0) {
                Q.audio.play("rock_paper_scissors.ogg");
                this.p.sound = 1;
            }

            this.p.count += dt;
            if (this.p.count > this.p.duration) {
                enemyHand = this.stage.insert(new Q.BossFinalGame({ frame: this.p.enemyHand }));
            } else {
                alex.p.punching = 2;
                if (Q.inputs['fire'] && this.p.frame == 0) {
                    this.p.frame = 1;
                } else if (Q.inputs['fire'] && this.p.frame == 1) {
                    this.p.frame = 2;
                } else if (Q.inputs['fire'] && this.p.frame == 2) {
                    this.p.frame = 0;
                }

                this.p.enemyHand = Math.floor((Math.random() * 3));
                alex.p.boss = false;
            }
        }
    });

    Q.animations('final-game', {
        movement: { frames: [0, 1, 2], rate: 1 / 3, loop: true }
    });

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}