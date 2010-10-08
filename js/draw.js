(function () {
    /* Object responsible for rendering ships. A ShipRenderer is built for
    every ship in the game. */
    window.spcw.ShipRenderer = function () {
        this.explodeTimer = 0;
        this.collisionPoly = [
            [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
        ];
    };
    
    /*
        Gets a polygon representing the outline of a ship for
        collision-detection purposes.
        
        Parameters:
            {spcw.Box} box: Dimensions of ship in game coordinates
            {unsigned long} angle: Angle of ship in radians
    */
    window.spcw.ShipRenderer.prototype.getCollisionPoly = function (box,
        angle)
    {
        var centerX, centerY, cAngle;
    
        centerX = box.centerX();
        centerY = box.centerY();
        
        cAngle = spcw.clampAngle[angle];

        this.collisionPoly[0][0] = centerX + 31 * Math.cos(angle - 0.044);
        this.collisionPoly[0][1] = centerY + 31 * -Math.sin(angle - 0.044);
        this.collisionPoly[1][0] = centerX + 21 * Math.cos(angle + 0.873);
        this.collisionPoly[1][1] = centerY + 21 * -Math.sin(angle + 0.873);
        this.collisionPoly[2][0] = centerX + 28 * Math.cos(angle + 2.409);
        this.collisionPoly[2][1] = centerY + 28 * -Math.sin(angle + 2.409);
        this.collisionPoly[3][0] = centerX + 31 * Math.cos(angle - 3.089);
        this.collisionPoly[3][1] = centerY + 31 * -Math.sin(angle - 3.089);
        this.collisionPoly[4][0] = centerX + 30 * Math.cos(angle - 2.339);
        this.collisionPoly[4][1] = centerY + 30 * -Math.sin(angle - 2.339);
        this.collisionPoly[5][0] = centerX + 23 * Math.cos(angle - 0.942);
        this.collisionPoly[5][1] = centerY + 23 * -Math.sin(angle - 0.942);
    
        return this.collisionPoly;
    };

    /*
        Draws a ship to a canvas.
        
        Parameters:
            {CanvasRenderingContext2D} ctx: Pre-scaled canvas context
            {spcw.Box} box: Dimensions of ship in screen coordinates
            {unsigned long} angle: Angle of ship in range [0, 16) (see
                spcw.clampAngle in constants.js)
            {Boolean} forward: True if forward thrusters on
            {Boolean} left: True if left thrusters on
            {Boolean} right: True if right thrusters on
            {Boolean} npc: True if object to render is an AI-controlled ship
    */
    window.spcw.ShipRenderer.prototype.drawShip = function (ctx, box, angle,
        forward, left, right, npc)
    {
        ctx.drawImage(spcw.imgAsset[angle], box.x, box.y);

        if (npc) {
            ctx.fillStyle = '#f00';
            ctx.globalAlpha = 0.65;
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillRect(box.x, box.y, box.width, box.height);
        }
    };
    
    /*
        Draws an explosion to a canvas.
        
        Parameters:
            {CanvasRenderingContext2D} ctx: Pre-scaled canvas context.
            {spcw.Box} box: Dimensions of explosion in screen coordinates
    */
    window.spcw.ShipRenderer.prototype.drawExplosion = function (ctx, box) {
        var explodeFrame;
        
        if (this.explodeTimer > 5) {
            if (this.explodeTimer > 10) {
                this.explodeTimer = 0;
            }
            
            explodeFrame = 17;
        } else {
            explodeFrame = 18;
        }
        
        ctx.drawImage(spcw.imgAsset[explodeFrame], box.x, box.y);

        this.explodeTimer++;
    };
}());
