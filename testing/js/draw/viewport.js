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
}

viewport.prototype.clear = function(){
	// Moving the translation back and forth makes sure the clearRect clears
	// The entire canvas.
	this.game.context.translate(-this.offset.x, -this.offset.y);
	this.game.context.clearRect(0, 0, this.width, this.height);
	this.game.context.translate(this.offset.x, this.offset.y);
}

viewport.prototype.pan = function(x, y){
	
	this.offset.x += x;
	this.offset.y += y;
	
	this.game.context.translate(x, y);
};