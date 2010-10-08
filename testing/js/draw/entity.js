function entity(game, params){
	this.init(game, params);
	this.state = this.params.state || {};

	this.render = function(){
		
		// Draw the entity's state
		if (this.params.gameShape){
			this.params.onBeforeMove && this.params.onBeforeMove.call(this);
			this.params.gameShape(this, this.params, this.state);
			//this.params.gameShape.apply(this, [this, this.params, this.state]);
			this.params.onAfterMove && this.params.onAfterMove.call(this);
		} else {
			log('No shape provided for entity ' + this);
		}
	}
	
	this.setState = function(state){
		this.state = state;
	};
	
	this.updateState = function(state){
		$.extend(true, this.state, state);
	};
}

entity.prototype = drawable;
