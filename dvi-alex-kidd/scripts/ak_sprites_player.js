/*
 * Proyecto final de DVI
 * Desarrollo de una demo del juego Alex Kidd con Quintus
 * Curso: 2017/18
 * Alumnos: Santi Baidez Ayuste & Jorge Díez Sánchez-Caballero & Daniel García Baameiro & Eduardo Gonzalo Montero
 *
 */

Quintus.AKSpritesPlayer = function(Q) {
	Q.Sprite.extend("Alex",{
		init: function(p){
			this._super(p, {
				sheet: 'alexStand',
				jumpSpeed: -525,
				speed: 200,
			});
			this.add('2d, platformerControls, animation, tween');
		}
	});
}