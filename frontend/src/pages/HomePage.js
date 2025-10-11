// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      {/* Navbar */}
      <nav
        className="d-flex justify-content-between align-items-center px-4 py-3"
        style={{
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(5px)",
        }}
      >
        <h3 style={{ fontWeight: "bold", letterSpacing: "1px" }}>Shopinion</h3>
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/about")}
        >
          About Us
        </button>
      </nav>

      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Discover, Rate & Share Your Favorite Stores 🛍️
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            marginBottom: "2rem",
            maxWidth: "600px",
          }}
        >
          Join our vibrant community where you can explore stores near you,
          leave honest reviews, and find the best-rated spots recommended by
          real users like you!
        </p>

        <button
          className="btn btn-warning btn-lg mb-3 px-5"
          style={{ fontSize: "1.2rem", fontWeight: "bold" }}
          onClick={() => navigate("/signup")}
        >
          Get Started – Sign Up
        </button>

        <p>
          Already have an account?{" "}
          <span
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-3"
        style={{ background: "rgba(0,0,0,0.2)" }}
      >
        <small>
          {" "}
          {new Date().getFullYear()} Shopinion. All rights reserved.
        </small>
      </footer>
    </div>
  );
}

export default HomePage;
