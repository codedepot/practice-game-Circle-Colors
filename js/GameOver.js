CircleColors.GameOver = function(game){};

CircleColors.GameOver.prototype = {

  preload : function(){

  },

  create : function(){
    this.createScoreText();
    this.createGameOverText();
    this.createRestartText();
    this.createMainMenuText();
  },

  createScoreText : function(){
    text = game.add.text(game.world.centerX, game.world.centerY -100, "Final Score: " + userPointsValue);
    text.anchor.setTo(0.5);
    text.font= 'Revalia';
    text.fontSize=30;
    text.fill="#fff";
    text.align='center';
    text.stroke = '#FFF';
    text.strokeThickness = 1;
  },

  createGameOverText : function(){
    text = game.add.text(game.world.centerX, game.world.centerY , "Game Over");
    text.anchor.setTo(0.5);
    text.font= 'Revalia';
    text.fontSize=50;
    text.fill="#fff";
    text.align='center';
    text.stroke = '#FFF';
    text.strokeThickness = 1;
  },

  createRestartText : function(){
    text = game.add.text(game.world.centerX, game.world.centerY + 75 , "Restart");
    text.anchor.setTo(0.5);
    text.font= 'Revalia';
    text.fontSize=20;
    text.fill="#fff";
    text.align='center';
    text.stroke = '#FFF';
    text.strokeThickness = 0.1;

    text.inputEnabled = true;
    text.events.onInputDown.add(this.onRestartClick, this);
  },
  onRestartClick : function(){
    this.state.start("Game");
  },
  createMainMenuText : function(){
    text = game.add.text(game.world.centerX, game.world.centerY + 100 , "Main Menu");
    text.anchor.setTo(0.5);
    text.font= 'Revalia';
    text.fontSize=20;
    text.fill="#fff";
    text.align='center';
    text.stroke = '#FFF';
    text.strokeThickness = 0.1;

    text.inputEnabled = true;
    text.events.onInputDown.add(this.onMainMenuClick, this);
  },
  onMainMenuClick : function(){
    this.state.start("StartMenu");
  }


};
