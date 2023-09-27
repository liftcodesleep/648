import { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import "./LoginForm.css";
import logo from "../../Images/picturePerfect.jpg";
import { Button } from "@mui/material";
class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleSignup = () => {
    window.location.href = "/signup";
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    try {
      const response = await fetch("http://44.197.240.111/user_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, user_type: "general" }),
      });
      const { isLoggedin, status, message } = await response.json();
      if (status === "SUCCESS" && isLoggedin) {
        Cookies.set("username", username);
        this.setState({ redirectToReferrer: true });
      } else {
        this.setState({ redirectToReferrer: false, error: message });
      }
    } catch (error) {
      console.log(error);
      this.setState({ error: "Invalid username or password" });
    }
  };

  render() {
    const { username, password, error, redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Navigate to="/" replace={true} />;
    }

    return (
      <div className="box">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <p>Your creativity has found a home</p>
        </div>
        <div className="login-container">
          <form className="login-form " onSubmit={this.handleSubmit}>
            <h2 className="text-black">Login Form</h2>

            <div className="login-form-group">
              <label className="text-black" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="login-form-group">
              <label className="text-black" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
              />
            </div>

            <Button
              sx={{
                width: "100%",
                backgroundColor: "#0077FF",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0055CC",
                },
              }}
              onClick={this.handleSubmit}
            >
              Login
            </Button>

            <div className="singup-account flex justify-between mt-4 ">
              <div className="account">
                <h4 className="text-black">Don't have an account?</h4>
              </div>
              <Button
                size="small"
                sx={{
                  backgroundColor: "#0077FF",

                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0055CC",
                  },
                }}
                onClick={this.handleSignup}
              >
                Singup
              </Button>
            </div>
            {error && (
              <div className="error" data-testid="login-error">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
