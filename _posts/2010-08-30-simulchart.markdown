---
layout: post
title: "Simulchart: Realtime charts for everyone"
published: true
---

# {{ page.title }}

This past weekend was [node knockout](http://nodeknockout.com/), so @matschaffer and
@thoughtmerchant and I teamed up to create [Simulchart](http://simulchart.com/),
a platform for creating realtime charts that you can embed anywhere:

<iframe src="http://www.simulchart.com/graphs/4c8faf7f5415bf7d43000003/iframe?width=700&amp;height=200" frameBorder="0" style="width: 700px; height: 200px;"> </iframe>

## Sending Data

What I really like about Simulcharts is how easy it is to send data to the
chart. To change the values in the chart above, all you need to do is run the following on your command line:

    curl -d value=342 \
      http://www.simulchart.com/graphs/4c8faf7f5415bf7d43000003/appendValue

That will send send a `POST` to
`http://www.simulchart.com/graphs/4c8faf7f5415bf7d43000003/appendValue` with a
post body of `value=342`. If you run that command right now, you will see the chart move.

Alternately, you could write a Ruby, Java, Python, or
whatever program to monitor any information you care about and post it to that
url. Then embed the chart on a dashboard page and watch all your metrics as
they fly by. The chart is highly customizable, but only width and height
customization options are currently exposed (sorry, we only had the weekend).
When the code freeze for node knockout is over, we'll update it to allow for
more tweaking.

## We Rock

Overall, I'm really proud of what we managed to accomplish in just one weekend. My team was rock solid, and I think our entry will only improve as a product over time. Sadly, we did run into a few scaling issues with node, which we were never able to fully figure out. So if you're not seeing a graph, be sure to reload the page. It'll show up after a few requests.

If you like what we made, please, please vote us highly one our [team page](http://nodeknockout.com/teams/awesometown). We really appreciate your support, and your votes will help us validate that Simulcharts is something we should develop further. Also, look forward to more posts this week about how we implemented certain features and how to do a system load chart like we have on our [demo page](http://simulchart.com/demos).

