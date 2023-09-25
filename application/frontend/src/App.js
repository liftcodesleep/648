import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRouter from "./AppRouter";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <AppRouter />
      {/* <Footer /> */}
    </div>
  );
};

export default App;
