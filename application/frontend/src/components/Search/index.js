import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Link, Navigate } from 'react-router-dom'
import './index.css';

class Search extends Component {
    state = {
        limit: 5,
        offset: 0,
        searchText: '',
        sortby: '',
        sortType: 'ASC',
        categories: [],
        searchResults: [],
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
            this.setState({ searchResults: data.posts, error: null });
        } catch (error) {
            this.setState({ error: 'Failed to fetch search results' });
        }
    }

    componentDidMount = async () => {
        try {
            const response = await fetch('http://44.197.240.111/get_categories?limit=' + this.state.limit + '&offset=' + this.state.offset, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            const data = await response.json();
            this.setState({ categories: data.categories, error: null });
        } catch (error) {
            this.setState({ error: 'Failed to fetch categories' });
        }
    }

    render() {
        const { searchText, categories, searchResults, error } = this.state;
        const username = Cookies.get('username');
        console.log(username)
        const firstInitial = username ? username.charAt(0) : '';
        return (
            <div className="container">
            <div className="header">
                <div className='logo-container'>
                    <img src={require('../../Images/picturePerfect.jpg')} alt="Logo" className="logo" />
                </div>
                <Link to="/user-profile" className="profile">
                    <div className="profile-initial">{firstInitial}</div>
                    <div className="profile-username">{username}</div>
                </Link>
            </div>
                <div className="search-container">
                    <div className="post">
                    <Link to="/uploadimage">
                        <button type="submit" >+ New Post</button>
                    </Link>
                    </div>

                    <form className="search-form" onSubmit={this.handleSubmit}>
                        <div className="input-wrapper">
                            <input type="text" value={searchText} onChange={this.handleInputChange} placeholder="Images, #tags, @users" />
                            <button type="submit">Search</button>
                        </div>
                    </form>
                </div>
                {error && <div>{error}</div>}
                {
                    categories.length > 0 &&
                    <>
                        <h2 className="category-heading">Categories</h2>
                        <div className="row-cards">
                            {categories.map((category, index) => (
                                <div key={index} className="card">
                                    <h2>{category}</h2>
                                </div>
                            ))}
                        </div>
                    </>
                }
                {
                    searchResults.length > 0 &&
                    <div className="row-cards">
                        {searchResults.map((result, index) => (
                            !result.isHeading &&
                            <div key={result.post_id} className="card">
                                <img src={require("../../Images/photo1.jpeg")} alt={result.desc} />
                                <h2>{result.desc}</h2>
                                <p>Made by: {result.made_by}</p>
                                <p>No. of views: {result.no_views}</p>
                                <p>No. of likes: {result.no_likes}</p>
                                <p>No. of dislikes: {result.no_dislikes}</p>
                                <span>{result.posted_on}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>
        );
    }
    
}

export default Search;
