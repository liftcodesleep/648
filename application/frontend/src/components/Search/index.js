import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './index.css';

class Search extends Component {
    state = {
        limit: 5,
        offset: 0,
        searchText: '',
        sortby: '',
        sortType: 'ASC',
        results: [],
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
            this.setState({ results: data.posts, error: null });
        } catch (error) {
            this.setState({ error: 'Failed to fetch search results' });
        }
    }

    render() {
        const { searchText, results, error } = this.state;
        return (
            <div className="container">
                <div className="search-container">
                    <div className='logo-container'>
                        <img src={require('../../Images/picturePerfect.jpg')} alt="Logo" className="logo" />
                    </div>
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
                {error && <div>{error}</div>}
                 {
                    results.length > 0 &&
                    <div className="row-cards">
                        {results.map(result => (
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
            </div>)
            ;
    }
}

export default Search;

