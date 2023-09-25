import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <span className="text-muted">
          © {new Date().getFullYear()} Picture Perfect.{" "}
          <p style={{ fontSize: "15px" }}>All rights reserved.</p>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
