drawable = {
	init: function(canvas, game, params){
		
		if (!canvas){
			throw "Canvas reference is needed!"
		}
		
		if (!game){
			throw "Game object reference is needed!"
		}
		
		this.canvas = canvas;
		this.game = game;
		this.context = this.canvas.getContext('2d')
		this.params = params || {};
		
		this.x = this.params.x || 0;
		this.y = this.params.y || 0;
		this.radius = this.params.radius || 0;
		this.color = this.params.color || '#000';
		
		if (!this.game.drawlist){
			this.game.drawlist = [];
		}
		
		this.game.drawlist.push(this);
	},
	
	draw: function(){
		
		this.render();
	},
	
	destroy: function(){
		
	}
};