function background(canvas, game, params){
	this.init(canvas, game, params);
	
	this.prop = {
		stars : [],
		starsPerViewport : 200,
		starMaxSize : 1
	};
	
	$(this.canvas)
		.css({
			'background': '#000'
		})
		
	this.generateStars();
}

background.prototype = drawable;

background.prototype.render = function(){
	for (var i = 0; i < this.prop.stars.length; i++){
		var star = this.prop.stars[i];
		
		circle($.extend({
			context : this.context,
			color : '#fff'
		}, star))
		
		/*circle({
			context : this.game.context,
			color : '#fff',
			x : star.x,
			y : star.y,
			radius : star.radius
		})*/
	}
};

background.prototype.generateStars = function(){
	for (var i = 0; i < this.prop.starsPerViewport; i++){
		this.prop.stars.push({ 
			x : Math.random() * game.viewport.width,
			y : Math.random() * game.viewport.height,
			radius : Math.random() * this.prop.starMaxSize
		});
	}
};