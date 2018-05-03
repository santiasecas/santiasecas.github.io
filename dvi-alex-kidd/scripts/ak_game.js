/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

window.addEventListener("load", function() {	
	var Q = window.Q = Quintus()
	.include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D, Audio, AKSpritesPlayer, AKSpritesEnemies, AKScenes")
	.setup({
		width: 512,
		height: 384
	})
	.controls()
	.touch()
	.enableSound()
	
	//CARGA DE RECURSOS
	Q.load(["main_theme.ogg", "player.png", "player.json"], function(){
		Q.compileSheets("player.png", "player.json");
	});
	
	
	//CARGA INICIAL DEL JUEGO
	Q.loadTMX("level1.tmx", function() {
		Q.stageScene("level1");
	});
});