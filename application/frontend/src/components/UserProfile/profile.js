import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./profile.css";

class UserProfile extends Component {
  state = {
    limit: 5,
    offset: 0,
    searchText: "",
    sortby: "",
    sortType: "ASC",
    posts: [],
    error: null,
    searchResults: [],
    isLoggedout: false,
  };

  handleInputChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { limit, offset, searchText, sortby, sortType, category } =
      this.state;
    try {
      const response = await fetch("http://127.0.0.1:8000/list_user_posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          limit,
          offset,
          searchText,
          sortby,
          sortType,
          category,
        }),
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
      this.setState({ error: "Failed to fetch search results" });
    }
  };
  handleLogout = async () => {
    const username = Cookies.get("username");
    const payload = {
      username: username,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === "SUCCESS" && data.isLoggedout) {
          Cookies.remove("token");
          Cookies.remove("username");
          this.setState({ isLoggedout: data.isLoggedout });
        } else {
          console.log(data.message);
        }
      } else {
        console.log("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount = async () => {
    try {
      const username = Cookies.get("username");
      const { limit, offset, searchText, sortby, sortType } = this.state;
      const response = await fetch("http://127.0.0.1:8000/list_user_posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          limit,
          offset,
          searchText,
          sortby,
          sortType,
          username,
        }),
      });
      const { status: message, posts, noOfPosts } = await response.json();
      if (message === "SUCCESS") {
        if (noOfPosts === 0) {
          this.setState({
            error: "No posts found for the corresponding user",
            posts: [],
          });
        } else {
          this.setState({ posts, error: null });
        }
      } else {
        this.setState({ error: "Failed to fetch user posts" });
      }
    } catch (error) {
      this.setState({ error: "Failed to fetch user posts" });
    }
  };

  render() {
    const { searchText, posts, error, isLoggedout, searchResults } = this.state;
    console.log("***********");
    console.log({ searchResults });
    console.log({ posts });
    const username = Cookies.get("username");
    console.log(username);
    const firstInitial = username ? username.charAt(0) : "";
    if (isLoggedout) {
      return <Navigate to="/login" />;
    }
    return (
      <div className="container">
        <div className="header">
          <div className="logo-container">
            <Link to="/">
              <img
                src={require("../../Images/picturePerfect.jpg")}
                alt="Logo"
                className="logo"
              />
            </Link>
          </div>
          <div className="search-container">
            <Link to="/uploadimage">
              <button type="submit">+ New Post</button>
            </Link>

            <form className="search-form" onSubmit={this.handleSubmit}>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={searchText}
                  onChange={this.handleInputChange}
                  placeholder="Images, #tags, @users"
                />
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

        <div class="profile-edit-container">
          <div className="profile-edit-initial">{firstInitial}</div>
          <div className="profile-edit-username">{username}</div>
          <button
            className="edit-button"
            onClick={() => (window.location.href = "/edit-profile")}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="row-cards">
            {searchResults.map(
              (result, index) =>
                !result.isHeading && (
                  <Link key={result.post_id} to={`/post/${result.post_id}`}>
                    <div className="publiccard">
                      <img src={result.image} alt={result.desc} />
                      <h2>{result.desc}</h2>
                      <p>Made by: {result.made_by}</p>
                      <p>No. of views: {result.no_views}</p>
                      <p>No. of likes: {result.no_likes}</p>
                      <p>No. of dislikes: {result.no_dislikes}</p>
                      <p>Posted on: {result.creation_date}</p>
                      <p>Category: {result.category}</p>
                    </div>
                  </Link>
                )
            )}
          </div>
        )}

        {searchResults.length === 0 && posts.length > 0 && (
          <>
            <h1 className="category-heading">All Posts</h1>
            {error && <div>{error}</div>}
            <div className="row-cards">
              {posts.map((post, index) => (
                <Link key={post.post_id} to={`/post/${post.post_id}`}>
                  <div key={post.post_id} className="publiccard">
                    <img src={post.image} alt={post.desc} />
                    <h2>{post.desc}</h2>
                    <p>Made by: {post.made_by}</p>
                    <p>No. of views: {post.no_views}</p>
                    <p>No. of likes: {post.no_likes}</p>
                    <p>No. of dislikes: {post.no_dislikes}</p>
                    <span>{post.posted_on}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default UserProfile;
