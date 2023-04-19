import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import './profile.css';

import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Footer/Footer';

class UserProfile extends Component {
    state = {
        limit: 5,
        offset: 0,
        searchText: '',
        sortby: '',
        sortType: 'ASC',
        posts: [],
        error: null
    }

    handleInputChange = (event) => {
        this.setState({ searchText: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { limit, offset, searchText, sortby, sortType } = this.state;
        try {
            const response = await fetch('http://44.197.240.111/view_public_posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify({ limit, offset, searchText, sortby, sortType })
            });
            const data = await response.json();
            this.setState({ posts: data.posts, error: null });
        } catch (error) {
            this.setState({ error: 'Failed to fetch search results' });
        }
    }

    componentDidMount = async () => {
        try {
            const username = Cookies.get('username');
            const { limit, offset, searchText, sortby, sortType } = this.state;
            const response = await fetch('http://44.197.240.111/list_user_posts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`,
              },
              body: JSON.stringify({ limit, offset, searchText, sortby, sortType, username }),
            });
            const { status: message, posts, noOfPosts } = await response.json();
            if (message === 'SUCCESS') {
              if (noOfPosts === 0) {
                this.setState({ error: 'No posts found for the corresponding user', posts: [] });
              } else {
                this.setState({ posts, error: null });
              }
            } else {
              this.setState({ error: 'Failed to fetch user posts' });
            }
          } catch (error) {
            this.setState({ error: 'Failed to fetch user posts' });
          }
          
    }
    

    render() {
        const { searchText, posts, error } = this.state;
        const username = Cookies.get('username');
        console.log(username)
        const firstInitial = username ? username.charAt(0) : '';
        return (
        <div>
        
        <header className='header'>
      <h1>Picture Perfect</h1>
      
        <div>
        
        <Link to="/uploadimage">
          <button  className="new-post-button">
            <FontAwesomeIcon icon={faPlus} className="icon" />
            New Post
          </button>
          </Link>
        </div>
    
        <div className="header-right">
          <input type="text" placeholder="Images, #tags, @users" className="search-bar" onClick={this.handleInputChange}  />
          <button className="search-button" onClick={this.handleSubmit}>
            <FontAwesomeIcon icon={faSearch} className="icon" />
          </button>
        </div>
    
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </header>
                    <div className="search-container">
                
                
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
                
      
        <div class="profile-edit-container">
   
                <div className="profile-edit-initial">{firstInitial}</div>
                <div className="profile-edit-username">{username}</div>
                <button className="edit-button" onClick={() => window.location.href='/edit-profile'}>
                    <FontAwesomeIcon icon={faEdit} />
                  
                </button>
                  
</div>

        <div className='categories'>
        <h2 className="category-head">All Posts</h2>
        </div>  
        {error && <div>{error}</div>}
        <div className="row-cards">
            {posts.map((post, index) => (
                <div key={post.post_id} className="publiccard">
                     <img src={post.image} alt={post.desc} />
                    <h2>{post.desc}</h2>
                    <p>Made by: {post.made_by}</p>
                    <p>No. of views: {post.no_views}</p>
                    <p>No. of likes: {post.no_likes}</p>
                    <p>No. of dislikes: {post.no_dislikes}</p>
                    <span>{post.posted_on}</span>
                            </div>
                      ))}
                        
                    </div>
                <Footer/>
                
            </div>
        );
    }
    
}

export default UserProfile;
