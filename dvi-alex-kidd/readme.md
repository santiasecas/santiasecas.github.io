# Alex Kidd in Miracle World
##Un proyecto usando Quintus
### Diseño del juego
**1. Objetivo del juego: cómo se gana, cómo se pierde.**

El objetivo del juego original es superar niveles derrotando a cada uno de los monstruos finales (que llamaremos "bosses") a los que hay que derrotar en una batalla a "piedra, papel o tijera". En el juego desarrollado, se ha querido plasmar esa esencia, desarrollando un único nivel pero mostrando la misma dinámica, llegar al final del nivel y luchar contra uno de los "bosses".

Para ello, nos hemos basado en el primer nivel del juego original y en la parte donde vendría una zona de agua, se ha sustituido por una pelea a "piedra, papel o tijera" contra el primer "boss" del juego: "Gooseka".

Por lo tanto, el objetivo del juego es llegar con vida al final y, una vez obtenido el dulce de arroz, pelearemos con el "boss" a "piedra, papel o tijera" y tendremos que vencerle. Si nos gana, nos quitará una vida.
Si Alex se queda sin vidas restantes, perderá la partida. Si vence al "boss" a "piedra, papel o tijera", ganará la partida.
Se pueden conseguir vidas extra de manera aleatoria en cajas interrogante, aunque a veces salen fantasmas de las mismas.

**2. Principales mecánicas**

Se va a proceder a explicar las mecánicas desarrolladas para el videojuego.
Las mecánicas desarrolladas están basadas principalmente en el personaje principal, Alex.

En cuanto a las cajas, Alex Kidd podrá interactuar con:

-**Caja Estrella**: Se podrá romper con el puño y contendrá bolsas de dinero.

-**Caja Interrogación**: Se podrá romper y contendrá un anillo, una vida, o un fantasma, de manera aleatoria.

-**Caja Calavera Amarilla**: Se podrá romper y en ese caso Alex Kidd quedará paralizado durante 1 segundo.

-**Caja Calavera morada**: Si alex Kidd la pisa aparecerá un fantasma que atacará a Alex Kidd.

Las mecánicas desarrolladas están basadas principalmente en el personaje principal, Alex. 

Este personaje puede correr a izquierda o derecha, saltar y agacharse.
Además, puede golpear con su puño para eliminar a enemigos.

**3. Personajes**

Los personajes definidos para el juego desarrollado son:

- **Alex Kidd**: personaje principal que tenemos que controlar y mantener a salvo hasta el final del nivel.
- **Bird**: Pájaro que está volando de lado a lado y que podremos destruir con el puño. Éste destruye a Alex si colisiona con él.
- **Ghost**: Enemigo indestructible que persigue a Alex durante un tiempo y lo destruye si lo logra capturar.
- **Scorpio**: Enemigo de tierra que se mueve entre 2 obstáculos y que destruye a Alex si logra colisionar con él. Se puede destruir con el puño.
- **Frog**: Enemigo de tierra que simplemente salta en su posición y destruye a Alex si lo toca. Se le puede destruir con el puño.
- **Boss**: Enemigo del final del nivel contra el que hay que jugar una partida a "piedra, papel o tijera". Gana el mejor de 3.


### Diseño de la implementación: arquitectura y principales componentes
Para implementar el juego, se ha distribuido el juego en diferentes scripts:

- **ak_game.js**: En este fichero se cargan los recursos del juego.
- **ak_scenes.js**: Aquí se definen todas las escenas del juego.
- **ak_sprites_enemies.js**: En este fichero se definen los sprites de los enemigos que se han nombrado antes: Bird, Ghost, Scorpio, Frog y Boss. Se definen cómo se muestran, su comportamiento y cómo interactuan con Alex Kidd, el puño o el nivel, en cada caso.
- **ak_sprites_objects.js**: Aquí se definen los objetos del juego que no corresponden con los enemigos o partes estáticas del mapa, como todas las cajas definidas: caja estrella, caja interrogante, caja calavera, caja calavera rosa; las piedras, sprites de la piedra rota, los sacos de dinero, elemenos de los menús, animaciones de enemigos al morir, elementos de marcador (hud), el anillo, incluso dos montañas que se muestran en la pelea contra el boss. 
- **ak_sprites_player.js**: En este fichero, se define el jugador Alex, con todas sus mecánicas y comportamientos y el sprite del puño y cómo se comporta con los elementos del nivel.

Se ha definido en "ak_sprites_enemies.js" un nuevo componente: "defaultEnemy", para los enemigos que se pueden destruir con el puño, para que actúen idéntica forma al ser golpeados con el puño.

### Equipo de trabajo y reparto de tareas
El equipo de trabajo se ha compuesto por:

- Santiago Baidez Ayuste
- Jorge Díez Sánchez-Caballero 
- Daniel García Baameiro 
- Eduardo Gonzalo Montero

El reparto de tareas ha sido el siguiente:
- Santiago Baidez Ayuste:
  Diseño gráfico y realización de los sprites, diseño del menú inicial, y programación del nivel y alex Kidd.
- Jorge Díez Sánchez-Caballero 
  Programación de enemigos y diferentes elementos como las cajas y items del juego,, así como correcciones y ajustes.
- Daniel García Baameiro 
  Programación de la pelea del jefe final Gooseka y los diferentes finales posibles del nivel.
- Eduardo Gonzalo Montero
  Programación de enemigos y diferentes elementos como las cajas y items del juego, así como correcciones y ajustes.

### Fuentes y referencias
Para la realización de este videojuego se han utilizado diferentes recursos como imágenes y sonidos.
Los sprites de terreno, cajas, algunos enemigos y alguno de Alex Kidd se han obtenido utilizando un emulador de Sega Master System, en concreto Fusion364 y luego retocándolos con programas de edición gráfica.
Si bien se han utilizado algunos sprites de los enemigos y de Alex Kidd descargados desde los sitios indicados a continuación:

- Emulador:
http://www.emulator-zone.com/doc.php/genesis/fusion.html

- Rom del videojuego: 
https://www.emuparadise.me/Sega_Master_System_ROMs/Alex_Kidd_in_Miracle_World_(USA,_Europe)/88877

- Algunos sprites del jugador y enemigos: 
https://www.spriters-resource.com

- Toda la música descargada desde:
https://downloads.khinsider.com/game-soundtracks/album/alex-kidd

