import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "./components/About";
import Alekya from "./components/Alekya";
import Vinay from "./components/Vinay";
import Jacob from "./components/Jacob";
import Ishika from "./components/Ishika";
import Nick from "./components/Nick";
import SignupForm from "./components/SignUpForm/signUpForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Search from "./components/Search/search";
import UserProfile from "./components/UserProfile/profile";
import EditProfile from "./components/EditProfile/editProfile";
import Post from "./components/Post/post";
import SinglePost from "./components/SinglePost/singlepost";
import Header from "./components/Header/header";
import Purchase from "./components/buyPhoto/purchase";
import { useLocation } from "react-router-dom";

const AppRouter = () => {
  const HeaderOnlyRoutes = ({ children }) => {
    const { pathname } = useLocation();
    return pathname === "/login" || pathname === "/signup" ? (
      <>{children}</>
    ) : (
      children
    );
  };
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <HeaderOnlyRoutes>
            <Routes>
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/alekya" element={<Alekya />} />
              <Route path="/jacob" element={<Jacob />} />
              <Route path="/nick" element={<Nick />} />
              <Route path="/ishika" element={<Ishika />} />
              <Route path="/vinay" element={<Vinay />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/" element={<Search />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/uploadimage" element={<Post />} />
              <Route path="/post/:postId" element={<SinglePost />} />
              <Route path="/post/:postId/purchase" element={<Purchase />} />
            </Routes>
          </HeaderOnlyRoutes>
        }
      />
    </Routes>
  );
};

export default AppRouter;
