function entity(game, params){
	this.init(game, params);

	this.render = function(){
		/*if (this.params.gameShape && this.game.shapes[this.params.gameShape]){
			this.game.shapes[this.params.gameShape](this.params);
		} else {
			log('No shape provided for entity ' + this);
		}*/
		
		if (this.params.gameShape){
			this.params.gameShape(this.params);
		} else {
			log('No shape provided for entity ' + this);
		}
	}
}

entity.prototype = drawable;
