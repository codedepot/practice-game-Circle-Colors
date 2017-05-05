CircleColors.StartMenu = function(game){};
var text;
var alternate = true;

CircleColors.StartMenu.prototype = {
  preload: function(){

  },
  create:function(game){
    this.createTitleText(game);
    this.createStartButton(game);
    this.createTutorialButton(game);
  },

  createTitleText:function(game){
    var text = game.add.text(game.world.centerX, game.world.centerY-100, "- Circle Colors -");
    text.anchor.setTo(0.5);

    text.font = 'Revalia';
    text.fontSize = 55;

    //  x0, y0 - x1, y1
    grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    text.inputEnabled = true;
    //text.input.enableDrag();

    text.events.onInputOver.add(this.over, this);
    text.events.onInputOut.add(this.out, this);
  },

  createStartButton : function(game){
    text = game.add.text(game.world.centerX, game.world.centerY+50, "Start Game");
    text.anchor.setTo(0.5);
    text.font= 'Revalia';
    text.fontSize=40;
    text.fill="#fff";
    text.align='center';
    text.stroke = '#FFF';
    text.strokeThickness = 1.5;

    text.inputEnabled = true;
    text.events.onInputDown.addOnce(this.startGame, this);
  },
  createTutorialButton : function(game){
    text2 = game.add.text(game.world.centerX, game.world.centerY+100, "Tutorial");
    text2.anchor.setTo(0.5);
    text2.font= 'Revalia';
    text2.fontSize=30;
    text2.fill="#fff";
    text2.align='center';
    text2.stroke = '#FFF';
    text2.strokeThickness = 1;

    text2.inputEnabled = true;
    text2.events.onInputDown.addOnce(this.startTutorial, this);
  },
  startGame: function(e){
    this.state.start("Game");
    //console.log(e);
  },
  startTutorial: function(e){
    this.state.start("Tutorial");
  },
  out : function(){

  },
  over : function(){

  }


};
