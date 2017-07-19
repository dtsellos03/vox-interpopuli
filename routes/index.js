var express = require('express');
var router = express.Router();
    var path = require("path");
    const api_key = require('../api_key.js');

   
    
    var generator = require('ngram-natural-language-generator');
 


    var request = require('request');
    var moment = require('moment');
    var async = require('async');
    var natural = require('natural');
    var tokenizer = new natural.WordTokenizer();
    var sw = require('stopword');
    var nlp = require('compromise')

    var fullCommentText = '';
    
    var NGrams = natural.NGrams;


/* GET home page. */

router.get('/test/:id', function(req, res, next) {
    
        var searchTerm = req.params.id;
        console.log("LOOKED UP VIEW!");
        
        CommentSearch(searchTerm, function(returnObj){
            res.status(201).json({
             obj: returnObj
         });
        });
 
 
        
        
   

});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;

function CommentSearch(searchTerm, callback, firstcallback) {
    
    console.time("Load functions")
  
    console.log(searchTerm);

        console.timeEnd("Load functions")

    var searchURL = 'https://www.googleapis.com/youtube/v3/search?key=' + api_key + '&textFormat=plainText&part=snippet&q=' + searchTerm + '&type=video&maxResults=50'

     console.time("Initial Requests");


    request.get(searchURL, function (error, response, body){
       
         
            
        // request.get(searchURL+'&pageToken='+JSON.parse(body).nextPageToken, function(error, response, bodytwo){

        console.timeEnd("Initial Requests")
        
        console.time("Declaring variables")
        
        var videoIDs = []
        var fullCommentText = '';
        var parsed = JSON.parse(body)
        // var secondparsed = JSON.parse(bodytwo)
        
        var topCommentNorm = {};
        var mostRepliedNorm = {};
        
        console.timeEnd("Declaring variables")
        
        
        
        var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
        var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
        var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
        var defaultCategory = 'N';
        
        var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
        var rules = new natural.RuleSet(rulesFilename);
        var tagger = new natural.BrillPOSTagger(lexicon, rules);

        
        console.time("Parse IDs")
        
        parsed.items.forEach(function(element) {
            var vidID = element.id.videoId;
            videoIDs.push({url: vidID, title: element.snippet.title});
          
            topCommentNorm[vidID]= 0;
            mostRepliedNorm[vidID] = 0;
        })
        
        // secondparsed.items.forEach(function(element) {
        //     var vidID = element.id.videoId;
        //     videoIDs.push({url: vidID, title: element.snippet.title});
           
        //     topCommentNorm[vidID]= 0;
        //     mostRepliedNorm[vidID] = 0;
        // })
        
        console.timeEnd("Parse IDs")
        
       

        var totalcomment = [];
        var mostReplied = [];
        var mostLiked = [];
        
        console.time("Comment Requests")
        
        async.forEachOfLimit(videoIDs, 1000, function(value, key, callback) {

                var videoID = videoIDs[key].url
                var videoTitle = videoIDs[key].title
                var url = 'https://www.googleapis.com/youtube/v3/commentThreads?key=' + api_key + '&textFormat=plainText&part=snippet&videoId=' + videoID + '&maxResults=100&order=relevance'

                request.get(url, function(error, response, body) {
           

                        try {

                            var parsed = JSON.parse(body)
                                //console.log(parsed.kind)
                            parsed.items.forEach(function(element) {
                                    totalcomment.push(element.snippet.topLevelComment.snippet.textOriginal.toLowerCase());
                                      ;
                                   // console.log(element.snippet.totalReplyCount)
                                    if (element.snippet.totalReplyCount > 10 && mostRepliedNorm[videoID] < 3) {
                                        fullCommentText = fullCommentText.concat(element.snippet.topLevelComment.snippet.textOriginal)
                                        mostRepliedNorm[videoID] += 1;
                                   
                                        mostReplied.push({
                                            comment: element.snippet.topLevelComment.snippet.textOriginal,
                                            videotitle: videoTitle,
                                            videoID: videoID,
                                            replyCount: element.snippet.totalReplyCount,
                                            author: element.snippet.topLevelComment.snippet.authorDisplayName,
                                            authorImage: element.snippet.topLevelComment.snippet.authorProfileImageUrl,
                                            date: moment.utc(element.snippet.topLevelComment.snippet.publishedAt).local().format('dddd, MMMM Do YYYY, h:mm a')                                            
                                        });
                                        
                                    }
                                    
                                    if (element.snippet.topLevelComment.snippet.likeCount > 10 && topCommentNorm[videoID] < 3) {
                                        fullCommentText = fullCommentText.concat(element.snippet.topLevelComment.snippet.textOriginal)
                                        topCommentNorm[videoID] += 1;
                                   
                                        mostLiked.push({
                                            comment: element.snippet.topLevelComment.snippet.textOriginal,
                                            videotitle: videoTitle,
                                            videoID: videoID,
                                            likeCount: element.snippet.topLevelComment.snippet.likeCount,
                                            author: element.snippet.topLevelComment.snippet.authorDisplayName,
                                            authorImage: element.snippet.topLevelComment.snippet.authorProfileImageUrl,
                                            date: moment.utc(element.snippet.topLevelComment.snippet.publishedAt).local().format('dddd, MMMM Do YYYY, h:mm a')
                                            
                                        });

                                        
                                    }
                                    
                                    
                                    
                                })

                        }
                        catch (err) {


                        }
                    
                    callback();

                })

            },
            function(err) {
                
                // AFTER ALL REQUESTS COMPLETE
                
                console.timeEnd("Comment Requests")

                console.time("Sort comment arrays")

                if (err) {
                    console.log(err);
                }

                 mostReplied.sort(function(a, b) {
                    return b['replyCount'] - a['replyCount']
                    });
                    
                mostReplied = mostReplied.slice(0,50)
                //console.log(mostReplied)
                
                // console.log(mostRepliedNorm)
                // console.log(topCommentNorm)
                
                mostLiked.sort(function(a, b) {
                    return b['likeCount'] - a['likeCount']
                    });
                    
               mostLiked = mostLiked.slice(0,50)
                    
            console.timeEnd("Sort comment arrays")
            
                var GeneratedSentence = '';
                
                generator.generator({
                    text: fullCommentText,
                    model: {
                        maxLength: 300,
                        minLength: 50
                    }
                }, function(err, sentence) {
                    GeneratedSentence = sentence;
                    console.log(sentence);
                });
            
                
                //console.log(totalcomment)

                // NGRAMS ANALYSIS
                
                console.time("NGRAMS")
                
                var NGRAMSarray = NGRAMSanalysis(totalcomment)

                // var finalTwoGrams = {kind: 'cloud', data: sortedArray(countTotals(NGRAMSarray[0])).slice(0,50)}
                var finalThreeGrams =  {kind: 'cloud', data: sortedArray(countTotals(NGRAMSarray[1])).slice(0,50)}
                var finalFourGrams =  {kind: 'cloud', data: sortedArray(countTotals(NGRAMSarray[2])).slice(0,50)}
               
               console.timeEnd("NGRAMS")

                //OTHER ANALYSIS
                
                console.time("Prenoun")

                var tokenizedComments = tokenizeArray(totalcomment);
                var counts = countTotals(tokenizedComments);
                var sortable = sortedArray(counts);
                
                console.timeEnd("Prenoun")

                var nouns = [];
                var verbs = [];
                var adjectives = [];
                
                console.time("POS Analyzer");
                
                NatPOSanalyzer(sortable);
                 
                console.timeEnd("POS Analyzer");
                
                
                var nounsObj = {
                    kind: 'cloud',
                    data: nouns
                }
                
                var adjectivesObj = {
                    kind: 'cloud',
                    data: adjectives
                }
                
                var verbsObj = {
                    kind: 'cloud',
                    data: verbs
                }
                
                var mostLikedObj = {
                    kind: 'COMMENT',
                    data: mostLiked
                }
                
                var mostRepliedObj = {
                    kind: 'COMMENT',
                    data: mostReplied
                }
                
                var Paragraph = {
                    kind: 'PARAGRAPH',
                    data: GeneratedSentence
                }
   
                
                // RETURN

                // var returnObj = [finalNGRAMS, nounsObj, adjectivesObj, verbsObj, mostLikedObj, mostReplied];
                
                var returnObj = {
                paragraph: Paragraph,
                // twoGrams: finalTwoGrams,
                threeGrams: finalThreeGrams,
                fourGrams: finalFourGrams,
                nouns: nounsObj, 
                adjectives: adjectivesObj, 
                verbs: verbsObj, 
                mostLiked: mostLikedObj, 
                mostReplied: mostRepliedObj,
                analysisInfo: {
                    comments: totalcomment.length,
                    videos: videoIDs.length
                }
                    
                };

             
                callback(returnObj);
     
         
                
                

                
                
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

                    var twoGRAMarray = [];
                    var threeGRAMarray = [];
                    var fourGRAMarray = [];
                    //console.log(array)
                    array.forEach(function(element) {
                     // console.log(element)
                        element = element.split(" ")
        
                        // var combinedStringTwo = NGrams.ngrams(element, 2)                      
                        var combinedStringThree = NGrams.ngrams(element, 3)
                        var combinedStringFour = NGrams.ngrams(element, 4)

                        // combinedStringTwo.forEach(function(element) {
                        //     twoGRAMarray.push(element.join(' '))
                        // })
                        
                        combinedStringThree.forEach(function(element) {
                            threeGRAMarray.push(element.join(' '))
                        })
                        
                        combinedStringFour.forEach(function(element) {
                            fourGRAMarray.push(element.join(' '))
                        })

                    })
                    return [twoGRAMarray,threeGRAMarray,fourGRAMarray]
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
                

                 function NatPOSanalyzer(array) {

                   
                    array.forEach(function(element) {
                        
                        var word = [element.value]

                        
                        switch(tagger.tag(word)[0][1]) {
                        
                            case "NN":
                
                                nouns.push(element)
                                break;
                            case "JJ":
                                adjectives.push(element)
                                break;
                            case "VB":
                                verbs.push(element)
                                break;
                            default:
                                

                        }

                    })
                    
                    nouns = nouns.slice(0, 50)
                    verbs = verbs.slice(0, 50)
                    adjectives = adjectives.slice(0,50)
                   
                }




            }
        );

    });
        // })

}