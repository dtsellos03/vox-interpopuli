import React from 'react';
import { render } from 'react-dom';



const AnalysisMetrics = (obj) => {
  
    console.log(obj.analysisInfo)
    
    if (!obj.analysisInfo){
      
          return (
                null

      )
      
      
      
    }
    
    
    return (
   

   <h5 className="ui header">Analyzed {obj.analysisInfo.videos} videos, {obj.analysisInfo.comments.toLocaleString()} comments</h5>
   


      )

  
  

}

export default AnalysisMetrics;
