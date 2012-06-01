/*------------------- 
a player entity
-------------------------------- */
var playerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
   
    init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    
    // set the walking  and gravity
    this.setVelocity(2, 2);
    this.gravity=0;
    this.direction = "left";
	this.stance = "normal";
	this.actionActive = false;
	this.swing = false;
	this.type = "player";

    me.debug.renderHitBox = false;
    
    //animation
    this.addAnimation("normal_up",[0,1,2,3]);
    this.addAnimation("normal_right",[4,5,6,7]);
    this.addAnimation("normal_down",[8,9,10,11]);
    this.addAnimation("normal_left",[12,13,14,15]);
    this.setCurrentAnimation(this.stance + "_" + this.direction);
    
    // adjust the bounding box x,w,y,h
    this.updateColRect(5,10 , 5, 10);
 
    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
    },
 
    /* -----
 
    update the player pos
 
    ------ */
   update: function() { 
		// Handle Inputs
		if (me.input.isKeyPressed('left')) {
		    this.doWalkHorizontal(true);
		} else if (me.input.isKeyPressed('right')) {
		    this.doWalkHorizontal(false);
		} else if (me.input.isKeyPressed('up')) {
			this.doWalkVertical(true);
		} else if (me.input.isKeyPressed('down')) {
			this.doWalkVertical(false);
		} else if (me.input.isKeyPressed('action')) {
			this.actionActive = true;
		} else {
			this.actionActive = false;
		    this.doStand();
		}
	    //
	    //
		// check collision
		//
		//
		this.swing = true;
		res = me.game.collide(this);
		if (res)
		{	
		    // enemy collition
		    if (res.obj.type == "enemy") {
		        this.swing = true;
		        res.obj.OnCollide(res,this);
		    }
		    // furniture collition
		    else if (res.obj.type == "furniture") {
                this.swing = true;
            }
		    // container collition
		    else if (res.obj.type == "container"){
		        this.swing = false;
    			// What do do if interacts
    			if (this.actionActive == true) {
    				res.obj.OnInteract(this);
    			};
    			// What to do if Collides
    			res.obj.OnCollide(res,this);
			}
			// npc
			else if (res.obj.type == "npc") {
			  this.swing = false;
			    
			}
			else {
			 this.swing = true;
			};
		};
		// check & update player movement
		this.updateMovement();
  		// update animation if necessary
	    if (this.vel.x!=0 || this.vel.y!=0) {
			if (this.vel.x > 0) {
			    this.direction="right";
			};
			if (this.vel.x < 0) {
			    this.direction="left";
			};
			if (this.vel.y > 0) {
			    this.direction="down";
			};
			if (this.vel.y < 0) {
			    this.direction="up";
			};
            this.setCurrentAnimation(this.stance + "_" + this.direction);
            this.parent(this);
            return true;
	   	} else {
		 	return false;
		};
	},
	 
    doWalkHorizontal : function(left) {
		this.vel.x += (left) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
    },
    
    doWalkVertical : function(up) {
		this.vel.y += (up) ? -this.accel.y * me.timer.tick : this.accel.y * me.timer.tick;
    },
    
    doStand : function(up) {
		this.vel.y = 0;
		this.vel.x = 0;
    }
}
);