
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Link, Navigate } from 'react-router-dom';
import './singlepost.css';
import { useParams } from 'react-router-dom';

class SinglePostClass extends Component {
  
        state = {
          post: null,
          comment: '',
          isLiked: false,
          isDisliked: false,
          numLikes: 0,
          numDislikes: 0,
          error: null,
          searchText: ''
        };
      
        componentDidMount() {
          const { postId } = this.props;
          console.log("$$$$$$$$$$$$$$$")
          console.log({postId})
        
          fetch('http://127.0.0.1:8000/get_post_details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
              postId: postId
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
              this.setState({
                post: data.post,
                isLiked: data.post.is_liked,
                isDisliked: data.post.is_disliked,
                numLikes: data.post.num_likes,
                numDislikes: data.post.num_dislikes
              });
            } else {
              throw new Error(data.message);
            }
          })
          .catch(error => {
            this.setState({ error: error.message });
          });
        }
      
        handleInputChange = event => {
          this.setState({ comment: event.target.value });
        };
      
        handleCommentSubmit = event => {
          event.preventDefault();
          const { postId } = this.props.match.params;
          const { comment } = this.state;
      
          fetch('/api/comments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
              postId: postId,
              comment: comment
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
              const { post } = this.state;
              const newPost = { ...post };
              newPost.num_comments += 1;
              this.setState({ post: newPost, comment: '' });
            } else {
              throw new Error(data.message);
            }
          })
          .catch(error => {
            this.setState({ error: error.message });
          });
        };
      
        handleLike = () => {
          const { postId } = this.props.match.params;
        
          fetch('/api/like', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
              postId: postId
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
              newPost.num_likes = data.num_likes;
              newPost.num_dislikes = data.num_dislikes;
              this.setState({ post: newPost, isLiked: true, isDisliked: false, numLikes: data.num_likes, numDislikes: data.num_dislikes });
            } else {
              throw new Error(data.message);
            }
          })
          .catch(error => {
            this.setState({ error: error.message });
          });
        }
        handleDislike = () => {
          const { postId } = this.props.match.params;
        
          fetch('/api/dislike', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
              postId: postId
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
              newPost.num_likes = data.num_likes;
              newPost.num_dislikes = data.num_dislikes;
              this.setState({ post: newPost, isLiked: false, isDisliked: true, numLikes: data.num_likes, numDislikes: data.num_dislikes });
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
       
        render() {
          const { post, comment, isLiked, isDisliked, numLikes, numDislikes, error, searchText } = this.state;
          
              const username = Cookies.get('username');
              const firstInitial = username ? username.charAt(0) : '';
          if (!post) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <div>{error}</div>;
          }
          return (
            <div className="container">
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
                      <Link to={`/user/${post.made_by}`}>{post.made_by}</Link>
                    </div>
                    <div className="post-stats">
                      <span className="post-views">{post.no_views} views</span>
                      <span className="post-likes">
                        <i className={`fa fa-thumbs-up ${isLiked ? 'active' : ''}`} aria-hidden="true" onClick={this.handleLike}></i>
                        <span>{numLikes}</span>
                      </span>
                      <span className="post-dislikes">
                        <i className={`fa fa-thumbs-down ${isDisliked ? 'active' : ''}`} aria-hidden="true" onClick={this.handleDislike}></i>
                        <span>{numDislikes}</span>
                      </span>
                      <span className="post-comments">{post.no_comments} comments</span>
                    </div>
                  </div>
                </div>
                <div className="post-body">
                  <p>{post.desc}</p>
                </div>
                <div className="post-footer">
                  <div className="post-comment">
                    <input type="text" placeholder="Add a comment" value={comment} onChange={this.handleInputChange} />
                    <button onClick={this.handleComment}>Comment</button>
                  </div>
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


      