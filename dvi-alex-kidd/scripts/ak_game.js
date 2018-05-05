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
		//width: 512,
		//height: 384
		maximize: true
	})
	.controls()
	.touch()
	.enableSound()
	
	//CARGA DE RECURSOS
	Q.load(["main_theme.ogg","main_theme.mp3","jump.ogg", "jump.mp3", "alex.png", "alex.json", "coin.ogg", "coin.mp3", "punch.ogg"], function(){
		Q.compileSheets("alex.png", "alex.json");
	});
	
	
	//CARGA INICIAL DEL JUEGO
	Q.loadTMX("level1.tmx", function() {
		Q.audio.play('main_theme.ogg',{loop: true});
		Q.stageScene("level1");
	});
});