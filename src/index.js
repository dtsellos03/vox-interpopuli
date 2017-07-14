import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import SearchBar from './components/search_bar';
import AnalysisDetail from './components/analysis_detail'
import CommentSearch from './functions/comment_search'
import AnalysisMetrics from './components/analysismetrics'



  


class App extends React.Component {
    

  
  constructor(props) {
    super(props);
    this.CommentSearch = CommentSearch.bind(this)
    this.state = { analyses: ['MEOW', 'DOG', 'CAT', "RAR"], selectedAnalysis: {kind:"INITIAL", data: [{ text: 'Search!', value: 1000 }]} };
    
  // this.CommentSearch('cats', (returnObj) => {
  //       this.setState({ analyses: returnObj, selectedAnalysis: returnObj[0] })
  // });
  }
  
  
  
  
  render() {
    return (

<div className="ui padded container">
<h1 className="ui header">Vox Interpopulgi</h1>
<h5 className="ui header">The voice of the Intertubes</h5>
<div className="ui container">
<span>
<div><SearchBar onSearchSubmit={term => 

this.CommentSearch(term, (returnObj) => {

        this.setState({ analyses: returnObj, selectedAnalysis: returnObj.twoGrams })


   })}/>
   
  
       <AnalysisMetrics analysisInfo={this.state.analyses.analysisInfo} />
   <br></br>

   </div>
   
   <div> </div>
   </span>
</div>
<div className="flex-container">


<div className="fixed column">
<div className="stickymenu">

  
    <div className="ui huge vertical menu">
    
     <div className="item">
     
    <div className="header">Comments</div>

  <div className="menu">
     <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses.mostLiked})}>
        Most Liked
      </a>
     <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses.mostReplied })}>
        Most Replies
      </a>
     </div>
    </div>
    
    <div className="item">
       
    <div className="header">Phrases</div>

  
  <div className="menu">
  
      <a className="item"  onClick={event => this.setState({ selectedAnalysis: this.state.analyses.twoGrams })}>
        Two words
      </a>
      <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses.threeGrams })}>
        Three words
      </a>
      <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses.fourGrams })}>
        Four words
      </a>
      
      </div>
      
      </div>
      
      <div className="item">
  
      
    <div className="header">Parts of Speech</div>

     <div className="menu">
      <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses.nouns })}>
        Nouns
      </a>
     <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses.adjectives })}>
        Adjectives
      </a>
            <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses.verbs })}>
        Verbs
      </a>
      
        </div>
      </div>
        
      
</div>

  </div>
  </div>
  
  
  <div className="flex column flex-column">
    <div className="ui segment">
      	<AnalysisDetail analysis={this.state.selectedAnalysis}/>
    </div>

</div>
</div>
</div>
      )
  }
  

}



ReactDOM.render(
  <App />,
  document.getElementById('main')
)


