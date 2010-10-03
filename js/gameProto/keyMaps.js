var keyMaps = {
	'37' : function(player){ // Left
		player.moveBy(-30, 0);
	},
	
	'38' : function(player){ // Up
		player.moveBy(0, -30);
	},
	
	'39' : function(player){ // Right
		player.moveBy(30, 0);
	},
	
	'40' : function(player){ // Down
		player.moveBy(0, 30);
	}
};