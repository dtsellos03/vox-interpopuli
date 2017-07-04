
module.exports = 

function CommentSearch(searchTerm, callback) {
    
    const loadingObj = [{ text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }]
  
    console.log(searchTerm)
    console.log(this.state)
    
   /// this.setState({ selectedAnalysis: [{ text: 'Loading!', value: 1000 }] })
   
   // FIRST CALLBACK HERE
    



    var path = require("path");
    const api_key = require('../../api_key.js');


    var request = require('es6-request');
    var async = require('async');
    var natural = require('natural');
    var tokenizer = new natural.WordTokenizer();
    var sw = require('stopword');
    var nlp = require('compromise')


    var NGrams = natural.NGrams;

    var searchURL = 'https://www.googleapis.com/youtube/v3/search?key=' + api_key + '&textFormat=plainText&part=snippet&q=' + encodeURI(searchTerm) + '&type=video&maxResults=50'

    request.get(searchURL)
        .then(([body, res]) => {
        var videoIDs = []
        var parsed = JSON.parse(body)
        parsed.items.forEach(function(element) {
            videoIDs.push({url: element.id.videoId, title: element.snippet.title});
        })

        var totalcomment = [];
        var mostReplied = [];
        var mostLiked = [];
        
        async.forEachOfLimit(videoIDs, 1000, function(value, key, callback) {

                var videoID = videoIDs[key].url
                var videoTitle = videoIDs[key].title
                var url = 'https://www.googleapis.com/youtube/v3/commentThreads?key=' + api_key + '&textFormat=plainText&part=snippet&videoId=' + videoID + '&maxResults=100'

                request.get(url)
                .then(([body, res]) => {

                        try {

                            var parsed = JSON.parse(body)
                                //console.log(parsed.kind)
                            parsed.items.forEach(function(element) {
                                    totalcomment.push(element.snippet.topLevelComment.snippet.textOriginal.toLowerCase());
                                   // console.log(element.snippet.totalReplyCount)
                                    if (element.snippet.totalReplyCount > 10) {
                                   
                                        mostReplied.push({
                                            comment: element.snippet.topLevelComment.snippet.textOriginal,
                                            videotitle: videoTitle,
                                            videoID: videoID,
                                            replyCount: element.snippet.totalReplyCount
                                        });
                                        
                                    }
                                    
                                    if (element.snippet.topLevelComment.snippet.likeCount > 10) {
                                   
                                        mostLiked.push({
                                            comment: element.snippet.topLevelComment.snippet.textOriginal,
                                            videotitle: videoTitle,
                                            videoID: videoID,
                                            likeCount: element.snippet.topLevelComment.snippet.likeCount
                                        });
                                        
                                    }
                                    
                                    
                                    
                                })
                                //console.log(totalcomment)

                            //count++


                        }
                        catch (err) {


                        }
                    
                    callback();

                })

            },
            function(err) {
                
                // AFTER ALL REQUESTS COMPLETE

                if (err) {
                    console.log(err);
                }

                 mostReplied.sort(function(a, b) {
                    return b['replyCount'] - a['replyCount']
                    });
                //console.log(mostReplied)
                
                mostLiked.sort(function(a, b) {
                    return b['replyCount'] - a['replyCount']
                    });
                    
               // console.log(mostLiked)
                
                var final = nlp("Books")
                final = final.verbs().out('array')
                console.log(final.length);
                console.log(totalcomment.length)
                
                //console.log(totalcomment)

                // NGRAMS ANALYSIS

                var finalNGARMS = sortedArray(countTotals(NGRAMSanalysis(totalcomment)));
                var finalNGRAMS = finalNGARMS.slice(0,50)
                //console.log(finalNGARMS)
              //  this.setState({ selectedAnalysis: this.state.analyses[3] })

                //OTHER ANALYSIS

                var tokenizedComments = tokenizeArray(totalcomment);
                var counts = countTotals(tokenizedComments);
                var sortable = sortedArray(counts);
             //   console.log(counts)
              //  console.log(sortable)
                var nouns = [];
                var verbs = [];
                var adjectives = [];
              POSanalyzer(sortable);

                
                // RETURN

                var returnObj = [finalNGRAMS, nouns, adjectives, verbs];
                console.log(returnObj)
             
                     callback(returnObj);
     
         
                
                return null

                
           
                function topComment(element) {
                    
                }
                
                
                
                function tokenizeArray(array) {
                    var tokenizedComments = []
                    array.forEach(function(element) {
                        var tokenized = element.split(" ");
                        var stoptokenized = sw.removeStopwords(tokenized)
                      //  console.log(tokenized + "---->" + stoptokenized)
                        tokenizedComments = tokenizedComments.concat(stoptokenized)
                    })
                    return tokenizedComments
                }


                function NGRAMSanalysis(array) {

                    var NGRAMarray = []
                    //console.log(array)
                    array.forEach(function(element) {
                     // console.log(element)
                        element = element.split(" ")
                        let combinedString = NGrams.ngrams(element, 3)
                      //  console.log(combinedString)
                        combinedString.forEach(function(element) {
                            NGRAMarray.push(element.join(' '))
                        })

                    })
                    return NGRAMarray
                }

                function countTotals(array) {

                    var counts = {};
          
                    for (var i = 0; i < array.length; i++) {
                        var num = array[i];
                        counts[num] = counts[num] ? counts[num] + 1 : 1;
                        
                    }
                    //console.log(counts)
                    return counts


                }
                
                function sortedArray(counts) {

      
                    var textdisplay = [];
                    for (var element in counts) {
 
                        if (counts[element] > 5) {
                          
                            textdisplay.push({
                              value: element, count: counts[element]
                            })
                        }

                    }

                    textdisplay.sort(function(a, b) {
                    return b['value'] - a['value']
                    });
                   // console.log(textdisplay)
                    return textdisplay


                }
                

                
                function POSanalyzer(array) {

                    console.log(array)
                    array.forEach(function(element) {
                        
                        var word = element.value

                        
                        if (nlp(word).verbs().out('array').length >0){
                           verbs.push(element)
                            
                        }
                        
                           if (nlp(word).nouns().out('array').length >0){
                           nouns.push(element)
                            
                        }
                        
                        if (nlp(word).adjectives().out('array').length >0){
                           adjectives.push(element)
                            
                        }

         

                    })
                    
                    nouns = nouns.slice(0, 50)
                    verbs = verbs.slice(0, 50)
                    adjectives = adjectives.slice(0,50)
                   
                }



            }
        );

    });

}