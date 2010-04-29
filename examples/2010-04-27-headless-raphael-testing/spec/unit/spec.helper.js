var Raphael = function () {
  var self = {
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
  };

  Raphael.textCalls = Raphael.textCalls || [];
  Raphael.animateCalls = Raphael.animateCalls || [];

  return self;
};

Raphael.clear = function () {
  Raphael.textCalls = [];
  Raphael.animateCalls = [];
};

