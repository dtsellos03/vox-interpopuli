//var commentURL = 'https://www.googleapis.com/youtube/v3/commentThreads?key='+api_key+'&textFormat=plainText&part=snippet&videoId='+videoID+'&maxResults=100'


// SEARCH

function analyzeComments(searchTerm, res) {

    
    var path = require("path");
    const api_key = require('./api_key.js')


    var request = require('request');
    var async = require('async');
    var natural = require('natural');
    var tokenizer = new natural.WordTokenizer();
    var sw = require('stopword')
var path = require("path");

var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';
 
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);


    var NGrams = natural.NGrams;

    var searchURL = 'https://www.googleapis.com/youtube/v3/search?key=' + api_key + '&textFormat=plainText&part=snippet&q=' + searchTerm + '&type=video&maxResults=50'

    request(searchURL, function(error, response, body) {
        var videoIDs = []
        var parsed = JSON.parse(body)
        parsed.items.forEach(function(element) {
            videoIDs.push(element.id.videoId);
        })

        var totalcomment = []
        async.forEachOfLimit(videoIDs, 1000, function(value, key, callback) {

                var videoID = videoIDs[key]
                var url = 'https://www.googleapis.com/youtube/v3/commentThreads?key=' + api_key + '&textFormat=plainText&part=snippet&videoId=' + videoID + '&maxResults=100'

                request(url, function(error, response, body) {

                    if (!error) {

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
                    }
                    callback();

                });

            },
            function(err) {
                
                // AFTER ALL REQUESTS COMPLETE

                if (err) {
                    console.log(err)
                }

             

                console.log("DONE!")

                function tokenizeArray(array) {
                    var tokenizedComments = []
                    array.forEach(function(element) {
                        var tokenized = tokenizer.tokenize(element)
                        tokenized = sw.removeStopwords(tokenized)
                        tokenizedComments = tokenizedComments.concat(tokenized)
                    })
                    return tokenizedComments
                }


                function NGRAMSanalysis(array) {

                    var NGRAMarray = []

                    array.forEach(function(element) {
                        combinedString = NGrams.ngrams(element, 3)
                        combinedString.forEach(function(element) {
                            NGRAMarray.push(element.join())
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

                    return counts


                }


                function sortedArray(counts) {

                    var sortable = [];
                    for (var element in counts) {
                        //console.log(element)
                        if (counts[element] > 5) {
                            sortable.push([element, counts[element]]);
                        }

                    }

                    sortable.sort(function(a, b) {
                        return a[1] - b[1];
                    });

                    return sortable


                }
                
                

                // NGRAMS ANALYSIS
                var grams_var = NGRAMSanalysis(totalcomment)
                var finalNGARMS = sortedArray(countTotals(NGRAMSanalysis(totalcomment)))

                //console.log(finalNGARMS)
                

                //OTHER ANALYSIS

                var tokenizedComments = tokenizeArray(totalcomment)
                var counts = countTotals(tokenizedComments)
                var sortable = sortedArray(counts)
                var nouns, verbs, adjectives = []
                
                
               // console.log(sortable)
                
                
                function POSanalyzer(array) {


                    array.forEach(function(element) {
                        
                        var word = element[0]
                       
                        
                        if ((tagger.tag([word]))[0][1] == "VB") {
                           verbs.push(element)
                            
                        }
                        
                        if ((tagger.tag([word]))[0][1] == "NN") {
                           nouns.push(element) 
                            
                        }
                        
                        if ((tagger.tag([word]))[0][1] == "JJ") {
                           adjectives.push(element)
                            
                        }

         

                    })
                   
                }


                POSanalyzer(sortable)

                var returnObj = finalNGARMS
                
                if(res){
                                    res.render('results.ejs', {
                    returnObj: returnObj
                });
                }



            }
        );

    });

}

analyzeComments('spicer')

module.exports = analyzeComments

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
