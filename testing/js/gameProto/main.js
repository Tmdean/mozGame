(function( $ ){
	$.fn.initGame = function() {
  
		var self = this,
			game = {
				framerate : (1000 / 30),
				keymap : {}
			};
			
		handleKeys(game.keymap);

		// Keep the play area the same size as the browser window
		$(window)
			.resize(function(){
				self.height($(window).height())
					.width($(window).width());
			})
			.resize();
			
		// Run loop
		setTimeout(function(){
			update(game);
			
			setTimeout(arguments.callee, game.framerate)
		}, game.framerate);
		
		// Make a player
		game.player1 = new player();

	};
})( jQuery );