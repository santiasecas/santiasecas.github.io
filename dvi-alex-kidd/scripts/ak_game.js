/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

window.addEventListener("load", function() {
    var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D, Audio, AKSpritesPlayer, AKSpritesEnemies,AKSpritesObjects, AKScenes")
        .setup({
            width: 512,
            height: 384
            //maximize: true
        })
        .controls()
        .touch()
        .enableSound()

    //CARGA DE RECURSOS
    Q.load(["main_theme.ogg", "main_theme.mp3", "jump.ogg", "jump.mp3",
			"alex.png", "bird.png", "frog.png", "frog.json", "scorpion.png", 
			"tiles.png", "coin.ogg", "coin.mp3", "punch.ogg", "fist.png",
			"menu01.png", "menu02.png", "menu03.png", "menu04.png", "menu05.png",
			"menu06.png", "menu07.png", "menu08.png", "map.png", "alexmap.png", "arrow.png"], function() {
        Q.sheet("alex", "alex.png", { tilew: 32, tileh: 48 });
        Q.sheet("bird", "bird.png", { tilew: 48, tileh: 32 });
        Q.sheet("scorpion", "scorpion.png", { tilew: 32, tileh: 28 });
        Q.sheet("frog", "frog.png", { tilew: 32, tileh: 48 });
        Q.sheet("escenary", "tiles.png", { tilew: 32, tileh: 32 });
		Q.sheet("alexmap", "alexmap.png", { tilew: 64, tileh: 90 });
		Q.sheet("arrow", "arrow.png", { tilew: 15, tileh: 24 });
		Q.loadTMX("level1.tmx", function() {
			Q.stageScene("menu");
		});
    });
});