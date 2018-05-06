/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

 //Enemigo Bird
Quintus.AKSpritesEnemies = function(Q) {
	Q.Sprite.extend("Bird",{
		init: function(p){
			this._super(p, {
				sheet: 'bird',
				sprite: 'BirdAnimation',
				gravity: 0,
				vx: 100
			});
			this.add("2d, animation, aiBounce");
			this.play("fly_right");
			this.on("bump.left", function(collision) {
				this.play("fly_right");
			});
			this.on("bump.right", function(collision) {
				this.play("fly_left");
			});
			this.on("hit.sprite", function(collision) {
				if(collision.obj.isA("Alex")) console.log("Toco a Alex");
				else if(collision.obj.isA("AlexFist")) this.destroy();
			});
			
		}
	});
	
	Q.animations("BirdAnimation", {
		fly_right: { frames: [0, 1], flip:false, rate: 1/2, loop: true},
		fly_left: { frames: [0, 1], flip:'x', rate: 1/2, loop: true}
	});
	
	 //Enemigo Scorpion
	Q.Sprite.extend("Scorpion",{
		init: function(p){
			this._super(p, {
				sheet: 'scorpion',
				sprite: 'ScorpionAnimation',
				vx: 50
			});
			this.add("2d, animation, aiBounce");
			this.play("move_right");
			this.on("bump.left", function(collision) {
				this.play("move_right");
			});
			this.on("bump.right", function(collision) {
				this.play("move_left");
			});
			this.on("hit.sprite", function(collision) {
				if(collision.obj.isA("Alex")) console.log("Toco a Alex");
				else if(collision.obj.isA("AlexFist")) this.destroy();
			});
			
		}
	});
	
	Q.animations("ScorpionAnimation", {
		move_right: { frames: [0, 1], flip:'x', rate: 1/4, loop: true},
		move_left: { frames: [0, 1], flip:false, rate: 1/4, loop: true}
	});
}