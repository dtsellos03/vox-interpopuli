
module.exports = 

function CommentSearch(searchTerm, callback) {
    
    const loadingObj = [{ text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }]
  
    console.log(this.state.analyses)
    
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
            videoIDs.push(element.id.videoId);
        })

        var totalcomment = []
        async.forEachOfLimit(videoIDs, 1000, function(value, key, callback) {

                var videoID = videoIDs[key]
                var url = 'https://www.googleapis.com/youtube/v3/commentThreads?key=' + api_key + '&textFormat=plainText&part=snippet&videoId=' + videoID + '&maxResults=100'

                request.get(url)
                .then(([body, res]) => {

                        try {


                            var parsed = JSON.parse(body)
                                //console.log(parsed.kind)
                            parsed.items.forEach(function(element) {
                                    totalcomment.push(element.snippet.topLevelComment.snippet.textOriginal.toLowerCase());
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
                
             
                     callback(returnObj);
     
                console.log("DOG")
                
                return null
                
            //   self.setState({ analyses: returnObj, selectedAnalysis: returnObj[0] })
            //               console.log(self.state);
                
           
                
                
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
                        let combinedString = NGrams.ngrams(element, 5)
                        console.log(combinedString)
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
                              text: element, value: counts[element]
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


                    array.forEach(function(element) {
                        
                        var word = element.text

                        
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