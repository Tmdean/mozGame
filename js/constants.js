/* Namespace for global variables */
window.spcw = {};

spcw._2PI = 2 * Math.PI;

/* 16 equally-spaced angles from 0 to 2*PI
   Used to map an integer in the range [0, 16) to an angle. */
spcw.clampAngle = [
    0,
    Math.PI / 8,
    Math.PI / 4,
    3 * Math.PI / 8,
    Math.PI / 2,
    5 * Math.PI / 8,
    3 * Math.PI / 4,
    7 * Math.PI / 8,
    Math.PI,
    9 * Math.PI / 8,
    5 * Math.PI / 4,
    11 * Math.PI / 8,
    3 * Math.PI / 2,
    13 * Math.PI / 8,
    7 * Math.PI / 4,
    15 * Math.PI / 8
];

/* Ship turn rate in radians per frame. */
spcw.TURN_SPEED = 0.05;

/* Ship velocity rate of increase per frame. */
spcw.ACCEL_RATE = 0.15;

/* Maximum ship velocity. */
spcw.MAX_VELOC = 7.5;

/* Dimensions of world. */
spcw.WORLD_WIDTH = 5000;
spcw.WORLD_HEIGHT = 3750;

/* Value in range [0, 1.0) determining how floaty the camera is.
   New camera position/zoom is determined by the following formula.
       CAMERA_DAMP * OLD_POSITION + (1 - CAMERA_DAMP) * NEW_POSITION */
spcw.CAMERA_DAMP = 0.9;

/* Margin of arena to show around the camera tracked objects in pixels. */
spcw.CAMERA_EDGE = 128;

/* Maximum zoomed out amount. This should be greater than 
   canvas_size / world_size */
spcw.CAMERA_MIN_ZOOM = 0.2;

/* Bullet velocity in pixels per frame. */
spcw.BULLET_SPEED = 17.5;

/* Bullet lifetime in frames. */
spcw.BULLET_LIFE = 40;

/* Amount of energy required to fire a bullet. */
spcw.BULLET_ENERGY = 20;

/* Bullet damage amount. */
spcw.BULLET_DAMAGE = 15;

/* Energy recharge amount per frame. */
spcw.RECHARGE_RATE = 0.2;

/* Delay between bullet firings in frames. */
spcw.FIRING_DELAY = 10;
