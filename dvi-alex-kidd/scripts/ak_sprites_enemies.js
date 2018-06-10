/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */


Quintus.AKSpritesEnemies = function(Q) {
    /**===========================================================================================
     *
     *                                         BIRD
     *
     ===========================================================================================*/
    Q.Sprite.extend("Bird", {
        init: function(p) {
            this._super(p, {
                sheet: 'bird',
                sprite: 'BirdAnimation',
                gravity: 0,
                vx: 60,
                died: false
            });
            this.add("2d, animation, aiBounce, defaultEnemy");
            this.play("fly_right");
            this.on("bump.left", function(collision) {
                this.play("fly_right");
            });
            this.on("bump.right", function(collision) {
                this.play("fly_left");
            });
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) this.destroy();
            });

        }
    });

    Q.animations("BirdAnimation", {
        fly_right: { frames: [0, 1], flip: false, rate: 1 / 2, loop: true },
        fly_left: { frames: [0, 1], flip: 'x', rate: 1 / 2, loop: true }
    });

    /**===========================================================================================
     *
     *                                          SCORPION
     *
     ===========================================================================================*/
    Q.Sprite.extend("Scorpion", {
        init: function(p) {
            this._super(p, {
                sheet: 'scorpion',
                sprite: 'ScorpionAnimation',
                vx: 50,
                died: false
            });
            this.add("2d, animation, aiBounce, defaultEnemy");
            this.play("move_right");
            this.on("bump.left", function(collision) {
                this.play("move_right");
            });
            this.on("bump.right", function(collision) {
                this.play("move_left");
            });
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) this.destroy();
            });

        }
    });




    Q.animations("ScorpionAnimation", {
        move_right: { frames: [0, 1], flip: 'x', rate: 1 / 4, loop: true },
        move_left: { frames: [0, 1], flip: false, rate: 1 / 4, loop: true }
    });

    /**===========================================================================================
     *
     *                                         FROG
     *
     ===========================================================================================*/
    Q.Sprite.extend("Frog", {
        init: function(p) {
            this._super(p, {
                sheet: 'frog',
                sprite: 'FrogAnimation',
                gravity: .5,
                contStand: 0,
                maxStand: 2.5,
                frame: 0,
                vx: 0,
                vy: 0,
                mirandoDerecha: false,
                died: false
            });
            this.add("2d, animation, aiBounce, defaultEnemy");
            this.play("stand_left"); // Mirando hacia la derecha

            //Si la rana toca el suelo esta se debe de quedar quieta
            this.on("bump.bottom", function(collision) {
                this.p.vx = 0;
                this.p.vy = 0;
            });

            //Cuando colisiona por su lado izquierdo debe cambiar de dirección
            this.on("bump.left", function(collision) {
                if (!collision.obj.isA("Alex")) {
                    this.play("stand_right");
                    this.p.mirandoDerecha = true;
                }
            });

            //Cuando colisiona por su lado derecho debe cambiar de dirección
            this.on("bump.right", function(collision) {
                if (!collision.obj.isA("Alex")) {
                    this.play("stand_left");
                    this.p.mirandoDerecha = false;
                }

            });

            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) this.destroy();
            });
        },

        step: function(dt) {
            this.p.contStand += dt;
            //Comprobamos si la rana debe de saltar
            if (this.p.contStand > this.p.maxStand) {
                //Comprobamos hacia donde mira la rana
                if (this.p.mirandoDerecha) {
                    //this.p.vx = 100;
                } else {
                    //this.p.vx = -100;
                }
                this.p.vy = -350;
                this.p.contStand = 0;
            }

            //Comprobamos si la rana está en el aire, tanto subiendo como cayendo
            if (this.p.vy !== 0) {
                if (this.p.mirandoDerecha) {
                    this.play("jump_right");
                } else {
                    this.play("jump_left");
                }
            } else {
                if (this.p.mirandoDerecha) {
                    this.play("stand_right");
                } else {
                    this.play("stand_left");
                }
            }
        }
    });


    Q.animations("FrogAnimation", {
        stand_right: { frames: [0], flip: 'x', rate: 1 / 4, loop: true },
        stand_left: { frames: [0], flip: false, rate: 1 / 4, loop: true },
        jump_right: { frames: [1], flip: 'x', rate: 1 / 4, loop: true },
        jump_left: { frames: [1], flip: false, rate: 1 / 4, loop: true },
    });



    /**===========================================================================================
     *
     *                                          GHOST
     *
     ===========================================================================================*/
    Q.Sprite.extend("Ghost", {
        init: function(p) {
            this._super(p, {
                sheet: 'ghost',
                sprite: 'GhostAnimation',
                gravity: 0,
                esperando: true,
                MaxVivo: 8,
                contVivo: 0,
                esperaMax: 1,
                contEspera: 0,
                collisionMask: '',
                type: 0,
                sensor: true
            });
            this.add("2d, animation, aiBounce");
            this.play("stand_left");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex")) {
                    this.destroy();
                }
            });
        },
        step: function(dt) {
            if (this.p.esperando) {
                this.p.contEspera += dt;
                if (this.p.contEspera > this.p.esperaMax) {
                    this.p.esperando = false;
                    this.p.type = 1;
                    this.p.collisionMask = 'Alex';
                }
            } else {
                this.p.contVivo += dt;
                if (this.p.contVivo > this.p.MaxVivo) {
                    this.destroy();
                } else {
                    PlayerX = Q.stages[0].lists["Alex"][0].p.x;
                    PlayerY = Q.stages[0].lists["Alex"][0].p.y;
                    if (this.p.x == PlayerX) {
                        this.play("stand_left");
                    }
                    if (this.p.x > (PlayerX + 2)) {
                        this.p.x = this.p.x - 1.5;
                        this.play("stand_left");
                    } else if (this.p.x < (PlayerX - 2)) {
                        this.p.x = this.p.x + 1.5;
                        this.play("stand_right");
                    }

                    if (this.p.y > (PlayerY + 2)) {
                        this.p.y = this.p.y - 1.5;
                    } else if (this.p.y < (PlayerY - 2)) {
                        this.p.y = this.p.y + 1.5;
                    }
                }
            }
        }
    });

    Q.animations("GhostAnimation", {
        stand_right: { frames: [0, 1], flip: 'x', rate: 1, loop: true },
        stand_left: { frames: [0, 1], flip: false, rate: 1, loop: true }
    });

    /**===========================================================================================
     *
     *                                          BOSS
     *
     ===========================================================================================*/
    Q.Sprite.extend("Boss", {
        init: function(p) {
            this._super(p, {
                sheet: 'gooseka',
                sprite: 'BossAnimation',
                scale: 1.2,
                muerto: false,
                llamado: false
            });
        }
    });

    /**===========================================================================================
     *
     *                                 BOSS ELECTION FINAL GAME
     *
     ===========================================================================================*/

    Q.Sprite.extend("BossFinalGame", {
        init: function(p) {
            this._super(p, {
                sheet: 'final-game',
                sprite: 'final-game',
                gravity: 0,
                frame: 0,
                duration: 3,
                count: 0,
                end: 5,
                gana: false,
            });
            this.add('2d, platformerControls, animation, tween');
        },
        step: function(dt) {
            if (true) {
                this.p.y = alex.p.y - 100;
                this.p.x = alex.p.x + 200;
            }
            this.p.count += dt;
            if (this.p.count > this.p.duration) {
                // JUEGO PIEDRA, PAPEL o TIJERAS
                console.log("Alex usa: " + alexHand.p.frame);
                console.log("Enemigo usa: " + this.p.frame);
                if (alexHand.p.frame == this.p.frame) {
                    console.log("empata");
                    this.destroy();
                    // De momento al empatar se pierde
                    Q.clearStages();
                    Q.stageScene("endGame");

                    //alexHand = this.stage.insert(new Q.AlexFinalGame());
                    //alexHand.destroy();
                } else if (alexHand.p.frame == 0 && this.p.frame == 1) {
                    console.log("gana");
                    alex.p.boss = false;
                    this.p.gana = true;
                } else if (alexHand.p.frame == 2 && this.p.frame == 0) {
                    console.log("gana");
                    alex.p.boss = false;
                    this.p.gana = true;
                } else if (alexHand.p.frame == 1 && this.p.frame == 2) {
                    console.log("gana");
                    alex.p.boss = false;
                    this.p.gana = true;
                } else {
                    sleep(2000);
                    console.log("pierde");
                    Q.clearStages();
                    Q.stageScene("endGame");
                }

                if (this.p.gana == true) {
                    this.destroy();
                    Q.clearStages();
                    Q.stageScene("creditos");

                    /* PENDIENTE: Ganar al tocar el arroz
                    //alexHand.destroy();
                    Q.clearStages();
                    Q.stageScene("level1");
                    alexHand.destroy();
                    alex.p.fin = true;
                    bossEnemy.destroy();
                    //this.stage.insert(new Q.Alex({ x: alex.p.x, y: alex.p.y }));*/
                    //this.stage.insert(new Q.Rice({ x: bossEnemy.p.x - 50, y: bossEnemy.p.y }));
                }
            }
        }
    });


    /**===========================================================================================
     *
     *                                    DEFAULT ENEMIES
     *
     ============================================================================================*/
    Q.component("defaultEnemy", {
        added: function() {
            this.entity.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist") && !this.p.died) {
                    this.p.died = true;
                    this.destroy();
                    Q.stage().insert(new Q.SmokeEnemyDie({ x: this.p.x, y: this.p.y }));
                    Q.audio.play("kill_enemy.ogg");
                    //Q.state.inc("score", 100);
                }
                //else if(collision.obj.isA("Alex")) {
                //	collision.obj.AlexDeath();
                //}
            });
            this.entity.on("destroy", function() {
                this.destroy();
            });
        }
    });
}