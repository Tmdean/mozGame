function entity(game, params){
	this.init(game, params);
	this.state = this.params.state || {};

	this.render = function(){
		
		if (this.params.gameShape){
			this.params.gameShape(this, this.params, this.state);
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
