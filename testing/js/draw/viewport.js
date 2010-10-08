function viewport(game, params){
	
	this.canvas = game.canvas;
	this.game = game;
	this.params = params;
	
	this.width = 500;
	this.height = 400;
	this.x1 = 0;
	this.y1 = 0;
	this.x2 = this.width;
	this.y2 = this.height;
	
	this.offset = {
		x : 0,
		y : 0
	};
		
	$(this.canvas).get(0).height = this.height;
	$(this.canvas).get(0).width = this.width;
	
	game.viewport = this;
	
	this.pan = function(x, y){

		this.offset.x += x;
		this.offset.y += y;

		this.game.context.translate(x, y);
		this.game.background.pan(x, y)
	};
	
	this.panTo = function(entity){
		var maxX = (entity.state.x + this.game.viewport.offset.x + entity.params.width),
			minX = (entity.state.x + this.game.viewport.offset.x),
			maxY = (entity.state.y + this.game.viewport.offset.y + entity.params.height),
			minY = (entity.state.y + this.game.viewport.offset.y),
			difference;
		
		if ( maxX > this.game.viewport.width ){
			difference = maxX - this.game.viewport.width;
			this.game.viewport.pan(-difference, 0)
		}
		
		if ( minX < 0 ){
			difference = 0 - minX;
			this.game.viewport.pan(difference, 0)
		}
		
		if ( maxY > this.game.viewport.height ){
			difference = maxY - this.game.viewport.height;
			this.game.viewport.pan(0, -difference)
		}
		
		if ( minY < 0 ){
			difference = 0 - minY;
			this.game.viewport.pan(0, difference)
		}
	};
	
	this.clear = function(){
		// Moving the translation back and forth makes sure 
		// the clearRect clears The entire canvas.
		this.game.context.translate(-this.offset.x, -this.offset.y);
		this.game.context.clearRect(0, 0, this.width, this.height);
		this.game.context.translate(this.offset.x, this.offset.y);
	}
}