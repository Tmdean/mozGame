// Testing value
var speed = 10;

var keyMaps = {
	'37' : function(game){ // Left
		game.viewport.pan(speed, 0);
	},
	
	'38' : function(game){ // Up
		game.viewport.pan(0, speed);
	},
	
	'39' : function(game){ // Right
		game.viewport.pan(-speed, 0);
	},
	
	'40' : function(game){ // Down
		game.viewport.pan(0, -speed);
	}
};