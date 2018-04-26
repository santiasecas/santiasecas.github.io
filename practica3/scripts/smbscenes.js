/*
 * Práctica de Laboratorio 3
 * Desarollo de videojuegos mediante tecnologías web
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Daniel García Baameiro
 *
 */

Quintus.SMBScenes = function(Q) {
	//MENU INICIAL
	Q.scene("menu", function(stage) {
		nivel = 1;
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2
		}));
		var button = box.insert(new Q.UI.Button({ asset: "mainTitle2.png" }));
		button.on("click",function() {
			Q.state.reset({ lives: 3, score: 0, coins:0});
			initGame();
		});
	});
	
	//Inserta en el juego las monedas indicando el cuadrado
	function coinsToMap([a, b]) {
		return {x: + a * 34 + 17, y: b * 34 + 17};
	}
	
	//Inserta en el juego las cajas de monedas según cuadrado, número de monedas dentro o
	// si contiene una seta.
	function coinboxesToMap([a, b, c, d]) {
		return {x: + a*34+17, y: b*34+18,coinsInside: c, mushroom: d};
	}
	
	/*
	 ******************************************
	 ************    LEVEL 1     **************
	 ******************************************
	 */
	Q.scene("level1", function(stage) {
		Q.stageTMX("level1.tmx",stage);
		var mario = stage.insert(new Q.Mario({x: 112, y: 441, limLeft: 17, limRight: 6700}));
		var koopa = stage.insert(new Q.Koopa({x: 748, y: 441, sprite: 'KoopaaAnimationRed', limLeft:300}));
		var koopa2 = stage.insert(new Q.Koopa({x: 1428, y: 441}));
		var koopa3 = stage.insert(new Q.Koopa({x: 5814, y: 441}));
		var piranha = stage.insert(new Q.Piranha({x: 986, y: 292}));
		var piranha2 = stage.insert(new Q.Piranha({x: 5474, y: 292}));
		var bloopa = stage.insert(new Q.Bloopa({x: 1088, y: 441}));
		var bloopa2 = stage.insert(new Q.Bloopa({x: 1190, y: 441}));
		var bloopa3 = stage.insert(new Q.Bloopa({x: 5355, y: 441}));
		var goomba = stage.insert(new Q.Goomba({x: 1600, y: 441}));
		var goomba2 = stage.insert(new Q.Goomba({x: 1634, y: 441}));
		var goomba3 = stage.insert(new Q.Goomba({x: 4862, y: 441}));
		var princess = stage.insert(new Q.Princess({x: 6716, y: 441}));

		var coins = [[8,8],[28, 5],[41,5],[116,4],[124,4]];
		for(c in coins) {
			var coin = stage.insert(new Q.Coin(coinsToMap(coins[c])));
		}
		
		var coinBoxes = [[16,9,1,0],[22,5,1,0],[21,9,1,0],[23,9,1,0],[63,9,0,1],[77,9,1,0],[92,5,1,0],[99,9,10,0],[104,9,1,0],[107,9,1,0],[110,9,1,0],[107,5,1,0],[167,9,0,1]]
		for(c in coinBoxes){
			var coinBox = stage.insert(new Q.CoinBox(coinboxesToMap(coinBoxes[c])));
		}
		stage.add("viewport").follow(mario,{ x: true, y: false });
		stage.centerOn(115,268);
		stage.viewport.offsetX = -50;
		stage.viewport.offsetY = 0;
	});
		
	/*
	 ******************************************
	 ************    LEVEL 2     **************
	 ******************************************
	 */
	Q.scene("level2", function(stage) {
		Q.stageTMX("level2.tmx",stage);
		var mario = stage.insert(new Q.Mario({x: 250, y: 400, limLeft: 190, limRight: 5780}));
		var koopa = stage.insert(new Q.Koopa({x: 959, y: 136, sprite: 'KoopaaAnimationRed', limLeft: 918, limRight: 1088}));
		var goomba = stage.insert(new Q.Goomba({x: 1500, y: 102, limLeft: 1428, limRight: 1666}));
		var goomba2 = stage.insert(new Q.Goomba({x: 1534, y: 102, limLeft: 1428, limRight: 1666}));
		var goomba3 = stage.insert(new Q.Goomba({x: 2850, y: 102, limLeft: 2788, limRight: 3026}));
		var koopa2 = stage.insert(new Q.Koopa({x: 4000, y: 170, limLeft: 3910, limRight: 4182}));
		var koopa3 = stage.insert(new Q.Koopa({x: 5100, y: 400, sprite: 'KoopaaAnimationRed', limLeft: 4896}));
		var princess = stage.insert(new Q.Princess({x: 5756, y: 400}));
		var platform = stage.insert(new Q.Platform({x: 2000, y: 340, limLeft: 1800, limRight: 2100}));
		var platform2 = stage.insert(new Q.Platform({x: 3235, y: 204, limLeft: 3094, limRight: 3322}));
		var platform3 = stage.insert(new Q.Platform({x: 3418, y: 272, limLeft: 3322, limRight: 3638}));
		
		var coins = [[35,11],[38,4],[39,4],[54,7],[55,7],[65,5],[66,5],[67,5],[68,5],[95,3],[96,3],[102,4],[103,4],[126,12],[127,12],[128,12],[134,4],[135,4]];
		for(c in coins) {
			var coin = stage.insert(new Q.Coin(coinsToMap(coins[c])));
		}
		
		var coinBoxes = [[64,10,0,1]];
		for(c in coinBoxes){
			var coinBox = stage.insert(new Q.CoinBox(coinboxesToMap(coinBoxes[c])));
		}
		
		stage.add("viewport").follow(mario,{ x: true, y: false });
		stage.centerOn(115,268);
		stage.viewport.offsetX = -50;
		stage.viewport.offsetY = 0;
	});

	//MUERTE
	Q.scene("muerte", function(stage) {
		Q.audio.stop();
		Q.audio.play('music_die.ogg');
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
		}));

		var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCC",
			label: "Continue" }));
		var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, color: "#000",
			label: stage.options.label }));
			
		button.on("click",function() {
			if(Q.state.p.lives > 0) initGame();
			else Q.stageScene("derrota",1);
		});
		box.fit(20);
	});
	
	//DERROTA
	Q.scene("derrota", function(stage) {
		nivel = 1;
		Q.audio.stop();
		Q.audio.play("music_game_over.ogg");
		
		var box = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2
		}));
		
		var button = box.insert(new Q.UI.Button({ asset: "gameover.png" }));
		
		button.on("click",function() {
			Q.state.reset({ lives: 3, score: 0, coins:0});
			startGame();
		});
	});
	
	//VICTORIA
	Q.scene("victoria", function(stage) {
		nivel++;
		if(nivel > 2) {
			//Este código se añade para volver al nivel 1 en bucle.
			//Si hubiera más niveles, no haría falta.
			Q.audio.stop();
			Q.audio.play("music_level_complete.ogg");
			var box = stage.insert(new Q.UI.Container({
				x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCC",
				label: "Play Again" }));
			var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, color: "#000",
				label: stage.options.label }));
			button.on("click",function() {
				Q.state.reset({ lives: 3, score: 0, coins:0});
				startGame();
			});
			box.fit(20);
		}
		else {
			Q.audio.stop();
			Q.audio.play("music_level_complete.ogg");
			var box = stage.insert(new Q.UI.Container({
				x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCC",
				label: "Next Level" }));
			var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, color: "#000",
				label: stage.options.label }));
			button.on("click",function() {
				startGame();
			});
			box.fit(20);
		}
	});
	
	/*
	 ******************************************
	 ****************   HUD   *****************
	 ******************************************
	 */
	//MARCADOR DE PUNTUACIÓN
	Q.scene('score', function(stage){
		var punt1 = stage.insert(new Q.UI.Text({
			x: 20, 
			y: 20, 
			size: 14,
			align: 'left',
			color: '#fff',
			family: 'emulogic',
			label: 'Mario'
		}));
		var punt2 = stage.insert(new Q.UI.Text({
			x: 20, 
			y: 20, 
			size: 14,
			align: 'left',
			color: '#fff',
			family: 'emulogic',
			label: '\n' + Q.state.p.score
		}));
		Q.state.on("change.score", this, function(score) {
			punt2.p.label = '\n' + score;
		});	
	});
	
	//MARCADOR DE MONEDAS
	Q.scene('coins', function(stage){
		var coin = stage.insert(new Q.Coin({
			x: 130,
			y: 45,
			scale: 0.7
		}));
		var monedas = stage.insert(new Q.UI.Text({
			x: 135,
			y: 20, 
			size: 14,
			align: 'left',
			color: '#fff',
			family: 'emulogic',
			label: '\n x ' + Q.state.p.coins
		}));
		Q.state.on("change.coins", this, function( coins ) {
			monedas.p.label = '\n x ' + coins;
		});	
	});
	
	//MARCADOR DE VIDAS
	Q.scene('lives', function(stage){
		var lives = stage.insert(new Q.MarioVidas({
			x: 240,
			y: 45,
			scale: 0.7
		}));
		var lives2 = stage.insert(new Q.UI.Text({
			x: 245,
			y: 20, 
			size: 14,
			align: 'left',
			color: '#fff',
			family: 'emulogic',
			label: '\n x ' + Q.state.p.lives
		}));
		Q.state.on("change.lives", this, function( lives ) {
			lives2.p.label = '\n x ' + lives;
		});	
	});
	
	
	function initGame() {
		Q.clearStages();
		Q.audio.stop();
		Q.audio.play("music_main.ogg", { loop: true});
		if(nivel == 1) {
			Q.stageScene("level1");
			Q.stageScene("score", 2);
			Q.stageScene("coins", 3);
			Q.stageScene("lives", 4);
		}
		else if(nivel == 2) {
			Q.stageScene("level2");
			Q.stageScene("score", 2);
			Q.stageScene("coins", 3);
			Q.stageScene("lives", 4);
		}
	}
	
	//CARGA INICIO
	function startGame() {
		if(nivel == 2) {
			Q.loadTMX("level2.tmx", function() {
				Q.audio.stop();
				Q.clearStages();
				initGame();
			});
		}
		else {
			Q.loadTMX("level1.tmx", function() {
				Q.audio.stop();
				Q.clearStages();
				Q.stageScene("menu");
			});
		}
	}
}