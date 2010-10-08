function initShapes(game){
	game.shapes = {
		player1 : function(entity, params, state){
			
			/*var xToDraw = state.x,
			yToDraw = state.y,
			maxX = (this.state.x + this.params.width),
			minX = (this.state.x),
			maxY = (this.state.y + this.params.height),
			minY = (this.state.y),
			difference;
			
			if ( maxX > game.viewport.width ){
				difference = maxX - game.viewport.width;
				game.viewport.pan(-difference, 0)
				xToDraw -= difference;
			}
			
			if ( minX < 0 ){
				difference = 0 - minX;
				game.viewport.pan(difference, 0)
				xToDraw += difference;
			}
			
			if ( maxY > game.viewport.height ){
				difference = maxY - game.viewport.height;
				game.viewport.pan(0, -difference)
				yToDraw -= difference;
			}
			
			if ( minY < 0 ){
				difference = 0 - minY;
				game.viewport.pan(0, difference)
				yToDraw += difference;
			}*/
			
			polygon({
				pointsX : [0, ( params.width / 2) , params.width],
				pointsY : [params.height, 0, params.height],
				offsetX : state.x,
				offsetY : state.y,
				color : params.color,
				context : entity.context
			})
		}
	};
}