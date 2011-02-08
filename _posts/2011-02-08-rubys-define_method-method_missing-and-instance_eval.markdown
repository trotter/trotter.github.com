---
layout: post
title: Ruby's define_method, method_missing, and instance_eval
published: true
---

# {{ page.title }}

<p class="meta">February 08, 2010 - Philly</p>

One of the things that I love most about Ruby is that it gets you part of the
way to Lisp. Sure, it doesn't have full on macros, but it does have a number of
totally cool methods that allow you to tighten up your code and ultimately make
your programs more maintainable. Three that I really like are `define_method`,
`method_missing`, and `instance_eval`. So let's have a look.

## define_method

Ruby's `define_method` lets you create methods using a method rather than the
language builtin `def`. One major benefit of this is that you can reduce the
duplication inherent methods with similar definitions. For example, the
following methods all pull data out of an internal hash:

{% highlight ruby %}
    # Without define_method:
    def user;  @data[:user];  end
    def email; @data[:email]; end
    def food;  @data[:food];  end
{% endhighlight %}

With `define_method`, we can iterate over each method name and reduce the
duplication like so:

{% highlight ruby %}
    # With define_method:
    %w(user email food).each do |meth|
      define_method(:meth) { @data[meth.to_sym] }
    end
{% endhighlight %}

Though the above code is the same number of lines as the previous example, it's
actually easier to maintain than when we defined each method individually. For
example, Adding another method is as simple as adding an item to the array. In
addition, if we rename our instance variable to `@kool_data`, we only need to
update our accessor methods in one place.

Another neat benefit is that methods created with define_method are actually
closures, whereas normal Ruby methods are not. For instance, we could use
`define_method` to allow runtime creation of callback methods like so:

{% highlight ruby %}
    class Callbacker
      def make_callback(obj, meth)
        self.send(:define_method, :callback) { obj.send(meth) }
      end
    end

    # usage
    callbacker = Callbacker.new
    callbacker.make_callback("   hello   ", :strip)
    callbacker.callback   # => "hello"
{% endhighlight %}

Sadly, that example is quite contrived, but it's all I've got off the top of my
head. If you can think of something better, leave it in the comments. I'll
update the post with your example and name.

## method_missing

Another cool language feature of Ruby is `method_missing`. It's the feature
that puts the magic in [Rails's](http://rubyonrails.org) `find_by_*` methods.
You've probably seen them in examples before, but in case you haven't, they
look like this:

{% highlight ruby %}
    Post.find_by_title("Awesomeness!")
    User.find_by_email("bob@example.com")
    User.find_by_email_and_login("bob@example.com", "bob")
{% endhighlight %}

Defining all these `find_by_*` methods by hand is nearly impossible as there's
a large number of combinations and they're based on columns in the database. In
conditions like these, `method_missing` really shines. Let's have a look:

{% highlight ruby %}
    class ActiveRecord::Base
      def method_missing(meth, *args, &block)
        if meth.to_s =~ /^find_by_(.+)$/
          run_find_by_method($1, *args, &block)
        else
          super # You *must* call super if you don't handle the
                # method, otherwise you'll mess up Ruby's method
                # lookup.
        end
      end

      def run_find_by_method(attrs, *args, &block)
        # Make an array of attribute names
        attrs = attrs.split('_and_')

        # #transpose will zip the two arrays together like so:
        #   [[:a, :b, :c], [1, 2, 3]].transpose
        #   # => [[:a, 1], [:b, 2], [:c, 3]]
        attrs_with_args = [attrs, args].transpose

        # Hash[] will take the passed associative array and turn it
        # into a hash like so:
        #   Hash[[[:a, 2], [:b, 4]]] # => { :a => 2, :b => 4 }
        conditions = Hash[attrs_with_args]

        # #where and #all are new AREL goodness that will find all
        # records matching our conditions
        where(conditions).all
      end
    end
{% endhighlight %}

Though there's a lot to the code above, the _most_ important bit is in the
method missing. Here we use a regex to match anything starting with 'find_by_'
and delegate those to `run_find_by_method`.

There are three very important caveats to using `method_missing`. First, you
*must* call `super` if you don't plan on handling the given method. If you fail
to call `super`, you will short circuit Ruby's method lookup and your code will
behave strangely.

Second, methods executed via `method_missing` are slower than their normally
defined counterparts. I don't have hard numbers on this, but googling around
may be able to tell you. If it doesn't, let me know in the comments, and I'll
get numbers.

Finally, you _should_ also define a corresponding `respond_to?` that reflects
that your object responds to these magic methods. For our example above, the
`respond_to?` would look like so:

{% highlight ruby %}
    class ActiveRecord::Base
      def respond_to?(meth)
        if meth.to_s =~ /^find_by_.*$/
          true
        else
          super
        end
      end
    end
{% endhighlight %}

Though `respond_to?` is not used heavily in practice, it _is_ a core component
of duck typing checks. Therefore, it's usually a good idea to make sure your
`respond_to?` matches your `method_missing`.

## instance_eval

The final feature we'll look at today is `instance_eval`. It's very much a
swiss army knife of a tool, but it really shines in its DSL supporting role.
For instance, take the [Chef API's](http://wiki.opscode.com/display/chef/Home)
approach to setting up File Templates:

{% highlight ruby %}
    template "/path/to/file.conf" do
      source "file.conf.erb"
      owner  "trotter"
      mode   "0755"
    end
{% endhighlight %}

Within the `template` method, we have access to `source`, `owner`, and `mode`
methods that are unavailable outside `template`. To make this work, we must
execute the block passed to `template` within a context where `source`,
`owner`, and `mode` are defined. With `instance_eval`, this is possible, and we
could implement the Chef DSL like so:

{% highlight ruby %}
    class ChefDSL
      def template(path, &block)
        TemplateDSL.new(path, &block)
      end
    end

    class TemplateDSL
      def initialize(path, &block)
        @path = path
        instance_eval &block
      end

      def source(source); @source = source; end
      def owner(owner);   @owner  = owner;  end
      def mode(mode);     @mode   = mode;   end
    end
{% endhighlight %}

The real trick to the above code is the `instance_eval` in `TemplateDSL`. It
takes the supplied block and runs it within the scope of a `TemplateDSL`
object. This means that the block has access to the `source`, `owner`, and
`mode` methods of `TemplateDSL`, which it uses to set the appropriate instance
variables.

If in the above example we had not used `instance_eval` and had instead defined
`TemplateDSL#initialize` as follows, then Ruby would raise a `NoMethodError`,
because the `source`, `owner`, and `mode` methods would not be accessible to
the block.

{% highlight ruby %}
    class TemplateDSL
      def initialize(path, &block)
        @path = path
        block.call
      end
    end
{% endhighlight %}

## Philly.rb

Hopefully this post helps you see why I think Ruby is such a cool language. If
you're in the Philly area, I'm giving a lightening talk at tonight's
[Philly.rb](http://phillyrb.org) meeting on this sort of Ruby "meta magic". I'd
love to see you there!
