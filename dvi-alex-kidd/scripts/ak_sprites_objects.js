/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

Quintus.AKSpritesObjects = function(Q) {
  /**===========================================================================================
   *
   *                                    YELLOWSKULL BLOCK
   *
   ===========================================================================================*/
    Q.Sprite.extend("YellowSkull", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 10,
                gravity: 0,
            });
            this.add("2d, drops, brokeBox");

            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) {
                    Q.audio.play("star_box.ogg");
                    Q.stages[0].lists["Alex"][0].paralisis();
                    this.destroy();
                }
            });
        }
    });

    /**===========================================================================================
     *
     *                                       QUESTION BLOCK
     *
     ===========================================================================================*/
    Q.Sprite.extend("Question", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 9,
                gravity: 0,
                dropped: false,
                drop: ""
            });
            this.add("2d, drops, brokeBox");

            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) {
                    var numero = Math.floor((Math.random() * 3) + 1);

                    if (numero === 1) {
                        this.p.drop = "anillo";
                        this.drop();
                    } else if (numero === 2) {
                        this.p.drop = "ghost";
                        this.drop(0);

                    } else if (numero === 3) {
                        this.p.drop = "vida";
                        this.drop();
                    }
                    Q.audio.play("star_box.ogg");
                    this.destroy();
                }
            });
        }
    });

    /**===========================================================================================
     *
     *                                       STAR BLOCK
     *
     ===========================================================================================*/
    Q.Sprite.extend("StarBlock", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 8,
                gravity: 0,
                dropped: false
            });
            this.add("2d, drops, brokeBox");

            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) {
                    if ((Math.random() * (10 - 1) + 1) < 7) {
                        this.p.drop = 'sackLittle';
                    } else {
                        this.p.drop = 'sackBig';
                    }
                    this.destroy();
                    Q.audio.play("star_box.ogg");
                    this.drop();
                }
            });
        }
    });

    /**===========================================================================================
     *
     *                                          GHOST BLOCK
     *
     ===========================================================================================*/
    Q.Sprite.extend("GhostBlock", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 16,
                gravity: 0,
                dropped: false
            });
            this.add("2d, drops");

            this.on("bump.top", function(collision) {
                if (collision.obj.isA("Alex")) {
                    this.drop(-32);
                }
            });
        }
    });

    /**===========================================================================================
     *
     *                                        ROCK BLOCK
     *
     ===========================================================================================*/
    Q.Sprite.extend("Rock", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 7,
                gravity: 0,
                broken: false
            });
            this.add("2d, brokeBox");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist") && !this.p.broken) {
                    this.p.broken = true;
                    Q.audio.play("break_box.ogg");
                }
            });
        }
    });

    Q.component("brokeBox", {
        added: function() {
            this.entity.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) {
                    this.stage.insert(new Q.MiniRockRight({ x: this.p.x + 10, y: this.p.y + 10 }));
                    this.stage.insert(new Q.MiniRockLeft({ x: this.p.x - 10, y: this.p.y + 10 }));
                    this.stage.insert(new Q.MiniRockRight({ x: this.p.x + 5, y: this.p.y - 10 }));
                    this.stage.insert(new Q.MiniRockLeft({ x: this.p.x - 5, y: this.p.y - 10 }));
                    this.destroy();
                }
            });
            this.entity.on("destroy", function() {
                this.destroy();
            });
        }
    });

    /**===========================================================================================
     *
     *                                         SACK LITTLE
     *
     ===========================================================================================*/
    Q.Sprite.extend("SackLittle", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 12,
                sensor: true,
                gravity: 0,
                taken: false
            });
            this.add("2d");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex") && !this.p.taken) {
                    this.p.taken = true;
                    Q.audio.play("coin.ogg");
                    Q.state.inc("coins", 10);
                    this.destroy();
                };
            });
        }
    });

    /**===========================================================================================
     *
     *                                         SACK BIG
     *
     ===========================================================================================*/
    Q.Sprite.extend("SackBig", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 11,
                sensor: true,
                gravity: 0,
                taken: false
            });
            this.add("2d");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex") && !this.p.taken) {
                    this.p.taken = true;
                    Q.audio.play("coin.ogg");
                    Q.state.inc("coins", 20);
                    this.destroy();
                };
            });
        }
    });

    Q.component("drops", {
        extend: {
            drop: function(offsetY) {
                if (!this.p.dropped) {
                    this.p.dropped = true;
                    console.log("Vamos a generar un " + this.p.drop);
                    if (this.p.drop === 'anillo') this.stage.insert(new Q.Ring({ x: this.p.x, y: this.p.y }));
                    if (this.p.drop === 'vida') this.stage.insert(new Q.Vida({ x: this.p.x, y: this.p.y }));
                    if (this.p.drop === 'sackLittle') this.stage.insert(new Q.SackLittle({ x: this.p.x, y: this.p.y }));
                    if (this.p.drop === 'sackBig') this.stage.insert(new Q.SackBig({ x: this.p.x, y: this.p.y }));
                    if (this.p.drop === 'ghost') this.stage.insert(new Q.Ghost({ x: this.p.x, y: this.p.y + offsetY }));
                };
            },
        }
    })

    /**===========================================================================================
     *
     *                                          ARROW
     *
     ===========================================================================================*/
    Q.Sprite.extend("Arrow", {
        init: function(p) {
            this._super(p, {
                sheet: "arrow",
                sprite: "ArrowAnimation",
                x: 162,
                y: 212,
                gravity: 0
            });
            this.add("animation, tween");
            this.play("point");
        }
    });

    Q.animations("ArrowAnimation", {
        point: { frames: [0, 1], rate: 1 / 2 }
    });

    /**===========================================================================================
     *
     *                                          LOGO
     *
     ===========================================================================================*/
    Q.Sprite.extend("Logo", {
        init: function(p) {
            this._super(p, {
                sheet: "logo",
                sprite: "LogoAnimation",
                x: 256,
                y: 192,
                scale: 0.64,
                gravity: 0
            });
            this.add("animation");
            this.play("light");
        }
    });

    Q.animations("LogoAnimation", {
        light: { frames: [0, 1], rate: 1 / 8 }
    });

    /**===========================================================================================
     *
     *                                          RICE
     *
     ===========================================================================================*/
    Q.Sprite.extend("Rice", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 17,
                x: 32,
                y: 32,
                gravity: 0,
                sensor: true
            });
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex")) {
                    this.del('platformerControls');
                    this.destroy();
                    Q.clearStages();
                    Q.stageScene("creditos");
                }
            });
        }
    });

    /**===========================================================================================
     *
     *                                  SMOKE WHEN AN ENEMY DIE
     *
     ===========================================================================================*/
    Q.Sprite.extend("SmokeEnemyDie", {
        init: function(p) {
            this._super(p, {
                sheet: 'enemyDie',
                sprite: 'SmokeEnemyDieAnimation',
                gravity: 0,
                sensor: true,
                type: Q.SPRITE_NONE,
                collisionMask: ''
            });
            this.add("animation");
            this.play("die");
            this.on("destroy", function() {
                this.destroy();
            });
        }
    });

    Q.animations("SmokeEnemyDieAnimation", {
        die: { frames: [0, 1], rate: 1 / 2, loop: false, trigger: "destroy" }
    });

    /**===========================================================================================
     *
     *                                        ALEX HUD
     *
     ===========================================================================================*/
    Q.Sprite.extend("AlexHud", {
        init: function(p) {
            this._super(p, {
                asset: 'alexhud.png'
            });
        }
    });

    /**===========================================================================================
     *
     *                                        MINI ROCK
     *
     ===========================================================================================*/
    Q.Sprite.extend("MiniRockLeft", {
        init: function(p) {
            this._super(p, {
                asset: 'minirock.png',
                sensor: true
            });
            this.add('tween');
            this.animate({ x: this.p.x - 40, y: this.p.y + 140 }, 0.6, Q.Easing.Quadratic.In, {
                callback: function() {
                    this.destroy();
                }
            });
        }
    });

    Q.Sprite.extend("MiniRockRight", {
        init: function(p) {
            this._super(p, {
                asset: 'minirock.png',
                sensor: true
            });
            this.add('tween');
            this.animate({ x: this.p.x + 40, y: this.p.y + 140 }, 0.6, Q.Easing.Quadratic.In, {
                callback: function() {
                    this.destroy();
                }
            });
        }
    });

    /**===========================================================================================
     *
     *                                          RING
     *
     ===========================================================================================*/
    Q.Sprite.extend("Ring", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 13,
                sensor: true,
                gravity: 0,
                taken: false
            });
            this.add("2d");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex") && !this.p.taken) {
                    this.p.taken = true;
                    Q.audio.play("coin.ogg");
                    Q.state.inc("rings", 1);
                    this.destroy();
                };
            });
        }
    });

    /**===========================================================================================
     *
     *                                          LIFE
     *
     ===========================================================================================*/
    Q.Sprite.extend("Vida", {
        init: function(p) {
            this._super(p, {
                sheet: 'vidaAlex',
                sensor: true,
                gravity: 0,
                taken: false
            });
            this.add("2d");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex") && !this.p.taken) {
                    this.p.taken = true;
                    Q.audio.play("coin.ogg");
                    Q.state.inc("lives", 1);
                    this.destroy();
                };
            });
        }
    });

    /**===========================================================================================
     *
     *                                        MOUNTAIN BACKGROUND
     *
     ===========================================================================================*/
    Q.Sprite.extend("Mountain", {
        init: function(p) {
            this._super(p, {
                asset: 'mountain.png',
                gravity: 0,
                sensor: true,
                collisionMask: ''
            });
        }
    });

    /**===========================================================================================
     *
     *                                       TITLE FINAL GAME
     *
     ===========================================================================================*/
    Q.Sprite.extend("TitleFinalGame", {
        init: function(p) {
                this._super(p, {
                    sheet: 'final-game-titles',
                    sprite: 'TitleFinalGameAnimation',
                    scale: 3.0,
                    count: 0,
                    frame: 0
                });
            }
    });
}
