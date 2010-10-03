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
			keymap = {};
		});
		
	return keymap;
}