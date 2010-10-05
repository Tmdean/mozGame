function handleKeys(keymap){
	
	$(document)
		.keydown(function(ev){
			keymap[ev.keyCode] = true;
		})
		.keyup(function(ev){
			keymap[ev.keyCode] = false;
		});
		
	$(window)
		.blur(function(){
			
			// If the window loses focus, reset the keyboard state.
			for (map in keymap){
				if (keymap.hasOwnProperty(map)){
					keymap[map] = null;
				}
			}
		});
		
	return keymap;
}