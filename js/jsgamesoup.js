/*
 *	JSGameSoup v74, Copyright 2009 Chris McCormick
 *	
 *	LGPL version 3 (see COPYING for details)
 *	
 * 	Major missing features:
 *	
 * 	* Fast, robust collision detection (slow poly collisions are there)
 *	* Bitmap sprites
 *	* Sound
 *
 */


/**	@class JSGameSoup is the core jsgamesoup library. When the jsgamesoup.js script is loaded, it will attach a `new JSGameSoup()` instantiation to every canvas tag which has an attribute 'jsgs'. The attribute 'jsgs' specifies the name of the function which should be called to launch the game script associated with that canvas. The 'fps' attribute specifies the desired frame rate of the game engine for that canvas. Once the jsGameSoup engine has been attached to the canvas it starts running immediately. The jsGameSoup engine keeps a list of objects to update and draw every frame. In order to make things happen in your game, you should create objects and add them to the engine with the addEntity() method.
	@param canvas The canvas element, or the ID of the canvas element which this instance of JSGameSoup should attach itself to.
	@param framerate The number of frames per second the game will try to run at on this canvas.
*/
function JSGameSoup(canvas, framerate) {
	/** The number of frames that the app has been running for */
	this.frameCount = 0;
	/** How fast we are running in FPS */
	this.framerate = framerate;
	/** The current/last position of the pointer */
	this.pointerPosition = [0, 0];
	// where we will output the graphics
	if (typeof canvas == "string")
		this.canvas = document.getElementById(canvas);
	else
		this.canvas = canvas;
	// set the cursor to the pointer for IE to stop the flickering text cursor problem
	this.canvas.style.cursor = "default";
	this.ctx = this.canvas.getContext('2d');
	// stop the bug where lines on whole integers are blurred (processingjs fix)
	this.ctx.translate(0.5, 0.5);
	// we need a variable we can access from inside callbacks etc.
	var JSGS = this;
	// give us easy access to some variables
	this.width = parseInt(this.canvas.width);
	this.height = parseInt(this.canvas.height);
	
	/* ****************************
	 	Graphics helpers
	 ******************************/
	/** @namespace graphics */
	
	/** clear the frame. This is called automatically before each frame is drawn. */
	this.clear = function clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	/** 	Draw a polygon
		@param poly A list of 2-element lists (x,y) like [[x1, y1,], [x2, y2]...]
		@param open Whether this polygon is closed or not
		@tag graphics
	*/
	this.polygon = function polygon(poly, open) {
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.moveTo(poly[0][0], poly[0][1]);
		for (var n = 0; n < poly.length; n++) {
			this.ctx.lineTo(poly[n][0], poly[n][1]);
		}
		if (open)
			this.ctx.lineTo(poly[0][0], poly[0][1]);
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.restore();
	}
	
	/**	Fill in the background
		@param color Should be specified like a normal canvas color
		@tag graphics
	*/
	this.background = function background(color) {
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.restore();
	}
	
	/* ****************************
	 	Math helpers
	 ******************************/
	/** @namespace math */
	
	/**
		Returns a random real number between start and end
		@param start The lower bound of the real number to be chosen.
		@param end The upper bound of the real number to be chosen.
		@tag math
	*/
	this.random = function random(start, end) {
		return Math.random() * (end - start) + start;
	}
	
	/**
		Returns the distance between two points (two element arrays)
		@param a The first point.
		@param b The second point.
		@tag math
	*/
	this.distance = function distance(a, b) {
		return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
	}
	
	/* *************************
	 	Event handling
	 ***************************/
	
	// TODO: optimise this so that there are separate lists of entities for each type of event they listen to
	// event state variables
	this.heldKeys = {};
	
	// helper function to attach events in a cross platform way
	this.attachEvent = function attachEvent(name) {
		var boss = this.canvas;
		// for some reason key events don't work on the canvas in firefox
		if (name.indexOf("key") == 0)
			boss = document;
		if ( boss.addEventListener ) {
			boss.addEventListener(name, this["on" + name], false);
		} else if ( boss.attachEvent ) {
			boss.attachEvent("on" + name, this["on" + name]);
		} else {
			boss["on" + name] = this["on" + name];
		}
	}
	
	// we want to allow right clicks on the canvas without popping up a stupid menu
	this.oncontextmenu = function oncontextmenu(ev) {
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("contextmenu");
	
	// helper function to cancel an event
	this.cancelEvent = function cancelEvent(ev) {
		if (ev.stopPropagation)
			ev.stopPropagation();
		// otherwise set the cancelBubble property of the original event to true (IE)
		ev.cancelBubble = true; 
	}
	
	// get the position of the triggered event
	this.getSetPointerPosition = function getSetPointerPosition(ev) {
		// Get the mouse position relative to the canvas element.
		if (ev.layerX || ev.layerX == 0) { // Firefox
			mouseX = ev.layerX - canvas.offsetLeft;
			mouseY = ev.layerY - canvas.offsetTop;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
			mouseX = ev.offsetX;
			mouseY = ev.offsetY;
		} else {
			mouseX = ev.clientX - canvas.offsetLeft + scrollX;
			mouseY = ev.clientY - canvas.offsetTop + scrollY;
		}
		this.pointerPosition = [mouseX, mouseY];
		return this.pointerPosition;
	}
	
	/* ** Actual event handlers ** */
	
	// pointer pressed event
	this.onmousedown = function onmousedown(ev) {
		var ev = (ev) ? ev : window.event;
		JSGS.pointInEntitiesCall(JSGS.getSetPointerPosition(ev), "pointerDown", ev.button);
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("mousedown");
	
	// pointer released event
	this.onmouseup = function onmouseup(ev) {
		var ev = (ev) ? ev : window.event;
		JSGS.pointInEntitiesCall(JSGS.getSetPointerPosition(ev), "pointerUp", ev.button);
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("mouseup");
	
	// TODO: make this only check for entities which are listening with pointerMove().
	this.onmousemove = function onmousemove(ev) {
		var ev = (ev) ? ev : window.event;
		JSGS.pointInEntitiesCall(JSGS.getSetPointerPosition(ev), "pointerMove", ev.button);
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("mousemove");
	
	// TODO: add mouse ispressed "event"
	
	// TODO: pointer over event
	
	// TODO: pointer out event
	
	// key down event
	this.onkeydown = function onkeydown(ev) {
		var ev = (ev) ? ev : window.event;
		// call keyDown on entities who are listening
		if (!JSGS.heldKeys[ev.keyCode]) {
			JSGS.entitiesCall("keyDown", ev.keyCode);
			JSGS.entitiesCall("keyDown_" + ev.keyCode);
			JSGS.heldKeys[ev.keyCode] = true;
		}
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("keydown");
	
	// key up event
	this.onkeyup = function onkeyup(ev) {
		var ev = (ev) ? ev : window.event;
		// call keyUp on entities who are listening
		if (JSGS.heldKeys[ev.keyCode]) {
			JSGS.entitiesCall("keyUp", ev.keyCode);
			JSGS.entitiesCall("keyUp_" + ev.keyCode);
			JSGS.heldKeys[ev.keyCode] = false;
		}
		JSGS.cancelEvent(ev);
		return false;
	}
	this.attachEvent("keyup");
	
	/* *************************
	 	Entity helpers
	 ***************************/
	
	// any entity which wants to be run every frame
	// must implement an .update() method
	// any entity which wants to be drawn, must implement
	// a .draw() method
	// 
	// a pointerPoly() method can be defined which returns a list of points which
	// define where the object is on the screen for things like mouse clicks or finger touches
	// a pointerBox() method can be defined for the same thing, but in a square
	// a pointerCircle() method can be defined for the same thing but in a circle
	//
	// if 'priority' is defined in the entity, it will be used to order the update/draw
	// greater priority will be run first
	//
	// collisions:
	//
	// TODO: different types of collisions:
	//	circle, box, polygon
	// 	for pointer
	//	for entity-entity
	/** Array holding all game entities. Use addEntity() and delEntity() to modify it's elements. */
	var entities = [];
	var addEntities = [];
	var delEntities = [];
	
	// array for synchronously sending events to entities in the update loop
	// [ entity, method, arg ]
	var entityEventQueue = [];
	
	// different specialist lists
	var entitiesKeyHeld = [];
	var entitiesColliders = [];
	// TODO: entitiesPointerDown, entitiesPointerUp, entitiesPointerMove, entitiesKeyDown, entitiesKeyUp
	
	/**
		Add this game entity to our pool of entities (will happen synchronously after update() in the main loop)
		@param e The entity to be added to the jsGameSoup entity pool.
	*/
	this.addEntity = function addEntity(e) {
		addEntities.push(e);
	}
	
	/**
		Remove this entity from our pool of entities (will happen synchronously after update() in the main loop)
		@param e The entity to be removed from the jsGameSoup entity pool.
	*/
	this.delEntity = function delEntity(e) {
		delEntities.push(e);
	}
	
	/**
		Returns true if this entity is in our array of all game entities.
		@param e The entity which we want to check for in the jsGamesoup entity pool.
	*/
	this.inEntities = function inEntities(e) {
		// is this entity in our entity list?
		return entities.indexOf(e) >= 0;
	}
	
	this.addEntityToSpecialistLists = function addEntityToSpecialistLists(e) {
		// add this object to any specialist list to which it belongs
		for (var method in e) {
			// if this entity has an event listener for when certain keys are held down
			if (method.indexOf("keyHeld") == 0 && entitiesKeyHeld.indexOf(e) < 0) {
				entitiesKeyHeld.push(e);
			}
			// if this entity has any type of collision detection happening
			if (method.indexOf("collision") == 0 && entitiesColliders.indexOf(e) < 0) {
				entitiesColliders.push(e);
			}
		}
	}
	
	this.removeEntityFromSpecialistLists = function removeEntityFromSpecialistLists(e) {
		// clean this entity out of any special lists (above) to which it belongs
		entitiesKeyHeld.remove(e);
		entitiesColliders.remove(e);
	}
	
	/* ********************
	 	Main loop
	 **********************/
	
	// any entity which can collide with other entities
	// should provide a .collisionBox() method and can
	// possibly provide a .collisionPoly() method for finer grained collisions
	// of a .collisionCircle() method for circular collisions
	// .collisionBox() should return an array which looks like [x, y, width, height]
	// .collisionPoly() should return an array which looks like [(x1, y1), (x2, y2), (x3, y3), ....]
	// .collisionCircle() should return an array which looks like [x, y, r] where r is the circle radius
	
	/** This is our main game loop, which gets launched automatically with the launch() method. */
	this.gameSoupLoop = function gameSoupLoop() {
		// run .update() on every entity in our list
		for (var o=0; o<entities.length; o++) {
			if (entities[o].update) {
				entities[o].update(this);
			}
		}
		
		// get all the events out of the event queue and execute the event method on it's entity
		var ev = null;
		while (ev = entityEventQueue.pop())
			ev[0][ev[1]](ev[2]);
		
		// add any new entities which the user has added
		for (var o=0; o<addEntities.length; o++) {
			// TODO: sort entities by priority
			// TODO: make sublists of drawables to make the loops tighter
			// TODO: make sublists of updateables to make the loops tighter
			// TODO: make sublists of event handling entities
			entities.push(addEntities[o]);
			this.addEntityToSpecialistLists(addEntities[o]);
			if (addEntities[o].update) {
				addEntities[o].update(this);
			}
		}
		addEntities = [];
		
		// delete any entities the user has asked to remove
		for (var o=0; o<delEntities.length; o++) {
			entities.remove(delEntities[o]);
			this.removeEntityFromSpecialistLists(delEntities[o]);
		}
		delEntities = [];
		
		// test for held keys and send them to listening entities
		for (var o=0; o<entitiesKeyHeld.length; o++) {
			var hasHeld = false;
			for (var k in this.heldKeys) {
				if (this.heldKeys[k]) {
					this.callAll(entitiesKeyHeld, "keyHeld_" + k);
					hasHeld = true;
				}
			}
			if (hasHeld)
				this.callAll(entitiesKeyHeld, "keyHeld");
		}
		
		// test for collisions between objects which support collisions
		// TODO: do an RDC test on colliding entities first
		// TODO: support poly-on-poly collisions
		// TODO: support poly-on-circle collisions
		// TODO: support circle-on-circle collisions
		for (var o=0; o<entitiesColliders.length; o++) {
			for (var e=o; e<entitiesColliders.length; e++) {
				if (e != o) {
					if (this.collidePolyPoly(entitiesColliders[o].collisionPoly(), entitiesColliders[e].collisionPoly())) {
						if (entitiesColliders[o].collided)
							entitiesColliders[o].collided(entitiesColliders[e]);
						if (entitiesColliders[e].collided)
							entitiesColliders[e].collided(entitiesColliders[o]);
					}
				}
			}
		}
		
		// clear the background
		this.clear();
		// run .draw() on every entity in our list
		for (var o=0; o<entities.length; o++) {
			if (entities[o].draw) {
				this.ctx.save();
				entities[o].draw(this.ctx, this);
				this.ctx.restore();
			}
		}
		
		this.frameCount += 1;
	}
	
	/** Launch an instance of jsGameSoup (generally happens automatically). */
	this.launch = function launch() {
		var GS = this;
		// launch our custom loop
		looping = setInterval(function() {
			try {
				GS.gameSoupLoop()
			} catch(e) {
				clearInterval(looping);
				if (console)
					console.log(e);
				throw(e);
			}
		}, 1000 / this.framerate);
		// DEBUG:
		//setInterval(function() { for (var e=0; e<entities.length; e++) console.log(entities[e].x + ", " + entities[e].y); }, 1000);
		//setInterval(function() { console.log(entities.length) }, 1000);
		//setInterval(function() { console.log(entitiesColliders.length) }, 1000);
	}
	
	/* ********************************************
		Collisions and collision helpers
	 **********************************************/
	
	// TODO: use canvas isPointInPath instead, when it's supported by excanvas
	/* Detect whether a point is inside a polygon (list of points) or not */
	this.pointInPoly = function pointInPoly(pos, poly) {
		/* This code is patterned after [Franklin, 2000]
		http://www.geometryalgorithms.com/Archive/algorithm_0103/algorithm_0103.htm
		Tells us if the point is in this polygon */
		cn = 0
		pts = poly.slice();
		pts.push([poly[0][0], poly[0][1]]);
		for (var i=0; i<poly.length; i++)
			if (((pts[i][1] <= pos[1]) && (pts[i+1][1] > pos[1])) || ((pts[i][1] > pos[1]) && (pts[i+1][1] <= pos[1])))
				if (pos[0] < pts[i][0] + (pos[1] - pts[i][1]) / (pts[i+1][1] - pts[i][1]) * (pts[i+1][0] - pts[i][0]))
		cn += 1
		return cn % 2
	}
	
	/* Detect whether a point is inside a box or not */
	this.pointInBox = function pointInBox(pos, box) {
		return pos[0] >= box[0] && pos[0] <= box[2] && pos[1] >= box[1] && pos[1] <= box[3];
	}
	
	/* Detect whether a point is inside a circle */
	this.pointInCircle = function pointInCircle(pos, circle) {
		return this.distance(pos, circle.slice(0,2)) <= circle[2];
	}
	
	/* Detect if a line is touching a line */
	this.lineOnLine = function lineOnLine(l1, l2) {
		/* Detects the intersection of two lines
		   http://www.kevlindev.com/gui/math/intersection/Intersection.js
		*/
		var a1 = l1[0];
		var a2 = l1[1];
		var b1 = l2[0];
		var b2 = l2[1];
		var a1x = a1[0];
		var a1y = a1[1];
		var a2x = a2[0];
		var a2y = a2[1];
		var b1x = b1[0];
		var b1y = b1[1];
		var b2x = b2[0];
		var b2y = b2[1];
		
		var ua_t = (b2x - b1x) * (a1y - b1y) - (b2y - b1y) * (a1x - b1x);
		var ub_t = (a2x - a1x) * (a1y - b1y) - (a2y - a1y) * (a1x - b1x);
		var u_b  = (b2y - b1y) * (a2x - a1x) - (b2x - b1x) * (a2y - a1y);
		
		if (u_b) {
			var ua = ua_t / u_b;
			var ub = ub_t / u_b;
			
			if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
				// intersection
				return [a1x + ua * (a2x - a1x), a1y + ua * (a2y - a1y)];
			} else {
				return [];
			}
		} else {
			if (ua_t == 0 || ub_t == 0) {
				// coincident
				//return [line2]
				//this will be caught elsewhere anyway
				return [(a2x + a1x) / 2, (a2y + a1y) / 2];
			} else {
				// parallel
				return [];
			}
		}
	}
	
	// *** Actual collision routines ***
	/* Test whether two polygons are touching */
	this.collidePolyPoly = function collidePolyPoly(e1, e2) {
		var collided = false;
		for (var l1=0; l1<e1.length; l1++) {
			for (var l2=0; l2<e2.length; l2++) {
				if (this.lineOnLine([e1[l1], e1[(l1 + 1) % e1.length]], [e2[l2], e2[(l2 + 1) % e2.length]]).length) {
					collided = true;
				}
			}
		}
		return collided;
	}
	
	/* ***************************************
	 	Make calls on entity methods
	 *****************************************/
	
	// call a method on an entity if the point is inside the entity's polygon/circle/box
	// used in mouse events to send mouseDown and mouseUp events into the entity
	this.pointInEntitiesCall = function pointInEntitiesCall(pos, fn, arg, entityList) {
		if (!entityList)
			entityList = entities;
		for (var e=0; e<entityList.length; e++) {
			if (entityList[e][fn]) {
				if (entityList[e].pointerPoly && this.pointInPoly(pos, entityList[e].pointerPoly()))
					entityEventQueue.push([entityList[e], fn, arg]);
				if (entityList[e].pointerBox && this.pointInBox(pos, entityList[e].pointerBox()))
					entityEventQueue.push([entityList[e], fn, arg]);
				if (entityList[e].pointerCircle && this.pointInCircle(pos, entityList[e].pointerCircle()))
					entityEventQueue.push([entityList[e], fn, arg]);
			}
		}
	}
	
	// call a method on each entity for which that method exists
	// used for key events etc.
	this.entitiesCall = function entitiesCall(fn, arg) {
		this.callAll(entities, fn, arg);
	}
	
	// generalised form of entitiesCall which can be applied on any array of entities
	this.callAll = function callAll(arr, fn, arg) {
		for (var e=0; e<arr.length; e++) {
			if (arr[e][fn]) {
				entityEventQueue.push([arr[e], fn, arg]);
			}
		}
	}
}

	/* *****************************************
	 	Cross platform launching stuff
		(outside JSGameSoup definition)
	 *******************************************/

/**
 *	Helper function which is automatically called to launch JSGameSoup on a canvas.
 *
 *	Finds all canvas tags in the document,
 *	calls the function named in the attribute 'jsgs',
 *	passes a new JSGameSoup instance to that function,
 *	fps is set in the attribute called 'fps'.
 *
 *	Modified version of processingjs' init.js example script.
 *
 */

function FindAndLaunchCanvasJSGS() {
	var canvases = document.getElementsByTagName("canvas");
	for ( var i = 0; i < canvases.length; i++ ) {
		var launchfn = null;
		var launchfps = 15;
		if (canvases[i].getAttribute) {
			if (canvases[i].getAttribute('jsgs'))
				launchfn = canvases[i].getAttribute('jsgs');
			if (canvases[i].getAttribute('fps'))
				launchfps = canvases[i].getAttribute('fps');
		} else {
			if (canvases[i].jsgs)
				launchfn = canvases[i].jsgs;
			if (canvases[i].fps)
				launchfps = canvases[i].fps;
		}
		if (launchfn) {
			var gs = new JSGameSoup(canvases[i], launchfps);
			this[launchfn](gs);
			gs.launch();
		}
	}
}

// Crossplatform document.ready from here:
// http://dean.edwards.name/weblog/2006/06/again/#comment335794
function JSGS_init() {
  if (arguments.callee.done) return;
  arguments.callee.done = true;
  // MAIN LAUNCH
  FindAndLaunchCanvasJSGS();
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', JSGS_init, false);
}
(function() {
  /*@cc_on
  if (document.body) {
    try {
      document.createElement('div').doScroll('left');
      return JSGS_init();
    } catch(e) {}
  }
  /*@if (false) @*/
  if (/loaded|complete/.test(document.readyState)) return JSGS_init();
  /*@end @*/
  if (!JSGS_init.done) setTimeout(arguments.callee, 50);
})();
_prevOnload = window.onload;
window.onload = function() {
  if (typeof _prevOnload === 'function') _prevOnload();
  JSGS_init();
};

// cross platform multiple onload event attach as a last resort
// from http://simonwillison.net/2004/May/26/addLoadEvent/
var oldonload = window.onload;
if (typeof window.onload != 'function') {
	window.onload = func;
} else {
	window.onload = function() {
		if (oldonload) {
			oldonload();
		}
		JSGS_init();
	}
}

/*
 *	Random stuff to support IE.
 */
// this is from here:
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

/* Python style remove function */
if (!Array.prototype.remove) {
	Array.prototype.remove = function(el) {
		var p = this.indexOf(el);
		if (p>=0) {
			this.splice(p, 1);
		}
	}
}

