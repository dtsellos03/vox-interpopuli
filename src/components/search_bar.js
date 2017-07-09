import React, {Component} from 'react';



class SearchBar extends Component {
  constructor(props) {
    super(props) 
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.state = { searchTerm: '' };
  }
  
  onFormSubmit(event){
    event.preventDefault();
    this.props.onSearchSubmit(this.state.searchTerm)
  }
  
  render() {
    return (
      <form onSubmit={this.onFormSubmit} className="ui form">
       <div className="ui action input">
      <input 
      value={this.state.searchTerm} 
      onChange={event => this.setState({ searchTerm: event.target.value })} 
     
      />
    
      <button  type ="submit" className="ui button" >Search</button>
    </div>
      </form>
      
      
      );
  }
  

  
  onSubmit(searchTerm){
    this.props.onSearchSubmit(searchTerm);
  }
}

export default SearchBar;

