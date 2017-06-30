import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import SearchBar from './components/search_bar';
//import CommentSearch from './rough_search'
import AnalysisDetail from './components/analysis_detail'
var nlp = require('compromise')


class App extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = { analyses: ['MEOW', 'DOG', 'CAT', "RAR"], selectedAnalysis: [{ text: 'Search!', value: 1000 }] };
    
   this.CommentSearch('meow')
  }
  
  
  
  render() {
    return (
      <div>
      <div><SearchBar onSearchSubmit={term => this.CommentSearch(term)}/></div>

      <div><li onClick={event => this.setState({ selectedAnalysis: this.state.analyses[0] })}>NGRAMS</li></div>
      <div><li onClick={event => this.setState({ selectedAnalysis: this.state.analyses[1] })}>Nouns</li></div>
      <div><li onClick={event => this.setState({ selectedAnalysis: this.state.analyses[2] })}>Adjectives</li></div>
      <div><li onClick={event => this.setState({ selectedAnalysis: this.state.analyses[3] })}>Verbs</li></div>
      
      <div><AnalysisDetail analysis={this.state.selectedAnalysis}/></div>
      
      </div>
      )
  }
  
  
  
  
  
CommentSearch(searchTerm) {
  
    console.log(this.state.analyses)
    var self = this;

    
    var path = require("path");
    const api_key = require('../api_key.js');


    var request = require('es6-request');
    var async = require('async');
    var natural = require('natural');
    var tokenizer = new natural.WordTokenizer();
    var sw = require('stopword');



    var NGrams = natural.NGrams;

    var searchURL = 'https://www.googleapis.com/youtube/v3/search?key=' + api_key + '&textFormat=plainText&part=snippet&q=' + searchTerm + '&type=video&maxResults=50'

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
              // console.log(nouns)
              // console.log(adjectives)
              // console.log(verbs)
                
                // RETURN

                var returnObj = [finalNGRAMS, nouns, adjectives, verbs];
                
             
                
     
                
               self.setState({ analyses: returnObj })
                           console.log(self.state);
                
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
                    //console.log(array)
                    array.forEach(function(element) {
                     // console.log(element)
                        let combinedString = NGrams.ngrams(element, 3)
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
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}



ReactDOM.render(
  <App />,
  document.getElementById('main')
)


