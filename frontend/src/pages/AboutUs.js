import React from "react";

function AboutPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
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
        <h3 style={{ fontWeight: "bold", letterSpacing: "1px" }}>My App</h3>
      </nav>

      {/* Content */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-4">
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          About Us
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            maxWidth: "800px",
            lineHeight: "1.8",
          }}
        >
          Welcome to <strong>Shopinion (your shopwise opinion)</strong>! Our
          mission is to create a community-driven platform where people can
          discover, rate, and share their favorite stores. We believe honest
          reviews and shared experiences make shopping smarter and more
          enjoyable. 🛍️
        </p>

        <p
          style={{
            fontSize: "1.1rem",
            maxWidth: "700px",
            marginTop: "1rem",
            opacity: 0.9,
          }}
        >
          Whether you're looking for the top-rated stores in your city or want
          to share your feedback with others, our platform connects you with
          trusted recommendations from real users like you.
        </p>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-3"
        style={{ background: "rgba(0,0,0,0.2)" }}
      >
        <small>
          © {new Date().getFullYear()} Shopinion. Built for the community.
        </small>
      </footer>
    </div>
  );
}

export default AboutPage;
