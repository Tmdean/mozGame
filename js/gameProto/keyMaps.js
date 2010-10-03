keyMaps = {
	'37' : function(el){ // Left
		$(el)
			.animate({
				'left': '-=30'
			},
			{
				'duration': 500,
				queue:  false
			});
	},
	
	'38' : function(el){ // Up
		$(el)
			.animate({
				'top': '-=30'
			},
			{
				'duration': 500,
				queue:  false
			});
	},
	
	'39' : function(el){ // Right
		$(el)
			.animate({
				'left': '+=30'
			},
			{
				'duration': 500,
				queue:  false
			});
	},
	
	'40' : function(el){ // Down
		$(el)
			.animate({
				'top': '+=30'
			},
			{
				'duration': 500,
				queue:  false
			});
	}
};