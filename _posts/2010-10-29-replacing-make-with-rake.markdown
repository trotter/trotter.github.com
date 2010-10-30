---
layout: post
title: Replacing Make With Rake
published: true
---

# {{ page.title }}

<p class="meta">October 29, 2010 - Philly</p>

I've been playing with Erlang again lately, and decided to go back through [Joe
Armstrong's book](http://pragprog.com/titles/jaerlang/programming-erlang) from
a few years ago. In chapter 6 of his book, Joe shows how to compile an Erlang
program using the classic `make` tool. Naturally, this got me thinking about
implementing his code in the Ruby alternative to `make`, `rake`.

Not Just For Tasks
------------------

Those of you that think Rake can only be used to define tasks should really
take a look at the [documentation](http://docs.rubyrake.org/). In the same way
that you use Rake to define a task, you can use it to generate a file according
to a rule. The following code will look regenerate `trotter.beam` anytime that
`trotter.erl` changes.

{% highlight ruby %}
    file 'trotter.beam' => 'trotter.erl' do
      sh 'erlc trotterl.erl'
    end
{% endhighlight %}

Of course, if I'm compiling one file, then I'm probably compiling many. For
these cases we use the `rule` method. The following code regenerate any beam
file when its corresponding erl file has changed. 

{% highlight ruby %}
    rule '.beam' => '.erl' do |t|
      sh "erlc #{t.source}"
    end
{% endhighlight %}

Cleaning Up After Yourself
--------------------------

That's pretty cool, but now we have a metric ass-ton of `*.beam` files laying
around our directory. Thankfully, Rake makes it pretty easy to clean up a lot
of files as well. Just require `rake/clean` and add necessary files to the
`CLEAN` constant.

{% highlight ruby %}
    require 'rake/clean'
    CLEAN.include('*.beam')
{% endhighlight %}

Putting It All Together
-----------------------

Putting this all together, we can make a Rakefile that will compile all the
Erlang code that I'm writing while working through this book.

{% highlight ruby %}
    require 'rake/clean'

    CLEAN.include('*.beam')
    ERLS  = FileList['*.erl']
    BEAMS = ERLS.ext('.beam') 

    rule '.beam' => '.erl' do |t|
      sh "erlc #{t.source}"
    end

    task :default => BEAMS
{% endhighlight %}

Here I've defined a default task that depends on all `.beam` files, which in
turn depend on all the `.erl` files. Running `rake` will cause Rake to check
the compile time of each `.beam` against its corresponding `.erl` file and
recompile if necessary. When I'm done messing around, a simple `rake clean`
will clear out all the `.beam` files, but leave all the `.erl` files intact.

I hope I've shown you that Rake is good for more than just putting together
sets of tasks. When you're working in a system where you need to generate files
on disk, Rake offers some wonderful tools for you.
