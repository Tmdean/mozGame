function background(game, params){
	
	this.prop = {
		stars : [],
		starsPerViewport : 200,
		starMaxSize : 1,
		offset : {
			x : 0,
			y : 0
		}
	};
	
	this.render = function(){
		
		this.game.context.translate(-this.game.viewport.offset.x, -this.game.viewport.offset.y);
		
		for (var i = 0; i < this.prop.stars.length; i++){
			var star = this.prop.stars[i];

			while ( star.x > this.game.viewport.width ){
				star.x -= this.game.viewport.width;
			}

			while ( star.x < 0 ){
				star.x += this.game.viewport.width;
			}

			while ( star.y > this.game.viewport.height ){
				star.y -= this.game.viewport.height;
			}

			while ( star.y < 0){
				star.y += this.game.viewport.height;
			}

			circle($.extend({
				context : this.context,
				color : '#fff'
			}, star));

		}
		
		this.game.context.translate(this.game.viewport.offset.x, this.game.viewport.offset.y);
	};
	
	this.pan = function(x, y){
		
		for (var i = 0; i < this.prop.stars.length; i++){
			var star = this.prop.stars[i];
			
			star.x += x;
			star.y += y;
		
			while ( (star.x + x) > this.game.viewport.width ){
				star.x -= this.game.viewport.width;
			}

			while ( (star.x + x) < 0 ){
				star.x += this.game.viewport.width;
			}

			while ( (star.y + y) > this.game.viewport.height ){
				star.y -= this.game.viewport.height;
			}

			while ( (star.y + y) < 0 ){
				star.y += this.game.viewport.height;
			}
		
		}
		
	};
	
	this.generateStars = function(){
		for (var i = 0; i < this.prop.starsPerViewport; i++){
			this.prop.stars.push({ 
				x : Math.random() * game.viewport.width,
				y : Math.random() * game.viewport.height,
				radius : Math.random() * this.prop.starMaxSize
			});
		}
	};
	
	this.init(game, params);
	
	$(this.canvas)
		.css({
			'background': '#000'
		});
	
	this.generateStars();
}

background.prototype = drawable;
