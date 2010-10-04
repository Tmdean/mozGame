var orbBase = {
	init: function(canvas, params){
		
		if (!canvas){
			throw "Canvas reference is needed!"
		}
		
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d')
		this.params = params || {};
		
		this.x = this.params.x || 0;
		this.y = this.params.y || 0;
		this.radius = this.params.radius || 0;
		this.color = this.params.color || '#000';
		
	},
	
	draw: function(){
		
		this.context.beginPath();
		this.context.arc(
			this.x, 
			this.y, 
			this.radius, 
			0, 
			Math.PI*2, 
			true);
		this.context.fillStyle = this.color;
		this.context.fill();
		this.context.closePath();
	},
	
	destroy: function(){
		
	}
};