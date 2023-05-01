
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Link, Navigate } from 'react-router-dom';
import './singlepost.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/base';


class SinglePostClass extends Component {
  
        state = {
          post: null,
          comment: '',
          isLiked: false,
          isDisliked: false,
          numLikes: 0,
          numDislikes: 0,
          error: null,
          searchText: '',
          showComments: false
        };
      
        componentDidMount() {
          const { postId } = this.props;
       
          fetch('http://127.0.0.1:8000/get_post_details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
              postid: postId
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch post data');
            }
            return response.json();
          })
          .then(data => {
            if (data.status === 'SUCCESS') {
              const { made_by, creation_date, no_likes, no_dislikes, points, isReshared, post_id, no_views, no_comments, image, desc, category , comments} = data.post;
              this.setState({
                post: {
                  madeBy: made_by,
                  creationDate: creation_date,
                  noLikes: no_likes,
                  noDislikes: no_dislikes,
                  points: points,
                  isReshared: isReshared,
                  postId: post_id,
                  noViews: no_views,
                  noComments: no_comments,
                  image: image,
                  desc: desc,
                  category: category,
                  comments: comments
                },
              
                numLikes: data.post.no_likes,
                numDislikes: data.post.no_dislikes
              });
            } else {
              throw new Error(data.message);
            }
          })
          .catch(error => {
            this.setState({ error: error.message });
          });
          
        }
      
        handleInputChangeComment = event => {
          this.setState({ comment: event.target.value });
        };
        handleCommentsClick = () => {
            this.setState(prevState => ({
              showComments: !prevState.showComments
            }));
          };
          
        handleCommentSubmit = event => {
            event.preventDefault();
            const { postId } = this.props;
            const { comment, post } = this.state;
            const username = Cookies.get('username');
          
            fetch('http://127.0.0.1:8000/add_comment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`
              },
              body: JSON.stringify({
                postid: postId,
                comment: comment,
                username: username
              })
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to submit comment');
              }
              return response.json();
            })
            .then(data => {
              if (data.status === 'SUCCESS') {
                const newPost = { ...post };
                newPost.noComments = data.no_comments;
                newPost.comments = data.comments;
                this.setState({ post: newPost, comment: '' });
              } else {
                throw new Error(data.message);
              }
            })
            .catch(error => {
              this.setState({ error: error.message });
            });
          };

          handleCommentDelete = async (index) => {
            const comments = [...this.state.post.comments];
            const commentToDelete = comments[index];
            const { postId } = this.props;
            const payload = {
              postid: postId,
              commentid: commentToDelete.comment_id,
              username: Cookies.get('username')
            };
            try {
              const response = await fetch('http://127.0.0.1:8000/delete_comment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify(payload)
              });
              if (response.ok) {
                const data = await response.json();
                if (data.status === 'SUCCESS' && data.isCommentDeleted) {
                  comments.splice(index, 1);
                  const updatedPost = {
                    ...this.state.post,
                    comments: comments,
                    noComments: comments.length
                  };
                  this.setState({
                    post: updatedPost
                  });
                } else {
                  console.log(data.message);
                }
              } else {
                console.log('Something went wrong. Please try again later.');
              }
            } catch (error) {
              console.log(error);
            }
          };
        
          
          
          
        handleLike = () => {
            const { postId } = this.props;
          
            fetch('http://127.0.0.1:8000/like_dislike_post', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`
              },
              body: JSON.stringify({
                postid: postId,
                liked: true
              })
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to like post');
              }
              return response.json();
            })
            .then(data => {
              if (data.status === 'SUCCESS') {
                const { post } = this.state;
                const newPost = { ...post };
                newPost.is_liked = true;
                newPost.is_disliked = false;
                newPost.num_likes = data.isUpdated ? data.no_likes : post.num_likes;
                newPost.num_dislikes = data.isUpdated ? data.no_dislikes : post.num_dislikes;
                this.setState({ post: newPost, isLiked: true, isDisliked: false, numLikes: newPost.num_likes, numDislikes: newPost.num_dislikes });
              } else {
                throw new Error(data.message);
              }
            })
            .catch(error => {
              this.setState({ error: error.message });
            });
          }
       handleDislike = () => {
        const { postId } = this.props;

  fetch('http://127.0.0.1:8000/like_dislike_post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('token')}`
    },
    body: JSON.stringify({
      postid: postId,
      liked: false
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to dislike post');
    }
    return response.json();
  })
  .then(data => {
    if (data.status === 'SUCCESS') {
      const { post } = this.state;
      const newPost = { ...post };
      newPost.is_liked = false;
      newPost.is_disliked = true;
      newPost.num_likes = data.no_likes;
      newPost.num_dislikes = data.no_dislikes;
      this.setState({ post: newPost, isLiked: false, isDisliked: true, numLikes: newPost.num_likes, numDislikes: newPost.num_dislikes });
    } else {
      throw new Error(data.message);
    }
  })
  .catch(error => {
    this.setState({ error: error.message });
  });
};

      
        handleInputChange = (event) => {
          this.setState({ searchText: event.target.value });
      }
      
      handleSubmit = async (event) => {
          event.preventDefault();
          const { limit, offset, searchText, sortby, sortType } = this.state;
          try {
              const response = await fetch('http://127.0.0.1:8000/view_public_posts', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${Cookies.get('token')}`
                  },
                  body: JSON.stringify({ limit, offset, searchText, sortby, sortType })
              });
              const data = await response.json();
              if (data.status === "SUCCESS") {
                  if (data.posts.length > 0) {
                      this.setState({ searchResults: data.posts, error: null });
                  } else {
                      this.setState({ searchResults: [], error: data.message });
                  }
              } else {
                  this.setState({ searchResults: [], error: data.message });
              }
              
          } catch (error) {
              this.setState({ error: 'Failed to fetch search results' });
          }
      }
      handleLogout = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            if (response.ok) {
                Cookies.remove('token');
                Cookies.remove('username');
                // Redirect to login page
                return <Navigate to="/login" />
            }
        } catch (error) {
            console.log(error);
        }
    }
       
      render() {
        const { post, isLiked, isDisliked, numLikes, numDislikes, error, searchText,showComments } = this.state;
        console.log("initial render")
        console.log({isLiked})
        console.log({post})
        const username = Cookies.get('username');
        const firstInitial = username ? username.charAt(0) : '';
        
        if (!post) {
          return <div>Loading...</div>;
        }
        if (error) {
          return <div>{error}</div>;
        }
        return (
          <div>
            <div className="header">
              <div className='logo-container'>
                <img src={require('../../Images/picturePerfect.jpg')} alt="Logo" className="logo" />
              </div>
              <div className="search-container">
                <Link to="/uploadimage">
                  <button type="submit" >+ New Post</button>
                </Link>
                <form className="search-form" onSubmit={this.handleSubmit}>
                  <div className="input-wrapper">
                    <input type="text" value={searchText} onChange={this.handleInputChange} placeholder="Images, #tags, @users" />
                    <button type="submit">Search</button>
                  </div>
                </form>
              </div>
              <div className="profile-container">
                <div className="profile-initial">{firstInitial}</div>
                <div className="profile-username">{username}</div>
                <div className="profile-dropdown">
                  <button className="profile-dropdown-button">⋮</button>
                  <div className="profile-dropdown-content">
                    <Link to="/user-profile">View Profile</Link>
                    <button onClick={this.handleLogout}>Logout</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="single-post">
              <div className="post-header">
                <img src={post.image} alt={post.desc} />
                <div className="post-info">
                  <div className="post-user">
                    <span>Username : {post.madeBy}</span>
                  </div>
                  <div className="post-stats">
                    <span className="post-views">{post.noViews} views</span>
                    <span className="post-likes">
                        
  <FontAwesomeIcon icon={faThumbsUp} className={`${isLiked ? 'active' : ''}`} onClick={this.handleLike} />
  <span>{numLikes}</span>
</span>
<span className="post-dislikes">
  <FontAwesomeIcon icon={faThumbsDown} className={`${isDisliked ? 'active' : ''}`} onClick={this.handleDislike} />
  <span>{numDislikes}</span>
</span>
{post.noComments > 0 && (
      <span className="post-comments" onClick={this.handleCommentsClick}>{post.noComments} comments</span>
    )}
                  </div>
                </div>
              </div>
              {showComments && post.noComments > 0 && (
  <div className="post-comments-section">
    {post.comments.map((comment, index) => (
      <div className="post-comment" key={index}>
        <span className="comment-username">{comment.username}: </span>
        <span className="comment-text">{comment.comment}</span>
        <button onClick={() => this.handleCommentDelete(index)}>
  <FontAwesomeIcon icon={faTrash} />
</button>

      </div>
    ))}
   
  </div>
)}

              <div className="post-body">
                <p>{post.desc}</p>
              </div>
              
            </div>
            <div className="post-footer">
                <div className="post-comment">
                  <input type="text" placeholder="Add a comment" value={this.state.comment} onChange={this.handleInputChangeComment} />
                  <button className='comment-button' onClick={this.handleCommentSubmit}>Comment</button>
                  <Link to='/post/:postId/purchase'>
                  <Button className='buy-button'>Buy</Button>
                  </Link>
                 
                </div>
               
                  
               
            </div>
          </div>
        );
      }
      
      
      
}

const SinglePost = (props) => {
  const postId = useParams().postId;


  return <SinglePostClass postId={postId} {...props} />;
};

export default SinglePost;


      