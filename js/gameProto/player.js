function player(params){
	this.init(this.params);
	
	$(this.container)
		.css({
			'height' : this.params.height || 40,
			'width' : this.params.width || 40,
			'background': this.params.color || '#f00'
		})
		.appendTo('#game')
}

player.prototype = movableObj;

player.prototype.moveBy = function(x, y){
	$(this.container)
		.animate({
			'left': '+=' + x,
			'top': '+=' + y,
		},
		{
			'duration': 500,
			queue:  false
		});
};