---
layout: post
title: Creating Hovers With Raphael
published: true
---

# {{ page.title }}

<p class="meta">April 07, 2011 - Philly</p>

![NYTimes Example](/images/2011-04-07-creating-hovers-with-raphael/nytimes.jpg)
In my [Raphael talk](http://www.slideshare.net/trotter/raphal-rubynation)  at
[RubyNation](http://www.rubynation.org) last weekend, I walked through a number
of real world examples of Raphael in action. One of those examples was this
[cool
graph](http://www.nytimes.com/interactive/2011/01/25/us/politics/state-of-the-union-words-used.html?ref=politics)
of presidential patterns of speech in State of the Union Addresses. One
interesting aspect of that graph is the way that hovering over a rectangle will
give that rectangle a black border and position the callout next to it. In this
post, I'll tell you how to create this style of hover for yourself.

## It Starts With a Rectangle

To get everything started, we first need to draw one of the rectangles from the
graph. This code will take care of that:

    r = Raphael("jobs-graph", 640, 120);
    rect = r.rect(481, 30, 7, 90);
    rect.attr({stroke: "none",
               fill:   "#446093"});

![Sad
Hover](/images/2011-04-07-creating-hovers-with-raphael/where-they-can-hover.jpg)
Since Raphael supports hover on elements natively, it's fairly tempting to
just throw the hover directly onto this rectangle like so:

    rect.hover(function () {
        rect.attr({"stroke": "#000"});
      },
      function () {
        rect.attr({"stroke": "none"});
      }
    );

Now, when the mouse is over the rectangle, we'll outline it in black. Problem
solved, right?

## Make Big Hover Areas

Unfortunately, in order for your users to see your effect, they are required
to hover _directly_ over the colored rectangle. As you'll quickly find, many
users hover _around_ the rectangle, then wonder why the effects dissappear
the minute their mouse moves slightly off the target area. To make hovering
easier on your users, it's usually better to create a separate target area
for hovering like so: ![Good
Hover](/images/2011-04-07-creating-hovers-with-raphael/with-invisible.jpg)

    hoverArea = r.rect(481, 0, 8, 120);
    hoverArea.attr({stroke: "none",
                    fill:   "#f00",
                    "fill-opacity": 0});
    rect.hover(function () {
        rect.attr({"stroke": "#000"});
      },
      function () {
        rect.attr({"stroke": "none"});
      }
    );

The `hoverArea` rectangle sits directly over our previous rectangle, except it
stretches from the top of the Raphael canvas to the bottom. This will allow
users to hover in any area above the rectangle they can see, and still get the
cool highlighting effect.

## Fill Your Hover and Make It Transparent

As you can see above, I've made the `hoverArea` rectangle have a transparent,
red fill color. *This is absolutely necessary*. If you don't give an element a
`fill`, then SVG will treat only the elements stroke area as hoverable. If you
don't make the `fill-opacity` transparent, then you'll have a giant red box on
your screen. For my `fill`, I prefer to use a unique color per hover element,
because it's then simple to turn off the transparency and see where all my
hover areas are located.

## Beer Time

So that's it, you now know how to make sweet hovers using
[RaphaelJS](http://raphaeljs.com). Go get yourself a beer and bask in your
awesomeness. I'll have a post up in the near future on how to add the callout
that you see in all these example images. Subscribe to [my feed](http://feeds.feedburner.com/trottercashion) so that you'll remember to read it.
