function update(game){
	
	// Just a little bit of testing code.
	/*if(game.keymap[37]){
		console.log('left!')
	}
	
	if(game.keymap[39]){
		console.log('right!')
	}*/
	
	
	for (key in game.keymap){
		if (game.keymap[key]){
			keyMaps[key](game.player1.container);
		}
	}
	
}