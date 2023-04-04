import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import './index.css';

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
            const response = await fetch('http://44.197.240.111/view_user_posts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            this.setState({ posts: data.posts, error: null });
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
        <div className="container">
        <div className="header">
            <div className='logo-container'>
                <img src={require('../../Images/picturePerfect.jpg')} alt="Logo" className="logo" />
            </div>
           
        </div>
        <div className="search-container">
            <div className="post">
                <button type="submit">+ New Post</button>
            </div>

            <form className="search-form" onSubmit={this.handleSubmit}>
                <div className="input-wrapper">
                    <input type="text" value={searchText} onChange={this.handleInputChange} placeholder="Images, #tags, @users" />
                    <button type="submit">Search</button>
                </div>
            </form>
        </div>
        <div class="profile-container">
   {/* <div className="profile-initial">{firstInitial}</div>
                <div className="profile-username">{username}</div> */}
                <div className="profile-initial">A</div>
                <div className="profile-username">Alekya</div>
                <button className="edit-button" onClick={() => window.location.href='/edit-profile'}>
                    <FontAwesomeIcon icon={faEdit} />
                    {/* <span className="edit-text">Edit</span> */}
                </button>
</div>

               
        <h1>All Posts</h1>
        {error && <div>{error}</div>}
        <div className="row-cards">
            {posts.map((post, index) => (
                <div key={post.post_id} className="card">
                    <img src={require("../../Images/photo1.jpeg")} alt={post.desc} />
                    <h2>{post.desc}</h2>
                    <p>Made by: {post.made_by}</p>
                    <p>No. of views: {post.no_views}</p>
                            <p>No. of likes: {post.no_likes}</p>
                            <p>No. of dislikes: {post.no_dislikes}</p>
                                <span>{post.posted_on}</span>
                            </div>
                        ))}
                    </div>
                
            </div>
        );
    }
    
}

export default UserProfile;
