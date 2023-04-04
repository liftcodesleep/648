import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './index.css';

class EditProfile extends Component {
  state = {
    name: '',
    username: '',
    email: '',
    activityLog: []
  }

 
  componentDidMount = async () => {
    try {
      // Fetch user details and activity log from the server
      const response = await fetch('http://44.197.240.111/user_details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });

      const data = await response.json();

      // Update the state with the fetched user details and activity log
      this.setState({
        
        activityLog: data.activityLog
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const { name, username, email } = this.state;

    try {
      // Send updated user details to the server
      const response = await fetch('http://44.197.240.111/update_user_details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({ name, username, email })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('User details updated successfully');
      } else {
        alert('Failed to update user details');
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { name, username, email, activityLog } = this.state;
  
    return (
      <div className="container">
        <h1>Edit Profile</h1>
        <div className="activity-log">
          <h2>Activity Log:</h2>
          <ul>
            {activityLog.map(activity => (
              <li key={activity.id}>
                <p>{activity.description}</p>
                <p>{activity.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>

  
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" value={name} onChange={this.handleInputChange} required />
          </div>
  
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" value={username} onChange={this.handleInputChange} required />
          </div>
  
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={email} onChange={this.handleInputChange} required />
          </div>
  
         
  
          <button type="submit">Save Changes</button>
        </form>

      </div>
    );
  }

}
export default EditProfile
  