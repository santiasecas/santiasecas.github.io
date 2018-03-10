var sprites = {
 Beer: { sx: 512, sy: 99, w: 23, h: 32, frames: 1 },
 Glass: { sx: 512, sy: 131, w: 23, h: 32, frames: 1 },
 NPC: { sx: 512, sy: 66, w: 33, h: 33, frames: 1 },
 ParedIzda: { sx: 0, sy: 0, w: 512, h: 480, frames: 1 },
 Player: { sx: 512, sy: 0, w: 56, h: 66, frames: 1 },
 TapperGameplay: { sx: 0, sy: 480, w: 512, h: 480, frames: 1 }
};
	//Jugador
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
  Game.setBoard(0,new TitleScreen("Tapper", 
                                  "Press space to start playing",
                                  playGame));
};

var playGame = function() {
  Game.setBoard(0, new tapperBackground());
  var board = new GameBoard();
  board.add(new Player());
  Game.setBoard(1, board);
  
  //Clientes de prueba
  board.add(new Client(100, 80, 1));
  board.add(new Client(66, 175, 1.2));
  board.add(new Client(33, 271, 1.7));
  board.add(new Client(0, 367, 0.6));
  //board.add(new DeadZone(0,512,10));
  
  //Pared izquierda
  var board2 = new GameBoard();
  Game.setBoard(2, board2);
  board2.add(new tapperLeftWall());
};

var tapperBackground = function() {
  this.setup('TapperGameplay', {});
  this.x = 0;
  this.y = 0;
  this.step = function(){};
};
tapperBackground.prototype = new Sprite();

var tapperLeftWall = function() {
  this.setup('ParedIzda', {});
  this.x = 0;
  this.y = 0;
  this.step = function(){};
};
tapperLeftWall.prototype = new Sprite();

var Player = function() {
	this.setup('Player', {});
	this.x = 325;
	this.y = 90;
	teclaPulsada = false;
	espacioPulsado = false;
	this.step = function(){
		if(Game.keys['arriba'] && !teclaPulsada) {
			teclaPulsada = true;
			if(this.x === 325 && this.y === 90){
	    		this.x = 421;
	    		this.y = 377;
	    	}
	    	else if(this.x === 357 && this.y === 185){
	    		this.x = 325;
	    		this.y = 90;
	    	}
	    	else if(this.x === 389 && this.y === 281){
	    		this.x = 357;
	    		this.y = 185;
	    	}
	    	else if(this.x === 421 && this.y === 377){
	    		this.x = 389;
	    		this.y = 281;
	    	}
		}
		if(Game.keys['abajo'] && !teclaPulsada) {
			teclaPulsada = true;
			if(this.x === 325 && this.y === 90){
	    		this.x = 357;
	    		this.y = 185;
	    	}
	    	else if(this.x === 357 && this.y === 185){
	    		this.x = 389;
	    		this.y = 281;
	    	}
	    	else if(this.x === 389 && this.y === 281){
	    		this.x = 421;
	    		this.y = 377;
	    	}
	    	else if(this.x === 421 && this.y === 377){
	    		this.x = 325;
	    		this.y = 90;
	    	}
		}
		if(Game.keys['espacio'] && !espacioPulsado) {
			espacioPulsado = true;
			this.board.add(new Beer(this.x-10,this.y, 2.5));
		}
		if(!Game.keys['abajo'] && !Game.keys['arriba'])
			teclaPulsada = false;
		if(!Game.keys['espacio'])
			espacioPulsado = false;
	};
};
Player.prototype = new Sprite();
Player.prototype.type = OBJECT_PLAYER;

var Client = function(x, y, v) {
	this.setup('NPC', {});
	this.x = x;
	this.y = y;
	this.vel = v;
	
	this.step = function() {
		this.x += this.vel;
		var collision = this.board.collide(this,OBJECT_PLAYER_PROJECTILE);
		if(collision) {
			this.board.remove(this);
			this.board.add(new Glass(this.x, this.y+10, 2.5));
		}
	};
};
Client.prototype = new Sprite();
Client.prototype.type = OBJECT_ENEMY;


var Beer = function(x, y, v) {
	this.setup('Beer', {});
	this.x = x;
	this.y = y;
	this.vel = -v;
	
	this.step = function() {
		this.x += this.vel;
		var colisionEnemigo = this.board.collide(this,OBJECT_ENEMY);
		if(colisionEnemigo) this.vel = -10000;
		
		var colisionPared = this.board.collide(this,OBJECT_DEADZONE);
		if(colisionPared) this.board.remove(this);
	};
};
Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_PLAYER_PROJECTILE;

var Glass = function(x, y, v) {
	this.setup('Glass', {});
	this.x = x;
	this.y = y;
	this.vel = v;
	
	this.step = function() {
		this.x += this.vel;
		if(this.board.collide(this,OBJECT_PLAYER)) this.board.remove(this);
		
	};
};
Glass.prototype = new Sprite();
Glass.prototype.type = OBJECT_ENEMY_PROJECTILE;

var DeadZone = function(x,y,lado) {
	this.x = x;
	this.y = y;
	this.lado = lado;
	this.step = function() {}
}
DeadZone.prototype.type = OBJECT_DEADZONE;

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

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!", 
                                  "Press space to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!", 
                                  "Press space to play again",
                                  playGame));
};

window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});