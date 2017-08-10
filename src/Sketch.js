var palhas;            /* main character sprite */
var superBock;         /* box sprite (in this case a beer) */
var board;             /* board class */
var recipiente;        /* place to put box in */
var caixa;             /* map delimiter box */
var puta;              /* mp3 file of player reaction */
var puta_end;          /* reaction to play at end of game */
var bombExpl;          /* mp3 of bomb exploding */
var gif;               /* gif of bomb exploding */
var displayMode = 0;   /* info about what mode to render at */
var guide;             /* display at the right of the screen that shows tips */
var explodingNow;      /* reference to the function that is in charge of exploding (so i can abort it if needed */

var gifs = new Array(MAX_GIFS);
var MAX_GIFS = 15;
var currIndex = 0;

var MAIN_MENU   = 0;
var HELP_MENU   = 1;
var AUTHOR_MENU = 2;
var GAME_MODE   = 3;


/* Constructor (only needed so far so other functions can remove the gif */

function Sketch(){
    removeMedia = function(){
        for(var i = 0; i < MAX_GIFS; i++)
            if(gifs[i] != null){
                gifs[i].remove();
            }
        bombExpl.stop();
        currIndex = 0;
    }
}

/* Methods */

function preload(){
    palhas      = loadImage("media/palhas.png");
    superBock   = loadImage("media/8-bit-beer.png");
    recipiente  = loadImage("media/red-circle.png");
    caixa       = loadImage("media/crate.jpeg");
    background  = loadImage("media/greysquare.png");
    floor       = loadImage("media/dirt.jpeg");
    main        = loadImage("media/main.png");
    help        = loadImage("media/help.png");
    autor       = loadImage("media/autor.png");
    guide       = loadImage("media/guide.png");
    puta        = loadSound("media/puta.wav");
    puta_end    = loadSound("media/puta_end.wav");
    bombExpl    = loadSound("media/explosion.wav");
}


function setup() {
    createCanvas(3200,2200);
    board = new Board();
}

function keyPressed(){
    switch(keyCode){
        case 37: /* Left arrow */
            board.updatePosition(-1,0);
            break;
        case 38:  /* Up arrow */
            board.updatePosition(0,-1);
            break;
        case 39: /* Right arrow */
            board.updatePosition(1,0);
            break;
        case 40: /* Down arrow */
            board.updatePosition(0,1);
            break;
        case 48: /* Number 0 */
            displayMode = MAIN_MENU;
            break;
        case 49: /* Number 1 */
            if(displayMode == MAIN_MENU)
                displayMode = HELP_MENU;
            break;
        case 50: /* number 2 */
            if(displayMode == MAIN_MENU)
                displayMode = AUTHOR_MENU;
            break;
        case 51: /* Number 3 */
            clear();
            if(displayMode == MAIN_MENU)
                displayMode = GAME_MODE;
            break;
        case 82: /* R to reset */
            if(displayMode == GAME_MODE){
                board.resetLvl();
                board.restarts++;
            }
            break;
        case 88: /* X to place bomb */
            if(board.stock >= 1){
                var oldStock = board.stock;
                board.stock = 0; /* the game will only allow a single explosion at a time (because im new to javascript and this is an ok solution */
                currx = board.playerx; /* save the coords on where the bomb was placed */
                curry = board.playery;
                currIndex = currIndex >= MAX_GIFS ? 0 : currIndex + 1;
                gifs[currIndex] = createImg("media/explode.gif");
                gifs[currIndex].position(board.playerx*board.cellWidth,board.playery*board.cellWidth);
                gifs[currIndex].size(board.cellWidth,board.cellWidth);
                bombExpl.play();
                board.addBombToGrid();

                explodingNow = setTimeout(function(){ /* explode bomb */

                    /* firstly check, before destroying the map, if the player will die or not */
                    for(var offsetY = -1; offsetY <= 1; offsetY++){
                        for(var offsetX = -1; offsetX <= 1; offsetX++){
                            var i = currx + offsetX;
                            var j = curry + offsetY;
                            if(board.grid[i][j].isPlayer) { /* did palhas man just kill himself? */
                                board.resetLvl();
                                return;
                            }
                        }
                    }

                    /* actually explode the bomb now */
                    for(var offsetY = -1; offsetY <= 1; offsetY++){
                        for(var offsetX = -1; offsetX <=1; offsetX++){
                            if(offsetX != 0 || offsetY != 0){ /* the bomb lies here, don't change it */
                                var i = currx + offsetX;
                                var j = curry + offsetY;
                                board.grid[i][j].isFloor = true;
                                board.grid[i][j].isBackground = false;
                                board.grid[i][j].isCrate = false;
                                board.grid[i][j].isGoal = false;
                                board.grid[i][j].isBox = false;

                            }
                        }
                    }

                    gifs[currIndex].remove();
                    board.stock = (oldStock <= 1) ? 0 : (oldStock - 1);
                },3000); /* wait for sound queue before exploding */
            }
            break;
        default:
            break;
    }
}

function draw() {
    switch(displayMode){
        case MAIN_MENU:
            image(main,0,0,3200,2200);
            break;
        case HELP_MENU:
            image(help,0,0,3200,2200);
            break;
        case AUTHOR_MENU:
            image(autor,0,0,3200,2200);
            break;
        case GAME_MODE:
            /* show actual game entities */
            board.show();

            /* show guide image with interface */
            image(guide,1900,0,1000,1902);

            /* show steps taken */
            textFont("Georgia");
            fill(0,0,0); /* black */
            textStyle(BOLD);
            textSize(35);
            text(board.steps,2355,820);

            /* show restarts taken */
            textSize(50);
            text(board.restarts,2355,1120);

            /* show current level */
            text((board.currLvl + 1),2400,190); /* currlvl start at 0 here */

            /* show bomb usage instructions if it is a bomb level */
            if(board.bombStock[board.currLvl] >= 1){
                fill(255,0,0); /* red */
                textSize(55);
                text("X to bomb",2100,300);
            }

            /* show number of bombs usable*/
            text(board.stock,2355,1450);
        default:
            break;
    }
}
