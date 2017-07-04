import React from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import { TagCloud } from "react-tagcloud";

const data = [
  { text: 'Hey', value: 1000 },
  { text: 'lol', value: 200 },
  { text: 'first impression', value: 800 },
  { text: 'very cool', value: 1000000 },
  { text: 'duck', value: 10 },
];


 
const fontSizeMapper = word => Math.log2(word.value) * 5;
const rotate = word => word.value % 360;



const AnalysisDetail = (analysis) => {
  console.log(analysis)
   
    if (!analysis){
        return <div>Loading...</div>;
    }
    
  if(analysis) {return (
      <div>

  
  
   <TagCloud minSize={12}
            maxSize={35}
            tags={analysis.analysis}
            onClick={tag => alert(`'${tag.value}' was selected!`)} />
  
    </div>
  )
}
}

export default AnalysisDetail;

