var game;
CircleColors.Game = function(gamePar){
  game = gamePar;
};
var colors = [0x00bff3, 0xa000f3, 0xffa31a, 0x00e600, 0x990000, 0xff00ff, 0xffff00];
var white = 0xffffff;
var circles = {};
var numCircles = 5;
var numSlices = 6;
var size = 360/numSlices;
var rotation = { min:0, max:0}; var rotationTween;
var gapSize = 10;
var gaps = {};
var bin = [1,-1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1];
var resetObjTemp = [];
var radiuses = [350, 300, 250, 200, 150, 100, 50];
var dims = {circleCenterY: 0, powerupX:0, timerX:0, timerY:0, userPointsY: 0, ratingY: 0}; var explosions;
var powerDims = {powerupNum: 4, powerbarX: 50, powerbarY: 0, powerbarWidth:  70, powerbarHeight: 250, powerWidth: 50, powerHeight:50, powerGap: 10, powerbarTop: 140, powerupTimerDiameter : 50,
powerupTimerStartPoint: -0.5*Math.PI, powerupTimerDelta: Math.PI/10 };
var powerups = []; var powerupRef = ["bomb", "random", "reduce", "virus", "time"];  var powerupGraphics = []; powerupClick = ""; var powerupTimer; var powerupTimerVal = 0; var powerupTimerTween;
var scoreTween; var timer; var timerValue = 25; var userPoints; var userPointsValue = 0; var level = 1; var levelText;
var ratingText; var ratingLetter; var ratingSum = {old:0}; var ratingTween; var ratingLetterTween; var ratingDims = {ratingTextX: 0, ratingLetterX: 0, ratingLetterSize:20};
var pointsDim = {a : 10, b:90, powerLower: 1.15, powerUpper: 1.6, powerPoint: 1.8, scalarLower: 0.16, scalarUpper: 0.4, scalarPoint: 0.8, powerupScale: 0.8};
var ratingVals = ["Fail", "Easy", "Exceptional", "Devious", "Devilish", "Clever", "Cool", "Brood", "Bravo", "Anarchist", "Amazing", "Savage", "Sadistic", "Sensasional"];
var ratingLetterVals = ["F", "E", "E+", "D", "D+", "C", "C+", "B", "B+", "A", "A+", "S", "SS", "SSS"];



CircleColors.Game.prototype = {
  preload : function(){},
  create : function(game){
    //initialize any variables that havent been set yet
    dims.circleCenterY = game.world.centerY-100;
    dims.timerX = game.world.width - 175;
    dims.timerY = game.world.height - 200;
    dims.userPointsY = game.world.height - 150;

    dims.ratingY = game.world.height - 175;
    ratingDims.ratingTextX = game.world.centerX - 30;
    ratingDims.ratingLetterX = game.world.centerX - 160;

    powerDims.powerbarY = game.world.centerY + powerDims.powerbarTop;

    //reset variables
    rotationTween = undefined;
    timerValue = 25;
    userPointsValue = 0;
    rotation.max = 0;

    //populate the colors:
    for( i = 0; i<numCircles; i++){
      circles[i] = {};
      gaps[i] =  game.add.graphics(0,0);
      for( j = 0; j<numSlices ; j++){
        //initialization
        circles[i][j] = game.add.graphics(0,0);
        circles[i][j].inputEnabled = true;
        circles[i][j].events.onInputDown.add(this.circleClicked, this);
        //variables
        circles[i][j].name = 'cir' + i + ",slice" + j;
        circles[i][j].ring = i;
        circles[i][j].slice =j;
        circles[i][j].inspected =false;
        circles[i][j].color = colors[Math.floor(Math.random()*colors.length)];
      }
    }

    rotationTween = this.add.tween(rotation).to({max: 360}, 10000, 'Linear', true, 0, -1, false);
    rotationTween.timeScale = 1;
    //------------draw the game hud-------------
    //level
    levelText = game.add.text(game.world.centerX, game.world.height-100, "Level " + level);
    levelText.anchor.setTo(0.5);

    //powerups
    var powerupRect = game.add.graphics(0,0);
    powerupRect.lineStyle(2, white);
    powerupRect.drawRect(powerDims.powerbarX, game.world.centerY +powerDims.powerbarTop, powerDims.powerbarWidth, powerDims.powerbarHeight);
    //initialize the powerup graphics
    for (var i = 0; i < powerDims.powerupNum; i++) {
      powerupGraphics.push(game.add.graphics(0,0));
    }
    //PowerupWidget.updatePowerUps();

    //powerup timer
    var powerupTimerOutline = game.add.graphics(0,0);
    powerupTimer = game.add.graphics(0,0);
    powerupTimerVal = powerDims.powerupTimerStartPoint;
    powerupTimerOutline.anchor.set(0.5);
    powerupTimer.anchor.set(0.5);
    powerupTimerOutline.lineStyle(2, white);
    powerupTimerOutline.drawCircle( powerDims.powerbarX + powerDims.powerbarWidth/2, powerDims.powerbarY -40, powerDims.powerupTimerDiameter);
    powerupTimerTween = this.add.tween(powerupTimer).to({}, 1000, 'Linear', true, 0, -1, false);
    powerupTimerTween.onLoop.add(PowerupWidget.timerOnLoop, this);


    //draw timer
    timer = game.add.text(dims.timerX, dims.timerY, "Time: " + timerValue );
    userPoints = game.add.text(dims.timerX, dims.userPointsY, "Points: " + userPointsValue );
    //timer.anchor.setTo(0.5);
    //userPoints.anchor.setTo(0.5);
    timer.align = "left";
    userPoints.align = "left";
    ScoreWidget.init();

    //make rating texts
    ratingText = game.add.text(ratingDims.ratingTextX, dims.ratingY, "");
    ratingText.alpha = 0; ratingText.anchor.y = 0.5;
    ratingLetter = game.add.text(ratingDims.ratingLetterX, dims.ratingY, "");
    ratingLetter.alpha =  0; ratingLetter.anchor.y = 0.5; ratingLetter.fontSize = 60;
    ratingLetter.text.fontsize(ratingDims.ratingLetterSize);
    //ratingLetter

    //explosions
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(function(image){
      image.anchor.x = 0.5;
      image.anchor.y = 0.5;
      image.animations.add('kaboom');
    }, this);
  },
  update : function(game){
    //draw the cirlces
    this.drawCircle(0, 250, game);
    this.drawCircle(1, 200, game);
    this.drawCircle(2, 150, game);
    this.drawCircle(3, 100, game);
    this.drawCircle(4, 50, game);
  },
  drawCircle: function(name, radius, game){

    //dawing gap
    gaps[name].clear();
    gaps[name].lineStyle(0, white);
    gaps[name].beginFill(backgroundColor);
    //gaps[name].arc(game.world.centerX, game.world.centerY, radius+gapSize,0, game.math.degToRad(1), true);
    gaps[name].drawCircle(game.world.centerX, dims.circleCenterY, 2*radius+gapSize);
    gaps[name].endFill();

    for( i = 0; i< numSlices; i++){

      circles[name][i].clear();


      circles[name][i].lineStyle(3, white);
      circles[name][i].beginFill(circles[name][i].color);
      if(alternate){
        circles[name][i].arc(game.world.centerX, dims.circleCenterY, radius, game.math.degToRad((size*i + rotation.max*bin[name])%360), game.math.degToRad((size*(i-1) + rotation.max*bin[name])%360), true);
      }else{
        circles[name][i].arc(game.world.centerX, dims.circleCenterY, radius, game.math.degToRad((size*i + rotation.max)%360), game.math.degToRad((size*(i-1) + rotation.max)%360), true);
      }
      circles[name][i].endFill();
    }

  },
  //check neighbours and if any matches, try to find more matches
  circleClicked: function(obj, pointer){
    var ring = obj.ring;
    var slice = obj.slice;
    var foundMatch = false;
    matches = [];
    resetObj = [];
    sliceSize = 360/numSlices;
    var virus = false;
    if(powerupClick === ""){//if its a regular click and not a powerupclick
      //check neighbours
      //traversing in the r direction
      if(alternate){//if circles are going in opposite directions,

        //var neighbourMin = Math.floor((slice + (2*bin[slice+1]*rotation.max/sliceSize))+numSlices*3)%numSlices;
        //var neighbourMax =  Math.ceil((slice + (2*bin[slice+1]*rotation.max/sliceSize))+numSlices*3)%numSlices;
        var neighbourMin = Math.floor(slice + ((2*bin[ring]*rotation.max)/sliceSize)+numSlices*3)%numSlices;
        var neighbourMax =  Math.ceil(slice + ((2*bin[ring]*rotation.max)/sliceSize)+numSlices*3)%numSlices;
        //console.log("clicked on ring " + ring + ", slice " + slice + "   min: " + neighbourMin + ", max: " + neighbourMax + ". Rotation: " + rotation.max);
        //looking at outer circle
        if( ring-1 != -1 && circles[(ring-1+numCircles)%numCircles][neighbourMin].color == circles[ring][slice].color){
          matches.push(circles[(ring-1+numCircles)%numCircles][neighbourMin]);
          foundMatch = true;
        }if( ring-1 != -1 &&  circles[(ring-1+numCircles)%numCircles][neighbourMax].color == circles[ring][slice].color ){
          matches.push(circles[(ring-1+numCircles)%numCircles][neighbourMax]);
          foundMatch = true;
        }
        //looking at inner circle
        if(ring+1 != numCircles && circles[(ring+1+numCircles)%numCircles][neighbourMin].color == circles[ring][slice].color ){
          matches.push(circles[(ring+1+numCircles)%numCircles][neighbourMin]);
          foundMatch = true;
        }if(ring+1 != numCircles && circles[(ring+1+numCircles)%numCircles][neighbourMax].color == circles[ring][slice].color){
          matches.push(circles[(ring+1+numCircles)%numCircles][neighbourMax]);
          foundMatch = true;
        }
      }else{
        if( ring-1 != -1 && circles[(ring-1+numCircles)%numCircles][slice].color == circles[ring][slice].color){
          matches.push(circles[(ring-1+numCircles)%numCircles][slice]);
          foundMatch = true;
        }if(ring+1 != numCircles && circles[(ring+1+numCircles)%numCircles][slice].color == circles[ring][slice].color){
          matches.push(circles[(ring+1+numCircles)%numCircles][slice]);
          foundMatch = true;
        }
      }
      //traversing in the theta direction
      if( circles[ring][(slice-1+numSlices)%numSlices].color == circles[ring][slice].color){
        matches.push(circles[ring][(slice-1+numSlices)%numSlices]);
        foundMatch = true;
      }if(circles[ring][(slice+1+numSlices)%numSlices].color == circles[ring][slice].color){
        matches.push(circles[ring][(slice+1+numSlices)%numSlices]);
        foundMatch = true;
      }


    }else{//if a powerup was clicked
      if(powerupClick === "bomb"){
        if( ring-1 != -1){
          matches.push(circles[(ring-1+numCircles)%numCircles][slice]);
        }
        if( ring+1 != numCircles){
          matches.push(circles[(ring+1+numCircles)%numCircles][slice]);
        }
          matches.push(circles[ring][(slice-1+numSlices)%numSlices]);
          matches.push(circles[ring][(slice+1+numSlices)%numSlices]);
          foundMatch = true;
      }else if(powerupClick === "virus"){
         PowerupWidget.virusPowerup(obj.color);
         virus = true;

      }

    }

    if(foundMatch){
      obj.inspected = true;
      resetObj.push(obj);
      this.findMoreMatches(matches, 0, resetObj);

      var explosion = explosions.getFirstExists(false);
      explosion.reset(pointer.position.x, pointer.position.y);
      explosion.play('kaboom', 30, false, true);
    }else if(virus){
    }else{
      ScoreWidget.reduceScore();
    }
  },

  findMoreMatches: function(matches, id, resetObj){

    var ring = matches[id].ring;
    var slice = matches[id].slice;
    var foundMatch = false;

    //traversing in the r direction
    if(alternate){
      var neighbourMin = Math.floor(slice + ((2*bin[ring]*rotation.max)/sliceSize)+numSlices*3)%numSlices;
      var neighbourMax =  Math.ceil(slice + ((2*bin[ring]*rotation.max)/sliceSize)+numSlices*3)%numSlices;
      //looking at outer circle
      if( ring-1 != -1 && circles[(ring-1+numCircles)%numCircles][neighbourMin].color == circles[ring][slice].color && !circles[(ring-1+numCircles)%numCircles][neighbourMin].inspected){
        matches.push(circles[(ring-1+numCircles)%numCircles][neighbourMin]);
        foundMatch = true;
      }if( ring-1 != -1 &&  circles[(ring-1+numCircles)%numCircles][neighbourMax].color == circles[ring][slice].color && !circles[(ring-1+numCircles)%numCircles][neighbourMax].inspected){
        matches.push(circles[(ring-1+numCircles)%numCircles][neighbourMax]);
        foundMatch = true;
      }
      //looking at inner circle
      if(ring+1 != numCircles && circles[(ring+1+numCircles)%numCircles][neighbourMin].color == circles[ring][slice].color && !circles[(ring+1+numCircles)%numCircles][neighbourMin].inspected){
        matches.push(circles[(ring+1+numCircles)%numCircles][neighbourMin]);
        foundMatch = true;
      }if(ring+1 != numCircles && circles[(ring+1+numCircles)%numCircles][neighbourMax].color == circles[ring][slice].color && !circles[(ring+1+numCircles)%numCircles][neighbourMax].inspected){
        matches.push(circles[(ring+1+numCircles)%numCircles][neighbourMax]);
        foundMatch = true;
      }
    }else{
      if(ring-1 != -1 && circles[(ring-1+numCircles)%numCircles][slice].color == circles[ring][slice].color && !circles[(ring-1+numCircles)%numCircles][slice].inspected ){
        matches.push(circles[(ring-1+numCircles)%numCircles][slice]);
      }if(ring+1 != numCircles && circles[(ring+1+numCircles)%numCircles][slice].color == circles[ring][slice].color  && !circles[(ring+1+numCircles)%numCircles][slice].inspected){
        matches.push(circles[(ring+1+numCircles)%numCircles][slice]);
      }
    }
    //traversing in the theta direction
    if(circles[ring][(slice-1+numSlices)%numSlices].color == circles[ring][slice].color && !circles[ring][(slice-1+numSlices)%numSlices].inspected){
      matches.push(circles[ring][(slice-1+numSlices)%numSlices]);
    }if(circles[ring][(slice+1+numSlices)%numSlices].color == circles[ring][slice].color && !circles[ring][(slice+1+numSlices)%numSlices].inspected){
      matches.push(circles[ring][(slice+1+numSlices)%numSlices]);
    }



    matches[id].inspected = true;
    resetObj.push(matches[id]);
    id++;
    if(id < matches.length){
      this.findMoreMatches(matches, id, resetObj);
    }else{
      this.fade(resetObj);
      //this.resetColors(resetObj);
    }



  },
  fade: function(resetObj){
    var tweens = [];
    tweens[0] = game.add.tween(resetObj[0]).to( { alpha: 0 }, 100, "Quart.easeOut");
    //console.log("num objects for score " + resetObj.length + ", " + powerupClick);
    ScoreWidget.updateScore(resetObj.length, powerupClick);
    for(i=1; i<resetObj.length;i++){
        tweens[i] = game.add.tween(resetObj[i]).to( { alpha: 0 }, 100, "Quart.easeOut");
        tweens[i-1].chain(tweens[i]);
    }
    tweens[0].start();
    resetObjTemp.push(resetObj);
    tweens[tweens.length-1].onComplete.add(this.resetColors,this);
    powerupClick = "";

  },
  resetColors: function(){
    var resetObj = resetObjTemp.pop();
    var tweens = [];

    for(i = 0; i<resetObj.length; i++){
      resetObj[i].inspected = false;
      //resetObj[i].alpha = 1;
      resetObj[i].color =  colors[Math.floor(Math.random()*colors.length)];
      tweens[i] = game.add.tween(resetObj[i]).to( { alpha: 1 }, 100, "Quart.easeOut");
      if(i!== 0){
        tweens[i-1].chain(tweens[i]);
      }
    }
    tweens[0].start();

  }
};

var PowerupWidget = {

  updatePowerUps: function(addNew){//called on init and when a powerup is used
    //get more powerups if do not have four
    //for(i = powerups.length; i<powerDims.powerupNum;i++){
    if(addNew && powerups.length<4){
      powerups.push(powerupRef[Math.floor(Math.random()*powerupRef.length)]);
    }

    //}
    for (var i = 0; i < powerupGraphics.length; i++) {
      powerupGraphics[i].destroy();
    }
    //draw the powerups
    for (var i = 0; i < powerups.length; i++) {

      powerupGraphics[i] = game.add.sprite( powerDims.powerbarX + powerDims.powerbarWidth/2, powerDims.powerbarY + powerDims.powerHeight*i + powerDims.powerGap*(i+1) + powerDims.powerHeight/2, powerups[i]);
      powerupGraphics[i].inputEnabled = true;
      powerupGraphics[i].events.onInputDown.add(PowerupWidget.powerClicked, this);
      powerupGraphics[i].anchor.set(0.5);
    }

  },
  powerClicked: function(obj, pointer){
    var index = powerupGraphics.indexOf(obj);
    var type = powerups[index];
    powerups.splice(index, 1);
    PowerupWidget.updatePowerUps(false);
    //console.log(type);
    if(type === "time"){
      PowerupWidget.timePowerup();
    }else if(type === "random"){
      PowerupWidget.randomPowerup();
    }else if(type === "reduce"){
      PowerupWidget.reducePowerup();
    }else if(type === "virus" || type === "bomb"){
      powerupClick = type;
    }
  },
  timerOnLoop : function(){
    powerupTimerVal += powerDims.powerupTimerDelta;
    if(powerupTimerVal > (Math.PI*2 + powerDims.powerupTimerStartPoint)){
      powerupTimerVal = powerDims.powerupTimerStartPoint;
      PowerupWidget.updatePowerUps(true);
    }
    powerupTimer.clear();
    powerupTimer.beginFill(white);
    powerupTimer.arc( powerDims.powerbarX + powerDims.powerbarWidth/2, powerDims.powerbarY -40, powerDims.powerupTimerDiameter/2,powerupTimerVal, powerDims.powerupTimerStartPoint , true );
    powerupTimer.endFill();
  },
  timePowerup : function(){
    rotationTween.timeScale = 0.5;
    setTimeout(function(){
      rotationTween.timeScale = 1;
    }, 5000);
  },
  randomPowerup : function(){
    for (var i = 0; i < numCircles; i++) {
      for (var j = 0; j < numSlices; j++) {
        circles[i][j].color = colors[Math.floor(Math.random()*colors.length)];
      }
    }
  },
  reducePowerup : function(){
    var shortLength = Math.floor(colors.length/2);
    for (var i = 0; i < numCircles; i++) {
      for (var j = 0; j < numSlices; j++) {
        if(colors.indexOf(circles[i][j].color) >= shortLength){//if second half of colors
          circles[i][j].color = colors[Math.floor(Math.random()*shortLength)];
        }
      }
    }
  },
  virusPowerup : function(color){
    var resetObj = [];
    for (var i = 0; i < numCircles; i++) {
      for (var j = 0; j < numSlices; j++) {
        if(circles[i][j].color === color){
          resetObj.push(circles[i][j]);
        }
      }
    }
    CircleColors.Game.prototype.fade(resetObj);
  }
};

var ScoreWidget = {
  init : function(){
    scoreTween =  game.add.tween(timer).to( {} , 1000, 'Linear',true, 0,-1,false);
    //scoreTween =  game.add.tween(timer);
    scoreTween.onLoop.add(this.onLoop, this);
    scoreTween.onComplete.add(this.onComplete, this);
    //scoreTween.start();
  },
  onLoop : function(){
    timerValue -=1;
    if(timerValue<0){
      this.gameOver();
      return;
    }
    timer.text = "Time: " + Math.round(timerValue);
    userPoints.text = "Points: " + userPointsValue;
    levelText.text = "level " + level;
  },
  onComplete : function(){
    scoreTween =  game.add.tween(timer).to( { }, 1000, 'Linear',true, 0, 0, true);
  },
  gameOver : function(){
    //game.state.clearCurrentState();
    powerups = []; powerupTimerVal = powerDims.powerupTimerStartPoint;
    game.state.start("GameOver");

  },
  updateScore : function(tilesNum, powerUpType){
    if(powerUpType === ""){
      userPointsValue += Math.floor(pointsDim.scalarPoint*Math.pow(tilesNum, pointsDim.powerPoint));
      calcLevel = this.quadraticSolver(userPointsValue);
      if(!isNaN(calcLevel)){
        level = calcLevel;
      }else{
        level = 1;
      }
      timerValue += this.calcScalar(level)*Math.pow(tilesNum, this.calcPower(level));
      //console.log("time increased by" +  this.calcScalar(level)*Math.pow(tilesNum, this.calcPower(level)));
    }else{
      userPointsValue += Math.floor(pointsDim.scalarPoint*Math.pow(tilesNum, pointsDim.powerPoint));
      calcLevel = this.quadraticSolver(userPointsValue);
      if(!isNaN(calcLevel)){
        level = calcLevel;
      }else{
        level = 1;
      }
      timerValue += this.calcScalar(level)*pointsDim.powerupScale*Math.pow(tilesNum, this.calcPower(level)*pointsDim.powerupScale);
    }
    this.updateRating(tilesNum);
  },
  reduceScore : function(){
    userPointsValue -= 25;
    level = this.quadraticSolver(userPointsValue);
    timerValue -= 5;
    this.updateRating(1);
  },
  updateRating : function(tilesNum){
    var timeout = 1500;
    ratingLetter.alpha = 1;
    ratingText.alpha = 1;
    //if more than 20 then make it red
    yellow = tilesNum >20? 0: Math.round(255/(Math.log2(tilesNum+1)));
    hex = this.rgb2hex("rgba(255," + yellow + ", 0, 1)");
    ratingLetter.fill = hex;

    if(tilesNum === 1){
      ratingText.text = ratingVals[tilesNum - 1];
      ratingLetter.text = ratingLetterVals[tilesNum - 1];
      ratingText.alpha = 1;
      if(ratingTween !== undefined){ ratingTween.stop();}
      ratingSum.old = 0;
    }else{
      tempNum = tilesNum;
      tilesNum += ratingSum.old;
      //console.log(tilesNum);
      if(tilesNum < 10){
        ratingText.text = ratingVals[Math.round(tilesNum) - 1];
        ratingLetter.text = ratingLetterVals[Math.round(tilesNum) - 1];
        ratingText.alpha = 1;
      }else if(tilesNum < 12){
        ratingText.text = ratingVals[9];
        ratingLetter.text = ratingLetterVals[9];
        ratingText.alpha = 1;
      }else if(tilesNum < 14){
        ratingText.text = ratingVals[10];
        ratingLetter.text = ratingLetterVals[10];
        ratingText.alpha = 1;
      }else if(tilesNum < 17){
        ratingText.text = ratingVals[11];
        ratingLetter.text = ratingLetterVals[11];
        ratingText.alpha = 1;
      }
      else if(tilesNum < 20){
        ratingText.text = ratingVals[12];
        ratingLetter.text = ratingLetterVals[12];
        ratingText.alpha = 1;
      }
      else {
        ratingText.text = ratingVals[13];
        ratingLetter.text = ratingLetterVals[13];
        ratingText.alpha = 1;
      }
      game.add.tween(ratingText).to({alpha: 0}, timeout, 'Linear', true, 0, 0, false);
      game.add.tween(ratingLetter).to({alpha: 0}, timeout, 'Linear', true, 0, 0, false);

      ratingSum.old += tempNum;
      if(ratingTween !== undefined){ ratingTween.stop();}
      ratingTime = ratingSum.old*450;
      ratingTween = game.add.tween(ratingSum).to({old:0}, ratingTime, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
      //console.log("ratingSum is " + ratingSum.old);
    }

  },
  quadraticSolver : function(score){
    var x = (pointsDim.b*-1 + Math.sqrt(pointsDim.b*pointsDim.b+4*pointsDim.a*score))/(2*pointsDim.a);
    return Math.ceil(x);
  },
  calcPower: function(level){
    var x =  ((pointsDim.powerUpper + pointsDim.powerLower)/2) -((pointsDim.powerUpper - pointsDim.powerLower)/2)*Math.tanh((level-10)/10) ;
    return x;
  },
  calcScalar : function(level){
    var x =  ((pointsDim.scalarUpper + pointsDim.scalarLower)/2) -((pointsDim.scalarUpper - pointsDim.scalarLower)/2)*Math.tanh((level-10)/10) ;
    return x;
  },
  rgb2hex : function(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }
};
