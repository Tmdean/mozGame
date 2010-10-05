function update(game){
	
	for (key in game.keymap){
		if (game.keymap[key] && keyMaps[key]){
			keyMaps[key](game);
		}
	}
	
	//game.context.clearRect(0, 0, game.viewport.width, game.viewport.height);
	game.viewport.clear();
	
	for (var i = 0; i < game.drawlist.length; i++){
		game.drawlist[i].draw()
	}
	
}