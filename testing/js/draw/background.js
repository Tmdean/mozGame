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
		
		while (star.x + this.game.viewport.offset.x > this.game.viewport.width){
			star.x -= this.game.viewport.width;
		}
		
		while (star.x + this.game.viewport.offset.x < 0){
			star.x += this.game.viewport.width;
		}
		
		while (star.y + this.game.viewport.offset.y > this.game.viewport.height){
			star.y -= this.game.viewport.height;
		}
		
		while (star.y + this.game.viewport.offset.y < 0){
			star.y += this.game.viewport.height;
		}
		
		circle($.extend({
			context : this.context,
			color : '#fff'
		}, star));
		
		
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