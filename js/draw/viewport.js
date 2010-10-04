function viewport(canvas, game, params){
	//this.init(canvas, game, params);
	
	this.width = 500;
	this.height = 400;
	this.x1 = 0;
	this.y1 = 0;
	this.x2 = this.width;
	this.y2 = this.height;
	
		
	$(canvas).get(0).height = this.height;
	$(canvas).get(0).width = this.width;
	
	game.viewport = this;
}

viewport.prototype.pan = function(x, y){
	
};