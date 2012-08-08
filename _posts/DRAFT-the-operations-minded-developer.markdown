---
layout: post
title: The Operations Minded Developer
published: false
---

# {{ page.title }}

<p class="meta">July 27, 2012 - Mountain View</p>

I started my programming career as a Rails developer in New York. Being new to
programming, I spent a lot of time absorbing all the information I could on the
field. I spent my nights with SICP under my pillow and my days reading the
Pickaxe book and Agile Web Development with Rails. I devoured blogs that tought
me about TDD and books like Smalltalk Best Practice Patterns that taught me the
best ways to structure my code. My code was rock solid. My tests told me when
things went wrong. Changing functionality was a breeze. Unfortunately, my
applications would break. Database indices were missing. Log files were filling
up the disk. My brand new shiny message queue would fall over in the middle of
the night. My sysadmins hated me. My problem was that though I was a good
developer, I wasn't an Operations Minded Developer.

Being an operations minded developer means being aware of operational problems
your application may face and acting to reduce the risk those problems create.
It's not enough to write code, hand it over to a sysadmin, and say "don't call
me when this breaks." You need to know how to write good log messages, what
metrics to collect, and how to protect your application from failures in other
applications. Keep in mind, this isn't DevOps that I'm writing about here.
There's no mention of deploying applications, actually collecting the metrics
that are published, or setting up a MySQL database. Today, I want to talk
purely about actions you need to take in your application to make it more
operationaly resiliant.

There's a lot to learn about how to think operationally, and many books have
been written on the topic. Today, I'm going to start small and skim the tops of
logging, metrics, and resiliancy against dependency failure. Hopefully some of
you will then pick up the charge and explain other issues the Operations Minded
Developer, pretty sure the third time I use it with all caps gives me an
automatic trademark :p.

## Logging

## Metrics

## Timeouts

## Be Operations Minded
