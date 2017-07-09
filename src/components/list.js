import React from 'react';
import { render } from 'react-dom';



const List = (commentArray) => {
  
  const commentItem = commentArray.map((comment) => {
    
    if (comment.replyCount){
      
      
          return (
      <div>
      <div className="ui image label">
  <img  src={comment.authorImage}/>
  {comment.author}

</div>


  &nbsp; {comment.replyCount} <i className="comments icon"></i> {comment.date} (UTC)

<h5><a target="_blank" href={"https://www.youtube.com/watch?v="+comment.videoID}> {comment.videotitle}</a></h5>
      <p>{comment.comment}</p>

<br/>
<hr/>
<br/>
</div>

      )
      
      
      
      
    }
    
    
    return (
      <div>
      <div className="ui image label">
  <img  src={comment.authorImage}/>
  {comment.author}

</div>


  &nbsp; {comment.likeCount} <i className="up arrow icon"></i> {comment.date} (UTC)

<h5><a target="_blank" href={"https://www.youtube.com/watch?v="+comment.videoID}> {comment.videotitle}</a></h5>
      <p>{comment.comment}</p>

<br/>
<hr/>
<br/>
</div>

      )
  })
  
    return (
      <div>

  {commentItem}
  
    </div>
  )

}

export default List;
