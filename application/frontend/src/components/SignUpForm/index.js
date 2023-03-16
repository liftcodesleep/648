import { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

class SignupForm extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const { token } = await response.json();
      Cookies.set('token', token);
      this.setState({ redirectToReferrer: true });
    } catch (error) {
      this.setState({
        error: 'Unable to create account. Please try again later.',
      });
    }
  };

  render() {
    const { name, email, password, error, redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Navigate to="/login" />;
    }

    return (
      <form className="signup-form" onSubmit={this.handleSubmit}>
        <h2>Signup Form</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={this.handleInputChange}
          />
        </div>
        <button type="submit">Create Account</button>
        <div className="already-member">
          <p>
            Already a member? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    );
  }
}

export default SignupForm;
