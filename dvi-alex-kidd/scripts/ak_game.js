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
        "menu06.png", "menu07.png", "map.png", "alexmap.png", "ghost.png",
        "arrow.png", "logo.png", "creditos.png", "creditos_dani.png",
        "creditos_edu.png", "creditos_jorge.png", "creditos_santi.png",
        "menu.mp3", "menu.ogg", "map.ogg", "map.mp3", "credits.mp3", "credits.ogg",
        "enemyDie.png", "alexhud.png", "minirock.png", "mountain.png", "star_box.mp3",
        "star_box.ogg", "break_box.ogg", "break_box.mp3", "kill_enemy.mp3", "kill_enemy.ogg",
        "game_over.mp3", "game_over.ogg", "die_alex.mp3", "die_alex.ogg"
    ], function() {
        Q.sheet("alex", "alex.png", { tilew: 32, tileh: 48 });
        Q.sheet("bird", "bird.png", { tilew: 48, tileh: 32 });
        Q.sheet("scorpion", "scorpion.png", { tilew: 32, tileh: 28 });
        Q.sheet("frog", "frog.png", { tilew: 32, tileh: 48 });
        Q.sheet("escenary", "tiles.png", { tilew: 32, tileh: 32 });
        Q.sheet("alexmap", "alexmap.png", { tilew: 64, tileh: 90 });
        Q.sheet("arrow", "arrow.png", { tilew: 15, tileh: 24 });
        Q.sheet("ghost", "ghost.png", { tilew: 32, tileh: 32 });
        Q.sheet("enemyDie", "enemyDie.png", { tilew: 32, tileh: 32 });
        Q.sheet("logo", "logo.png", { tilew: 800, tileh: 600 });
        Q.loadTMX("level1.tmx", function() {
            Q.stageScene("level1");
            Q.state.reset({ lives: 3, coins: 0, rings: 0 });
            Q.stageScene("hud", 2);
            Q.stageScene("lives", 3);
            Q.stageScene("coins", 4);
            Q.stageScene("rings", 5);
        });
    });
});