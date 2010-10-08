// Testing value
var speed = 10;

var keyMaps = {
	'37' : function(game){ // Left
		game.player1.state.x -= speed;
	},
	
	'38' : function(game){ // Up
		game.player1.state.y -= speed;
	},
	
	'39' : function(game){ // Right
		game.player1.state.x += speed;
	},
	
	'40' : function(game){ // Down
		game.player1.state.y += speed;
	}
};