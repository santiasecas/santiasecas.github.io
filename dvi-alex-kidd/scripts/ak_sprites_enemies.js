/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

//Enemigo Bird
Quintus.AKSpritesEnemies = function(Q) {
    Q.Sprite.extend("Bird", {
        init: function(p) {
            this._super(p, {
                sheet: 'bird',
                sprite: 'BirdAnimation',
                gravity: 0,
                vx: 100
            });
            this.add("2d, animation, aiBounce");
            this.play("fly_right");
            this.on("bump.left", function(collision) {
                this.play("fly_right");
            });
            this.on("bump.right", function(collision) {
                this.play("fly_left");
            });
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex")) console.log("Toco a Alex");
                else if (collision.obj.isA("AlexFist")) this.destroy();
            });

        }
    });

    Q.animations("BirdAnimation", {
        fly_right: { frames: [0, 1], flip: false, rate: 1 / 2, loop: true },
        fly_left: { frames: [0, 1], flip: 'x', rate: 1 / 2, loop: true }
    });

    //Enemigo Scorpion
    Q.Sprite.extend("Scorpion", {
        init: function(p) {
            this._super(p, {
                sheet: 'scorpion',
                sprite: 'ScorpionAnimation',
                vx: 50
            });
            this.add("2d, animation, aiBounce");
            this.play("move_right");
            this.on("bump.left", function(collision) {
                this.play("move_right");
            });
            this.on("bump.right", function(collision) {
                this.play("move_left");
            });
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex")) console.log("Toco a Alex");
                else if (collision.obj.isA("AlexFist")) this.destroy();
            });

        }
    });




    Q.animations("ScorpionAnimation", {
        move_right: { frames: [0, 1], flip: 'x', rate: 1 / 4, loop: true },
        move_left: { frames: [0, 1], flip: false, rate: 1 / 4, loop: true }
    });

    //Enemigo rana
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
                mirandoDerecha: false
            });
            this.add("2d, animation, aiBounce");
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
                if (collision.obj.isA("Alex")) console.log("Toco a Alex");
                else if (collision.obj.isA("AlexFist")) this.destroy();
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
}