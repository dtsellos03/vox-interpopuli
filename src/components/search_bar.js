import React, {Component} from 'react';


class SearchBar extends Component {
  constructor(props) {
    super(props) 
    
    this.state = { searchTerm: '' };
  }
  render() {
    return (
      <div>
      
      <input 
      value={this.state.searchTerm} 
      onChange={event => this.setState({ searchTerm: event.target.value })} />
    
      <button  onClick={event => this.onSubmit(this.state.searchTerm)} >Search</button>
      </div>
      );
  }
  
  onSubmit(searchTerm){
    this.props.onSearchSubmit(searchTerm);
  }
}

export default SearchBar;
