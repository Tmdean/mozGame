function background(canvas, game, params){
	this.init(canvas, game, params);
	
	this.prop = {
		stars : [],
		starsPerViewport : 200,
		starMaxSize : .5
	};
	
	$(this.canvas)
		.css({
			'background': '#000'
		})
		
	this.generateStars();
}

background.prototype = drawable;

background.prototype.render = function(){
	for (var i = 0; i < this.prop.starsPerViewport; i++){
		var star = this.prop.stars[i];
		
		circle($.extend({
			context : this.context,
			color : '#fff'
		}, star))
		
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