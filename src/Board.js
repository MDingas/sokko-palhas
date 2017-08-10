/*
 * Board where the game takes place
 *
 *
 */

/*
 * TODO
 *
 * replace all instances of cellNumx with MAXSIZE
 *
 */

function Board(){

    /* Instance variables */
    var sketch = new Sketch();                       /* class where i get the bomb gif */
    var bombGif = sketch.gif;                        /* gif of bomb counting down */
    var MAXSIZE = 30;                                /* max number of cells on grid */
    var cellNumx = 15;                               /* max number of cells in the y diretion */
    var cellNumy = 15;                               /* max number of cells on the x direction */
    var goalNr = 0;                                  /* number of box/recipient pairs */
    this.bombStock = AuxFun.bombStock();             /* total bomb stock for each lvl */
    this.steps = 0;                                  /* steps taken by player */
    this.restarts = 0;                               /* number of times player restarted */
    this.grid = AuxFun.make2DArray(MAXSIZE,MAXSIZE); /* grid of game cells */
    this.levelList = AuxFun.levelList();             /* list of char levels to be loaded */
    this.currLvl = 0;
    this.cellWidth = 1900 / cellNumy;
    this.playerx;                                    /* Current x cord of the player */
    this.playery;                                    /* Current y cord of the player */
    this.stock = this.bombStock[this.currLvl];       /* bomb stock at certain level */

    /* Constructor */

    for(var i = 0; i < MAXSIZE; i++){
        for(var j = 0; j < MAXSIZE; j++){
            this.grid[i][j] = new Cell(i*this.cellWidth,j*this.cellWidth,this.cellWidth);
        }
    }

    this.populateBoard = function(matrix){
        for(var i = 0; i < cellNumx; i++){
            for(var j = 0; j < cellNumy; j++){
                var curr = matrix[i][j];

                if(curr == '-'){
                    this.grid[i][j].isBackground = true;
                }else if(curr == ' '){
                    this.grid[i][j].isFloor = true;
                }else if(curr == '#'){
                    this.grid[i][j].isCrate = true;
                }else if(curr == 'c'){
                    this.grid[i][j].isBox = true;
                }else if(curr == '.'){
                    this.grid[i][j].isGoal = true;
                    goalNr++;
                }else if(curr == 'o'){
                    this.grid[i][j].isPlayer = true;
                    this.playerx = i;
                    this.playery = j;
                }else if(curr == 'C'){
                    goalNr++;
                    this.grid[i][j].isBox = true;
                    this.grid[i][j].isGoal = true;
                }

            }
        }
    }

    this.cleanBoard = function(){
        for(var i = 0; i < MAXSIZE; i++){
            for(var j = 0; j < MAXSIZE; j++){
                this.grid[i][j].isBackground = false;
                this.grid[i][j].isPlayer = false;
                this.grid[i][j].isFloor = false;
                this.grid[i][j].isCrate = false;
                this.grid[i][j].isGoal = false;
                this.grid[i][j].isBox = false;
            }
        }
        goalNr = 0;
    }

    /* Begin game */
    this.cleanBoard();
    this.populateBoard(this.levelList[0]);

    /* Methods */

    /* Is the move about to be made legal? */
    this.isLegalPos = function(x,y,i,j){
        return (! /* the following can't happen */
                (   x < 0 || y < 0                                          /* before the first lines */
                 || this.grid[x][y].isBackground                            /* cant go beyond the grid, even after exploding a bomb */
                 || x >= cellNumx || y >= cellNumy                          /* after the last lines */
                 || this.grid[x][y].isCrate                                 /* step into a crate */
                 || (this.grid[x+i][y+j].isCrate && this.grid[x][y].isBox)  /* move a box if there's a crate in its way */
                 || (this.grid[x+i][y+j].isBox && this.grid[x][y].isBox))); /* move a box if there's a box in its way */
    }

    this.updatePosition = function(x,y){
        if(this.isLegalPos(this.playerx + x,this.playery + y,x,y)){
            this.grid[this.playerx][this.playery].isPlayer = false;
            this.grid[this.playerx + x][this.playery + y].isPlayer = true;
            if(this.grid[this.playerx + x][this.playery + y].isBox){
                this.grid[this.playerx + x]  [this.playery + y].isBox = false;
                this.grid[this.playerx+(2*x)][this.playery+(2*y)].isBox = true;
            }
            this.playerx += x;
            this.playery += y;
            this.steps++;
        }
    }

    this.show = function(){
        if(!this.isFinished()){
            for(var i = 0; i < cellNumx; i++){
                for(var j = 0; j < cellNumy; j++){
                    this.grid[i][j].show();
                }
            }
        }
        else{
            if(++this.currLvl  == this.levelList.length - 1)
                puta_end.play();
            else
                puta.play();

            this.cleanBoard();
            this.populateBoard(this.levelList[this.currLvl]);
            this.stock = this.bombStock[this.currLvl];
            removeMedia();
        }
    }

    this.isFinished = function(){
        var finishedCells = 0;
        for(var i = 0; i < cellNumx; i++){
            for(var j = 0; j < cellNumy; j++)
                if(this.grid[i][j].isBox && this.grid[i][j].isGoal)
                    finishedCells++;
        }

        return(finishedCells == goalNr);
    }

    this.addBombToGrid = function(){
        this.grid[this.playerx][this.playery].isFloor = true; /* Make the bomb behave like a crate, meaning the player cant pass through it */
    }

    this.resetLvl = function(){
        clearTimeout(explodingNow);
        this.cleanBoard();
        this.populateBoard(board.levelList[board.currLvl]);
        this.stock = this.bombStock[this.currLvl];
        removeMedia();
    }
}
