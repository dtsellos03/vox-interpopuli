import React from 'react';
import { render } from 'react-dom';

import { TagCloud } from "react-tagcloud";
import  List  from './list';
import ParagraphText from './paragraph_text';
import InitialSearch from './initial_search';

const Loading = require('react-loading-animation');

const options = {
  luminosity: 'light',
  hue: 'red'
};

const AnalysisDetail = (analysis) => {
  
    console.log(analysis)
  
  var processedList = analysis.analysis.data;

    
  if(analysis) {
    
    if(analysis.analysis.kind == "PARAGRAPH") {
      return ParagraphText(analysis.analysis.data)
      
    }
    
    if(analysis.analysis.kind == "INITIAL") {
      
      return <InitialSearch/>
      
    }
    
    
    if(analysis.analysis.kind == "LOADING"){
 
      return <div><Loading /></div>
 
    }
    
    if(analysis.analysis.kind == "COMMENT"){
 
      return List(analysis.analysis.data)
    }
    
    
    const customRenderer = (tag, size, color) => (
  <span key={tag.value}
        style={{
          fontSize: `${size}em`,
          margin: '5px',
          padding: '5px',
          display: 'inline-block',
          color: `${color}`,
        }}>{tag.value}</span>
);
    
    
    
  
    return (
      <div>

  
  <TagCloud tags={processedList}
            minSize={2.3}
            maxSize={3}
            renderer={customRenderer} />
  
    </div>
  )
}

}

export default AnalysisDetail;

