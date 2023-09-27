import React, { Component } from "react";
import Cookies from "js-cookie";
import "./editProfile.css";
import Header from "../Header/header";
import { TextField } from "@mui/material";

class EditProfile extends Component {
  state = {
    name: "",
    username: "",
    email: "",
    activityLog: [],
  };

  async componentDidMount() {
    try {
      // Fetch user details and activity log from the server
      const username = Cookies.get("username");
      const userDetailsResponse = await fetch(
        "http://44.197.240.111/view_user_profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ username }),
        }
      );
      const userDetailsData = await userDetailsResponse.json();
      console.log({ userDetailsData });

      const activityLogResponse = await fetch(
        "http://44.197.240.111/activity_log",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ username }),
        }
      );
      const activityLogData = await activityLogResponse.json();

      // Update the state with the fetched user details and activity log
      if (activityLogData.status === "SUCCESS") {
        this.setState({
          name: userDetailsData.name,
          username: userDetailsData.username,
          email: userDetailsData.email,
          activityLog: activityLogData.log,
          noOfPosts: activityLogData.no_of_posts,
        });
      } else {
        console.log(activityLogData.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleFormSubmit = async (event) => {
    event.preventDefault();

    const { name, username, email } = this.state;

    try {
      // Send updated user details to the server
      const response = await fetch(
        "http://44.197.240.111/update_user_profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            username: username,
            updates: [
              { updatedColumn: "name", updatedValue: name },
              { updatedColumn: "email", updatedValue: email },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.status === "SUCCESS") {
        alert("User details updated successfully");
      } else {
        alert("Failed to update user details");
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { name, username, email, activityLog, noOfPosts } = this.state;

    return (
      <div style={{ marginBottom: "5rem" }}>
        <div className="edit-box gap-4">
          <div className="edit-container mt-8">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={this.handleInputChange}
                  required
                />

                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={this.handleInputChange}
                  required
                />

                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <button className="button-save" onClick={this.handleFormSubmit}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          <div className="activity-log">
            <h2 className="activity-heading">Activity Log:</h2>
            <div className="log-container">
              <p>Number of Posts: {noOfPosts}</p>
              <ul>
                {activityLog.map((activity) => (
                  <li key={activity.activity_time}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>{activity.activity} :</p>
                      <p>{activity.activity_time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default EditProfile;
