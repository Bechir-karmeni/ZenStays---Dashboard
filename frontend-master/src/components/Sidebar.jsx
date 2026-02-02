import React from "react";
import { Heart, Users, LogOut, User, Home, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ userName = "User", isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read role from localStorage (set at login in LoginPage)
  const storedUser = JSON.parse(localStorage.getItem("me") || "{}");
  const role = storedUser.role || "CLIENT";

  // Check if user is admin (supports both ADMIN and HR for backwards compatibility)
  const isAdmin = role === "ADMIN" || role === "admin" || role === "HR" || role === "hr";

  // Admin menu
  const adminMenu = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/employees", label: "Client Management", icon: Users },
    { path: "/scheduling", label: "Scheduling", icon: Calendar },
  ];

  // Client menu
  const clientMenu = [{ path: "/my-assessments", label: "Dashboard", icon: Home }];

  // Pick menu based on role
  const menuItems = isAdmin ? adminMenu : clientMenu;

  const handleNavigation = (path) => navigate(path);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("me");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
    window.location.reload();
  };

  const handleProfileClick = () => navigate("/profile");

  const isActivePath = (itemPath) =>
    location.pathname === itemPath || location.pathname.startsWith(itemPath + "/");

  return (
    <div className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
      <button
        className={`sidebar-toggle ${isOpen ? "sidebar-open" : "sidebar-collapsed"}`}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
      >
        ☰
      </button>

      <div className="sidebar-logo">
        <div className="logo-container">
          <div className="logo-icon">
            <Heart className="logo-heart" />
          </div>
          {isOpen && <span className="logo-text">Zenstays</span>}
        </div>
      </div>

      <div className="sidebar-nav">
        <nav className="nav-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(item.path);
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item ${active ? "active" : ""}`}
              >
                <Icon className="nav-icon" />
                {isOpen && <span className="nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-profile">
        <div className="profileName-container">
          <div className="profile-avatar">
            <User className="avatar-icon" />
          </div>
          {isOpen && (
            <div className="profile-info">
              <button onClick={handleProfileClick} className="sideprofile-name">
                {storedUser.first_name
                  ? `${storedUser.first_name} ${storedUser.last_name || ""}`
                  : userName}
              </button>
              <p className="profile-role">{isAdmin ? "Administrator" : "Client"}</p>
            </div>
          )}
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <LogOut className="logout-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
