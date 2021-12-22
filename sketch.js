var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudimage;
var c1,c2,c3,c4,c5,c6;
var clouds,obstacles;
var score;
var restartImage,gameoverImage,restart,gameOver;
var checkpoint,die,jump;


const PLAY=1;
const END=0;
var gameState=PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudimage=loadImage("cloud.png");
  
  
  c1=loadImage("obstacle1.png");
  c2=loadImage("obstacle2.png");
  c3=loadImage("obstacle3.png");
  c4=loadImage("obstacle4.png");
  c5=loadImage("obstacle5.png");
  c6=loadImage("obstacle6.png");

  restartImage=loadImage("restart.png");

  gameoverImage=loadImage("gameOver.png");

  checkpoint=loadSound("checkpoint.mp3");
  die=loadSound("die.mp3");
  jump=loadSound("jump.mp3");
}

function setup() {

  createCanvas(windowWidth,windowHeight);
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("stop", trex_collided)
  trex.scale = 0.8;
  
  //create a ground sprite
  ground = createSprite(width/2,height-250,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //creating invisible ground
  invisibleGround = createSprite(200,height-240,400,10);
  invisibleGround.visible = false;
  
  clouds=createGroup();
  obstacles=createGroup();
  score=0;
  trex.debug=false;
  trex.setCollider("circle",0,0,40)

  gameOver=createSprite(width/2,height/2-50,40,40)
  gameOver.addImage(gameoverImage)
  gameOver.scale=0.8
  restart=createSprite(width/2,height/2,40,40)
  restart.addImage(restartImage)
  restart.scale=0.8
  
  
} 

function draw() {
  //set background color
  background(180);
  textSize(20)
  text("score: "+score,width-150,50)
  
  //console.log(trex.y)
  if (gameState===PLAY){
    gameOver.visible=false;
    restart.visible=false;
    trex.changeAnimation("running");
    score=score+Math.round(getFrameRate()/60)
    ground.velocityX = -(4+2*(score/100));
    // jump when the space key is pressed
    if((keyDown("space")|| touches.length>0)&& trex.collide(invisibleGround)) {
      trex.velocityY = -16;
      jump.play();
      touches=[];
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    spawnClouds();
    createObstacles();
    if (trex.isTouching(obstacles)){
      gameState=END;
      die.play();
    }
    if (score>0 && score%100===0){
      checkpoint.play();
    }
  } 
  else if(gameState===END){
    ground.velocityX=0;
    clouds.setVelocityXEach(0);
    obstacles.setVelocityXEach(0);
    clouds.setLifetimeEach(-1);
    obstacles.setLifetimeEach(-1);
    trex.changeAnimation("stop")
    trex.velocityY=0;
    gameOver.visible=true;
    restart.visible=true;
    if ((mousePressedOver(restart)) || touches.length>0 ){
     reset();
     touches=[];
    }    
  }
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  //Spawn Clouds
  
  
  drawSprites();
}

//function to spawn the clouds
function spawnClouds(){
 // write your code here
 if(frameCount%50===0){
  var cloud=createSprite(width ,100,60,10);
  cloud.velocityX=-2
  cloud.y = Math.round(random(10,height/2-100));
  cloud.addImage(cloudimage);
  cloud.scale=0.8;
  cloud.lifetime=width/2+100;
  clouds.add(cloud);
 } 
 
}

function createObstacles(){
 if(frameCount%70===0){
   var cactus=createSprite(width,height-265,20,20)
   cactus.velocityX=-(6+2*(score/100));
   var rand=Math.round(random(1,6));
   switch(rand){
     case 1:cactus.addImage(c1); break;
     case 2:cactus.addImage(c2); break;
     case 3:cactus.addImage(c3); break;
     case 4:cactus.addImage(c4); break;
     case 5:cactus.addImage(c5); break;
     case 6:cactus.addImage(c6); break;
   }
   cactus.scale=0.8;
   cactus.lifetime=300
   obstacles.add(cactus);
 }
}
function reset(){
gameState=PLAY;
obstacles.destroyEach();
clouds.destroyEach();
score=0;
}
