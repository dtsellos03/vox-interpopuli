import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import SearchBar from './components/search_bar';
//import CommentSearch from './rough_search'
import AnalysisDetail from './components/analysis_detail'
import CommentSearch from './functions/comment_search'



  


class App extends React.Component {
    

  
  constructor(props) {
    super(props);
    this.CommentSearch = CommentSearch.bind(this)
    this.state = { analyses: ['MEOW', 'DOG', 'CAT', "RAR"], selectedAnalysis: {kind:"LOADING", data: [{ text: 'Search!', value: 1000 }]} };
    
   this.CommentSearch('meow', (returnObj) => {

        this.setState({ analyses: returnObj, selectedAnalysis: returnObj[0] })


   });
  }
  
  
  
  
  render() {
    return (

<div className="ui very padded container">
<h1 className="ui header">Vox Interpopuli</h1>
<h5 className="ui header">The voice of the Intertubes</h5>
<div className="ui container">
<div><SearchBar onSearchSubmit={term => 

this.CommentSearch(term, (returnObj) => {

        this.setState({ analyses: returnObj, selectedAnalysis: returnObj[0] })


   })}/></div>
</div>
<div className="ui grid">
  <div className="three wide column">
    <div className="ui vertical menu">
      <a className="item"  onClick={event => this.setState({ selectedAnalysis: this.state.analyses[0] })}>
        Bigrams
      </a>
      <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses[1] })}>
        Nouns
      </a>
      <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses[2] })}>
        Adjectives
      </a>
      <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses[3] })}>
        Verbs
      </a>
     <a className="item" onClick={event => this.setState({ selectedAnalysis: this.state.analyses[4] })}>
        Most Liked
      </a>
    </div>

  </div>
  <div className="thirteen wide column">
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


