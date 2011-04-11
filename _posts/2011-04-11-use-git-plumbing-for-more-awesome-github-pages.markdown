---
layout: post
title: Use Git Plumbing For More Awesome Github Pages
published: true
---

# {{ page.title }}

<p class="meta">April 11, 2011 - Philly</p>

[GitHub Pages](http://pages.github.com/) are an excellent way to publish your
blog or documentation, but I've been having a small problem with mine lately.
My bounce rates on this blog are higher than I'd like, so I started using
Jekyll's `related_posts` feature to let people know there's more they might
want to read. Unfortunately, GitHub disables `lsi`, which gives good cross-post
recommendations, when building your Jekyll blog, because it requires more
processing power than they'd like to spend.

Thankfully, Scott Chacon gave a [fantastic talk](http://threetrees.heroku.com/#1)
at RubyNation a week ago that covered some neat git plumbing tricks to solve my
problem, which I codified into the following `Rakefile`.

{% highlight ruby %}
    require 'fileutils'

    task :publish do
      FileUtils.rm_rf('/tmp/trotter-blog-index')
      ENV['GIT_INDEX_FILE'] = '/tmp/trotter-blog-index'
      sh "jekyll --lsi generated"
      sh "cd generated && GIT_DIR=../.git git add ."
      tsha = `git write-tree`.chomp
      csha = `echo 'updated' | git commit-tree #{tsha}`.chomp
      sh "git update-ref refs/heads/master #{csha}"
      FileUtils.rm_rf("generated")
      sh "git push -f origin master"
    end
{% endhighlight %}

**TL;DR:** Copy the above into your `Rakefile`, run `git co -b jekyll`, run `rake
publish`. However, you probably want to read on, because this task some crazy
shit.

## The High Level

The `publish` task starts off by telling jekyll to generate the site with lsi
enabled, which will give us good cross post recommendations. It then builds and
commits an unreferenced tree with all the files in `generated` at the root of
the tree. It then points the `master` branch at the resulting commit, and
pushes it up to `origin`, which is GitHub in my case.

## The Low Level

So how does all that really work at the low level? Well, we start by using an
alternate an alternate index file, which will keep this commit separate from
all previous history in our repo:

{% highlight ruby %}
    FileUtils.rm_rf('/tmp/trotter-blog-index')
    ENV['GIT_INDEX_FILE'] = '/tmp/trotter-blog-index'
{% endhighlight %}

Next, we tell jekyll to generate our project into the `generated` directory with lsi enabled:

{% highlight ruby %}
    sh "jekyll --lsi generated"
{% endhighlight %}

Now it's time to add the files. If we do a normal `git add .`, then we're going to end up with a tree like the following:

{% highlight bash %}
    new file: generated/index.html
    new file: generated/favicon.ico
{% endhighlight %}

In order for GitHub to properly serve our site though, we need the tree to look more like this:

{% highlight bash %}
    new file: index.html
    new file: favicon.ico
{% endhighlight %}

To fix this problem, go into the `generated` directory, and tell git to use
`../.git` as its git directory. For some reason (hoping someone in the comments
will know), this will cause git to treat the `generated` directory as the root
of the project. We're now free to add our files:

{% highlight ruby %}
    sh "cd generated && GIT_DIR=../.git git add ."
{% endhighlight %}

Using `write-tree`, we'll write our current index to a tree in git. The command
will output a tree hash, which we will pass to `commit-tree` to build an actual
commit for our changes. This will output a commit hash, which we will store in
`csha` and use to update `master` in a minute.

Now we'll build a tree from our current index using `write-tree`, commit it using `commit-tree`, and keep track of the commit hash in `csha`.

{% highlight ruby %}
    tsha = `git write-tree`.chomp
    csha = `echo 'updated' | git commit-tree #{tsha}`.chomp
{% endhighlight %}

We'll use `update-ref` to point the `master` reference, which is our `master`
branch, at the commit we just created. Because this changes your `master`
reference, be sure that you've created a `jekyll` branch as I mentioned in the
tl;dr above. If you don't, then you'll likely lose your reference to your
ungenerated project. If this happens, you can get it back using `git fsck
--lost-found`. Sadly, I don't know much about how that works.

{% highlight ruby %}
    sh "git update-ref refs/heads/master #{csha}"
{% endhighlight %}

Finally, we clean up the `generated` directory and push our new `master` to
github. Because everything is at the root level with an `index.html`, GitHub
will just serve up our project without first processing it through Jekyll.

{% highlight ruby %}
    FileUtils.rm_rf("generated")
    sh "git push -f origin master"
{% endhighlight %}

## Running the Command

To make use of this Rake task in your own Jekyll projects, run the following on your commandline:

{% highlight bash %}
    cd [your project]
    curl -L http://bit.ly/my-rakefile >> Rakefile
    git co -b jekyll
    git add Rakefile
    git commit -m "Add Trotter's publish task"
    git push github jekyll
    rake publish
{% endhighlight %}

By default, the `publish` task does not turn on lsi. You can add `lsi: true` to
`_config.yml` to enable it, though you'll need the [GNU Scientific
Library](http://www.gnu.org/software/gsl/) to make it work.

## Beer Time

Keep in mind that the `publish` task **will** make your `master` branch point at
an unparented commit, which contains your **published** site. From now on, you'll
make and commit all your changes to the `jekyll` branch, then run `rake
publish` to actually publish your blog to GitHub. Go drink a beer and Enjoy!

FYI, if you liked this post, consider subscribing to [my
feed](http://feeds.feedburner.com/trottercashion) for more awesome bits of
knowledge.
