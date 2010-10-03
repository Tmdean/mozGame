function update(game){
	
	for (key in game.keymap){
		if (game.keymap[key] && keyMaps[key]){
			keyMaps[key](game.player1);
		}
	}
	
}