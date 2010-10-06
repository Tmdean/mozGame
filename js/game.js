spcw.World = function (gs) {
    this.screen_x = 0;
    this.screen_y = 0;
    this.screen_x2 = 0;
    this.screen_y2 = 0;
    this.visible_width = 0;
    this.visible_height = 0;
    this.screen_zoom = 0.2;
    this.anchors = [];
    this.gs = gs;
};

spcw.World.prototype.addAnchor = function (anchor) {
    this.anchors.push(anchor);
};

spcw.World.prototype.removeAnchor = function (anchor) {
    this.anchors.remove(anchor);
};

spcw.World.prototype.update = function (gs) {
    var min_x, min_y, mid_x, mid_y, max_x, max_y, i,
        screen_width, screen_height, zoom_inv;

    mid_x = 0;
    mid_y = 0;
    min_x = spcw.WORLD_WIDTH;
    min_y = spcw.WORLD_HEIGHT;
    max_x = 0;
    max_y = 0;
    
    for (i = 0; i < this.anchors.length; i++) {
        mid_x += this.anchors[i].x + this.anchors[i].width / 2;
        mid_y += this.anchors[i].y + this.anchors[i].height / 2;
        min_x = Math.min(min_x, this.anchors[i].x) - spcw.CAMERA_EDGE;
        min_y = Math.min(min_y, this.anchors[i].y) - spcw.CAMERA_EDGE;
        max_x = Math.max(max_x, this.anchors[i].x + this.anchors[i].width +
            spcw.CAMERA_EDGE);
        max_y = Math.max(max_y, this.anchors[i].y + this.anchors[i].height +
            spcw.CAMERA_EDGE);
    }

    mid_x /= this.anchors.length;
    mid_y /= this.anchors.length;

    screen_width = max_x - min_x + 1;
    screen_height = max_y - min_y + 1;

    /*this.screen_zoom = spcw.CAMERA_DAMP * this.screen_zoom + 
        (1 - spcw.CAMERA_DAMP) * Math.min(gs.width / screen_width,
            gs.height / screen_height);*/
    this.screen_zoom = 0.2;

    this.screen_x = spcw.CAMERA_DAMP * this.screen_x +
        (1 - spcw.CAMERA_DAMP) * (mid_x - (gs.width / this.screen_zoom) / 2);

    this.screen_y = spcw.CAMERA_DAMP * this.screen_y +
        (1 - spcw.CAMERA_DAMP) * (mid_y - (gs.height / this.screen_zoom) / 2);
    
    zoom_inv = 1 / this.screen_zoom;
    this.screen_x2 = this.screen_x + zoom_inv * gs.width;
    this.screen_y2 = this.screen_y + zoom_inv * gs.height;
};

spcw.World.prototype.scale = function (ctx) {
    ctx.scale(this.screen_zoom, this.screen_zoom);
};

spcw.World.prototype.translate_x = function (x, width) {
    var x2 = x + width;
    
    if ((x >= this.screen_x && x <= this.screen_x2) ||
        (x2 >= this.screen_x && x2 <= this.screen_x2))
    {
        return x - this.screen_x;
    } else {
        return x - this.screen_x + spcw.WORLD_WIDTH;
    }
};

spcw.World.prototype.translate_y = function (y, height) {
    var y2 = y + height;
    
    if ((y >= this.screen_y && y <= this.screen_y2) ||
        (y2 >= this.screen_y && y2 <= this.screen_y2))
    {
        return y - this.screen_y;
    } else {
        return y - this.screen_y + spcw.WORLD_HEIGHT;
    }
};

spcw.World.prototype.offset_x = function(x, dx) {
    var result;
    
    result = (x + dx) % spcw.WORLD_WIDTH;
    if (result < 0) {
        result = spcw.WORLD_WIDTH - result;
    }
    
    return result;
};

spcw.World.prototype.offset_y = function (y, dy) {
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
    this.width = 128;
    this.height = 128;
};

spcw.Planet.prototype.draw = function (c, gs) {
    if (spcw.assets_loaded) {
        c.save();
        this.world.scale(c);
        c.drawImage(spcw.img_asset[19],
            this.world.translate_x(this.x, this.width),
            this.world.translate_y(this.y, this.height));
        c.restore();
    }
};

spcw.Bullet = function (world, x, y, dx, dy) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = 8;
    this.height = 8;
    this.life = spcw.BULLET_LIFE;
    this.collide_poly = [ [0, 0], [0, 0], [0, 0], [0, 0] ];
};

spcw.Bullet.prototype.update = function (gs) {
    this.x = this.world.offset_x(this.x, this.dx);
    this.y = this.world.offset_y(this.y, this.dy);

    this.life--;
    if (this.life <= 0) gs.delEntity(this);
};

spcw.Bullet.prototype.draw = function (c, gs) {
    if (spcw.assets_loaded) {
        c.save();
        this.world.scale(c);
        c.drawImage(spcw.img_asset[16],
            this.world.translate_x(this.x, this.width),
            this.world.translate_y(this.y, this.height));
        c.restore();
    }
};

spcw.Bullet.prototype.collisionPoly = function () {
    var center_x, center_y, angle_a, angle_b, h;

    center_x = 2 * this.x + this.dx;
    if (dx < 0) {
        center_x -= this.width;
    } else {
        center_x += this.width;
    }
    center_x /= 2;

    center_y = 2 * this.y + this.dy;
    if (dy < 0) {
        center_y -= this.width;
    } else {
        center_y += this.height;
    }
    center_y /= 2;

    angle_a = Math.atan2(-this.dy, this.dx);
    angle_b = Math.atan2(4, spcw.BULLET_SPEED / 2);
    h = Math.sqrt(Math.pow(spcw.BULLET_SPEED / 2, 2) + 16);

    this.collide_poly[0][0] = center_x + h * Math.cos(angle_a + angle_b);
    this.collide_poly[0][1] = center_y + h * -Math.sin(angle_a + angle_b);
    this.collide_poly[1][0] = center_x + h * Math.cos(angle_a + Math.PI - angle_b);
    this.collide_poly[1][1] = center_y + h * -Math.sin(angle_a + Math.PI - angle_b);
    this.collide_poly[2][0] = center_x + h * Math.cos(angle_a + Math.PI + angle_b);
    this.collide_poly[2][1] = center_y + h * -Math.sin(angle_a + Math.PI + angle_b);
    this.collide_poly[3][0] = center_x + h * Math.cos(angle_a - angle_b);
    this.collide_poly[3][1] = center_y + h * -Math.sin(angle_a - angle_b);
    return this.collide_poly;
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
    this.delta_thet = 0;
    this.thrust = false;
    this.firing = false;

    this.img_index = 0;
    this.angle = Math.random() * spcw._2PI;
    this.x = Math.random() * (spcw.WORLD_WIDTH - 256) + 128;
    this.y = Math.random() * (spcw.WORLD_HEIGHT - 256) + 128;
    this.dx = 0;
    this.dy = 0;
    this.veloc = 0;
    this.width = 64;
    this.height = 64;
    this.fire_timeout = spcw.FIRING_DELAY;
    this.energy = 100;
    this.shield = 100;
    this.exploding = false;
    this.explode_frame = 0;
    this.explode_timeout = 0;
    this.collide_poly = [ [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0] ];

    if (!this.npc) {
        world.addAnchor(this);
    }

    if (!this.npc) {
        this.keyDown_37 = this.keyUp_39 = function () {
            this.delta_thet += spcw.TURN_SPEED;
        };

        this.keyUp_37 = this.keyDown_39 = function () {
            this.delta_thet -= spcw.TURN_SPEED;
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
    var bullet_x, bullet_y, bullet_dx, bullet_dy, c_angle, center_x, center_y;

    if (this.npc) {
        this.do_ai();
    }

    if (Math.abs(this.delta_thet) < 0.05) {
        this.delta_thet = 0;
    }

    this.angle += this.delta_thet;
    if (this.angle >= spcw._2PI) {
        this.angle -= spcw._2PI;
    }

    if (this.angle < 0) {
        this.angle += spcw._2PI;
    }

    this.img_index = Math.round(
        this.angle / (Math.PI / 8)) % 16;

    c_angle = spcw.clamp_angle[this.img_index];
    center_x = this.x + this.width / 2;
    center_y = this.y + this.height / 2;

    if (this.thrust && !this.exploding) {
        this.dx = (spcw.MAX_VELOC - this.veloc) * (this.dx / spcw.MAX_VELOC) + 
            this.veloc * Math.cos(c_angle)
        this.dy = (spcw.MAX_VELOC - this.veloc) * (this.dy / spcw.MAX_VELOC) + 
            this.veloc * -Math.sin(c_angle)
        this.veloc = Math.min(this.veloc + spcw.ACCEL_RATE, spcw.MAX_VELOC);
    } else {
        this.veloc = 0;
    }

    if (this.firing && !this.exploding &&
        this.fire_timeout <= 0 && this.energy >= spcw.BULLET_ENERGY)
    {
        bullet_x = center_x + Math.cos(c_angle) * 28 - 4;
        bullet_y = center_y - Math.sin(c_angle) * 28 - 4;
        bullet_dx = Math.cos(c_angle) * spcw.BULLET_SPEED + this.dx;
        bullet_dy = -Math.sin(c_angle) * spcw.BULLET_SPEED + this.dy;
        gs.addEntity(new spcw.Bullet(this.world, bullet_x, bullet_y,
            bullet_dx, bullet_dy));
        this.fire_timeout = spcw.FIRING_DELAY;
        this.energy -= spcw.BULLET_ENERGY;
    }

    this.energy = Math.min(100, this.energy + spcw.RECHARGE_RATE);

    if (this.shield < 0) {
        this.shield = 0;
        this.exploding = true;
        this.explode_timeout = 100;
    }

    if (this.exploding) {
        this.explode_frame = (this.explode_frame + 1) % 2;
        this.explode_timeout--;
        if (this.explode_timeout <= 0) {
            gs.delEntity(this);
            this.world.removeAnchor(this);
        }
    }

    if (this.npc) {
        $('#ai_weapons').width(Math.round(this.energy));
        $('#ai_shield').width(Math.round(this.shield));
    } else {
        $('#player_weapons').width(Math.round(this.energy));
        $('#player_shield').width(Math.round(this.shield));
    }

    if (this.fire_timeout > 0) {
        this.fire_timeout--;
    }

    this.x = this.world.offset_x(this.x, this.dx);
    this.y = this.world.offset_y(this.y, this.dy);
};

spcw.Ship.prototype.draw = function (c, gs) {
    if (!this.npc) {
        $('#delta_thet').text(this.delta_thet);
        $('#angle').text(this.angle);
        $('#img_index').text(this.img_index);
        $('#coord_x').text(this.x);
        $('#coord_y').text(this.y);
        $('#dx').text(this.dx);
        $('#dy').text(this.dy);
        $('#velocity').text(this.veloc);
    }

    if (spcw.assets_loaded) {
        c.save();
        this.world.scale(c);

        if (this.exploding) {
            c.drawImage(spcw.img_asset[17 + this.explode_frame],
                this.world.translate_x(this.x, this.width),
                this.world.translate_y(this.y, this.height));
        } else if (this.npc) {
            c.drawImage(spcw.img_asset[this.img_index],
                this.world.translate_x(this.x, this.width),
                this.world.translate_y(this.y, this.height));
            c.fillStyle = '#f00';
            c.globalAlpha = 0.65;
            c.globalCompositeOperation = 'source-atop';
            c.fillRect(this.world.translate_x(this.x, this.width),
                this.world.translate_y(this.y, this.height),
                this.width, this.height);
        } else {
            c.drawImage(spcw.img_asset[this.img_index],
                this.world.translate_x(this.x, this.width),
                this.world.translate_y(this.y, this.height));
        }
        c.restore();
    }
};

spcw.Ship.prototype.collisionPoly = function () {
    var center_x, center_y, c_angle;

    center_x = this.x + this.width / 2;
    center_y = this.y + this.height / 2;
    c_angle = spcw.clamp_angle[this.img_index];
    this.collide_poly[0][0] = center_x + 31 * Math.cos(c_angle - 0.044);
    this.collide_poly[0][1] = center_y + 31 * -Math.sin(c_angle - 0.044);
    this.collide_poly[1][0] = center_x + 21 * Math.cos(c_angle + 0.873);
    this.collide_poly[1][1] = center_y + 21 * -Math.sin(c_angle + 0.873);
    this.collide_poly[2][0] = center_x + 28 * Math.cos(c_angle + 2.409);
    this.collide_poly[2][1] = center_y + 28 * -Math.sin(c_angle + 2.409);
    this.collide_poly[3][0] = center_x + 31 * Math.cos(c_angle - 3.089);
    this.collide_poly[3][1] = center_y + 31 * -Math.sin(c_angle - 3.089);
    this.collide_poly[4][0] = center_x + 30 * Math.cos(c_angle - 2.339);
    this.collide_poly[4][1] = center_y + 30 * -Math.sin(c_angle - 2.339);
    this.collide_poly[5][0] = center_x + 23 * Math.cos(c_angle - 0.942);
    this.collide_poly[5][1] = center_y + 23 * -Math.sin(c_angle - 0.942);

    return this.collide_poly;
};

spcw.Ship.prototype.do_ai = function () {
    var player_x, player_y, this_x, this_y, dist, player_angle, angle_diff;

    player_x = spcw.player.x + spcw.player.width / 2;
    player_y = spcw.player.y + spcw.player.height / 2;
    this_x = this.x + this.width / 2;
    this_y = this.y + this.height / 2;

    player_angle = -Math.atan2(player_y - this_y, player_x - this_x);
    if (player_angle < 0) player_angle += spcw._2PI;

    angle_diff = spcw.clamp_angle[this.img_index] - player_angle;
    if (angle_diff < 0) angle_diff += spcw._2PI;

    if (Math.abs(angle_diff) > 0.393) {
        if (angle_diff < Math.PI) {
            this.delta_thet = -spcw.TURN_SPEED * 2;
        } else {
            this.delta_thet = spcw.TURN_SPEED * 2;
        }
    } else {
        this.delta_thet = 0;
    }

    dist = Math.sqrt(
        Math.pow(this_x - player_x, 2) +
        Math.pow(this_y - player_y, 2));

    if (dist > 700) {
        if (angle_diff < 0.314) {
            this.thrust = true;
        } else {
            this.thrust = false;
        }
        this.firing = false;
    } else {
        this.thrust = false;
        if (Math.abs(angle_diff) < 0.224) {
            this.firing = true;
        } else {
            this.firing = false;
        }
    }
};