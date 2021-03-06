/**
 * @author RCordeiro
 */


var spiderEntity = me.Entity.extend({   
init: function(x, y, settings) {
//settings
	var settings = {};
	settings.type='mobs';
	settings.spritewidth = 24;
	settings.spriteheight = 24;
	settings.image = "creatures";
	settings.height = 24;
	settings.width = 24;
	this._super(me.Entity, 'init',[x, y, settings]);
	
// set prods
	this.hp = 100;
	this.damage = 10;
	this.hci = 10;
	this.body.collisionType = me.collision.types.ENEMY_OBJECT;
	this.body.setVelocity(0.5, 0.5);
	this.body.gravity = 0;
	this.updateme = true;
	this.collidable = true;
	this.direction = "left";
	this.spritedirection = "left";
	this.type = "mob";
	this.stage = "random"; //chase, attack, dead, respawn
	this.randomlenght = 0;
	this.timetospawn = 100+Math.round(Math.random()*100,0);
	this.respawnX=this.pos.x;
	this.respawnY=this.pos.y;
	this.sensedistance = 64;
	this.alwaysUpdate= true;
	
    //me.debug.renderHitBox = false;
    
    //animation
    this.renderable.addAnimation("walk",[266,286]);
	this.renderable.addAnimation("stand",[266]);
    this.renderable.addAnimation("dead",[466])
    this.renderable.setCurrentAnimation("stand");
    },

update: function(dt) { 		
	// do stage
		if (this.stage == "random")   this.doRandomWalk();
		if (this.stage == "chase")    this.doChaseWalk();
		if (this.stage == "attack")   this.doAttack();
		if (this.stage == "dead")     this.doDead();
		if (this.stage == "respawn")  this.doRespawn();
	
	// move
		if (this.direction == "right"){
			this.body.vel.x= this.body.accel.x * me.timer.tick;
			this.body.vel.y = 0;	
			this.renderable.angle = -1.57;
		};
		if (this.direction == "left"){
			this.body.vel.x= -this.body.accel.x * me.timer.tick
			this.body.vel.y = 0;
			this.renderable.angle = 1.57;
		};
		if (this.direction == "down"){
			this.body.vel.y= this.body.accel.y * me.timer.tick;
			this.body.vel.x = 0;	
			this.renderable.angle = 0;
		};
		if (this.direction == "up"){
			this.body.vel.y= -this.body.accel.y * me.timer.tick
			this.body.vel.x = 0;
			this.renderable.angle = 3.14;
		};
		if (this.direction == "stand"){
			this.body.vel.y = 0
			this.body.vel.x = 0;
			this.renderable.angle = 0;
		};

	// update animation if necessary	
	if (this.stage == 'dead') {
		if (!this.renderable.isCurrentAnimation("dead")) {
			this.renderable.setCurrentAnimation("dead");
		}
	};
	if (this.body.vel.x!=0 || this.body.vel.y!=0) {
		if (!this.renderable.isCurrentAnimation("walk")) {
		this.renderable.setCurrentAnimation("walk");
		}
		this.body.update(dt);
	} else {
		if (!this.renderable.isCurrentAnimation("stand")) {
		this.renderable.setCurrentAnimation("stand");
		}
	}
	
   
//
// check collision
//
//
me.collision.check(this);
// update player movement
return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
},
	
onCollision : function (response, other) {
	var colide = false;
	switch (response.b.body.collisionType) {
		case me.collision.types.WORLD_SHAPE:
			colide = true;
			this.randomlenght = 0;
			break;
		case me.collision.types.ENEMY_OBJECT:
			colide = false;
			break;
		case me.collision.types.ACTION_OBJECT:
			colide = false;
			break;
		case me.collision.types.PLAYER_OBJECT:
			response.b.doDamage(this, this.hci, this.damage);
			colide = true;
			break;
		default:
			colide = false;
	};
	return colide
},	

onInteract: function(obj){	
	this.updateme = true;	
},

doBounce: function(res,obj) {
	if (res.pos.x < 0 && obj.body.vel.x < 0){
		obj.body.vel.x = 0;
	};
	if (res.pos.x > 0 && obj.body.vel.x > 0){
		obj.body.vel.x = 0;
	}
	if (res.y<0 && obj.body.vel.y<0){
		obj.body.vel.y = 0;
	};
	if (res.y>0 && obj.body.vel.y>0){
		obj.body.vel.y = 0;
	}
},

doRandomWalk: function (){
   if (this.randomlenght == 0){
		this.randomlenght = 200 + Math.round(Math.random()*100,0);
		switch (Math.round(Math.random() * 4,0)){
			case 0: 
				this.direction="left";
				break;
			  case 1:
				this.direction="right";
				break;
			case 2:
				this.direction="up";
				break;
			case 3:
				this.direction="down";
				break;
	   }
   } else {
	   this.randomlenght -=1;
   };   
   // test if player is near
	var difx = (this.pos.x - player.pos.x)
	var dify = (this.pos.y - player.pos.y)
	var distplayer = Math.hypot(difx,dify);
	if (distplayer <= this.sensedistance) {
		this.stage = "chase"
	};  
},
   
doChaseWalk: function (){
   // find preference direction
   var difx = (this.pos.x - player.pos.x)
   var dify = (this.pos.y - player.pos.y)
   
   if (Math.abs(Math.abs(difx)-Math.abs(dify)) >= 16) {
	   if (Math.abs(difx) >= Math.abs(dify) && Math.abs(difx) > 16){
			if (difx >= 0) {
			  this.direction = "left"; 
			} else {
			  this.direction = "right";
			}
	   }
	   
	   if (Math.abs(dify) > Math.abs(difx) && Math.abs(dify) > 16) {
		   if (dify >= 0) {
			  this.direction = "up" 
			} else {
			  this.direction = "down"
			}
	   }
   }
	if(Math.abs(difx) <=8 && Math.abs(difx) <= 8){
		this.stage="attack"
	};
	// test if player is near
	var difx = (this.pos.x - player.pos.x)
	var dify = (this.pos.y - player.pos.y)
	var distplayer = Math.hypot(difx,dify);
	if (distplayer > this.sensedistance) {
		this.stage = "random"
	};    
},

doAttack: function(){
   this.stage="chase"
},

doDead: function(){
   //this.randomlenght = 0
   this.collidable = false;
   this.stance='dead'
   this.direction="stand";
   if (!this.renderable.isCurrentAnimation("dead")) {
		this.renderable.setCurrentAnimation("dead");
	}
   if (this.timetospawn == 0){
		this.stage = "respawn";
		this.timetospawn=100+Math.round(Math.random()*100,0);
   } else {
	   this.timetospawn -=1
   };
},
   
doRespawn: function(){
 this.pos.x =  (this.respawnX - 64) + (Math.random() * 128)
 this.pos.y =  (this.respawnY - 64) + (Math.random() * 128);
 this.direction ="left";
 this.stance ="normal";
 this.stage = "random";
 this.hp = Math.random() * 50;
 this.collidable = true;
},
  
doDamage: function(attacker,hci,damage) {
	// calculate hc and do damage;   		
	this.hp -= damage;
	// little bounce
	if (attacker.direction == "left") {
  this.pos.x-=10
	}; 
	if (attacker.direction == "right") {
  this.pos.x+=10
	};
	if (attacker.direction == "up") {
		this.pos.y-=10
	};
	if (attacker.direction == "down") { 
		this.pos.y+=10
	};
	// check if die
	if (this.hp<=0){
		this.stage = "dead"
		//me.game.remove(this);
	}
}

})
