var sprites = {
 Beer: { sx: 512, sy: 99, w: 23, h: 32, frames: 1 },
 Glass: { sx: 512, sy: 131, w: 23, h: 32, frames: 1 },
 NPC: { sx: 512, sy: 66, w: 33, h: 33, frames: 1 },
 ParedIzda: { sx: 0, sy: 0, w: 512, h: 480, frames: 1 },
 TpSingle: { sx: 512, sy: 0, w: 56, h: 66, frames: 1 },
 TapperGameplay: { sx: 0, sy: 480, w: 512, h: 480, frames: 1 }
};

var enemies = {
  straight: { x: 0,   y: -50, sprite: 'enemy_ship', health: 10,
              E: 100 },
  ltr:      { x: 0,   y: -100, sprite: 'enemy_purple', health: 10,
              B: 75, C: 1, E: 100, missiles: 2  },
  circle:   { x: 250,   y: -50, sprite: 'enemy_circle', health: 10,
              A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
  wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20,
              B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
  step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
              B: 150, C: 1.2, E: 75 }
};

var OBJECT_PLAYER = 1,
	//Jarras con cerveza
    OBJECT_PLAYER_PROJECTILE = 2,
	//Clientes
    OBJECT_ENEMY = 4,
	//Jarras vacías
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16,
	//Bordes
    OBJECT_DEADZONE = 32;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  // Only 1 row of stars
  if(ua.match(/android/)) {
    Game.setBoard(0,new Starfield(50,0.6,100,true));
  } else {
    Game.setBoard(0,new Starfield(20,0.4,100,true));
    Game.setBoard(1,new Starfield(50,0.6,100));
    Game.setBoard(2,new Starfield(100,1.0,50));
  }
  Game.setBoard(3,new TitleScreen("Tapper",
                                  "Press [SPACE] to start playing",
                                  playGame));
};

var level1 = [
 // Start,   End, Gap,  Type,   Override
  [ 0,      4000,  500, 'step' ],
  [ 6000,   13000, 800, 'ltr' ],
  [ 10000,  16000, 400, 'circle' ],
  [ 17800,  20000, 500, 'straight', { x: 50 } ],
  [ 18200,  20000, 500, 'straight', { x: 90 } ],
  [ 18200,  20000, 500, 'straight', { x: 10 } ],
  [ 22000,  25000, 400, 'wiggle', { x: 150 }],
  [ 22000,  25000, 400, 'wiggle', { x: 100 }]
];

var playerBar = [[325, 90], [421, 377], [357, 185], [389, 281]];

var playGame = function() {
  Game.setBoard(0, new tapperBackground());
  var board = new GameBoard();
  board.add(new PlayerTpSingle());
  Game.setBoard(1, board);

  //Pared izquierda para hacer el gesto de saliendo puerta clientes
  var board2 = new GameBoard();
  Game.setBoard(2, board2);
  board2.add(new tapperLeftWall());


  //Respaen de cada posición en la barra -> board, clients, frequency, delay, x, y, lap)
  var spawn1 = new Spawner(board, 2, 4000,  500, 120,  80, 0.5);
  var spawn2 = new Spawner(board, 1, 6500, 1000,  90, 175, 0.2);
  var spawn3 = new Spawner(board, 5, 2500, 700,  60, 271, 1.0);
  var spawn4 = new Spawner(board, 7, 2000, 1300,  25, 367, 0.6);

  //DeadZone
  board.add(new DeadZone(90,80));
  board.add(new DeadZone(66,175));
  board.add(new DeadZone(33,271));
  board.add(new DeadZone(0,367));
  board.add(new DeadZone(345,80));
  board.add(new DeadZone(375,175));
  board.add(new DeadZone(410,271));
  board.add(new DeadZone(440,367));

  Game.setBoard(3,board);
};

//Fondo de pantalla principal - Creo un nuevo objeto que hereda de sprite y que me dibuja la imagen del fondo
var tapperBackground = function() {
  this.setup('TapperGameplay', {});
  this.x = 0;
  this.y = 0;
  this.step = function(){};
};
tapperBackground.prototype = new Sprite();

//Pared izquierda
var tapperLeftWall = function() {
  this.setup('ParedIzda', {});
  this.x = 0;
  this.y = 0;
  this.step = function(){};
};
tapperLeftWall.prototype = new Sprite();

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!",
                                  "Press [SPACE] to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!",
                                  "Press [SPACE] to play again",
                                  playGame));
};

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width;
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set,
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  };

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  };
};

//Jugador - Player
var PlayerTpSingle = function() {
	this.setup('TpSingle', {});
	this.x = playerBar[0][0];
	this.y = playerBar[0][1];

	teclaPulsada = false;
	espacioPulsado = true;

  this.step = function(){
		if(Game.keys['up'] && !teclaPulsada) {
      //console.log("Up pulsada");
			teclaPulsada = true;
			if(this.x === playerBar[0][0] && this.y === playerBar[0][1]){
    		this.x = playerBar[1][0];
    		this.y = playerBar[1][1];
    	}
    	else if(this.x === playerBar[2][0] && this.y === playerBar[2][1]){
    		this.x = playerBar[0][0];
    		this.y = playerBar[0][1];
    	}
    	else if(this.x === playerBar[3][0] && this.y === playerBar[3][1]){
    		this.x = playerBar[2][0];
    		this.y = playerBar[2][1];
    	}
    	else if(this.x === playerBar[1][0] && this.y === playerBar[1][1]){
    		this.x = playerBar[3][0];
    		this.y = playerBar[3][1];
    	}
	  }
		if(Game.keys['down'] && !teclaPulsada) {
      //console.log("Down pulsada");
      //console.log(teclaPulsada);
			teclaPulsada = true;
			if(this.x === playerBar[0][0] && this.y === playerBar[0][1]){
	    		this.x = playerBar[2][0];
	    		this.y = playerBar[2][1];
	    	}
	    	else if(this.x === playerBar[2][0] && this.y === playerBar[2][1]){
	    		this.x = playerBar[3][0];
	    		this.y = playerBar[3][1];
	    	}
	    	else if(this.x === playerBar[3][0] && this.y === playerBar[3][1]){
	    		this.x = playerBar[1][0];
	    		this.y = playerBar[1][1];
	    	}
	    	else if(this.x === playerBar[1][0] && this.y === playerBar[1][1]){
	    		this.x = playerBar[0][0];
	    		this.y = playerBar[0][1];
	    	}
  		}
  		if(Game.keys['fire'] && !espacioPulsado) {
  			espacioPulsado = true;
  			this.board.add(new Beer(this.x-10,this.y, 2.5));
        GameManager.setNumberBeer();
        //console.log("presiono espacioPulsado");
  		}
  		if(!Game.keys['up'] && !Game.keys['down'])
  			teclaPulsada = false;
  		if(!Game.keys['fire']){
  			espacioPulsado = false;
        //console.log("levanto espacio");
      }

      var collision = this.board.collide(this,OBJECT_ENEMY_PROJECTILE);
      if(collision) {
        collision.hit(0);
        GameManager.setGlassCollected();
      }
    };
};

PlayerTpSingle.prototype = new Sprite();
PlayerTpSingle.prototype.type = OBJECT_PLAYER;

//Cerveza
var Beer = function(x, y, v) {
	this.setup('Beer', {});
	this.x = x;
	this.y = y;
	this.vel = -v; //Si no va hacia la derecha

	//Desaparece cuando choca con un vaso vacío o con la pared
	this.step = function() {
		this.x += this.vel;
    var collision = this.board.collide(this,OBJECT_DEADZONE);
    if(collision){
      this.hit(0);
      GameManager.glassOnDeadZone();
    }
	};
};

Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_PLAYER_PROJECTILE;

// Movimiento y velocidad
var Client = function(x, y, v) {
	this.setup('NPC', {});
	this.x = x;
	this.y = y;
  this.vel = v;

  this.step = function() {
		this.x += this.vel;
    // Generamos un choque
    var collision = this.board.collide(this,OBJECT_PLAYER_PROJECTILE);
		if(collision) {
      collision.hit(0);
      this.hit(0);
      GameManager.setClientsServed();
			this.board.add(new Glass(this.x, this.y+10, 2.5));
		}

    var collision = this.board.collide(this,OBJECT_DEADZONE);
    if(collision){
      collision.hit(0);
      GameManager.clientOnDeadZone();
    }
  }
};

Client.prototype = new Sprite();
Client.prototype.type = OBJECT_ENEMY;

var Glass = function(x, y, v) {
  GameManager.setNumberGlass();
	this.setup('Glass', {});
	this.x = x;
	this.y = y;
	this.vel = v;
	//Desaparece cuando choca con el jugador o con la pared
	this.step = function() {
		this.x += this.vel;
    var collision = this.board.collide(this,OBJECT_DEADZONE);
		if(collision){
      this.hit(0);
      GameManager.glassOnDeadZone();
    }
	};
};

Glass.prototype = new Sprite();
Glass.prototype.type = OBJECT_ENEMY_PROJECTILE;

//Paredes laterales. (Falta definir mejor)
var DeadZone = function(x,y) {
  this.w = 20;
  this.h = 80;
  this.x = x;
  this.y = y;

  this.step = function(){
    var collision = this.board.collide(this,OBJECT_ENEMY);

  	if(collision) {
  		console.log("Enemigo colisiona");
      collision.hit(0);
  	}

    var collision = this.board.collide(this,OBJECT_PLAYER_PROJECTILE);
  	if(collision){
      console.log("Cerveza colisiona");
      collision.hit(0);
  	}
  }
};

DeadZone.prototype = new Sprite();
DeadZone.prototype.type = OBJECT_DEADZONE;

DeadZone.prototype.draw = function(ctx){
	var canvas = document.getElementById('game');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
    // Cambiar por un color para visualizar las DeadZones
		ctx.fillStyle = "transparent";
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
};

var Spawner = function(board, clients, frequency, delay, x, y, v){
  GameManager.setNumberClient(clients);
  this.proto = new Client();
	this.board = board;
	this.clients = clients;
	this.frequency = frequency;
	this.delay = delay;
	this.x = x;
  this.y = y;

  //console.log("entra");

  for(i=0; i<this.clients; i++){
		this.delay+=Math.floor((Math.random() * 1000) + 0);
		setTimeout(function(){

      var client = new Client(x, y, v);
			board.add(client);
			//console.log(board);
		}, this.delay + this.frequency*i);
	}
};

// Patron singleton -> https://es.wikipedia.org/wiki/Singleton#Javascript
var GameManager = new function(){
	this.clients = 0;
	this.glass = 0;
  this.beer = 0;

  // Se debe avisar de cuantos clientes se van a generar
	this.setNumberClient = function(clients){
		this.clients = this.clients + clients;
		console.log("Clientes añadido. Total: " + this.clients);

    if(this.clients == 0){
      this.gameState(0);
    }
	};

  // Se debe avisar cada vez que se creen jarras vacias
	this.setNumberGlass = function(){
		this.glass = this.glass + 1;
    this.beer = this.beer - 1;
		console.log("Glass creada. Total: " + this.glass);
	};

  // Se debe avisar cuando se creen jarras
  this.setNumberBeer = function(){
    this.beer = this.beer + 1;
    console.log("Cerveza puesta. Total: " + this.beer);
  };

  // Aviso de que he recogido una jarra vacia
  this.setGlassCollected = function(){
    this.glass = this.glass - 1;
    if(this.glass == 0){
      this.gameState(0);
    }
  }

  //Se debe avisar cada vez que sirvamos a un cliente
	this.setClientsServed = function(){
		this.clients = this.clients - 1;
    console.log("Cliente servido. Total: " + this.clients);
	};

  // Se debe avisar cuando un cliente llega al extremo de la barra
  this.clientOnDeadZone = function(){
    console.log("Cliente en el extemo de la barra!");
    this.clients = this.clients - 1;
    this.gameState(1);
  }

  // Se debe avisar cuando una jarra vacia llega al extremo de la barra
  this.glassOnDeadZone = function(){
    console.log("Una jarra ha caido!");
    this.glass = this.glass - 1;
    this.gameState(1);
  }

  /* - El jugador gana si:
        - No quedan clientes a los que servir. (El número de clientes es fijo
          para un nivel y se conoce a priori)
        - No quedan jarras vacias que recoger
     - El jugador pierde si:
        - Algún cliente llega al extremo derecho de la barra
        - Alguna cerveza llena llega al extremo izquierdo de la barra
        - Alguna jarra vacia llega al extremo derecho de la barra
  */
	this.gameState = function(derrota){
		console.log(this.clients, this.glass, this.beer);

    if(derrota == 0){
		  if(this.clients == 0 && this.glass == 0 && this.beer == 0){
			  console.log("¡Todo limpio! ¡Has ganado!");
			  //beer a -1 para que se ponga a 0 al pulsar espacio
			  this.beer = -1;
        winGame();
		  }
    }else{
      console.log("Has perdido... :(");
      loseGame();
      this.clients = 0;
	  //beer a -1 para que se ponga a 0 al pulsar espacio
      this.beer = -1;
      this.glass = 0;
    }
	};
};

window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});
