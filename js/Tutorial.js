CircleColors.Tutorial = function(game){};

CircleColors.Tutorial.prototype = {
  preload: function(){

    this.load.image("chain-example", "assets/chain-example.png");
  },
  create : function(game){
    this.createBackBtn();
    this.createTileDesc();
    this.createTileImage();
    this.createPowerupDesc();
    this.createPowerupDef();
  },

  createBackBtn : function(){
    text = game.add.text(50, 25, "< Back");
    text.anchor.setTo(0.5);
    text.font= 'Revalia';
    text.fontSize=30;
    //text.fill="#fff";
    text.align='center';
    //text.stroke = '#FFF';
    text.strokeThickness = 1.5;

    grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    text.stroke = '#000000';
    //text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    text.inputEnabled = true;
    text.events.onInputDown.addOnce(this.backBtnPress, this);
  },
  backBtnPress : function(){
    this.state.start("StartMenu");
  },
  createTileDesc : function(){
    descText = game.add.text(10, 50, "The objective of the game is to match colors. When a tile is adjacent to another tile with the same color, it can be clicked and both tiles will disappear."
  + " Tiles are adjacent if the tile's side is touching another tile's side. If two tiles are matched, a chain reaction starts where all tiles touching the matched tiles will disappear."
  + " The image below shows a chain which started at tile 1.");
    descText.wordWrap = true;
    descText.wordWrapWidth = 590;
    //text.anchor.setTo(0.5);
    descText.font= 'Revalia';
    descText.fontSize=20;
    descText.fill="#fff";
    descText.align='left';
    descText.stroke = '#FFF';
    //text.strokeThickness = 1.5;
  },
  createTileImage : function(){
    tileImage =  game.add.sprite(10, 205, "chain-example");
    //powerupGraphics[i] = game.add.sprite( powerDims.powerbarX + powerDims.powerbarWidth/2, powerDims.powerbarY + powerDims.powerHeight*i + powerDims.powerGap*(i+1) + powerDims.powerHeight/2, powerups[i]);
  },
  createPowerupDesc : function(){
    descText = game.add.text(10, 430, "There are powerups on the bottom left of the screen. they can be used by clicking on them");
    descText.wordWrap = true;
    descText.wordWrapWidth = 590;
    //text.anchor.setTo(0.5);
    descText.font= 'Revalia';
    descText.fontSize=20;
    descText.fill="#fff";
    descText.align='left';
    descText.stroke = '#FFF';
    //descText.strokeThickness = 0.5;
  },
  createPowerupDef : function(){
    powerups = ["bomb", "random", "reduce", "virus", "time"];
    desc = ["Clicking this powerup and clicking another tile will cause a chain reaction to all tiles adjacent, regardless of color",
    "This powerup will randomly change each tile's color.",
    "This powerup will reduce the colors used by half, making it easier to find matches.",
    "Clicking this powerup and clicking another tile will clear all tiles of that color.",
    "This will slow down the rotation of the circles."];
    for (var i = 0; i < powerups.length; i++) {
      startY = 500;
      delta = 60;
      powerImage = game.add.sprite(40, startY + delta*i + 20, powerups[i])
      descText = game.add.text(80,  startY + delta*i, desc[i]);
      powerImage.anchor.set(0.5);
      descText.font= 'Revalia';
      descText.fontSize=15;
      descText.fill="#fff";
      descText.align='left';
      descText.stroke = '#FFF';
      descText.wordWrap = true;
      descText.wordWrapWidth = 500;

    }


    //text.strokeThickness = 1.5;
  }

};
