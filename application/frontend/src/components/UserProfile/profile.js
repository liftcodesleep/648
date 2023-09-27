import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./profile.css";

import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Footer/Footer";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { Avatar, Button, Divider, ListItemText, alpha } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { deepOrange } from "@mui/material/colors";

class UserProfile extends Component {
  state = {
    limit: 5,
    offset: 0,
    searchText: "",
    sortby: "",
    sortType: "DESC",
    posts: [],
    error: null,
    searchResults: [],
    isLoggedout: false,
  };

  handleInputChange = (event) => {
    this.setState({ searchText: event.target.value });
  };
  handleDelete(postId) {
    fetch("http://44.197.240.111/delete_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: postId,
        username: Cookies.get("username"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          const updatedPosts = this.state.posts.filter(
            (post) => post.post_id !== postId
          );
          this.setState({ posts: updatedPosts });
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { limit, offset, searchText, sortby, sortType } = this.state;
    if (!searchText) {
      this.setState({ error: "Please enter a query to" });
      return;
    }
    try {
      const response = await fetch("http://44.197.240.111/view_public_posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ limit, offset, searchText, sortby, sortType }),
      });
      const data = await response.json();
      this.setState({ posts: data.posts, error: null });
    } catch (error) {
      this.setState({ error: "Failed to fetch search results" });
    }
  };

  updateViews = async (postId) => {
    try {
      const response = await fetch("http://44.197.240.111/add_view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ postid: postId }),
      });
      const data = await response.json();
      if (data.status === "SUCCESS") {
        const { searchResults } = this.state;
        const updatedSearchResults = searchResults.map((result) => {
          if (result.post_id === data.postid) {
            return { ...result, no_views: data.noOfViews };
          }
          return result;
        });
        this.setState({ searchResults: updatedSearchResults });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  componentDidMount = async () => {
    try {
      const username = Cookies.get("username");
      const { limit, offset, searchText, sortby, sortType } = this.state;
      const response = await fetch("http://44.197.240.111/list_user_posts", {
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
    const username = Cookies.get("username");
    console.log(username);
    const firstInitial = username ? username.charAt(0) : "";
    if (isLoggedout) {
      return <Navigate to="/login" />;
    }
    return (
      <div style={{ minHeight: "100vh" }}>
        <div className="search-container"></div>

        <div class="profile-edit-container">
          <Avatar
            sx={{ bgcolor: deepOrange[500], height: "50px", width: "50px" }}
          >
            {firstInitial}
          </Avatar>

          <div className="profile-edit-username">{username}</div>
          <Button
            disablePadding
            startIcon={
              <ManageAccountsIcon
                sx={{ color: "white" }}
                fontSize="large"
                color="action"
              />
            }
            component={Link}
            to={"/edit-profile"}
            sx={{
              color: "white",
              backgroundColor: "#e66fb9",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            Edit Profile
          </Button>
        </div>

        <div className="categories">
          <h2 className="category-head">All Posts</h2>
        </div>
        <Divider
          sx={{
            marginLeft: "32px",
            marginRight: "32px",
            backgroundColor: "whitesmoke",
            opacity: "0.50",
          }}
        ></Divider>

        <div className="row-cards">
          <div className="error-box">{error && <h1>{error}</h1>}</div>
          {posts.map((post, index) => (
            <Link
              key={post.post_id}
              to={`/post/${post.post_id}`}
              onClick={() => this.updateViews(post.post_id)}
            >
              <div key={post.post_id} className="publiccard">
                <img src={post.image} alt={post.desc} />

                <div className="profile_name">
                  <div className="name_profile">
                    <p style={{ fontWeight: "bold" }}>{post.made_by}</p>
                  </div>
                  <div className="dropdown">
                    <button
                      className="delete_dropdown"
                      onClick={(e) => {
                        e.stopPropagation();
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown.style.display =
                          dropdown.style.display === "block" ? "none" : "block";
                      }}
                    >
                      ⋮
                    </button>
                    <div
                      className="delete_container"
                      style={{ display: "none" }}
                    >
                      <button onClick={() => this.handleDelete(post.post_id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="post_details">
                  <div>
                    <p>
                      {post.no_views}{" "}
                      <RemoveRedEyeIcon style={{ fontSize: "medium" }} /> Views
                    </p>
                  </div>
                  <p>
                    {post.no_likes}{" "}
                    <FavoriteIcon style={{ fontSize: "medium" }} /> Likes
                  </p>
                  <p>
                    {post.no_dislikes}{" "}
                    <HeartBrokenIcon style={{ fontSize: "medium" }} /> Dislikes
                  </p>
                </div>

                <span>{post.posted_on}</span>

                <div>
                  <p>{post.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

export default UserProfile;
