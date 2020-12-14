var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_collided;
var ground, invisibleGround, groundImage, ground2;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg, restartImg
var jumpSound, checkPointSound, dieSound

function preload() {
  trex_collided = loadAnimation("download.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("rest.png")
  gameOverImg = loadImage("gameover.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  ground2 = createSprite(width/2, windowHeight-10,windowWidth*2, 35);
  ground2.shapeColour = ("yellow");

  trex = createSprite(50, 160, 10, 10);

  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.24;



  ground = createSprite(width/2, windowHeight-25,windowWidth*2, 35);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(width/2,windowHeight/2);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width/2,windowHeight/2+50);
  restart.addImage(restartImg);


  gameOver.scale = 1;
  restart.scale = 0.1;

  invisibleGround = createSprite(width/2, windowHeight-1,windowWidth*2, 35);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();


  trex.setCollider("circle", 0, 0, 100);
  trex.debug = true;

  score = 0;

}

function draw() {

  background("lightblue");
  //displaying score
  textSize(20);
  textFont("algerian");
  text("Score: " + score, 400, 50);


  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100)
    //scoring
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && trex.y >=windowHeight-50) {
      trex.velocityY = -14;
      jumpSound.play();
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()

    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    trex.scale = 0.24;


    ground.velocityX = 0;
    trex.velocityY = 0


    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  //stop trex from falling down
  trex.collide(invisibleGround);
  
fill("yellow");
  circle(80,80,50);
  
  drawSprites();
}

function reset() {
  gameState = PLAY;
  score = 0;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
}


function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(windowWidth, windowHeight-45,windowWidth*2, 35);
    obstacle.velocityX = -(6 + score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}