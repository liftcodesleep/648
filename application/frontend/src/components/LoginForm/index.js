import { Component } from 'react'
import Cookies from 'js-cookie'
import { Link, Navigate } from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    error: '',
    redirectToReferrer: false,
  }

  handleInputChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = async e => {
    e.preventDefault()
    const { username, password } = this.state
    try {
      const response = await fetch('http://127.0.0.1:8000/user_login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, "user_type": "general" })
      })
      // const val = await response.json()
      // console.log({val})
      const { isLoggedin, status, message } = await response.json()
      console.log({ isLoggedin })
      console.log({ status })
      console.log({ message })
      // Cookies.set('token', token)
      if (status == "SUCCESS" && isLoggedin) {
        console.log("inside success")
        this.setState({ redirectToReferrer: true })

      } else {
        console.log("inside failure")
        this.setState({ redirectToReferrer: false, error: message })
      }

    } catch (error) {
      console.log(error)
      this.setState({ error: 'Invalid username or password' })
    }
  }

  render() {
    const { username, password, error, redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return <Navigate to="/" replace={true} />
    }

    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
        <h2>Login Form</h2>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={username} onChange={this.handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={this.handleInputChange} />
        </div>
        <button type="submit">Login</button>
        <div>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    )
  }
}

export default LoginForm
