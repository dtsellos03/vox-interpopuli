const api_key = require('./api_key.js')


var request = require('request');
request('https://www.googleapis.com/youtube/v3/commentThreads?key='+api_key+'&textFormat=plainText&part=snippet&videoId=vk0F8dHo3wU&maxResults=100', function (error, response, body) {

      var parsed = JSON.parse(body)
      console.log(parsed.kind)

});

