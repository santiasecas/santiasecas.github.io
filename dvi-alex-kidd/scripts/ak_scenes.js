/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

Quintus.AKScenes = function(Q) {
	Q.scene("level1", function(stage) {
		//Q.audio.play('main_theme.ogg',{loop: true});
		Q.stageTMX('level1.tmx',stage);
		var alex = stage.insert(new Q.Alex({x: 100, y: 200}));
		stage.insert(new Q.Bird({x: 200, y: 200}));
		stage.insert(new Q.Scorpion({x: 250, y: 500}));
		stage.add("viewport").follow(alex,{ x: false, y: true });
		stage.centerOn(256,0);
	});
}