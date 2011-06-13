---
layout: post
title: Introducing Chloe - The Realtime Web Server
published: true
---

# {{ page.title }}

Developing for the realtime web is hard. It's not that the concepts are
terribly hard, or the coding in particular, rather it's the operational
difficulties of handling tens of thousands of concurrent requests without
having your web server fall over. In an attempt to solve this problem, I've
created an open source, realtime web server called [Chloe](https://github.com/mashion/chloe), which
vastly simplifies the problem of connecting your existing web app to the
realtime web. It supports a hybrid of the Socket.IO and Faye APIs, and requires
nothing special from your application other than the ability to send and
receive HTTP POSTs.

## How It Works

The beauty of Chloe is that it works wonderfully with absolutely any web
framework. Use Rails? We got you covered. Spring? No problem. Node.js? Yea, we
can even do that too. The trick is that Chloe handles all the web sockety (and
xhr / long polling fallback) bits, and sends an HTTP POST to your web
application when new data comes in via the browser. When you want to send data
back to the browser, you just send a POST to Chloe. Because Chloe is written in
Erlang and uses the Yaws web server, it's built from the ground up to handle
tens of thousands of simultaneous connections without falling over.

In practical terms, it works like this (ripped straight from the Chloe README).
The user's browser loads your page [1], which instantiates a connection to
Chloe using JavaScript. It can then send data over that connection [2], which
will be relayed to your app via a POST from Chloe [3]. When you have data that
you want to send back to the browser, send a POST to Chloe [4], which will
relay it back to the connected browser [5].

                               2. Send data over websockets
      +---------------------------------------------------------------------------------------------+
      |                                                                                             v
    +------------------------+  1. /index.html   +----------+  4. POST /send (data for browser)   +-------+
    |        Browser         | ----------------> | Your App | ----------------------------------> | Chloe | -+
    +------------------------+                   +----------+                                     +-------+  |
      ^                                            ^          3. Data from the browser              |        |
      | 5. Data from your app                      +------------------------------------------------+        |
      |                                                                                                      |
      |                                                                                                      |
      +------------------------------------------------------------------------------------------------------+

Chloe is dead simple to integrate into any existing web application. We
recently converted [Simulchart](http://simulchart-rails.heroku.com), previously
written in Node.js, to Rails and Chloe, and it only took a few hours. If you
have a look at [the source](https://github.com/mashion/simulchart-rails),
you'll see that the Rails code only has to worry about realtime aspects in [one
place](https://github.com/mashion/simulchart-rails/blob/master/app/controllers/charts_controller.rb#L30).

## Getting and Running It

If you want to see how Chloe works for yourself, I'd love for you to pull it
down and run it. On OSX, this is as easy the following. If you're on Ubuntu,
we've got packages for you as well. Find the package for you at
[https://github.com/mashion/chloe/downloads](https://github.com/mashion/chloe/downloads) and substitute it for the one below.

{% highlight bash %}
curl -LO \
  https://github.com/downloads/mashion/chloe/chloe-0.0.3-osx.tgz
tar xzvf chloe-0.0.3-osx.tgz
./chloe-0.0.3/bin/chloe start
{% endhighlight %}

To check that Chloe is _really_ running, hit [http://localhost:8901](http://localhost:8901). You
should see a simple page telling that it's up. To stop the server, just use
`./chloe-0.0.3/bin/chloe stop`.

Of course, just running a Chloe server on its own isn't _that_ interesting. So
pull down the Chloe source and run the demo app that will let you see how Chloe
works.

{% highlight bash %}
git clone https://github.com/mashion/chloe.git
ruby support/echo_server.rb
{% endhighlight %}

Then point your browser at [http://localhost:4567](http://localhost:4567) and see Chloe in action.

To see Chloe at work in a more substantial app, pull down the Simulchart source
from [https://github.com/mashion/simulchart.git](https://github.com/mashion/simulchart.git), get a twitter api key, and run
Simulchart locally.

## What's Left

Chloe is still in active development, and we've got a number of upcoming
features planned. First, we need to authenticate outbound POSTs through Chloe,
so that only your application can send data down to the browser. Second, we
want to add a number of monitoring hooks to make gauging the health of a
running Chloe server super simple. Third, we'd like to make the installation
process even easier. We currently have self-contained binary packages for OSX
and Ubuntu, but we'd love to have legit debian and rpm packages. We also plan
to write a homebrew recipe soon to make OSX installs even easier. Fourth, we
want to see how the community uses Chloe and improve our API to make the common
use cases easier to do. If you want to help with any of these efforts, we'd
love your support. Code is available on github at [https://github.com/mashion/chloe](https://github.com/mashion/chloe).

## Learn More, Contribute, Give Back

If you think Chloe sounds cool, I'd really appreciate [your vote](http://monetateopensource.strutta.com/entry/168161) in the [Monetate Open Source Prize](http://monetateopensource.strutta.com/entry/168161). The top prize is $5,000, which we'll put directly towards funding additional Chloe development.

If you _really_ think it sounds cool, I'd love your help developing it. Code is available on github at [https://github.com/mashion/chloe](https://github.com/mashion/chloe). Patches and forks are always welcome.

FYI, if you liked this post, consider subscribing to [my
feed](http://feeds.feedburner.com/trottercashion) for more awesome bits of
knowledge.
