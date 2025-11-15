import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const NAV_ITEMS = {
  hr: [
    { id: "manage_mrf", label: "Home" },
    { id: "settings", label: "Settings" },
  ],
  hm: [{ id: "hm_review", label: "View Sent Profiles" }],
  hr_head: [
    { id: "manage_mrf", label: "Home" },
    { id: "settings", label: "Settings" },
  ],
};

const Sidebar = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = NAV_ITEMS;

  // Update current view when role changes
  useEffect(() => {
    // Get first view for current role
    const firstView = navItems[state.currentUserRole]?.[0]?.id;
    if (firstView) {
      navigate(`/${firstView}`);
    }
  }, [state.currentUserRole, navigate, navItems]);

  const location = useLocation();

  return (
    <div 
      className={`bg-white border-end p-3 ${isCollapsed ? 'collapsed' : ''}`} 
      style={{ 
        width: isCollapsed ? "60px" : "240px",
        transition: "width 0.3s ease"
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className={`text-uppercase text-secondary small fw-bold mb-0 ${isCollapsed ? 'd-none' : ''}`}>
          Navigation
        </h6>
        <button 
          className="btn btn-sm btn-light" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <i className={`bi bi-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>
      <div className="nav flex-column">
        {navItems[state.currentUserRole].map((item) => {
          const path = `/${item.id}`;
          const currentPath = location.pathname === '/' ? '/manage_mrf' : location.pathname;
          const isActive = currentPath === path;
          return (
            <button
              key={item.id}
              className={`btn text-start mb-1 w-100 ${isActive ? "btn-primary text-white" : "btn-outline-secondary"} ${isCollapsed ? 'p-2' : ''}`}
              onClick={() => navigate(path)}
              title={item.label}
            >
              <i className={`bi bi-${item.id === 'mrf_tracker' ? 'kanban' : item.id === 'manage_mrf' ? 'list-check' : item.id === 'settings' ? 'gear' : 'file-earmark-text'}`}></i>
              <span className={isCollapsed ? 'd-none' : 'ms-2'}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
