/**
 * @author megadigo
 */
var bedEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
   
    init: function(x, y, settings) {
    // call the constructor
    this.parent(x, y, settings);
    
    // set the walking  and gravity
    
    //animation
    //this.addAnimation("normal_up",[0,1,2,3]);
    //this.addAnimation("normal_right",[4,5,6,7]);
    //this.addAnimation("normal_down",[8,9,10,11]);
    //this.addAnimation("normal_left",[12,13,14,15]);
    // this.setCurrentAnimation(stance + "_" + direction);
    
    // adjust the bounding box x,w,y,h
    //this.updateColRect(2,12 , 2, 5);

 
    },
 
    /* -----
 
    update the player pos
 
    ------ */
   update: function() { 
		
		
		// check & update player movement
		//this.updateMovement();
		return false; 
    }
}
)