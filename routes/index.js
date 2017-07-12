var express = require('express');
var router = express.Router();


/* GET home page. */

router.get('/test', function(req, res, next) {
   res.status(201).json({
             message: 'Saved message',
             obj: req.params.value
         })

});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;

function analyzeComments(searchTerm, res) {
    
    
const api_key = require('../api_key.js')


var request = require('request');
var async = require('async');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var sw = require('stopword')


var NGrams = natural.NGrams;

var searchURL = 'https://www.googleapis.com/youtube/v3/search?key='+api_key+'&textFormat=plainText&part=snippet&q='+searchTerm+'&type=video&maxResults=50'

request(searchURL, function (error, response, body) {
      var videoIDs = []
      var parsed = JSON.parse(body)
      parsed.items.forEach(function(element){
            videoIDs.push(element.id.videoId);
      })

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
                                          totalcomment.push(element.snippet.topLevelComment.snippet.textOriginal.toLowerCase());
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
                        
                    // TOKENIZE ARRAY 
                    
                        console.log("DONE!")
                        
                        function tokenizeArray(array){
                            var tokenizedComments = []
                            array.forEach(function(element){
                                var tokenized = tokenizer.tokenize(element)
                                tokenized = sw.removeStopwords(tokenized)
                                tokenizedComments =  tokenizedComments.concat(tokenized)
                            })
                            return tokenizedComments
                        }
                    
                        
                        function NGRAMSanalysis(array){
                            
                            var NGRAMarray = []
                            
                            array.forEach(function(element){
                                combinedString = NGrams.ngrams(element, 3)
                                combinedString.forEach(function(element){
                                    NGRAMarray.push(element.join())
                                })
                              
                            })
                            return NGRAMarray
                        }
                        
                        function countTotals(array){
                            
                            var counts = {};
                            
                            for(var i = 0; i< array.length; i++) {
                                var num = array[i];
                                counts[num] = counts[num] ? counts[num]+1 : 1;
                            }
                            
                            return counts
                            
                            
                        }
                        
                                                
                        function sortedArray(counts){
                            
                            var sortable = [];
                            for (var element in counts) {
                                //console.log(element)
                                if(counts[element]>5){
                                      sortable.push([element, counts[element]]);
                                }
                              
                            }
                            
                            sortable.sort(function(a, b) {
                                return a[1] - b[1];
                            });
                            
                            return sortable
                            
                            
                        }
                        
                        function posSorter(array){
                            array.forEach(function(element){
                                
                            })
                        }
                        
                        
                        var tokenizedComments = tokenizeArray(totalcomment)
       
                        var grams_var = NGRAMSanalysis(totalcomment)
                        
                       // console.log(sortedArray(countTotals(grams_var)))
                        
                        var finalNGARMS = sortedArray(countTotals(NGRAMSanalysis(totalcomment)))
                        
                       console.log(finalNGARMS)
       
                        
                        var counts = countTotals(tokenizedComments)
                      



                        
                        var returnObj = finalNGARMS
                        
                        res.render('results.ejs', { returnObj: returnObj });
                        
                        //var sortable = sortedArray(counts)
                        
                       //keysSorted = Object.keys(counts).sort(function(a,b){return counts[b]-counts[a]})


                        //console.log(sortable)
   
                    }
                );

});

}