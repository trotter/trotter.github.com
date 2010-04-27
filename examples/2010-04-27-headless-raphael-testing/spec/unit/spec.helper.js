var Raphael = function () {
  Raphael.textCalls = Raphael.textCalls || [];
  Raphael.animateCalls = Raphael.animateCalls || [];
};

Raphael.prototype = {
  attr: function () {
    return this;
  },

  text: function () {
    var args = Array.prototype.slice.call(arguments, 0); // Make an array
    Raphael.textCalls.push(args);
    return this;
  },

  animate: function () {
    var args = Array.prototype.slice.call(arguments, 0); // Make an array
    Raphael.animateCalls.push(args);
    return this;
  }
}

Raphael.clear = function () {
  Raphael.textCalls = [];
  Raphael.animateCalls = [];
};

