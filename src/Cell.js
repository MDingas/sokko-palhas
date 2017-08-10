
/*
 * A single cell, a board is constituted by multiple cells
 *
 */

function Cell(x,y,w){
    this.isBackground = false;
    this.isPlayer = false;
    this.isFloor = false;
    this.isCrate = false;
    this.isGoal = false;
    this.isBox = false;
    this.x = x; /* x cord */
    this.y = y; /* y cord */
    this.w = w; /* width */
}

Cell.prototype.show = function(){

    if(this.isBox && this.isGoal){
        image(floor,this.x,this.y,this.w,this.w);
        image(recipiente,this.x,this.y,this.w,this.w);
        image(superBock,this.x,this.y,this.w,this.w);
    }else if(this.isPlayer){
        image(floor,this.x,this.y,this.w,this.w);
        image(palhas,this.x,this.y,this.w,this.w);
    }else if(this.isBox){
        image(floor,this.x,this.y,this.w,this.w);
        image(superBock,this.x,this.y,this.w,this.w);
    }else if(this.isGoal){
        image(floor,this.x,this.y,this.w,this.w);
        image(recipiente,this.x,this.y,this.w,this.w);
    }else if(this.isCrate){
        image(caixa,this.x,this.y,this.w,this.w);
    }else if(this.isBackground){
        image(background,this.x,this.y,this.w,this.w);
    }else{
        image(floor,this.x,this.y,this.w,this.w);
    }
}
