# Truck Tracker

Quick app created to make a slackbot that scrapes the food truck website.
Hard coded to Place du Canada since that's where our office is, but that can be improved in a further version.

Requires a slack token, just put it in the `SLACK_TOKEN` env variable: `export SLACK_TOKEN=XXX`

You can just run `npm start`

## Docker Instructions

I also created a docker file for fun.

  - `cp Dockerfile.sample Dockerfile`
  - modify with your slack token
  - `docker build -t <yourname>/truck-tracker`
  - `docker run -d <yourname>/truck-tracker`

