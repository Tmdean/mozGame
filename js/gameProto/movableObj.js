var movableObj = {
	container: {},
	
	init: function(params){
		this.params = params;
		
		this.container = this.params.container || $('div');
		
		$(this.container)
			.css({
				'position' : 'absolute',
				'top' : this.params.x || 0,
				'left' : this.params.y || 0
			})
	}
};