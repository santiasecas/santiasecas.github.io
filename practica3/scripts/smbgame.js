/*
 * Práctica de Laboratorio 3
 * Desarollo de videojuegos mediante tecnologías web
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Daniel García Baameiro
 *
 */

window.addEventListener("load", function() {	
	var Q = window.Q = Quintus()
	.include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D, Audio, SMBSprites, SMBScenes")
	.setup({
		width: 320,
		height: 480
	})
	.controls()
	.touch()
	.enableSound()
	
	//CARGA DE RECURSOS
	Q.load(["mario_small.png","mario_small.json", "goomba.png", "goomba.json", "bloopa.png", "bloopa.json", "piranha.png", "piranha.json", "item_rise.ogg", "1up.ogg","coin_spinner.png",
	"koopa.png", "koopa.json", "princess.png", "coin.png", "coin.json","coinbox.png", "coinbox.json", "lives.png", "music_main.ogg", "mushroom.png","1up_mushroom.png","100.png","200.png","1up.png",
	"music_die.ogg", "music_level_complete.ogg", "music_game_over.ogg", "coin.ogg", "jump.ogg", "kick.ogg", "bump.ogg","gameover.png","mainTitle2.png", "platform.png"], function(){
		Q.compileSheets("mario_small.png","mario_small.json");
		Q.compileSheets("goomba.png", "goomba.json");
		Q.compileSheets("bloopa.png", "bloopa.json");
		Q.compileSheets("piranha.png","piranha.json");
		Q.compileSheets("coin.png","coin.json");
		Q.compileSheets("coinbox.png","coinbox.json");
		Q.compileSheets("koopa.png","koopa.json");
	});
	
	nivel = 1;
	
	//CARGA INICIAL DEL JUEGO
	Q.loadTMX("level1.tmx", function() {
		Q.stageScene("menu");
	});
});