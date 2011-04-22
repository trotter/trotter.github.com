---
layout: post
title: Hacking CloudFoundry
published: false
---

# Things I've learned hacking CloudFoundry

- If you're on a plane and can't access the internet, you'll need to change
  `A_ROOT_SERVER` in `vcap/common/lib/vcap/common.rb` to point at '127.0.0.1' (This
  change will prevent you from being able to run w/ multiple boxes).
- If running as root, each router can handle 32,768 open sockets: `vcap/router/lib/router.rb:92`
- The router collects data about itself and logs it, `vcap/router/router/lib/router.rb:129`,
  which appears to be accessible in the logfile.
- Router (and maybe other components) can take a 'log_file' and 'log_level' in their config
- The stats they collect make this so, so impressive. See example:

    {
      "type": "Router",
      "uuid": "07fdfc04006ad8fdc640f379203daf33",
      "host": "127.0.0.1:52154",
      "credentials": [
        "d634a0b1d1c1f36433fd6cf50d60422f",
        "626fd95bd3871d4c4e84e8946fb517a3"
      ],
      "start": "2011-04-15 16:09:27 -0700",
      "num_cores": 1,
      "config": {
        "port": 2222,
        "inet": "0.0.0.0",
        "sock": "/tmp/router.sock",
        "log_level": "INFO",
        "pid": "/var/vcap/sys/run/router.pid",
        "config_file": "/home/trotter/cloudfoundry/vcap/router/config/router.yml"
      },
      "requests": 36,
      "bad_requests": 0,
      "urls": 2,
      "droplets": 2,
      "requests_per_sec": 12,
      "top_app_requests": [
        { 
          "url": "env.vcap.me",
          "rps": 12,
          "clients": [
            { 
              "ip": "192.168.27.1",
              "rps": 12
            }
          ]
        }
      ],
      "uptime": "0d:0h:3m:5s",
      "mem": 22712,
      "cpu": 0.7,
      "client_connections": 0,
      "app_connections": 0
    }

- Health monitor needs tests
- What is 'fcntl' in `dea/lib/dea/agent.rb`
