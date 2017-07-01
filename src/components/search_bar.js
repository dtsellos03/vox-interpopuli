import React, {Component} from 'react';



class SearchBar extends Component {
  constructor(props) {
    super(props) 
    
    this.state = { searchTerm: '' };
  }
  render() {
    return (
      <div className="ui action input">
      
      <input 
      value={this.state.searchTerm} 
      onChange={event => this.setState({ searchTerm: event.target.value })} 
     
      />
    
      <button  className="ui button" onClick={event => this.onSubmit(this.state.searchTerm)} >Search</button>
    
      </div>
      );
  }
  

  
  onSubmit(searchTerm){
    this.props.onSearchSubmit(searchTerm);
  }
}

export default SearchBar;
