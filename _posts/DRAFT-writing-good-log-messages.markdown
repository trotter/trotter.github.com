---
layout: post
title: How to write good log messages
published: true
---

# {{ page.title }}

Logging is important. Very important. When your application breaks, the first
place you usually check for a hint of what went wrong is the logs.
Unfortunately, I have found that most log messages are absolutely terrible.
They include snarky comments, lack any indication of what was going on, and
sometimes do not even include the current time. Based on my experience, a log
message should include the following: the current time, hostname, the process
pid, a user / transaction identifier, the class, method, and line that wrote
the message, the code version, an informative description of what is
being logged, an array of important variables. This leads to log messages that
look somewhat like the following (wrapped for clarity).

    level time               host                     pid  user
    INFO 08-08-2012-20:27:59 blog1.trottercashion.com 4537 10.21.7.50 app/models/post.rb:75 5cc6e4238e6b76207825e14924a96d59f5c82c19 post_id=543;blog_id=4 Loading Post

So let's break this line down:

+ **level** - INFO - This is the log level for your logger. It gives you an idea
  of the importance of a message at a quick glance.

+ **time** - 08-08-2012-20:27:59 - The current time, preferably in UTC.

+ **host** - blog1.trottercashion.com - The hostname for the server. When you
  start agregating logs from many hosts together, this lets you know which box
  actually logged this message.

+ **pid** - 4537 - The pid for the process. This can help you to figure out if
  only one particular process is misbehaving.

+ **user** - 10.21.7.50 - Some unique identifier for either the user or the
  transaction. Here I'm using IP, but a session id often works better. You're
  really looking for a way to track a user's actions across multiple requests
  and services.

+ **location** - app/models/post.rb:75 - The location in the code that generated
  this message. This will save you a _lot_ of time figuring out where you need
  to look in your code.

+ **version** - 5cc6e4238e6b76207825e14924a96d59f5c82c19 - The version of the code
  you are running. Here I am using a git commit hash, but you could just as
  well use semver.

+ **variables** - post_id=543;blog_id=4 - Any important variables you want to
  output. Here I am writing out the post id and blog id, so that I can inspect
  them in my database if there's a problem.

+ **message** - Loading Post - An plain text description of what's going on. Make
  sure it is descriptive and not a snarky comment like "in ur codez".
