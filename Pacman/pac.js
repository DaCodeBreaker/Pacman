const tilecol=20;
const tilerow=20
const tilewidth=30;
const wwidth=tilecol*tilewidth;
const wheight=tilerow*tilewidth;
const pelletwidth=5
imgs=new Set();
walls=new Set();
pellets=new Set();
cherries=new Set();
powerpellets=new Set();
gate=new Set();
ghosts=[];
const directions=["down","up","left","right"];
const speed=5;
let score=0;
let ghostcount=0;
let modetimer=0;
let mode="scatter";
let pmode="scatter";
let omode="scatter";
let superpac=false;
let supertimer=0;
let startghost=[];

const tileMap = [
    "XXXXXXXXXXXXXXXXXXXX", // 1
    "X....O.....XX..u...X", // 2 - Top corners opened
    "X.XX.XXX.XXXX.XXX.XX", // 3
    "X.XX.XXX.XXXX.XXX.XX", // 4
    "X.....u.........O..X", // 5
    "X.XX.X.XXXXXX.X.XX.X", // 6
    "X.XX.X...XX...X.XX.X", // 7
    "X....XXX.XX.XXX....X", // 8
    "XXXX.X........X.XXXX", // 9  
    "X....X.X----X.X....X", // 10
    " .XX.X.XprboX.X.XX. ", // 11 - Warp Tunnel (Blank ends)
    "XXXX.X.XXXXXX.X.XXXX", // 12
    "X........c.........X", // 13 - Cherry area fully open
    "X.XX.X.XXXXXX.X.XX.X", // 14
    "X.XX.X........X.XX.X", // 15
    "X.XX.XXX.XX.XXX.XX.X", // 16
    "X.O......P.....u...X", // 17
    "XX.X.X.XXXXXX.X.X.XX", // 18
    "X....u...XX.....O..X", // 19 - Bottom corners opened
    "XXXXXXXXXXXXXXXXXXXX", // 20
];


class Block{
    constructor(x,y,image="",width,height,direction="",nextdir="no",nextimg="",speed=5){
        this.x=x;
        this.y=y;
        this.image=image;
        this.width=width;
        this.height=height;
        this.direction=direction;
        this.nextdir=nextdir;
        this.nextimg=nextimg;
        this.speed=speed;
    }
}

class Ghost{
    constructor(x,y,image="",width,height,direction="up",nextdir="no",nextimg="",prevdir="no",active=false,speed=3,scared=false){
        this.x=x;
        this.y=y;
        this.image=image;
        this.width=width;
        this.height=height;
        this.direction=direction;
        this.nextdir=nextdir;
        this.nextimg=nextimg;
        this.prevdir=prevdir;
        this.active=active;
        this.speed=speed;
        this.scared=scared;
    }
}

function load(){
    pacmandown=new Image();
    pacmandown.src="./graphics/pacmanDown.png";
    
    pacmanup=new Image();
    pacmanup.src="./graphics/pacmanUp.png";

    pacmanleft=new Image();
    pacmanleft.src="./graphics/pacmanLeft.png";

    pacmanright=new Image();
    pacmanright.src="./graphics/pacmanRight.png";

    pinkGhost=new Image();
    pinkGhost.src="./graphics/pinkGhost.png";

    blueGhost=new Image();
    blueGhost.src="./graphics/blueGhost.png";

    redGhost=new Image();
    redGhost.src="./graphics/redGhost.png"; 

    orangeGhost=new Image();
    orangeGhost.src="./graphics/orangeGhost.png";

    wall=new Image();
    wall.src="./graphics/wall.png";

    scaredGhost=new Image();
    scaredGhost.src="./graphics/scaredGhost.png";

    cherry=new Image();
    cherry.src="./graphics/cherry.png";

    cherry2=new Image();
    cherry2.src="./graphics/cherry2.png";
}

function create(){
    for (let i=0;i<tilecol;i++){
        for(let j=0;j<tilerow;j++){
            if (tileMap[i][j]=="X"){
                walls.add(new Block(tilewidth*j,tilewidth*i,wall,tilewidth,tilewidth));
            }
            
            else if (tileMap[i][j]=="r"){
                ghosts.push(new Ghost(tilewidth*j,tilewidth*i,redGhost,tilewidth,tilewidth,"up","no",redGhost));
            }
            else if (tileMap[i][j]=="p"){
                ghosts.push(new Ghost(tilewidth*j,tilewidth*i,pinkGhost,tilewidth,tilewidth,"up","no",pinkGhost));
                startghost=[tilewidth*j,tilewidth*i]
            }

            else if (tileMap[i][j]=="P"){
                pacman=new Block(tilewidth*j,tilewidth*i,pacmanright,tilewidth,tilewidth,"no","no",pacmanright);
            }

            
            else if (tileMap[i][j]=="b"){
                ghosts.push(new Ghost(tilewidth*j,tilewidth*i,blueGhost,tilewidth,tilewidth,"up","no",blueGhost));
            }
            else if (tileMap[i][j]=="o"){
                ghosts.push(new Ghost(tilewidth*j,tilewidth*i,orangeGhost,tilewidth,tilewidth,"up","no",orangeGhost));
            }
            else if (tileMap[i][j]=="."){
                pellets.add(new Block(tilewidth*j+(tilewidth-pelletwidth)/2,tilewidth*i+(tilewidth-pelletwidth)/2,null,pelletwidth,pelletwidth));
            }
            else if (tileMap[i][j]=="O"){
                cherries.add(new Block(tilewidth*j,tilewidth*i,cherry,tilewidth,tilewidth));
            }
            else if (tileMap[i][j]=="-"){
                gate.add(new Block(tilewidth*j,tilewidth*i,wall,tilewidth,5));
            }
            else if (tileMap[i][j]=="u"){
                powerpellets.add(new Block(tilewidth*j+(tilewidth-pelletwidth*2)/2,tilewidth*i+(tilewidth-pelletwidth*2)/2,null,pelletwidth*2,pelletwidth*2));
            }
            else{
                continue;
            }
        }
    }
}


function draw(){
    for (let img of imgs){
        context.drawImage(img.image,img.x,img.y,img.width,img.height);
    }
    for (let img of cherries){
        context.drawImage(img.image,img.x,img.y,img.width,img.height);
    }
    for(let wall of walls){
        context.drawImage(wall.image,wall.x,wall.y,wall.width,wall.height);}
    
    for (let pellet of pellets){
        context.fillStyle="white";
        context.fillRect(pellet.x,pellet.y,pellet.width,pellet.height);

        
    }
    for (let pellet of powerpellets){
        context.fillStyle="white";
        context.fillRect(pellet.x,pellet.y,pellet.width,pellet.height);

    }
    for (let ghost of ghosts){
        if(superpac){
            context.drawImage(scaredGhost,ghost.x,ghost.y,ghost.width,ghost.height);}
        else{
        context.drawImage(ghost.image,ghost.x,ghost.y,ghost.width,ghost.height);}
    }

    for (let gat of gate){
        context.fillRect(gat.x,gat.y,gat.width,gat.height);
    }
    
    context.drawImage(pacman.image,pacman.x,pacman.y,pacman.width,pacman.height);
}
function timer(){
    modetimer+=1
    setTimeout(timer,1000);
}

function supertime(){
    
    if(superpac){
        supertimer+=1;
        setTimeout(supertime,1000);}
}
function pzone(){
    let dist=((pacman.x-ghosts[0].x)**2+(pacman.y-ghosts[0].y)**2)**(1/2);
    if (dist<7*tilewidth){
        pmode="chase";
    }
    else{
        pmode="scatter";
    }     
}
function ozone(){
    let dist=((pacman.x-ghosts[3].x)**2+(pacman.y-ghosts[3].y)**2)**(1/2);
    if (dist<6*tilewidth){
        omode="chase";
    }
    else{
        omode="scatter";
    }
}
function update(){

    context.clearRect(0,0,wwidth,wheight);
    draw();
    move(pacman);
    actualdirectionchange(pacman);
    
    for (let ghost of ghosts){
        if (ghost.active){
            if (collisioncheck(ghost,ghost.direction) ){
                ghostmovement(ghost,true);
            }
            if (ghost.x%tilewidth==0 && ghost.y%tilewidth==0 && ghost.y!=tilewidth*9 && ghost.y!=tilewidth*10){
                ghostmovement(ghost,true);
            }
            if(collisioncheck(pacman,"",ghost,"ghost") && superpac){
                [ghost.x,ghost.y]=[startghost[0],startghost[1]];
                //ghost.scared=false;
            }
            if(collisioncheck(pacman,"",ghost,"ghost") && !superpac){
                gameover()
                return false}
            move(ghost);
            
        }

    }
    if (supertimer==15){
        supertimer=0;
        superpac=false;
        mode="chase";
        modetimer=7;
    }
    if (modetimer==7 && !superpac){
        mode="chase";
    }
    else if (modetimer==20 && !superpac){
        mode="scatter";
        modetimer=0;
    }
    
    console.log(mode)
    eat();
    pzone();
    ozone();
    setTimeout(update,1000/40);
    
    
}
function actualdirectionchange(a){
 
    if (a.x%tilewidth==0 && a.y%tilewidth==0 && !collisioncheck(a,a.nextdir)){
        a.direction=a.nextdir;
        a.image=a.nextimg;
    }
}
function directionchange(e){

    if (e.key=="ArrowDown" || e.key=="s" || e.key=="S"){
 
        pacman.nextdir="down";
        pacman.nextimg=pacmandown;
        
    
        

    }

    if (e.key=="ArrowUp" || e.key=="w" || e.key=="W"){
        pacman.nextdir="up";
        pacman.nextimg=pacmanup;
        
        
    }
    if (e.key=="ArrowLeft" || e.key=="a" || e.key=="A"){
        pacman.nextdir="left";
        pacman.nextimg=pacmanleft;
        
    }   
    if (e.key=="ArrowRight" || e.key=="d" || e.key=="D"){
        pacman.nextdir="right";
        pacman.nextimg=pacmanright;
       
    }
    
}

function move(a){
    if (a.direction=="down" && a.y<wheight-tilewidth && !collisioncheck(a,a.direction)){
        a.y+=a.speed;}
    else if(a.direction=="up"  && a.y>0 && !collisioncheck(a,a.direction)){
        a.y-=a.speed;}
    else if(a.direction=="left" && a.x>0 && !collisioncheck(a,a.direction)){
        a.x-=a.speed;}
    else if(a.direction=="right" && a.x<wwidth-tilewidth && !collisioncheck(a,a.direction)){
        a.x+=a.speed;}
    
}

function pred(dir,a,speed=a.speed){
    let predx,predy;
    if (dir=="down"){
        predx=a.x;
        predy=a.y+speed;
    }
    else if (dir=="up"){
        predx=a.x;
        predy=a.y-speed;
    }   
    else if (dir=="left"){
        predx=a.x-speed;
        predy=a.y;
    }
    else if (dir=="right"){
        predx=a.x+speed;
        predy=a.y;
    }
    return [predx, predy];
}
function collision(a,b,dir){
    
    if (dir=="no"){
        return false;
    }
    let c=pred(dir,a);
    let predx=c[0];
    let predy=c[1];
    if ((predx+tilewidth>b.x && predx<b.x+tilewidth && predy+tilewidth>b.y && predy<b.y+tilewidth) || (predx+tilewidth>wwidth ||predx<0 ||predy+tilewidth>wheight ||predy<0)){    
        return true;}
   
    } 

function collisioncheck(a,dir,obj=walls,what=""){
    if (obj==walls){
        for (let gat of gate){
            if (collision(a,gat,dir) && dir=="up")
                return false;
            else if (collision(a,gat,dir))
                return true;
            }
        
        for (let wall of walls){
            if (collision(a,wall,dir)){
                return true;
            }
        }
    }
    
    else if(what="ghost"){
        if (a.x+tilewidth>obj.x && obj.x+obj.width>a.x && a.y+tilewidth>obj.y && obj.y+obj.height>a.y){
            return true;
        }
    }

    else{
        if  (a.x+tilewidth>obj.x && obj.x+obj.width>a.x && a.y+tilewidth>obj.y && obj.y+obj.height>a.y){
            return true;
            }
        }
    
    return false;
}

function eat(){
    for (let pellet of pellets){
        if (collisioncheck(pacman,"",pellet)){
            pellets.delete(pellet);
            score+=1;
            //console.log(score);
        }
    }
    for (let cher of cherries){
        if (collisioncheck(pacman,"",cher)){
            cherries.delete(cher);
            score+=10;
            console.log(score);
        }
    }
    for (let pellet of powerpellets){
        if (collisioncheck(pacman,"",pellet)){
            powerpellets.delete(pellet);
            score+=1;
            supertimer=0;
            if (!superpac){
                superpac=true
                mode="run";
                for (let ghost of ghosts){
                    ghost.scared=true;
                }
                supertime();

            }
    
            
            //console.log(score);
        }
    
    }

}


function complement(x){
    if (x=="down"){
        return "up";
    }
    else if (x=="up"){
        return "down";
    }
    else if (x=="left"){
        return "right";
    }
    else if (x=="right"){
        return "left";
    }
}
function ghostmovement(ghost,intersection=false){
    
    if  (intersection){
        let possibledirs=[];
        for (let i of directions){
                
                
            if (!collisioncheck(ghost,i) && i!=complement(ghost.direction)){  
                    possibledirs.push(i);
                }
                
            }
        
            
        if (mode=="run"){
            let maxdist=0;
            let maxdir="";
            for (let i of possibledirs){
                let [predx,predy]=pred(i,ghost);
                let dist=(pacman.x-predx)**2+(pacman.y-predy)**2;
                if (dist>maxdist){
                    maxdist=dist;
                    maxdir=i;
                }
            }
            ghost.direction=maxdir;
        }
        
        
        else if(ghost.image==redGhost && mode=="chase"){
            let mindist=Infinity;
            let mindir="";
            for (let i of possibledirs){
                let [predx,predy]=pred(i,ghost);
                let dist=(pacman.x-predx)**2+(pacman.y-predy)**2;
                if (dist<mindist){
                    mindist=dist;
                    mindir=i;
                }
            }
            ghost.direction=mindir;
        }
        else if(ghost.image==blueGhost && mode=="chase"){
            let [redx,redy]=[ghosts[1].x,ghosts[1].y]
            let [predpacx,predpacy]=pred(pacman.direction,pacman,2*pacman.speed)
            target=[2*predpacx-redx,2*predpacy-redy]
            let mindist=Infinity;
            let mindir="";
            for (let i of possibledirs){
                let [predx,predy]=pred(i,ghost);
                let dist=(target[0]-predx)**2+(target[1]-predy)**2;
                if (dist<mindist){
                    mindist=dist;
                    mindir=i;
                }
            }
            ghost.direction=mindir;
            
            }
        else if(ghost.image==pinkGhost && pmode=="chase")
        {
            let mindist=Infinity;
            let mindir="";
            for (let i of possibledirs){
                let [predx,predy]=pred(i,ghost);
                let dist=(pacman.x-predx)**2+(pacman.y-predy)**2;
                if (dist<mindist){
                    mindist=dist;
                    mindir=i;
                }
            }
            ghost.direction=mindir;
        }
        else if(ghost.image==orangeGhost && omode=="chase")
        {
            let mindist=Infinity;
            let mindir="";
            for (let i of possibledirs){
                let [predx,predy]=pred(i,ghost);
                let dist=(pacman.x-predx)**2+(pacman.y-predy)**2;
                if (dist<mindist){
                    mindist=dist;
                    mindir=i;
                }
            }
            ghost.direction=mindir;
        }
        
        
        else{
        ghost.direction=possibledirs[Math.floor(Math.random()*possibledirs.length)];}
    
        }
    }
    
function ghostadd(){
    if (ghostcount<4){
        ghosts[ghostcount].active=true;   
        ghostcount+=1;
        setTimeout(ghostadd,5000);
        
        
    }
}
function gameover(){
   

}



//load,draw,update,move,collision.gameover,ghosts,ghostsmovement,win
board=document.getElementById("board");
board.width=wwidth;
board.height=wheight;
context=board.getContext("2d");

window.onload=()=>{
    load();
    create();
    timer();
    ghostadd();
    update();
    document.addEventListener("keyup",directionchange);
}          