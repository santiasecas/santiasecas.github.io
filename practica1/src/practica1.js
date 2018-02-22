/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {
    this.gs = gs;
    this.cartas = [];
    this.cartasEncontradas = [];
    this.mensajeEstado;
    this.estado;
	this.carta1;
	this.carta2;
	
   /**
    * Inicializa el juego creando las cartas (recuerda que son 2 de cada tipo de carta), 
    * desordenándolas y comenzando el bucle de juego.
    */
    this.initGame = function() {
        this.mensajeEstado = "Memory Game";
		this.estado = 0;
        this.crearCartas();
        this.desordenarCartas();
        this.loop();
    }
    
   /**
    * Dibuja el juego, esto es:
    * (1) escribe el mensaje con el estado actual del juego
    * (2) pide a cada una de las cartas del tablero que se dibujen.
    */
    this.draw = function() {
        this.gs.drawMessage(this.mensajeEstado);
        for (var i = 0; i < this.cartas.length; i++) {
            this.cartas[i].draw(this.gs, i);
		}
    }
    
   /**
    * Es el bucle del juego.
    */
    this.loop = function() {
		var that = this; 
        setInterval(function(){that.draw()}, 16);
    }
    
   /**
    * Este método se llama cada vez que el jugador pulsa sobre
    * alguna de las cartas (identificada por el número que ocupan en el array de cartas
    * del juego). Es el responsable de voltear la carta y, si hay dos volteadas, comprobar
    * si son la misma (en cuyo caso las marcará como encontradas). En caso de no ser
    * la misma las volverá a poner boca abajo
    */
    this.onClick = function(cardId) {
		//Estado 0: no se ha pulsado ninguna carta
		if (this.estado == 0 && !this.cartas[cardId].volteada) {
			this.carta1 = this.cartas[cardId]
			this.carta1.flip();
			this.estado = 1;
		}
		//Estado 1: se ha pulsado 1 carta
		if (this.estado == 1 && !this.cartas[cardId].volteada) {
			this.carta2 = this.cartas[cardId]
			this.carta2.flip();
			this.estado = 2;
		}
		//Estado 2: se han pulsado 2 cartas
		if (this.estado == 2) {
			//Se pasa a Estado 3 para bloquear el juego.
			this.estado = 3;
			c1 = this.carta1;
			c2 = this.carta2;
			var that = this;
			//Si no coinciden
			if(!c1.compareTo(c2)){
				this.mensajeEstado = "Try again";
				setTimeout(function() {
					c1.flip();
					c2.flip();
					//Y se libera el Estado.
					that.estado = 0;
				},1000);
			}
			//Si coinciden
			else {
				this.cartasEncontradas.push(c1);
				c1.encontrada = true;
				this.cartasEncontradas.push(c2);
				c2.encontrada = true;
				this.mensajeEstado = "Match found!!";
				setTimeout(function() {
					//Y se libera el Estado.
					that.estado = 0;
				},1000);
			}
		}
		if (this.cartasEncontradas.length == this.cartas.length)
			this.mensajeEstado = "You win!!";
    }
    
   /**
    * Este método crea 8 pares de cartas de las disponibles y las guarda en el array de cartas
    */
    this.crearCartas = function() {
        this.cartas = [
            new MemoryGameCard("8-ball"),
            new MemoryGameCard("8-ball"),
            new MemoryGameCard("potato"), 
            new MemoryGameCard("potato"),
            new MemoryGameCard("dinosaur"), 
            new MemoryGameCard("dinosaur"),
            new MemoryGameCard("kronos"), 
            new MemoryGameCard("kronos"),
            new MemoryGameCard("rocket"), 
            new MemoryGameCard("rocket"),
            new MemoryGameCard("unicorn"), 
            new MemoryGameCard("unicorn"),
            new MemoryGameCard("guy"), 
            new MemoryGameCard("guy"),
            new MemoryGameCard("zeppelin"), 
            new MemoryGameCard("zeppelin")
        ]
    }
    
   /**
    * Este método desordena las cartas de manera aleatoria
    */
    this.desordenarCartas = function() {
        var numCartas = this.cartas.length
        var cartasAux = [];
        while(numCartas > 0) {
            elem = Math.floor(Math.random() * numCartas);
            aux = this.cartas[elem];
            this.cartas.splice(elem,1);
            cartasAux.push(aux);
            numCartas = this.cartas.length;
        }
        this.cartas = cartasAux;
    }
};

/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {

    this.nombre = id;
    this.volteada = false;
    this.encontrada = false;

   /**
    * Da la vuelta a la carta, cambiando el estado de la misma
    */
    this.flip = function() {
        if (this.volteada == false) {
            this.volteada = true;
        }
        else { 
        this.volteada = false;
        }
    }
    
   /** 
    * Marca una carta como encontrada, cambiando el estado de la misma
    */
    this.found = function()  {
        this.encontrada = true;
    }
     
   /**
    * Compara dos cartas, devolviendo true si ambas representan la misma carta
    */
    this.compareTo = function(otherCard) {
        return this.nombre == otherCard.nombre;
    }
    
   /**
    * Dibuja la carta de acuerdo al estado en el que se encuentra.
    * Recibe como parámetros el servidor gráfico y la posición en la que se encuentra en
    * el array de cartas del juego (necesario para dibujar una carta).
    */
    this.draw = function(gs, pos)  {
        // Si no está volteada, se ve la cara trasera.
        if(this.volteada == false) {
            gs.draw("back", pos);
        }
        // En caso contrario, se ve la cara de su id.
        else {
            gs.draw(this.nombre, pos);
        }
    }
};