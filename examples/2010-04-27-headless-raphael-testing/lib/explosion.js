var Explosion = function (div) {
  this.r = new Raphael(div, 400, 200);
  this.labels = {};
  this.drawText();
};

Explosion.prototype = {
  drawText: function () {
    this.labels.raphael = this.r.text(200, 100, "Raphael").
      attr({font: "14px Helvetica, Arial, sans-serif"});
    this.labels.awesome = this.r.text(200, 120, "Awesome!").
      attr({font: "14px Helvetica, Arial, sans-serif"});
  },

  explode: function () {
    var self = this;
    this.labels.raphael.animate({rotation: 90,  x: 30,  y: 30}, 1000, "bounce");
    this.labels.awesome.animate({rotation: 180, x: 300, y: 170}, 1000, "<>", function () {
      setTimeout(function () {
        self.reform();
      }, 200);
    });
  },

  reform: function () {
    this.labels.raphael.animate({rotation: 360, x: 200, y: 100}, 1300, "<");
    this.labels.awesome.animate({rotation: 360, x: 200, y: 120}, 1300, ">");
  }
};
