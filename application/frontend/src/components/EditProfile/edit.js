import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './edit.css';

class EditProfile extends Component {
  state = {
    name: '',
    username: '',
    email: '',
    activityLog: []
  }

  async componentDidMount() {
    try {
      // Fetch user details and activity log from the server
      const userDetailsResponse = await fetch('http://127.0.0.1:8000/view_user_profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      const userDetailsData = await userDetailsResponse.json();

      const activityLogResponse = await fetch('http://127.0.0.1:8000/activity_log', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      const activityLogData = await activityLogResponse.json();

      // Update the state with the fetched user details and activity log
      this.setState({
        name: userDetailsData.name,
        username: userDetailsData.username,
        email: userDetailsData.email,
        activityLog: activityLogData.activityLog
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
      const response = await fetch('http://127.0.0.1:8000/update_user_profile', {
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
        <div className='edit-container'>
        <div className='logo-container'>
                        <img src={require('../../Images/picturePerfect.jpg')} alt="Logo" className="logo" />
                    </div>
        <div className="activity-log">
          <h2 className = "activity-heading">Activity Log:</h2>
          <ul>
            {activityLog.map(activity => (
              <li key={activity.id}>
                <p>{activity.description}</p>
                <p>{activity.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
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
  