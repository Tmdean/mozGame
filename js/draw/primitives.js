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