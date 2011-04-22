---
layout: post
title: Automating the CloudFoundry Install
published: true
---

# {{ page.title }}

<p class="meta">April 14, 2011 - Philly</p>

If you haven't heard, VMWare open sourced a massive platform as a service
application called [CloudFoundry](http://cloudfoundry.org/) two days ago.  It's
totally awesome, but as the
[README](https://github.com/cloudfoundry/vcap/blob/master/README) illustrates,
it takes a while to get it installed and setup. Since I don't like waiting, I
transformed that README into a simple bash script that will handle everything
for you. It's available now on [my
fork](https://github.com/trotter/vcap/tree/fix-install-process-part-deux). It takes
nearly an hour to run, but only requires manual intervention when entering the
sudo password (which only happens twice). With this script, getting up and
running with CloudFoundry is as simple as downloading [Ubuntu
10.04.2](http://www.ubuntu.com/business/get-ubuntu/download) and
[Virtualbox](http://www.virtualbox.org/) and running the following commands in your Ubuntu VM:

{% highlight bash %}
    sudo apt-get install -y openssh-server curl
    bash < <(curl -s -k -B https://github.com/trotter/vcap/raw/fix-install-process/setup/install)
{% endhighlight %}

In the future, I'd like to turn this script into a set of Chef recipes... but
that's for the future. In the meantime, have fun playing with CloudFoundry!
