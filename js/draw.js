(function () {
    var spcw;
    
    spcw = window.spcw;
    
    spcw.drawPoly = function (ctx, poly) {
        var i;
        
		ctx.beginPath();
		ctx.moveTo(poly[0][0], poly[0][1]);
		for (i = 0; i < poly.length; i++) {
			ctx.lineTo(poly[i][0], poly[i][1]);
		}
		ctx.lineTo(poly[0][0], poly[0][1]);
		ctx.closePath();
    };
    
    /* Ship rendering object. A ShipRenderer is built for every ship in the
    game. */
    spcw.ShipRenderer = function (npc) {
        this.polyPoints = [
            [-32, -32], [-29, -16], [-29, 16], [-32, 32], [-23, 32], [-8, 16], [22, 10],
            [32, 0], [22, -10], [-8, -16], [-23, -32]
        ];

        this.collisionPoly = [
            [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
            [0, 0], [0, 0]
        ];
        
        this.width = 64;
        this.height = 64;
        
        this.explodeSegments = [];
        
        if (npc) {
            this.color = '#c33';
        } else {
            this.color = '#3c3';
        }
    };
    
    /*
        Gets a polygon representing the outline of a ship for
        collision-detection purposes.
        
        Parameters:
            {spcw.Box} box: Dimension/location of ship in game coordinates
            {unsigned long} angle: Angle of ship in radians
    */
    spcw.ShipRenderer.prototype.getCollisionPoly = function (box, angle) {
        var cosa, sina, centerX, centerY, poly, coll, i;
        
        cosa = Math.cos(angle);
        sina = Math.sin(angle);
    
        centerX = box.centerX();
        centerY = box.centerY();
        
        coll = this.collisionPoly;
        poly = this.polyPoints;
        
        for (i = 0; i < this.collisionPoly.length; i++) {
            coll[i][0] = cosa * poly[i][0] + sina * poly[i][1] + centerX;
            coll[i][1] = -sina * poly[i][0] + cosa * poly[i][1] + centerY;
        }
    
        return this.collisionPoly;
    };

    /*
        Draws a ship to a canvas.
        
        Parameters:
            {CanvasRenderingContext2D} ctx: Pre-scaled canvas context
            {spcw.Box} box: Dimension/location of ship in screen coordinates
            {unsigned long} angle: Angle of ship in range [0, 16) (see
                spcw.clampAngle in constants.js)
            {Boolean} forward: True if forward thrusters on
            {Boolean} left: True if left thrusters on
            {Boolean} right: True if right thrusters on
            {Boolean} npc: True if object to render is an AI-controlled ship
    */
    spcw.ShipRenderer.prototype.drawShip = function (ctx, box, angle, forward,
        left, right, npc)
    {
        this.getCollisionPoly(box, spcw.clampAngle[angle]);

		spcw.drawPoly(ctx, this.collisionPoly);
	    ctx.strokeStyle = this.color;
		ctx.lineWidth = 2.5;
		ctx.stroke();
    };
    
    spcw.ShipRenderer.prototype.beginExplosion = function (angle) {
        var i, cosa, sina;
        
        cosa = Math.cos(angle);
        sina = Math.sin(angle);
        
        for (i = 0; i < this.polyPoints.length - 1; i++) {
            this.explodeSegments.push({
                dx: Math.random() - 0.5,
                dy: Math.random() - 0.5,
                points: [
                    [ cosa * this.polyPoints[i][0] + sina * this.polyPoints[i][1],
                    -sina * this.polyPoints[i][0] + cosa * this.polyPoints[i][1] ],
                    [ cosa * this.polyPoints[i + 1][0] + sina * this.polyPoints[i + 1][1],
                    -sina * this.polyPoints[i + 1][0] + cosa * this.polyPoints[i + 1][1] ]
                ]
            });
        }
    };
    
    /*
        Draws an explosion to a canvas.
        
        Parameters:
            {CanvasRenderingContext2D} ctx: Pre-scaled canvas context.
            {spcw.Box} box: Dimension/location of explosion in screen coordinates
    */
    spcw.ShipRenderer.prototype.drawExplosion = function (ctx, box) {
        var i, seg, centerX, centerY;
        
        centerX = box.centerX();
        centerY = box.centerY();
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        for (i = 0; i < this.explodeSegments.length; i++) {
            seg = this.explodeSegments[i];
            
            seg.points[0][0] += seg.dx;
            seg.points[1][0] += seg.dx;
            seg.points[0][1] += seg.dy;
            seg.points[1][1] += seg.dy;
            
            ctx.beginPath();
            ctx.moveTo(seg.points[0][0] + centerX, seg.points[0][1] + centerY);
            ctx.lineTo(seg.points[1][0] + centerX, seg.points[1][1] + centerY);
            ctx.closePath();
            ctx.stroke();
        }
    };
    
    spcw.PlanetRenderer = function () {
        this.width = 256;
        this.height = 256;
        this.polyPoints = [
            [128, 0], [111, 64], [64, 111], [0, 128], [-64, 111], [-111, 64],
            [-128, 0], [-111, -64], [-64, -111], [0, -128], [64, -111],
            [111, -64]
        ];
        
        this.poly = [
            [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
            [0, 0], [0, 0], [0, 0], [0, 0]
        ];
    };
    
    spcw.PlanetRenderer.prototype.drawPlanet = function (ctx, box) {
        var centerX, centerY, i;
        
        centerX = box.centerX();
        centerY = box.centerY();
        
        for (i = 0; i < this.poly.length; i++) {
            this.poly[i][0] = this.polyPoints[i][0] + centerX;
            this.poly[i][1] = this.polyPoints[i][1] + centerY;
        }
        
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#cc3';
        spcw.drawPoly(ctx, this.poly);
        ctx.stroke();
    };
    
    spcw.BulletRenderer = function () {
        this.width = 8;
        this.height = 8;
        this.collisionPoly = [
            [0, 0], [0, 0], [0, 0], [0, 0]
        ];
    };
    
    spcw.BulletRenderer.prototype.drawBullet = function (ctx, box) {
        ctx.fillStyle = '#6f6';
        ctx.fillRect(box.x, box.y, box.width, box.height);
    };
    
    spcw.BulletRenderer.prototype.getCollisionPoly = function (box, dx, dy) {
        var centerX, centerY, angleA, angleB, h;
    
        centerX = 2 * box.x + dx;
        if (dx < 0) {
            centerX -= box.width;
        } else {
            centerX += box.width;
        }
        centerX /= 2;
    
        centerY = 2 * box.y + dy;
        if (dy < 0) {
            centerY -= box.width;
        } else {
            centerY += box.height;
        }
        centerY /= 2;
    
        angleA = Math.atan2(-dy, dx);
        angleB = Math.atan2(4, spcw.BULLET_SPEED / 2);
        h = Math.sqrt(Math.pow(spcw.BULLET_SPEED / 2, 2) + 16);
    
        this.collisionPoly[0][0] = centerX + h * Math.cos(angleA + angleB);
        this.collisionPoly[0][1] = centerY + h * -Math.sin(angleA + angleB);
        this.collisionPoly[1][0] = centerX + h * Math.cos(angleA + Math.PI - angleB);
        this.collisionPoly[1][1] = centerY + h * -Math.sin(angleA + Math.PI - angleB);
        this.collisionPoly[2][0] = centerX + h * Math.cos(angleA + Math.PI + angleB);
        this.collisionPoly[2][1] = centerY + h * -Math.sin(angleA + Math.PI + angleB);
        this.collisionPoly[3][0] = centerX + h * Math.cos(angleA - angleB);
        this.collisionPoly[3][1] = centerY + h * -Math.sin(angleA - angleB);

        return this.collisionPoly;
    };
    
    /*
        Background rendering object. Draws the scrolling grid.
        
        Parameters:
            {unsigned long} width: width of arena (same as spcw.WORLD_WIDTH)
            {unsigned long} height: height of arena (same as spcw.WORLD_HEIGHT)
    */
    spcw.BackgroundRenderer = function (width, height) {
        var i, maxX, maxX, x, y, radius;
        
        this.width = width;
        this.height = height;

		this.generateStars(this.width, this.height);
    };

	spcw.BackgroundRenderer.prototype.generateStars = function(width, height){
		
		var i, maxX, maxY;
		
		this.stars = [];
		
		maxX = this.width * spcw.STARFIELD_DEPTH;
        maxY = this.height * spcw.STARFIELD_DEPTH;
		
		for (i = 0; i < spcw.NUM_STARS; i++){
			this.stars.push({ 
				x : -Math.random() * maxX,
				y : -Math.random() * maxY,
				radius : Math.random() * spcw.MAX_STAR_SIZE,
				layer : parseInt((Math.random() * spcw.LAYER_RANDOMNESS) + 1)
			});
		}
	};
    
    /*
        Renders the background.
        
        Parameters:
            {CanvasRenderingContext2D} ctx: Pre-scaled canvas context.
            {double} scrollX: Upper-left x-position of screen in game
                coordinates. Ranges from 0 to spcw.WORLD_WIDTH
            {double} scrollY: Upper-left y-position of screen in game
                coordinates. Ranges from 0 to spcw.WORLD_HEIGHT
            {double} scrollX2: Lower-right x-position of screen in game
                coordinates. Ranges from 0 to spcw.WORLD_WIDTH * 2
            {double} scrollX2: Lower right y-position of screen in game
                coordinates. Ranges from 0 to spcw.WORLD_HEIGHT * 2
        
        Note: The magnitudes of scrollX2 - scrollX and scrollY2 - scrollY
            vary depending on the current zoom level.
    */
    spcw.BackgroundRenderer.prototype.drawBackground = function (ctx,
        scrollX, scrollY, scrollX2, scrollY2)
    {
        var screenWidth, screenHeight;
        
        screenWidth = scrollX2 - scrollX + 1;
        screenHeight = scrollY2 - scrollY + 1;

        this.drawStars(ctx, scrollX, scrollY, screenWidth, screenHeight);
        this.drawGrid(ctx, scrollX, scrollY, screenWidth, screenHeight);
    };
    
    spcw.BackgroundRenderer.prototype.drawStars = function (ctx,
        scrollX, scrollY, screenWidth, screenHeight)
    {
        var i, star, x, y, xTransform, yTransform, halfWidth, halfHeight,
            widthOffset, heightOffset, initY;
        
        ctx.fillStyle = '#fff';

        halfWidth = screenWidth / 2;
        halfHeight = screenHeight / 2;
        widthOffset = halfWidth * spcw.STARFIELD_DEPTH;
        heightOffset = halfHeight * spcw.STARFIELD_DEPTH;
        
        for (i = 0; i < this.stars.length; i++) {
            star = this.stars[i];

			x = star.x - scrollX / (spcw.STAR_DETACHMENT * star.layer);
			y = star.y - scrollY / (spcw.STAR_DETACHMENT * star.layer);

            while (x < -widthOffset) x += this.width;
            while (y < -heightOffset) y += this.height;
            
            initY = y;
            while (x < widthOffset + halfWidth) {
                while (y < heightOffset + halfHeight) {
                    ctx.fillRect(
                        (x - halfWidth) / spcw.STARFIELD_DEPTH + halfWidth,
                        (y - halfHeight) / spcw.STARFIELD_DEPTH + halfHeight,
                        star.radius, star.radius);
                    y += this.height;
                }
                
                y = initY;
                x += this.width;
            }
        }
    };

	spcw.BackgroundRenderer.prototype.panStars = function(x, y){
		for (var i = 0; i < this.prop.stars.length; i++){
			var star = this.prop.stars[i];

			star.x += x / (spcw.STAR_DETACHMENT * star.layer);
			star.y += y / (spcw.STAR_DETACHMENT * star.layer);
		}
	};
    
    spcw.BackgroundRenderer.prototype.drawGrid = function (ctx,
        scrollX, scrollY, width, height)
    {
        var x, y;

        ctx.strokeStyle = '#99f';
        ctx.globalAlpha = 0.5;
        for (x = (100 - scrollX) % 100; x < width; x += 100) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (y = (100 - scrollY) % 100; y < height; y += 100) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    };
}());
