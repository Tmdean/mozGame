function background(game, params){
	
	this.prop = {
		stars : [],
		starsPerViewport : 250,
		starMaxSize : 1,
		detachmentFactor : 1,
		layerRandomness : 30,
		offset : {
			x : 0,
			y : 0
		}
	};
	
	this.render = function(){
		
		this.game.context.translate(-this.game.viewport.offset.x, -this.game.viewport.offset.y);
		
		for (var i = 0; i < this.prop.stars.length; i++){
			var star = this.prop.stars[i],
				layerWidth = this.game.viewport.width,
				layerHeight = this.game.viewport.height;

			while ( star.x > layerWidth ){
				star.x -= this.game.viewport.width;
			}

			while ( star.x < 0 ){
				star.x += this.game.viewport.width;
			}

			while ( star.y > layerHeight ){
				star.y -= this.game.viewport.height;
			}

			while ( star.y < 0 ){
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
			
			star.x += x / (this.prop.detachmentFactor * star.layer);
			star.y += y / (this.prop.detachmentFactor * star.layer);
		}
		
	};
	
	this.generateStars = function(){
		for (var i = 0; i < this.prop.starsPerViewport; i++){
			this.prop.stars.push({ 
				x : Math.random() * game.viewport.width,
				y : Math.random() * game.viewport.height,
				radius : Math.random() * this.prop.starMaxSize,
				layer : parseInt((Math.random() * this.prop.layerRandomness) + 1)
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
