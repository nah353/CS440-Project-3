import React from "react";

export default function Navbar({ setPage, currentPage, currentUser, onLogout }) {
  return (
    <div className="nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        <div className="brand">Recipe Webapp</div>
        {currentUser && (
          <span className="small" style={{ color: 'var(--text-secondary)' }}>
            Signed in as <strong>{currentUser.username}</strong>
          </span>
        )}
      </div>
      <div className="nav-buttons" style={{ gap: '0' }}>
        <button 
          onClick={() => setPage("home")}
          className={currentPage === "home" ? "nav-tab-active" : "nav-tab"}
        >
          Home
        </button>
        {currentUser && (
          <button
            onClick={() => setPage("account")}
            className={currentPage === "account" ? "nav-tab-active" : "nav-tab"}
          >
            Account
          </button>
        )}
        <button 
          onClick={() => setPage("scan")}
          className={currentPage === "scan" ? "nav-tab-active" : "nav-tab"}
        >
          Scan Food
        </button>
        {!currentUser ? (
          <button
            onClick={() => setPage("auth")}
            className={currentPage === "auth" ? "nav-tab-active" : "nav-tab"}
          >
            Login / Sign Up
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="nav-tab"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
