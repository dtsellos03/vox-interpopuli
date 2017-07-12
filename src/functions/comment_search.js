
module.exports = 

function CommentSearch(searchTerm, callback, firstcallback) {
    
    const loadingObj = [{ text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }, { text: 'Loading!', value: 1000 }]
  
    console.log(searchTerm)
    console.log(this.state)
    this.setState({selectedAnalysis: {kind:"LOADING", data: [{ text: 'Search!', value: 1000 }]}});
   /// this.setState({ selectedAnalysis: [{ text: 'Loading!', value: 1000 }] })
   
   // FIRST CALLBACK HERE
   // firstcallback()


    var path = require("path");
    const api_key = require('../../api_key.js');


    var request = require('es6-request');
    var moment = require('moment');
    var async = require('async');
    var natural = require('natural');
    var tokenizer = new natural.WordTokenizer();
    var sw = require('stopword');
    var nlp = require('compromise')
    
    
    request.get("/test/dog")
        .then(([bodytest, res]) => {
            console.log(bodytest)
        });


    var NGrams = natural.NGrams;

    var searchURL = 'https://www.googleapis.com/youtube/v3/search?key=' + api_key + '&textFormat=plainText&part=snippet&q=' + encodeURI(searchTerm) + '&type=video&maxResults=50'

    request.get(searchURL)
        .then(([body, res]) => {
            
        request.get(searchURL+'&pageToken='+JSON.parse(body).nextPageToken)
        .then(([secondbody, res]) => {
        
        var videoIDs = []
        var parsed = JSON.parse(body)
        var secondparsed = JSON.parse(secondbody)
        
        var topCommentNorm = {};
        var mostRepliedNorm = {};
        
        
        parsed.items.forEach(function(element) {
            let vidID = element.id.videoId;
            videoIDs.push({url: vidID, title: element.snippet.title});
            topCommentNorm[vidID]= 0;
            mostRepliedNorm[vidID] = 0;
        })
        
        secondparsed.items.forEach(function(element) {
            let vidID = element.id.videoId;
            videoIDs.push({url: vidID, title: element.snippet.title});
            topCommentNorm[vidID]= 0;
            mostRepliedNorm[vidID] = 0;
        })

        var totalcomment = [];
        var mostReplied = [];
        var mostLiked = [];
        
        async.forEachOfLimit(videoIDs, 1000, function(value, key, callback) {

                var videoID = videoIDs[key].url
                var videoTitle = videoIDs[key].title
                var url = 'https://www.googleapis.com/youtube/v3/commentThreads?key=' + api_key + '&textFormat=plainText&part=snippet&videoId=' + videoID + '&maxResults=100&order=relevance'

                request.get(url)
                .then(([body, res]) => {

                        try {

                            var parsed = JSON.parse(body)
                                //console.log(parsed.kind)
                            parsed.items.forEach(function(element) {
                                    totalcomment.push(element.snippet.topLevelComment.snippet.textOriginal.toLowerCase());
                                   // console.log(element.snippet.totalReplyCount)
                                    if (element.snippet.totalReplyCount > 10 && mostRepliedNorm[videoID] < 3) {
                                        
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
                    
                mostReplied = mostReplied.slice(0,50)
                //console.log(mostReplied)
                
                console.log(mostRepliedNorm)
                console.log(topCommentNorm)
                
                mostLiked.sort(function(a, b) {
                    return b['likeCount'] - a['likeCount']
                    });
                    
               mostLiked = mostLiked.slice(0,50)
                    
               // console.log(mostLiked)
                
                var final = nlp("Books")
                final = final.verbs().out('array')
                console.log(final.length);
                console.log(totalcomment.length)
                
                //console.log(totalcomment)

                // NGRAMS ANALYSIS
                
                var NGRAMSarray = NGRAMSanalysis(totalcomment)

                var finalTwoGrams = {kind: 'cloud', data: sortedArray(countTotals(NGRAMSarray[0])).slice(0,50)}
                var finalThreeGrams =  {kind: 'cloud', data: sortedArray(countTotals(NGRAMSarray[1])).slice(0,50)}
                var finalFourGrams =  {kind: 'cloud', data: sortedArray(countTotals(NGRAMSarray[2])).slice(0,50)}
               

                //OTHER ANALYSIS

                var tokenizedComments = tokenizeArray(totalcomment);
                var counts = countTotals(tokenizedComments);
                var sortable = sortedArray(counts);

                var nouns = [];
                var verbs = [];
                var adjectives = [];
                
                 POSanalyzer(sortable);
                
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
   
                
                // RETURN

                // var returnObj = [finalNGRAMS, nounsObj, adjectivesObj, verbsObj, mostLikedObj, mostReplied];
                
                var returnObj = {
                twoGrams: finalTwoGrams,
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
     
         
                
                return null

                
                
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
                        let combinedStringTwo = NGrams.ngrams(element, 2)                      
                        let combinedStringThree = NGrams.ngrams(element, 3)
                        let combinedStringFour = NGrams.ngrams(element, 4)

                        combinedStringTwo.forEach(function(element) {
                            twoGRAMarray.push(element.join(' '))
                        })
                        
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
        })

}