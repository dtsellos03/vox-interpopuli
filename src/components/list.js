import React from 'react';
import { render } from 'react-dom';



const List = (commentArray) => {
  
  const commentItem = commentArray.map((comment) => {
    return (
      <div>
      <div className="ui image label">
  <img  src={comment.authorImage}/>
  {comment.author}
  <i className="delete icon"></i>
</div>

<a className="ui label">
  <i className="mail icon"></i> {comment.likeCount} Likes
</a>

<h5>{comment.videotitle}</h5>
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
