import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import MrfDetailsModal from "../components/MrfDetailsModal";
import Modal from "../components/Modal";
import AppToast from "../components/Toast";

const KPICard = ({ title, value, subtext, color }) => (
  <div className="col">
    <div className={`card border-${color} shadow-sm h-100`}>
      <div className="card-body">
        <h6 className="text-muted mb-1">{title}</h6>
        <h3 className={`text-${color} fw-bold mb-1`}>{value}</h3>
        <p className="text-muted small mb-0">{subtext}</p>
      </div>
    </div>
  </div>
);

const MrfTracker = () => {
  const { mockMrfs, mockEmployees, state } = useAppContext();
  const [mrfs, setMrfs] = useState(mockMrfs);
  const [selectedMrf, setSelectedMrf] = useState(null);
  const [showMrfDetails, setShowMrfDetails] = useState(false);
  const [filters, setFilters] = useState({
    mrfId: '',
    designation: '',
    department: '',
    hiringManager: '',
    status: '',
    dateRange: ''
  });

  // Assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMrfForAssign, setSelectedMrfForAssign] = useState(null);
  const [assignTo, setAssignTo] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  // HR Head and their team members (use mock employee with role hr_head)
  const hrHead = Object.values(mockEmployees).find(emp => emp.role === 'hr_head');
  const teamMembers = hrHead?.teamMembers?.map(id => mockEmployees[id]) || [];

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="fw-bold text-dark">MRF Tracker</h3>
      </div>

      {/* KPIs */}
      {/* (KPIs already shown above) */}

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h6 className="text-muted mb-3">Filters</h6>
          <div className="row g-3">
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="MRF ID"
                value={filters.mrfId}
                onChange={(e) => setFilters({ ...filters, mrfId: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Designation"
                value={filters.designation}
                onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                {Array.from(new Set(mockMrfs.map(mrf => mrf.department))).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.hiringManager}
                onChange={(e) => setFilters({ ...filters, hiringManager: e.target.value })}
              >
                <option value="">All Hiring Managers</option>
                {Object.values(mockEmployees).map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setFilters({
                mrfId: '',
                designation: '',
                department: '',
                hiringManager: '',
                status: '',
                dateRange: ''
              })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <KPICard
          title="Total Active MRFs"
          value="15"
          subtext="5 pending approval"
          color="primary"
        />
        <KPICard
          title="Time to Fill"
          value="45 days"
          subtext="Avg. across all positions"
          color="success"
        />
        <KPICard
          title="Open Positions"
          value="8"
          subtext="3 critical positions"
          color="warning"
        />
        <KPICard
          title="Cost per Hire"
          value="₹25,000"
          subtext="15% below target"
          color="info"
        />
        <KPICard
          title="Offer Acceptance Rate"
          value="85%"
          subtext="Last 30 days"
          color="secondary"
        />
      </div>

      <div className="card shadow-sm">
        <div className="card-body table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>MRF ID</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Hiring Manager</th>
                <th>Status</th>
                <th>Posting Date</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mrfs
                .filter(mrf => {
                  const matchMrfId = !filters.mrfId || mrf.id.toLowerCase().includes(filters.mrfId.toLowerCase());
                  const matchDesignation = !filters.designation || mrf.designation.toLowerCase().includes(filters.designation.toLowerCase());
                  const matchDepartment = !filters.department || mrf.department === filters.department;
                  const matchHiringManager = !filters.hiringManager || mrf.hiringManagerId === filters.hiringManager;
                  const matchStatus = !filters.status || mrf.status === filters.status;
                  const matchDate = !filters.dateRange || mrf.postingDate.includes(filters.dateRange);
                  
                  return matchMrfId && matchDesignation && matchDepartment && 
                         matchHiringManager && matchStatus && matchDate;
                })
                .map((mrf) => (
                <tr key={mrf.id}>
                  <td 
                    className="fw-semibold text-primary cursor-pointer" 
                    onClick={() => {
                      setSelectedMrf(mrf);
                      setShowMrfDetails(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {mrf.id}
                  </td>
                  <td>{mrf.designation}</td>
                  <td>{mrf.department}</td>
                  <td>{mockEmployees[mrf.hiringManagerId].name}</td>
                  <td>
                    <span
                      className={`badge ${
                        mrf.status === "Open" ? "bg-warning text-dark" : "bg-success"
                      }`}
                    >
                      {mrf.status}
                    </span>
                  </td>
                  <td>{mrf.postingDate}</td>
                  <td>
                    {mrf.assignedTo ? (
                      <span className="text-success">{mockEmployees[mrf.assignedTo].name}</span>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td>
                    {teamMembers.length > 0 ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedMrfForAssign(mrf);
                          setAssignTo(mrf.assignedTo || (teamMembers[0] && teamMembers[0].id) || "");
                          setAssignDueDate(mrf.assignmentDue || "");
                          setShowAssignModal(true);
                        }}
                        disabled={!(state?.currentUserRole === 'hr_head')}
                        title={state?.currentUserRole === 'hr_head' ? '' : 'Only HR Head can assign MRFs'}
                      >
                        {mrf.assignedTo ? 'Reassign' : 'Assign'}
                      </button>
                    ) : (
                      <span className="small text-muted">No team</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal for HR Head */}
      <Modal
        show={showAssignModal}
        title={`Assign ${selectedMrfForAssign?.id || ''}`}
        onClose={() => setShowAssignModal(false)}
        footer={
          <>
            <button className="btn btn-secondary me-2" onClick={() => setShowAssignModal(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!assignTo) {
                  setToast({ show: true, message: 'Please select a team member', variant: 'danger' });
                  return;
                }
                setMrfs(prev => prev.map(m => m.id === selectedMrfForAssign.id ? { ...m, assignedTo: assignTo, assignmentDue: assignDueDate, status: 'Open' } : m));
                setToast({ show: true, message: `Assigned ${selectedMrfForAssign.id} to ${mockEmployees[assignTo].name}`, variant: 'success' });
                setShowAssignModal(false);
              }}
            >
              Save
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label">Assign To</label>
            <select className="form-select" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
              <option value="">Select team member</option>
              {teamMembers.map(tm => (
                <option key={tm.id} value={tm.id}>{tm.name} ({tm.activeMrfs} active)</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Assignment Due</label>
            <input type="date" className="form-control" value={assignDueDate} onChange={(e) => setAssignDueDate(e.target.value)} />
          </div>
        </div>
      </Modal>

      <AppToast show={toast.show} message={toast.message} variant={toast.variant} onClose={() => setToast({ ...toast, show: false })} />

      <MrfDetailsModal
        show={showMrfDetails}
        onClose={() => setShowMrfDetails(false)}
        mrfData={{
          mrfId: selectedMrf?.id,
          requirementType: 'Expansion',
          employmentType: 'Full Time',
          annualCtc: '5-7',
          variablePay: '0',
          requiredSkillSet: selectedMrf?.requiredSkills || 'N/A',
          jobDescription: selectedMrf?.designation || 'Digital Marketing',
          state: 'TELANGANA',
          createdBy: 'Aditya Ghosh',
          createdAt: '24 Oct, 2025',
          modifiedBy: 'Aditya Ghosh',
          lastModified: '30 Oct, 2025',
          vacancies: '1',
          department: selectedMrf?.department
        }}
      />
    </div>
  );
};

export default MrfTracker;
