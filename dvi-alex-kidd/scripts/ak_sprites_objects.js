/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

Quintus.AKSpritesObjects = function(Q) {
    Q.Sprite.extend("Question", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
				frame: 9,
                gravity: 0,
            });
            this.add("2d, drops");

            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) {
                    this.destroy();
                    this.drop();
                }
            });

        }
    });

    Q.Sprite.extend("StarBlock", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
				frame: 8,
                gravity: 0,
            });
            this.add("2d, drops");

            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) {
                    this.destroy();
                    this.drop();
                }
            });
        }
    });

    Q.Sprite.extend("Rock", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
				frame: 7,
                gravity: 0,
            });
            this.add("2d, drops");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("AlexFist")) {
                    this.destroy();
                    this.drop();
                }
            });
        }
    });

    Q.Sprite.extend("SackLittle", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 12,
                sensor: true,
                gravity: 0
            });
            this.add("2d");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex")) {
                    Q.audio.play("coin.ogg");
                    this.destroy();
                };
            });
        }
    });

    Q.Sprite.extend("SackBig", {
        init: function(p) {
            this._super(p, {
                sheet: 'escenary',
                frame: 11,
                sensor: true,
                gravity: 0
            });
            this.add("2d");
            this.on("hit.sprite", function(collision) {
                if (collision.obj.isA("Alex")) {
                    Q.audio.play("coin.ogg");
                    this.destroy();
                };
            });
        }
    });
    
    Q.component("drops", {
        extend: {
            drop: function() {
                if(this.p.drop === 'sackLittle') this.stage.insert(new Q.SackLittle({ x: this.p.x, y: this.p.y }));
                if (this.p.drop === 'sackBig') this.stage.insert(new Q.SackBig({ x: this.p.x, y: this.p.y }));
            },
        }
    })
	
	Q.Sprite.extend("Arrow",{
		init: function(p){
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
		point: { frames: [0,1], rate: 1/2}
	});
}