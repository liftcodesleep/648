import React, { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import "./search.css";
import Footer from "../Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { catImages } from "../utils/CategoryImg";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";

class Search extends Component {
  state = {
    limit: 5,
    offset: 0,
    searchText: "",
    category: "",
    sortby: "",
    sortType: "DESC",
    categories: [],
    searchResults: [],
    error: null,
    isLoggedout: false,
  };

  handleInputChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

  // handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const { limit, offset, searchText, sortby, sortType, category } =
  //     this.state;

  //   try {
  //     const response = await fetch("http://44.197.240.111/view_public_posts", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${Cookies.get("token")}`,
  //       },
  //       body: JSON.stringify({
  //         limit,
  //         offset,
  //         searchText,
  //         sortby,
  //         sortType,
  //         category,
  //       }),
  //     });
  //     const data = await response.json();
  //     if (data.status === "SUCCESS") {
  //       if (data.posts.length > 0) {
  //         this.setState({ searchResults: data.posts, error: null });
  //       } else {
  //         this.setState({ searchResults: [], error: data.message });
  //       }
  //     } else {
  //       this.setState({ searchResults: [], error: data.message });
  //     }
  //   } catch (error) {
  //     this.setState({ error: "Failed to fetch search results" });
  //   }
  // };

  handleCategoryClick = (category) => {
    this.setState({ category: category }, () => {
      const fakeEvent = { preventDefault: () => {} };
      this.handleSubmit(fakeEvent);
    });
  };
  handleLogout = async () => {
    const username = Cookies.get("username");
    const payload = {
      username: username,
    };
    try {
      const response = await fetch("http://44.197.240.111/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        console.log({ data });
        console.log(data.status);
        console.log(data.isLoggedout);
        console.log(data.status === "SUCCESS" && data.isLoggedout);
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
      const response = await fetch("http://44.197.240.111/fetch_categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();
      this.setState({ categories: data.categories, error: null });
    } catch (error) {
      console.log(error);
      this.setState({ error: "Failed to fetch categories" });
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

  render() {
    const {
      searchText,
      categories,
      searchResults,
      error,
      isLoading,
      isLoggedout,
    } = this.state;
    const username = Cookies.get("username");
    const firstInitial = username ? username.charAt(0) : "";

    if (isLoggedout) {
      return <Navigate to="/login" />;
    }
    return (
      <div>
        {error && <div className="error">{error}</div>}
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {searchResults.length > 0 && (
              <div className="images-background">
                <div className="row-cards">
                  {searchResults.map(
                    (result, index) =>
                      !result.isHeading && (
                        <div>
                          <div style={{ display: "flex", marginTop: "20px" }}>
                            <div className="profile_initial">
                              {result.made_by.charAt(0)}
                            </div>
                            <h1
                              style={{
                                marginLeft: "10px",
                                fontWeight: "bold",
                                fontSize: "20px",
                                color: "white",
                              }}
                            >
                              {result.made_by}
                            </h1>
                          </div>
                          <div className="publiccard">
                            <Link
                              key={result.post_id}
                              to={`/post/${result.post_id}`}
                              onClick={() => this.updateViews(result.post_id)}
                            >
                              <img src={result.image} alt={result.desc} />
                            </Link>
                            <h2>{result.desc}</h2>

                            <div className="post-data">
                              <p>
                                {result.no_views}{" "}
                                <RemoveRedEyeIcon
                                  style={{ fontSize: "medium" }}
                                />{" "}
                                Views
                              </p>
                              <p>
                                {result.no_likes}{" "}
                                <FavoriteIcon style={{ fontSize: "medium" }} />{" "}
                                Likes
                              </p>

                              <p>
                                {result.no_dislikes}
                                <HeartBrokenIcon
                                  style={{ fontSize: "medium" }}
                                />{" "}
                                Dislikes{" "}
                              </p>
                            </div>
                            <p>Posted on: {result.creation_date}</p>
                            <p style={{ paddingBottom: "10px" }}>
                              Category: {result.category}
                            </p>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

            {searchResults.length === 0 && categories.length > 0 && (
              <>
                <div className="categories">
                  <h2 className="category-head">Categories</h2>
                </div>
                <div className="row">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="search-card"
                      onClick={() => this.handleCategoryClick(category)}
                    >
                      <img src={catImages.src} />
                      <h2 className="category">{category}</h2>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}

export default Search;
