/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

Quintus.AKScenes = function(Q) {
    function blocksToMap([a, b]) {
        return { x: +a * 32 + 16, y: b * 32 + 16 };
    }

    Q.scene("level1", function(stage) {
        //Q.audio.play('main_theme.ogg',{loop: true});
        Q.stageTMX('level1.tmx', stage);
        var alex = stage.insert(new Q.Alex({ x: 100, y: 200 }));
        stage.insert(new Q.Bird({ x: 200, y: 200 }));
        stage.insert(new Q.Scorpion({ x: 250, y: 500 }));
        stage.insert(new Q.Frog({ x: 110, y: 200 }));
        stage.insert(new Q.Question({ x: 200, y: 200, drop: 'sackBig' }));
        stage.insert(new Q.StarBlock({ x: 232, y: 200, drop: 'sackLittle' }));
        stage.insert(new Q.Rock({ x: 264, y: 200, drop: 'sackBig' }));
        stage.insert(new Q.Ghost({ x: 160, y: 200 }));


        //PRIMER NIVEL DE OBJETOS
        var stars = [
            [3, 10],
            [3, 11],
            [14, 21],
            [14, 22],
            [1, 23],
            [3, 28],
            [3, 32],
            [2, 34],
            [6, 34],
            [6, 35],
            [7, 34],
            [14, 36],
            [1, 40],
            [1, 42],
            [14, 51],
            [14, 52],
            [3, 54],
            [1, 61],
            [12, 64],
            [13, 64],
            [14, 64],
            [9, 70],
            [1, 72],
            [12, 76],
            [14, 79],
            [10, 88],
            [10, 90]
        ];

        for (s in stars) {
            stage.insert(new Q.StarBlock(blocksToMap(stars[s])));
        }


        var rocks = [
            [3, 12],
            [8, 15],
            [8, 16],
            [1, 24],
            [2, 24],
            [7, 22],
            [7, 23],
            [12, 23],
            [13, 24],
            [14, 25],
            [4, 28],
            [3, 29],
            [4, 30],
            [2, 31],
            [4, 31],
            [2, 32],
            [5, 32],
            [6, 32],
            [2, 33],
            [6, 33],
            [2, 35],
            [13, 37],
            [14, 37],
            [1, 39],
            [2, 39],
            [3, 39],
            [4, 39],
            [4, 40],
            [4, 41],
            [4, 42],
            [14, 43],
            [13, 44],
            [12, 45],
            [1, 54],
            [2, 54],
            [4, 55],
            [4, 56],
            [2, 61],
            [14, 61],
            [1, 62],
            [2, 62],
            [13, 62],
            [12, 65],
            [12, 66],
            [14, 66],
            [4, 88],
            [4, 89],
            [4, 90],
            [4, 91],
            [10, 89],
            [10, 91],
            [12, 88],
            [12, 89],
            [12, 90],
            [12, 91]
        ];
        for (r in rocks) {
            stage.insert(new Q.Rock(blocksToMap(rocks[r])));
        }
		stage.insert(new Q.Rice(blocksToMap([13,107])));
        stage.add("viewport").follow(alex, { x: false, y: true });
        stage.centerOn(256, 0);
    });

    var count = 0;
    var menus = ["menu01.png", "menu02.png", "menu03.png", "menu06.png", 
				 "menu05.png", "menu04.png", "menu07.png"
    ];

    Q.Sprite.extend("Menu", {
        init: function(p) {
            this._super(p, {
                asset: menus[count],
                x: 256,
                y: 192,
                scale: 0.64,
                action: false
            });
            this.add("tween");
        },
        step: function(dt) {
            if (this.p.action == true && Q.inputs['fire']) {
                Q.clearStages();
                Q.stageScene("map");
            }
        }
    });

    Q.scene("menu", function(stage) {
		Q.audio.stop();
		Q.audio.play("menu.ogg");
        var sprite = stage.insert(new Q.Menu);
        sprite.chain({ x: 256, y: 192 }, 0.5, {
            callback: function() {
                stage.insert(new Q.Menu({ asset: menus[++count] }));
            }
        });
        sprite.chain({ x: 256, y: 192 }, 0.5, {
            callback: function() {
                stage.insert(new Q.Menu({ asset: menus[++count] }));
            }
        });
        sprite.chain({ x: 256, y: 192 }, 0.5, {
            callback: function() {
                stage.insert(new Q.Menu({ asset: menus[++count] }));
            }
        });
        sprite.chain({ x: 256, y: 192 }, 0.5, {
            callback: function() {
                stage.insert(new Q.Menu({ asset: menus[++count] }));
            }
        });
        sprite.chain({ x: 256, y: 192 }, 0.5, {
            callback: function() {
                stage.insert(new Q.Menu({ asset: menus[++count] }));
            }
        });
        sprite.chain({ x: 256, y: 192 }, 0.5, {
            callback: function() {
                stage.insert(new Q.Menu({ asset: menus[++count], action: true }));
				stage.insert(new Q.Logo);
				count = 0;
            }
        });
    });

    Q.Sprite.extend("Map", {
        init: function(p) {
            this._super(p, {
                asset: "map.png",
                x: 256,
                y: 192,
                scale: 0.64,
                action: false
            });
            this.add("tween");
        },
        step: function(dt) {
            if (Q.inputs['action']) {
                Q.clearStages();
                Q.stageScene("level1");
            }
        }
    });

    Q.scene("map", function(stage) {
		Q.audio.stop();
		Q.audio.play("map.ogg");
        stage.insert(new Q.Map);
        stage.insert(new Q.AlexMap);
        stage.insert(new Q.Arrow);
    });
	
	Q.scene("creditos",function(stage) {
		Q.audio.stop();
		Q.audio.play("credits.ogg");
		stage.insert(new Q.Sprite({ asset: "creditos.png", x: 256, y: 192, scale: 0.64 }));
		var sprite = new Q.Sprite({ asset: "creditos_dani.png", x: 256, y: 192, scale: 0.64 });
		sprite.add("tween");
		stage.insert(sprite);
		sprite.chain({opacity: 0 }, 5, Q.Easing.Quadratic.In, { callback: function() { 
			var sprite2 = new Q.Sprite({ asset: "creditos_edu.png", x: 256, y: 192, scale: 0.64 });
			stage.insert(sprite2);
			sprite2.add("tween");
			sprite2.chain({opacity: 0 }, 5, Q.Easing.Quadratic.In, { callback: function() { 
				var sprite3 = new Q.Sprite({ asset: "creditos_jorge.png", x: 256, y: 192, scale: 0.64 });
				stage.insert(sprite3);
				sprite3.add("tween");
				sprite3.chain({opacity: 0 }, 5, Q.Easing.Quadratic.In, { callback: function() { 
					var sprite4 = new Q.Sprite({ asset: "creditos_santi.png", x: 256, y: 192, scale: 0.64 });
					stage.insert(sprite4);
					sprite4.add("tween");
					sprite4.chain({opacity: 0 }, 5, Q.Easing.Quadratic.In, { callback: function() {
						Q.clearStages();
						Q.stageScene("menu");
					} })
				} })
			} })
		} })
	});
}