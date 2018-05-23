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

    Q.scene("die", function(stage) {
        if (Q.state.get("lives") === 0) {
            Q.clearStages();
            Q.stageScene("endGame", 1, { score: Q.state.get("coins") });
        } else startGame();
    });

    Q.scene("level1", function(stage) {
        //Q.audio.play('main_theme.ogg',{loop: true});
        Q.stageTMX('level1.tmx', stage);
        stage.insert(new Q.Mountain({ x: 128, y: 3408 }));
        stage.insert(new Q.Mountain({ x: 288, y: 3408 }));
        var alex = stage.insert(new Q.Alex({ x: 100, y: 200 }));
        //stage.insert(new Q.Mountain({ x: 416, y: 3408 }));
        //stage.insert(new Q.Scorpion({ x: 250, y: 500 }));
        //stage.insert(new Q.Frog({ x: 150, y: 200 }));
        stage.insert(new Q.Question({ x: 464, y: 431, drop: 'ghost' }));
        stage.insert(new Q.Question({ x: 368, y: 1072, drop: 'ghost' }));
        stage.insert(new Q.GhostBlock({ x: 240, y: 1616, drop: 'ghost' }));
        //stage.insert(new Q.StarBlock({ x: 232, y: 200, drop: 'sackLittle' }));
        //stage.insert(new Q.Rock({ x: 264, y: 200 }));
        //stage.insert(new Q.Ghost({ x: 160, y: 200 }));

        var birds = [
            [8, 19],
            [8, 26],
            [4, 34],
            [8, 37],
            [6, 46],
            [6, 49],
            [8, 54],
            [8, 64],
            [8, 74],
            [2, 81],
            [2, 91],
            [8, 94]
        ];

        for (b in birds) {
            stage.insert(new Q.Bird(blocksToMap(birds[b])));
        }

        var sackBig = [
            [7, 45],
            [2, 48],
            [8, 62],
            [2, 78],
            [2, 79],
            [5, 88],
            [5, 89],
            [13, 88],
            [13, 89],
            [3, 96],
            [3, 97],
            [3, 98]
        ];

        for (s in sackBig) {
            stage.insert(new Q.SackBig(blocksToMap(sackBig[s])));
        }

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
            [1, 62],
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
            [13, 13],
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
            [2, 62],
            [14, 62],
            [1, 63],
            [2, 63],
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
        stage.insert(new Q.Rice(blocksToMap([13, 107])));
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
                Q.state.reset({ lives: 3, coins: 0, rings: 0 });
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
                startGame();
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

    Q.Sprite.extend("endKey", {
        init: function(p) {
            this._super(p, {
                time: 5,
                cont: 0
            });
        },
        step: function(dt) {
            this.p.cont += dt;
            if (this.p.cont > this.p.time) {
                Q.state.reset({ lives: 3, coins: 0, rings: 0 });
                Q.clearStages();
                Q.stageScene("menu");;
            }
        }
    });

    Q.scene('endGame', function(stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: "black"
        }));
        var label1 = container.insert(new Q.UI.Text({
            x: -20,
            y: -45,
            size: 16,
            color: '#fff',
            family: 'Alex Kidd in Miracle World',
            label: "GAME OVER"
        }));
        var label2 = container.insert(new Q.UI.Text({
            x: -20,
            y: 10,
            size: 12,
            color: '#fff',
            family: 'Alex Kidd in Miracle World',
            label: ("SCORE: " + stage.options.score)
        }));

        container.fit(Q.height);
        Q.audio.play("game_over.ogg")
        stage.insert(new Q.endKey);
    });

    Q.scene("creditos", function(stage) {
        Q.audio.stop();
        Q.audio.play("credits.ogg");
        stage.insert(new Q.Sprite({ asset: "creditos.png", x: 256, y: 192, scale: 0.64 }));
        var sprite = new Q.Sprite({ asset: "creditos_dani.png", x: 256, y: 192, scale: 0.64 });
        sprite.add("tween");
        stage.insert(sprite);
        sprite.chain({ opacity: 0 }, 5, Q.Easing.Quadratic.In, {
            callback: function() {
                var sprite2 = new Q.Sprite({ asset: "creditos_edu.png", x: 256, y: 192, scale: 0.64 });
                stage.insert(sprite2);
                sprite2.add("tween");
                sprite2.chain({ opacity: 0 }, 5, Q.Easing.Quadratic.In, {
                    callback: function() {
                        var sprite3 = new Q.Sprite({ asset: "creditos_jorge.png", x: 256, y: 192, scale: 0.64 });
                        stage.insert(sprite3);
                        sprite3.add("tween");
                        sprite3.chain({ opacity: 0 }, 5, Q.Easing.Quadratic.In, {
                            callback: function() {
                                var sprite4 = new Q.Sprite({ asset: "creditos_santi.png", x: 256, y: 192, scale: 0.64 });
                                stage.insert(sprite4);
                                sprite4.add("tween");
                                sprite4.chain({ opacity: 0 }, 5, Q.Easing.Quadratic.In, {
                                    callback: function() {
                                        Q.clearStages();
                                        Q.stageScene("menu");
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    });

    /*
     ******************************************
     ****************   HUD   *****************
     ******************************************
     */
    //MARCADOR DE VIDAS
    Q.scene('lives', function(stage) {
        var lives = stage.insert(new Q.AlexHud({
            x: 50,
            y: 25,
            scale: 0.7
        }));
        var vidas = Q.state.p.lives.toString();
        while (vidas.length < 2) {
            vidas = '0' + vidas;
        }
        var lives2 = stage.insert(new Q.UI.Text({
            x: 70,
            y: 25,
            size: 10,
            align: 'left',
            color: '#fff',
            family: 'Alex Kidd in Miracle World',
            label: vidas
        }));
        Q.state.on("change.lives", this, function(lives) {
            lives2.p.label = vidas;
        });
    });

    function monedas() {
        var monedas = Q.state.p.coins.toString();
        while (monedas.length < 5) {
            monedas = '0' + monedas;
        }
        return monedas;
    }

    //MARCADOR DE MONEDAS
    Q.scene('coins', function(stage) {
        var coins = stage.insert(new Q.SackLittle({
            x: 230,
            y: 20
        }));
        var coins2 = stage.insert(new Q.UI.Text({
            x: 250,
            y: 25,
            size: 10,
            align: 'left',
            color: '#fff',
            family: 'Alex Kidd in Miracle World',
            label: monedas()
        }));
        Q.state.on("change.coins", this, function(coins) {
            coins2.p.label = monedas();
        });
    });

    //MARCADOR DE ANILLOS
    Q.scene('rings', function(stage) {
        var rings = stage.insert(new Q.Ring({
            x: 400,
            y: 25,
            scale: 0.85
        }));
        var anillos = Q.state.p.rings.toString();
        while (anillos.length < 2) {
            anillos = '0' + anillos;
        }
        var rings2 = stage.insert(new Q.UI.Text({
            x: 420,
            y: 25,
            size: 10,
            align: 'left',
            color: '#fff',
            family: 'Alex Kidd in Miracle World',
            label: anillos
        }));
        Q.state.on("change.rings", this, function(rings) {
            rings2.p.label = '\n x ' + rings;
        });
    });

    //CARGA JUEGO
    function startGame() {
        Q.loadTMX("level1.tmx", function() {
            Q.audio.stop();
            Q.clearStages();
            Q.audio.stop();
            //Q.audio.play("music_main.ogg", { loop: true });
            Q.stageScene("level1");
            Q.stageScene("hud", 2);
            Q.stageScene("lives", 3);
            Q.stageScene("coins", 4);
            Q.stageScene("rings", 5);
        });
    }
};