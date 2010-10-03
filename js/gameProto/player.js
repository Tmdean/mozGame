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