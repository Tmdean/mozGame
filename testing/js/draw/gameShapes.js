function initShapes(game){
	game.shapes = {
		player1 : function(entity, params, state){
			
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