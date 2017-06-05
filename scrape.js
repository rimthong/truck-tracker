'use strict';
let request = require('request');
let cheerio = require('cheerio');
let moment = require('moment');
let Botkit = require('botkit');

let url = 'http://www.camionderue.com/s/place-du-canada';
let baseUrl = 'http://www.camionderue.com';

let controller = Botkit.slackbot();
let bot = controller.spawn({
  token: process.env.SLACK_TOKEN
})

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

let montrealTrucks = function(date, callback){
  request(url, function(error, response, html){
    if(!error){
      let $ = cheerio.load(html);
      let trucks = [];
      $('.box .row-horaire').each( function(i, elem) {
        if($(this).find('.long-date').text().indexOf(date.locale('fr').format('LL')) != -1){
          trucks.push(` - ${$(this).find('a').text()} (${baseUrl}${$(this).find('a').attr('href')})`);
        }
      });
      callback(null, trucks);
    }
    else {
      callback(error);
    }
  });
};

let buildMessage = (result, keyword) => {
  let reply = "";
  if(result.length === 0) {
    reply = `No food trucks ${keyword}! :(`;
  } else {
    reply = `Here are ${keyword}'s trucks:\n`;
    result.forEach( (value) => {
      reply += `${value}\n`
    });
  }
  return reply;
}

controller.hears("montreal tomorrow",['direct_message,direct_mention,mention'],function(bot,message) {
  let date = moment().add(1, 'days');
  montrealTrucks(date, (err, result) => {
    if(!err){
      return bot.reply(message, buildMessage(result, 'tomorrow'));
    } else {
      console.log(err);
    }
  });
});

controller.hears("montreal",['direct_message,direct_mention,mention'],function(bot,message) {
  let date = moment();
  montrealTrucks(date, (err, result) => {
    if(!err){
      return bot.reply(message, buildMessage(result, 'today'));
    } else {
      console.log(err);
    }
  });
});

