var CircleColors = {};
var backgroundColor = 0x3e3e3e;
var Config ={
  numRings: 5,
  colorPerRing:5
};

CircleColors.Boot = function(game){};

CircleColors.Boot.prototype = {
  preload: function(game){
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },

  create: function(){
    this.input.maxPointers = 1;
    this.stage.backgroundColor = backgroundColor;

    this.input.addPointer();
    this.state.start("Preloader");
  }
};
