spcw.World = function (gs) {
    this.screenX = 0;
    this.screenY = 0;
    this.screenX2 = 0;
    this.screenY2 = 0;
    this.screenZoom = 0.2;
    this.anchors = [];
    this.anchorCount = 0;
    this.gs = gs;
    this.anim = new spcw.BackgroundRenderer(spcw.WORLD_WIDTH,
        spcw.WORLD_HEIGHT);
    this.lastFrame = new Date().getTime();
};

spcw.World.prototype.addAnchor = function (anchor) {
    this.anchorCount++;
    this.anchors.push({
        obj: anchor,
        xOffs: 0,
        yOffs: 0
    });
    this.anchors.push({
        obj: anchor,
        xOffs: spcw.WORLD_WIDTH,
        yOffs: spcw.WORLD_HEIGHT
    });
};

spcw.World.prototype.removeAnchor = function (anchor) {
    var i;
    
    this.anchorCount--;
    
    i = 0;
    while (i < this.anchors.length) {
        if (this.anchors[i].obj === anchor) {
            this.anchors.splice(i, 1);
        } else {
            i++;
        }
    }
};

spcw.compareByX = function (a, b) {
    return a.midX - b.midX;
};

spcw.compareByY = function (a, b) {
    return a.midY - b.midY;
};

spcw.World.prototype.findMinExtent = function (cmp) {
    var arr, i, len, minWidth, minIndex, width;
    
    minIndex = 0;
    arr = this.anchors;

    if (arr.length > 0) {    
        len = this.anchorCount;
        
        minWidth = cmp(arr[len - 1], arr[0]);
        for (i = 1; i < len; i++) {
            width = cmp(arr[len + i - 1], arr[i]);
            if (width < minWidth) {
                minWidth = width;
                minIndex = i;
            }
        }
    }
    
    return minIndex;
};

spcw.World.prototype.update = function (gs) {
    var i, anchor, minExtent, minX, midX, maxX, minY, midY, maxY, newZoom,
        newX, newY, screenWidth, screenHeight, zoomInv;
    
    if (!$('#auto-camera:checked').length) return;

    for (i = 0; i < this.anchors.length; i++) {
        anchor = this.anchors[i];
        anchor.minX = anchor.obj.x + anchor.xOffs;
        anchor.minY = anchor.obj.y + anchor.yOffs;
        anchor.midX = anchor.minX + anchor.obj.width / 2;
        anchor.midY = anchor.minY + anchor.obj.height / 2;
        anchor.maxX = anchor.minX + anchor.obj.width + spcw.CAMERA_EDGE;
        anchor.maxY = anchor.minY + anchor.obj.height + spcw.CAMERA_EDGE;
        anchor.minX -= spcw.CAMERA_EDGE;
        anchor.minY -= spcw.CAMERA_EDGE;
    }
    
    this.anchors.sort(spcw.compareByX);
    minExtent = this.findMinExtent(spcw.compareByX);
    
    minX = spcw.WORLD_WIDTH;
    midX = 0;
    maxX = 0;
    for (i = 0; i < this.anchorCount; i++) {
        anchor = this.anchors[i + minExtent];
        minX = Math.min(minX, anchor.minX);
        midX += anchor.midX;
        maxX = Math.max(maxX, anchor.maxX);
    }
    midX /= this.anchorCount;
    
    this.anchors.sort(spcw.compareByY);
    minExtent = this.findMinExtent(spcw.compareByY);
    
    minY = spcw.WORLD_HEIGHT;
    midY = 0;
    maxY = 0;
    for (i = 0; i < this.anchorCount; i++) {
        anchor = this.anchors[i + minExtent];
        minY = Math.min(minY, anchor.minY);
        midY += anchor.midY;
        maxY = Math.max(maxY, anchor.maxY);
    }
    midY /= this.anchorCount;
    
    screenWidth = maxX - minX + 1;
    screenHeight = maxY - minY + 1;

    newZoom = Math.max(spcw.CAMERA_MIN_ZOOM, Math.min(gs.width / screenWidth,
        gs.height / screenHeight));
    newX = midX - (gs.width / this.screenZoom) / 2;
    newY = midY - (gs.height / this.screenZoom) / 2;
   
    if (Math.abs(this.screenX + spcw.WORLD_WIDTH - newX) <
        Math.abs(this.screenX - newX))
    {
        this.screenX += spcw.WORLD_WIDTH;
    }
    
    if (Math.abs(this.screenX - spcw.WORLD_WIDTH - newX) <
        Math.abs(this.screenX - newX))
    {
        this.screenX -= spcw.WORLD_WIDTH;
    }
    
    if (Math.abs(this.screenY + spcw.WORLD_HEIGHT - newY) <
        Math.abs(this.screenY - newY))
    {
        this.screenY += spcw.WORLD_HEIGHT;
    }
    
    if (Math.abs(this.screenY - spcw.WORLD_HEIGHT - newY) <
        Math.abs(this.screenY - newY))
    {
        this.screenY -= spcw.WORLD_HEIGHT;
    }
    
    this.screenZoom = spcw.CAMERA_DAMP * this.screenZoom + 
        (1 - spcw.CAMERA_DAMP) * newZoom;

    this.screenX = spcw.CAMERA_DAMP * this.screenX +
        (1 - spcw.CAMERA_DAMP) * newX;

    this.screenY = spcw.CAMERA_DAMP * this.screenY +
        (1 - spcw.CAMERA_DAMP) * newY;
    
    if (this.screenX < 0) {
        this.screenX += spcw.WORLD_WIDTH;
    }
    
    if (this.screenX >= spcw.WORLD_WIDTH) {
        this.screenX -= spcw.WORLD_WIDTH;
    }
    
    if (this.screenY < 0) {
        this.screenY += spcw.WORLD_HEIGHT;
    }
    
    if (this.screenY >= spcw.WORLD_HEIGHT) {
        this.screenY -= spcw.WORLD_HEIGHT;
    }
    
    zoomInv = 1 / this.screenZoom;
    this.screenX2 = this.screenX + zoomInv * gs.width;
    this.screenY2 = this.screenY + zoomInv * gs.height;
    this.updateDebugInfo();
};

spcw.World.prototype.updateDebugInfo = function () {
    var $gameArea, $screenArea, gameAreaOffset, width, height, x1, y1, x2, y2;
    
    $gameArea = $('#game-area');
    gameAreaOffset = $gameArea.offset();
    
    width = $gameArea.width() / spcw.WORLD_WIDTH;
    height = $gameArea.height() / spcw.WORLD_HEIGHT;
    x1 = Math.round(this.screenX * width);
    y1 = Math.round(this.screenY * height);
    x2 = Math.round(this.screenX2 * width);
    y2 = Math.round(this.screenY2 * height);
    $screenArea = $('#screen-area');
    $screenArea.offset({
        left: x1 + gameAreaOffset.left,
        top: y1 + gameAreaOffset.top});
    $screenArea.width(x2 - x1);
    $screenArea.height(y2 - y1);
    
    $('#screen-x').text(this.screenX.toFixed(3));
    $('#screen-y').text(this.screenY.toFixed(3));
    $('#fps').text((1000 / (new Date().getTime() - this.lastFrame)).toFixed(3));
    this.lastFrame = new Date().getTime();
};

spcw.World.prototype.draw = function (c, gs) {
    c.save();
    this.scale(c);
    this.anim.drawBackground(c, this.screenX, this.screenY,
        this.screenX2, this.screenY2);
    c.restore();
};

spcw.World.prototype.scale = function (ctx) {
    ctx.scale(this.screenZoom, this.screenZoom);
};

spcw.World.prototype.translateX = function (x, width) {
    var x2 = x + width;
    
    if ((x >= this.screenX && x <= this.screenX2) ||
        (x2 >= this.screenX && x2 <= this.screenX2))
    {
        return x - this.screenX;
    } else {
        return x - this.screenX + spcw.WORLD_WIDTH;
    }
};

spcw.World.prototype.translateY = function (y, height) {
    var y2 = y + height;
    
    if ((y >= this.screenY && y <= this.screenY2) ||
        (y2 >= this.screenY && y2 <= this.screenY2))
    {
        return y - this.screenY;
    } else {
        return y - this.screenY + spcw.WORLD_HEIGHT;
    }
};

spcw.World.prototype.offsetX = function(x, dx) {
    var result;
    
    result = (x + dx) % spcw.WORLD_WIDTH;
    if (result < 0) {
        result = spcw.WORLD_WIDTH - result;
    }
    
    return result;
};

spcw.World.prototype.offsetY = function (y, dy) {
    var result;
    
    result = (y + dy) % spcw.WORLD_HEIGHT;
    if (result < 0) {
        result = spcw.WORLD_HEIGHT - result;
    }
    
    return result;
};

spcw.Planet = function (world) {
    this.world = world;

    this.x = Math.round(spcw.WORLD_WIDTH / 2 - 64);
    this.y = Math.round(spcw.WORLD_HEIGHT / 2 - 64);

    this.anim = new spcw.PlanetRenderer();

    this.box = new spcw.Box();
    this.width = this.box.width = this.anim.width;
    this.height = this.box.height = this.anim.height;
};

spcw.Planet.prototype.draw = function (c, gs) {
    this.box.x = this.world.translateX(this.x, this.box.width);
    this.box.y = this.world.translateY(this.y, this.box.height);

    c.save();
    this.world.scale(c);
    this.anim.drawPlanet(c, this.box);
    c.restore();
};

spcw.Bullet = function (world, x, y, dx, dy) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.anim = new spcw.BulletRenderer();
    this.box = new spcw.Box();
    this.width = this.box.width = this.anim.width;
    this.height = this.box.height = this.anim.height;
    this.life = spcw.BULLET_LIFE;
    this.collidePoly = [ [0, 0], [0, 0], [0, 0], [0, 0] ];
};

spcw.Bullet.prototype.update = function (gs) {
    this.x = this.world.offsetX(this.x, this.dx);
    this.y = this.world.offsetY(this.y, this.dy);

    this.life--;
    if (this.life <= 0) gs.delEntity(this);
};

spcw.Bullet.prototype.draw = function (c, gs) {
    c.save();
    this.world.scale(c);
    this.box.x = this.world.translateX(this.x, this.width);
    this.box.y = this.world.translateY(this.y, this.height);
    this.anim.drawBullet(c, this.box);
    c.restore();
};

spcw.Bullet.prototype.collisionPoly = function () {
    this.box.x = this.x;
    this.box.y = this.y;
    
    return this.anim.getCollisionPoly(this.box, this.dx, this.dy);
};

spcw.Bullet.prototype.collided = function (other) {
    if (other === spcw.player) {
        spcw.player.shield -= spcw.BULLET_DAMAGE;
        this.world.gs.delEntity(this);
    } else if (other === spcw.ai) {
        spcw.ai.shield -= spcw.BULLET_DAMAGE;
        this.world.gs.delEntity(this);
    }
};

spcw.Ship = function (world, npc) {
    this.world = world;
    this.npc = npc;
    
    /* input/AI-controlled properties */
    this.deltaThet = 0;
    this.thrust = false;
    this.firing = false;

    this.imgIndex = 0;
    this.angle = Math.random() * spcw._2PI;
    this.x = Math.random() * (spcw.WORLD_WIDTH - 256) + 128;
    this.y = Math.random() * (spcw.WORLD_HEIGHT - 256) + 128;
    this.width = 64;
    this.height = 64;
    this.dx = 0;
    this.dy = 0;
    this.veloc = 0;
    this.fireTimeout = spcw.FIRING_DELAY;
    this.energy = 100;
    this.shield = 100;
    this.exploding = false;
    this.explodeFrame = 0;
    this.explodeTimeout = 0;

    this.box = new spcw.Box();
    this.box.width = this.width;
    this.box.height = this.height;
    this.anim = new spcw.ShipRenderer(npc);

    world.addAnchor(this);

    if (!this.npc) {
        this.keyDown_37 = this.keyUp_39 = function () {
            this.deltaThet += spcw.TURN_SPEED;
        };

        this.keyUp_37 = this.keyDown_39 = function () {
            this.deltaThet -= spcw.TURN_SPEED;
        };

        this.keyDown_38 = this.keyUp_38 = function() {
            this.thrust = !this.thrust;
        };

        this.keyDown_88 = this.keyDown_32 = this.keyUp_32 = 
            this.keyUp_88 = function ()
        {
            this.firing = !this.firing;
        };
    }
};

spcw.Ship.prototype.update = function (gs) {
    var bulletX, bulletY, bulletDX, bulletDY, cAngle, centerX, centerY;
    
    if (!$('#update-ships:checked').length) return;

    if (this.npc) {
        this.doAi();
    }

    if (Math.abs(this.deltaThet) < 0.05) {
        this.deltaThet = 0;
    }

    this.angle += this.deltaThet;
    if (this.angle >= spcw._2PI) {
        this.angle -= spcw._2PI;
    }

    if (this.angle < 0) {
        this.angle += spcw._2PI;
    }

    this.imgIndex = Math.round(this.angle / (Math.PI / 8)) % 16;

    cAngle = spcw.clampAngle[this.imgIndex];
    centerX = this.x + this.width / 2;
    centerY = this.y + this.height / 2;

    if (this.thrust && !this.exploding) {
        this.dx = (spcw.MAX_VELOC - this.veloc) * (this.dx / spcw.MAX_VELOC) + 
            this.veloc * Math.cos(cAngle)
        this.dy = (spcw.MAX_VELOC - this.veloc) * (this.dy / spcw.MAX_VELOC) + 
            this.veloc * -Math.sin(cAngle)
        this.veloc = Math.min(this.veloc + spcw.ACCEL_RATE, spcw.MAX_VELOC);
    } else {
        this.veloc = 0;
    }

    if (this.firing && !this.exploding &&
        this.fireTimeout <= 0 && this.energy >= spcw.BULLET_ENERGY)
    {
        bulletX = centerX + Math.cos(cAngle) * 28 - 4;
        bulletY = centerY - Math.sin(cAngle) * 28 - 4;
        bulletDX = Math.cos(cAngle) * spcw.BULLET_SPEED + this.dx;
        bulletDY = -Math.sin(cAngle) * spcw.BULLET_SPEED + this.dy;
        gs.addEntity(new spcw.Bullet(this.world, bulletX, bulletY,
            bulletDX, bulletDY));
        this.fireTimeout = spcw.FIRING_DELAY;
        this.energy -= spcw.BULLET_ENERGY;
    }

    this.energy = Math.min(100, this.energy + spcw.RECHARGE_RATE);

    if (this.shield <= 0 && !this.exploding) {
        this.shield = 0;
        this.exploding = true;
        this.explodeTimeout = 100;
        this.anim.beginExplosion(cAngle);
    }

    if (this.exploding) {
        this.explodeFrame = (this.explodeFrame + 1) % 2;
        this.explodeTimeout--;
        if (this.explodeTimeout <= 0) {
            gs.delEntity(this);
            this.world.removeAnchor(this);
        }
    }

    if (this.npc) {
        $('#ai-weapons').width(Math.round(this.energy));
        $('#ai-shield').width(Math.round(this.shield));
    } else {
        $('#player-weapons').width(Math.round(this.energy));
        $('#player-shield').width(Math.round(this.shield));
    }

    if (this.fireTimeout > 0) {
        this.fireTimeout--;
    }

    this.x = this.world.offsetX(this.x, this.dx);
    this.y = this.world.offsetY(this.y, this.dy);
};

spcw.Ship.prototype.draw = function (c, gs) {
    if (!this.npc) {
        $('#delta-thet').text(this.deltaThet.toFixed(3));
        $('#angle').text(this.angle.toFixed(3));
        $('#img-index').text(this.imgIndex.toFixed(3));
        $('#coord-x').text(this.x.toFixed(3));
        $('#coord-y').text(this.y.toFixed(3));
        $('#dx').text(this.dx.toFixed(3));
        $('#dy').text(this.dy.toFixed(3));
        $('#velocity').text(this.veloc.toFixed(3));
    }
    
    this.box.x = this.world.translateX(this.x, this.width);
    this.box.y = this.world.translateY(this.y, this.height);

    c.save();
    this.world.scale(c);

    if (this.exploding) {
        this.anim.drawExplosion(c, this.box);
    } else {
        this.anim.drawShip(c, this.box, this.imgIndex, this.thrust,
            this.deltaThet > 0, this.deltaThet < 0, this.npc);
    }
    c.restore();
};

spcw.Ship.prototype.collisionPoly = function () {
    this.box.x = this.x;
    this.box.y = this.y;
    
    return this.anim.getCollisionPoly(this.box, spcw.clampAngle[this.imgIndex]);
};

spcw.Ship.prototype.doAi = function () {
    var playerX, playerY, thisX, thisY, dist, playerAngle, angleDiff;

    playerX = spcw.player.x + spcw.player.width / 2;
    playerY = spcw.player.y + spcw.player.height / 2;
    thisX = this.x + this.width / 2;
    thisY = this.y + this.height / 2;

    playerAngle = -Math.atan2(playerY - thisY, playerX - thisX);
    if (playerAngle < 0) playerAngle += spcw._2PI;

    angleDiff = spcw.clampAngle[this.imgIndex] - playerAngle;
    if (angleDiff < 0) angleDiff += spcw._2PI;

    if (Math.abs(angleDiff) > 0.393) {
        if (angleDiff < Math.PI) {
            this.deltaThet = -spcw.TURN_SPEED * 2;
        } else {
            this.deltaThet = spcw.TURN_SPEED * 2;
        }
    } else {
        this.deltaThet = 0;
    }

    dist = Math.sqrt(
        Math.pow(thisX - playerX, 2) +
        Math.pow(thisY - playerY, 2));

    if (dist > 700) {
        if (angleDiff < 0.314) {
            this.thrust = true;
        } else {
            this.thrust = false;
        }
        this.firing = false;
    } else {
        this.thrust = false;
        if (Math.abs(angleDiff) < 0.224) {
            this.firing = true;
        } else {
            this.firing = false;
        }
    }
};
