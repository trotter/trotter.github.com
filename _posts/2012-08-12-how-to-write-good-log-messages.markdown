---
layout: post
title: How To Write Good Log Messages
published: true
---

# {{ page.title }}

Logging is important. Very important. When your application breaks, the first
place you usually check for a hint of what went wrong is the logs.
Unfortunately, I have found that most log messages are absolutely terrible.
They include snarky comments, lack any indication of what was going on, and
sometimes do not even include the current time. Based on my experience, a good
log message looks like this (wrapped for clarity):

    INFO 2012-09-20T20:27:59Z blog1.trottercashion.com 4537 10.21.7.50 \
      app/models/post.rb:75 5cc6e4238e6b76207825e14924a96d59f5c82c19 \
      post_id=543;blog_id=4 Loading Post

## Component Breakdown

Let's break this line down into its components. I'll start with the component
name followed by the corresponding portion of the line from above. Finally,
I'll give a brief description of this component's purpose.

**level** - INFO - This is the log level for your logger. It gives you an idea
of the importance of a message at a quick glance.

**time** - 2012-09-20T20:27:59Z - The current time in [ISO-8601
format](http://en.wikipedia.org/wiki/ISO_8601). Your date will be yyyy-mm-dd,
and the Z at the end of the time signifies that this is UTC time.

**host** - blog1.trottercashion.com - The hostname for the server. When you
start agregating logs from many hosts together, this lets you know which box
actually logged this message.

**pid** - 4537 - The pid for the process. This can help you to figure out if
only one particular process is misbehaving.

**user** - 10.21.7.50 - Some unique identifier for either the user or the
transaction. Here I'm using IP, but a session id often works better. You're
really looking for a way to track a user's actions across multiple requests
and services.

**location** - app/models/post.rb:75 - The location in the code that generated
this message. This will save you a _lot_ of time figuring out where you need
to look in your code.

**version** - 5cc6e4238e6b76207825e14924a96d59f5c82c19 - The version of the
code you are running. Here I am using a git commit hash, but you could just as
well use semver. This is _very_ important as the location in the log may be for
a different version of code than what is currently running.

**variables** - post_id=543;blog_id=4 - Any important variables you want to
output. Here I am writing out the post id and blog id, so that I can inspect
them in my database if there's a problem.

**message** - Loading Post - An plain text description of what's going on. Make
sure it is descriptive and not a snarky comment like "in ur codez".

## Nuances

I find it's best to separate each component of the output with a tab. This
makes splitting it using tools like `cut` very easy. Alternately, using spaces
is fine as well, but you'll find that your message usually contains spaces.
I've used spaces in the example above mainly to ensure it looks nice in the
browser. Alternately, Some people like to output their logs as json, which
leads to lines that look like this:

    {"level":"INFO","time":"08-08-2012-20:27:59", \
     "host":"blog1.trottercashion.com","pid":4537,"user":"10.21.7.50",
     "location":"app/models/post.rb:75", \
     "version":"5cc6e4238e6b76207825e14924a96d59f5c82c19", \
     "variables":{"post_id":543,"blog_id":4},"message":"Loading Post"}

This seems like a perfectly accessible approach to me, but it's not one that
I've experimented with yet.

Also, it is worth pointing out that determining the file and line number for
the location component _may_ slow down your program. If this is the case in
your language of choice, you may want to use something like
`class_name:method_name` instead. As long as it helps you get back to a place
in code, use whatever you want for location.

So what are your thoughts on log messages? If I've left out anything that you
find particularly important, please let me know in the comments. I'm always
looking for ways to improve my logging.

**Update** - I updated the time to use ISO-8601. As pointed out in the
comments, it's a much clearer way to specify the time and it sorts lexically.
