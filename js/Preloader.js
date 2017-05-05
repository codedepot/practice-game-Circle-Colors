CircleColors.Preloader = function(game){};

CircleColors.Preloader.prototype = {

  preload: function(){
    this.load.image("bomb", "assets/bomb-icon-white.png");
    this.load.image("random", "assets/dice-white.png");
    this.load.image("reduce", "assets/filter-white.png");
    this.load.image("virus", "assets/hazard-white.png");
    this.load.image("time", "assets/hour-glass-white.png");
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);

  },

  create: function(){
    this.state.start("StartMenu");
  }

};
