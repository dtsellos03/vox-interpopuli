import React from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import { TagCloud } from "react-tagcloud";
import  List  from './list'




 
const fontSizeMapper = word => Math.log2(word.value) * 5;
const rotate = word => word.value % 360;
const Loading = require('react-loading-animation');



const AnalysisDetail = (analysis) => {
  
    console.log(analysis)
  
  var processedList = analysis.analysis.data;


   
    if (!analysis){
        return <div>Loading...</div>;
    }
    
  if(analysis) { 
    
    
    if(analysis.analysis.kind == "LOADING"){
 
      return <div><Loading /></div>
 
    }
    
    if(analysis.analysis.kind == "COMMENT"){
 
      return List(analysis.analysis.data)
    }
    
  
    return (
      <div>

  
   <TagCloud minSize={12}
            maxSize={35}
            tags={processedList}
            onClick={tag => alert(`'${tag.value}' was selected!`)} />
  
    </div>
  )
}

}

export default AnalysisDetail;

