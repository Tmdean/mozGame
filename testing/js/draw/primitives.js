/* Needed params:

	context,
	x,
	y,
	radius,
	color
*/
function circle(params){
	params.context.beginPath();
	params.context.arc(
		params.x, 
		params.y, 
		params.radius, 
		0, 
		Math.PI*2, 
		true);
	params.context.fillStyle = params.color;
	params.context.fill();
	params.context.closePath();
}


/* Needed params: 

	pointsX, 
	pointsY, 
	offsetX, 
	offsetY,
	color, 
	context
*/
function polygon(params){	
	params.context.translate(params.offsetX || 0, params.offsetY || 0);
	params.context.beginPath();
	
	// Get the smaller of the two points arrays so they match up correctly
	totalPoints = params.pointsX.length > params.pointsY.length ? params.pointsY.length : params.pointsX.length;
	
	// Start off the pen at the first point
	params.context.moveTo(params.pointsX[0], params.pointsY[0]);
	
	for (i = 1; i < totalPoints; i++){
		params.context.lineTo(params.pointsX[i], params.pointsY[i]);
	}
		
	// Close the polygon by drawing a line back to the first point
	params.context.lineTo(params.pointsX[0], params.pointsY[0]);
	
	// If no color was specified, default it to magenta
	params.context.strokeStyle = params.context.fillStyle = params.color || '#f00';
	params.context.fill();
	params.context.stroke();
	params.context.closePath();
	params.context.translate(-params.offsetX || 0, -params.offsetY || 0);
};