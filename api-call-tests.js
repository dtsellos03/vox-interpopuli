const api_key = require('./api_key.js')


var request = require('request');
var async = require('async');
var natural = require('natural');

var searchTerm = 'cats';

var searchURL = 'https://www.googleapis.com/youtube/v3/search?key='+api_key+'&textFormat=plainText&part=snippet&q='+searchTerm+'&type=video&maxResults=50'

//var commentURL = 'https://www.googleapis.com/youtube/v3/commentThreads?key='+api_key+'&textFormat=plainText&part=snippet&videoId='+videoID+'&maxResults=100'


// SEARCH

request(searchURL, function (error, response, body) {
      var videoIDs = []
      var parsed = JSON.parse(body)
      parsed.items.forEach(function(element){
            videoIDs.push(element.id.videoId);
      })
      //console.log(videoIDs)
      var totalcomment = []
      async.forEachOfLimit(videoIDs, 1000, function(value, key, callback) {

                        var videoID = videoIDs[key]
                        var url = 'https://www.googleapis.com/youtube/v3/commentThreads?key='+api_key+'&textFormat=plainText&part=snippet&videoId='+videoID+'&maxResults=100'

                        request(url, function(error, response, body) {

                            if (!error) {

                                try {
                                  
                                    
                                    var parsed = JSON.parse(body)
                                    //console.log(parsed.kind)
                                    parsed.items.forEach(function(element){
                                          totalcomment.push(element.snippet.topLevelComment.snippet.textOriginal);
                                    })
                                    //console.log(totalcomment)

                                    //count++

                                  
                                }
                                catch (err) {

                               
                                }
                            }
                            callback();

                        });

                    },
                    function(err) {

                        if (err) {
                            console.log(err)
                        }
                        
                        console.log(totalcomment.length)

   
                    }
                );

});


// COMMENT
// request(commentURL, function (error, response, body) {
//       var totalcomment = []
//       var parsed = JSON.parse(body)
//       console.log(parsed.kind)
//       parsed.items.forEach(function(element){
//             totalcomment.push(element.snippet.topLevelComment.snippet.textOriginal);
//       })
//       console.log(totalcomment)

// });

