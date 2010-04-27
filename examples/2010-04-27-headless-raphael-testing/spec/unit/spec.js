describe('Explosion', function () {
  var explosion;

  before_each(function () {
    Raphael.clear();
    explosion = new Explosion("explosion-draw-here");
  });

  it('should draw the text on init', function () {
    var text = Raphael.textCalls;
    expect(text[0]).to(eql, [200, 100, "Raphael"]);
    expect(text[1]).to(eql, [200, 120, "Awesome!"]);
  });

  it('should explode', function () {
    explosion.explode();
    var animate = Raphael.animateCalls;

    expect(animate[0]).to(eql, [{rotation: 90,  x: 30,  y: 30},
                                1000, "bounce"]);
    // We don't take everything, because testing the callback
    // is too hard for this example :-)
    expect(animate[1].slice(0,3)).to(eql, [{rotation: 180, x: 300, y: 170},
                                1000, "<>"]);
  });

  it('should reform', function () {
    explosion.reform();
    var animate = Raphael.animateCalls;

    expect(animate[0]).to(eql, [{rotation: 360, x: 200, y: 100}, 1300, "<"]);
    expect(animate[1]).to(eql, [{rotation: 360, x: 200, y: 120}, 1300, ">"]);
  });
});
