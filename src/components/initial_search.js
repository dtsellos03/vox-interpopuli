import React from 'react';
import { render } from 'react-dom';



const InitialSearch = (commentArray) => {
  

  
    return (
      <div className="ui very padded text">

  <h1>Please enter a search term to see what YouTube has to say about it.</h1>
  <h3>This application retrieves the fifty most relevant videos 
  and analyzes one hundred comments from each video. The most commonly used phrases, adjectives, nouns, etc are then presented in a tag cloud.</h3>
  
    </div>
  )

}

export default InitialSearch;
