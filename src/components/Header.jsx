import React from "react";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { state, updateState } = useAppContext();

  return (
    <header className="bg-white border-bottom shadow-sm py-3 px-4 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        <h4 className="text-primary fw-bold mb-0">Talanet</h4>
        <span className="text-muted d-none d-sm-inline">Acquisition Portal</span>
      </div>
      <div className="d-flex align-items-center gap-4">
        <div className="d-flex align-items-center gap-3">
          <div>
            <div className="fw-semibold">Aditya Ghosh</div>
            <div className="text-muted small">ID: MED007942</div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted d-none d-md-inline">Role:</span>
          <select
            className="form-select form-select-sm"
            style={{ width: "200px" }}
            value={state.currentUserRole}
            onChange={(e) => {
              updateState({ 
                currentUserRole: e.target.value,
                currentView: null // Reset view to trigger useEffect in Sidebar
              });
            }}
          >
            <option value="hr">HR (Talent Acquisition)</option>
            <option value="hm">Hiring Manager</option>
            <option value="management">Management</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
