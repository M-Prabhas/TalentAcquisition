import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const HiringManagerDashboard = () => {
  const navigate = useNavigate();

  // ---------------------------------------
  // MOCK DATA
  // ---------------------------------------

  const mockMrfs = [
    {
      id: "MRF001",
      position: "Senior React Developer",
      department: "Engineering",
      status: "Open",
      priority: "High",
      targetDate: "2025-12-15",
      requestedBy: "Sarah Johnson",
      postings: []
    },
    {
      id: "MRF002",
      position: "Backend Engineer",
      department: "Engineering",
      status: "In Progress",
      priority: "Medium",
      targetDate: "2025-12-20",
      requestedBy: "Sarah Johnson",
      postings: []
    },
    {
      id: "MRF003",
      position: "DevOps Engineer",
      department: "Engineering",
      status: "Open",
      priority: "High",
      targetDate: "2025-12-10",
      requestedBy: "Sarah Johnson",
      postings: []
    },
  ];

  const mockCandidates = [
    {
      id: 1,
      mrfId: "MRF001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      contactNumber: "+91 98765 43210",
      qualification: "B.Tech Computer Science",
      gender: "Male",
      age: 28,
      languages: ["English", "Hindi", "Tamil"],
      experience: 5,
      noticePeriod: "30 days",
      currentSalary: "800000",
      expectedSalary: "1200000",
      source: "LinkedIn",
      designation: "React Developer",
      sentToHiringManager: true,
      pitchCallStatus: "Satisfactory",
      hmReviewStatus: "Pending",
      hmReviewRemark: "",
      shortlisted: false,
      inviteStatus: "Interested",
    },
    {
      id: 2,
      mrfId: "MRF001",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      contactNumber: "+91 98765 43211",
      qualification: "M.Tech Software Engineering",
      gender: "Female",
      age: 26,
      languages: ["English", "Hindi"],
      experience: 4,
      noticePeriod: "Immediate",
      currentSalary: "700000",
      expectedSalary: "1100000",
      source: "Naukri",
      designation: "Frontend Developer",
      sentToHiringManager: true,
      pitchCallStatus: "Satisfactory",
      hmReviewStatus: "Shortlisted",
      hmReviewRemark: "Strong technical skills, good communication",
      shortlisted: true,
      inviteStatus: "Interested",
      suggestedInterviewSlots: [
        { date: "2025-11-20", time: "10:00" },
        { date: "2025-11-20", time: "14:00" }
      ],
      interviewCompleted: true,
      interviewEvaluation: {
        technicalSkills: 8,
        communication: 9,
        problemSolving: 7,
        cultureFit: 8,
        overallRating: 8,
        strengths: "Excellent React knowledge, good team player",
        weaknesses: "Needs improvement in backend technologies",
        recommendation: "Strong Hire"
      }
    },
    {
      id: 3,
      mrfId: "MRF001",
      name: "Amit Patel",
      email: "amit.patel@email.com",
      contactNumber: "+91 98765 43212",
      qualification: "B.E. Information Technology",
      gender: "Male",
      age: 30,
      languages: ["English", "Hindi", "Gujarati"],
      experience: 6,
      noticePeriod: "60 days",
      currentSalary: "900000",
      expectedSalary: "1300000",
      source: "Indeed",
      designation: "Full Stack Developer",
      sentToHiringManager: true,
      pitchCallStatus: "Satisfactory",
      hmReviewStatus: "Rejected",
      hmReviewRemark: "Experience doesn't match our requirements",
      shortlisted: false,
      inviteStatus: "Interested",
    },
    {
      id: 4,
      mrfId: "MRF002",
      name: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      contactNumber: "+91 98765 43213",
      qualification: "MCA",
      gender: "Female",
      age: 27,
      languages: ["English", "Hindi", "Telugu"],
      experience: 4,
      noticePeriod: "30 days",
      currentSalary: "750000",
      expectedSalary: "1050000",
      source: "Referral",
      designation: "Backend Developer",
      sentToHiringManager: true,
      pitchCallStatus: "Satisfactory",
      hmReviewStatus: "Shortlisted",
      hmReviewRemark: "Excellent backend knowledge, team player",
      shortlisted: true,
      inviteStatus: "Interested",
      suggestedInterviewSlots: [
        { date: "2025-11-21", time: "11:00" }
      ]
    },
    {
      id: 5,
      mrfId: "MRF002",
      name: "Vikram Singh",
      email: "vikram.singh@email.com",
      contactNumber: "+91 98765 43214",
      qualification: "B.Tech CSE",
      gender: "Male",
      age: 25,
      languages: ["English", "Hindi", "Punjabi"],
      experience: 3,
      noticePeriod: "Immediate",
      currentSalary: "600000",
      expectedSalary: "900000",
      source: "LinkedIn",
      designation: "Node.js Developer",
      sentToHiringManager: true,
      pitchCallStatus: "Satisfactory",
      hmReviewStatus: "Pending",
      hmReviewRemark: "",
      shortlisted: false,
      inviteStatus: "Interested",
    },
    {
      id: 6,
      mrfId: "MRF003",
      name: "Ananya Iyer",
      email: "ananya.iyer@email.com",
      contactNumber: "+91 98765 43215",
      qualification: "B.Tech IT",
      gender: "Female",
      age: 29,
      languages: ["English", "Hindi", "Malayalam"],
      experience: 5,
      noticePeriod: "45 days",
      currentSalary: "850000",
      expectedSalary: "1150000",
      source: "Company Website",
      designation: "DevOps Engineer",
      sentToHiringManager: true,
      pitchCallStatus: "Satisfactory",
      hmReviewStatus: "Shortlisted",
      hmReviewRemark: "Strong DevOps experience, AWS certified",
      shortlisted: true,
      inviteStatus: "Interested",
      suggestedInterviewSlots: [
        { date: "2025-11-22", time: "15:00" }
      ]
    },
    {
      id: 7,
      mrfId: "MRF003",
      name: "Karan Mehta",
      email: "karan.mehta@email.com",
      contactNumber: "+91 98765 43216",
      qualification: "M.Tech Computer Science",
      gender: "Male",
      age: 31,
      languages: ["English", "Hindi"],
      experience: 7,
      noticePeriod: "30 days",
      currentSalary: "950000",
      expectedSalary: "1400000",
      source: "Naukri",
      designation: "Senior DevOps",
      sentToHiringManager: true,
      pitchCallStatus: "Satisfactory",
      hmReviewStatus: "Pending",
      hmReviewRemark: "",
      shortlisted: false,
      inviteStatus: "Interested",
    },
  ];

  // COMPANY + USER INFO
  const companyInfo = {
    name: "TalentHub",
    logo: "https://ui-avatars.com/api/?name=TH&background=4F46E5&color=fff&bold=true&size=40",
  };

  const loggedInUser = {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Hiring Manager",
    department: "Engineering",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff",
  };

  // ---------------------------------------
  // STATES
  // ---------------------------------------

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  const [viewMode, setViewMode] = useState("mrfIds");
  const [selectedMrfId, setSelectedMrfId] = useState(null);

  const [showCandidateDetailModal, setShowCandidateDetailModal] = useState(false);
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState(null);

  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [evaluationCandidate, setEvaluationCandidate] = useState(null);

  const [evaluationData, setEvaluationData] = useState({
    technicalSkills: 5,
    communication: 5,
    problemSolving: 5,
    cultureFit: 5,
    overallRating: 5,
    strengths: "",
    weaknesses: "",
    recommendation: ""
  });

  const [filters, setFilters] = useState({
    candidateId: "",
    name: "",
    email: "",
    qualification: "",
    contactNumber: "",
    designation: "",
    experience: "",
    mrfId: "",
    status: "",
    source: "",
  });

  const [activeKpiFilter, setActiveKpiFilter] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "reschedule",
      message: "Interview rescheduled for Priya Sharma from Nov 15 to Nov 20",
      candidateName: "Priya Sharma",
      timestamp: "2025-11-13T09:30:00",
      read: false,
      icon: "bi-calendar-x",
      color: "warning",
    }
  ]);

  // ---------------------------------------
  // DERIVED DATA
  // ---------------------------------------

  const departmentMrfs = mockMrfs.filter(m => m.department === loggedInUser.department);

  const forwardedCandidates = mockCandidates.filter(
    c => c.sentToHiringManager === true && c.pitchCallStatus === "Satisfactory"
  );

  const scheduledInterviews = mockCandidates.filter(
    c => c.suggestedInterviewSlots && c.suggestedInterviewSlots.length > 0
  );

  const mrfCandidates = selectedMrfId
    ? forwardedCandidates.filter(c => String(c.mrfId) === String(selectedMrfId))
    : forwardedCandidates;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredCandidates = useMemo(() => {
    let result = [...mrfCandidates];

    if (activeKpiFilter === "pending") {
      result = result.filter(c => !c.hmReviewStatus || c.hmReviewStatus === "Pending");
    }
    if (activeKpiFilter === "shortlisted") {
      result = result.filter(c => c.hmReviewStatus === "Shortlisted");
    }
    if (activeKpiFilter === "rejected") {
      result = result.filter(c => c.hmReviewStatus === "Rejected");
    }

    if (filters.name) {
      result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
    }

    return result;
  }, [mrfCandidates, filters, activeKpiFilter]);

  const totalForwarded = forwardedCandidates.length;
  const pendingReview = forwardedCandidates.filter(c => !c.hmReviewStatus || c.hmReviewStatus === "Pending").length;
  const shortlisted = forwardedCandidates.filter(c => c.hmReviewStatus === "Shortlisted").length;
  const rejected = forwardedCandidates.filter(c => c.hmReviewStatus === "Rejected").length;

  // ---------------------------------------
  // HANDLERS
  // ---------------------------------------

  const handleCandidateClick = (candidate) => {
    setSelectedCandidateDetail(candidate);
    setShowCandidateDetailModal(true);
  };

  const handleManagerFeedback = (candidateId, feedback, remark) => {
    const idx = mockCandidates.findIndex(c => c.id === candidateId);
    if (idx !== -1) {
      mockCandidates[idx].hmReviewStatus = feedback;
      mockCandidates[idx].hmReviewRemark = remark;
    }
  };

  const handleOpenEvaluationForm = (candidate) => {
    setEvaluationCandidate(candidate);

    if (candidate.interviewEvaluation) {
      setEvaluationData(candidate.interviewEvaluation);
    }

    setShowEvaluationForm(true);
    setShowCandidateDetailModal(false);
  };

  const handleEvaluationSubmit = () => {
    const idx = mockCandidates.findIndex(c => c.id === evaluationCandidate.id);
    if (idx !== -1) {
      mockCandidates[idx].interviewEvaluation = evaluationData;
      mockCandidates[idx].interviewCompleted = true;
    }

    setToast({ show: true, message: "Evaluation submitted!", variant: "success" });
    setShowEvaluationForm(false);
  };

  return (
    <div className="container-fluid py-4">

      {/* ------------------------------ HEADER - FIXED ------------------------------ */}
      <div 
        className="card shadow-sm mb-4" 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          margin: 0,
          borderRadius: 0
        }}
      >
        <div className="card-body py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <img src={companyInfo.logo} alt={companyInfo.name} style={{ width: 40, height: 40 }} />
              <h5 className="mb-0 fw-bold text-primary">{companyInfo.name}</h5>
            </div>
            <div className="d-flex align-items-center gap-3">
              {/* Notification Bell */}
              <div className="position-relative">
                <button
                  className="btn btn-outline-secondary btn-sm position-relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <i className="bi bi-bell fs-5"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg"
                    style={{
                      minWidth: 380,
                      maxWidth: 400,
                      zIndex: 1050,
                      right: 0,
                      top: "100%",
                      marginTop: "0.5rem",
                      maxHeight: "500px",
                      overflowY: "auto"
                    }}
                  >
                    <div className="dropdown-header d-flex justify-content-between align-items-center border-bottom py-2">
                      <h6 className="mb-0 fw-bold">Notifications</h6>
                      {unreadCount > 0 && (
                        <button
                          className="btn btn-link btn-sm text-decoration-none p-0"
                          onClick={() => {
                            setNotifications(notifications.map(n => ({ ...n, read: true })));
                          }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-bell-slash fs-1 text-muted"></i>
                        <p className="text-muted mt-2 mb-0">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`dropdown-item py-3 border-bottom ${!notification.read ? "bg-light" : ""}`}
                        >
                          <div className="d-flex gap-2">
                            <div className={`text-${notification.color}`}>
                              <i className={`${notification.icon} fs-5`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <p className="mb-1 small">{notification.message}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  <i className="bi bi-clock me-1"></i>
                                  {new Date(notification.timestamp).toLocaleString()}
                                </small>
                                <div className="btn-group btn-group-sm">
                                  {!notification.read && (
                                    <button
                                      className="btn btn-link btn-sm text-decoration-none p-0 me-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
                                      }}
                                    >
                                      <i className="bi bi-check2"></i>
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-link btn-sm text-danger text-decoration-none p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotifications(notifications.filter(n => n.id !== notification.id));
                                    }}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <img
                  src={loggedInUser.avatar}
                  alt={loggedInUser.name}
                  className="rounded-circle"
                  style={{ width: 35, height: 35 }}
                />
                <div>
                  <p className="mb-0 small fw-semibold">{loggedInUser.name}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{loggedInUser.department}</p>
                </div>
              </div>

              <div className="position-relative">
                <button
                  className="btn btn-outline-primary btn-sm dropdown-toggle"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <span className="badge bg-primary" style={{ fontSize: "0.7rem" }}>{loggedInUser.role}</span>
                </button>
                {showUserDropdown && (
                  <div className="dropdown-menu show position-absolute end-0 mt-2 shadow" style={{ minWidth: 220, zIndex: 1050 }}>
                    <button className="dropdown-item" onClick={() => { setShowUserDropdown(false); setToast({ show: true, message: 'Switched to HR Manager view', variant: 'info' }); }}>
                      <i className="bi bi-person-badge me-2"></i> HR Manager
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger" onClick={() => navigate("/login")}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD SPACING FOR FIXED HEADER */}
      <div style={{ height: "80px" }}></div>

      {/* ------------------------------ PAGE TITLE ------------------------------ */}
      <div className="mb-4">
        <h3 className="fw-bold">Hiring Manager Dashboard</h3>
        <p className="text-muted">Department: {loggedInUser.department}</p>
      </div>

      {/* ------------------------------ KPI CARDS ------------------------------ */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">Manager Feedback Tracker</h5>
          <small className="text-muted">
            <i className="bi bi-info-circle"></i> Click on a KPI card to filter candidates
          </small>
        </div>
        <div className="row g-3">
          {[
            { title: "Total Forwarded", value: totalForwarded, icon: "bi-people-fill", color: "primary", filterType: null },
            { title: "Pending Review", value: pendingReview, icon: "bi-clock-history", color: "warning", filterType: "pending" },
            { title: "Shortlisted", value: shortlisted, icon: "bi-check-circle-fill", color: "success", filterType: "shortlisted" },
            { title: "Rejected", value: rejected, icon: "bi-x-circle-fill", color: "danger", filterType: "rejected" }
          ].map((kpi, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div
                className={`card shadow-sm border-${kpi.color} h-100 ${kpi.filterType ? 'cursor-pointer' : ''} ${activeKpiFilter === kpi.filterType ? 'border-3' : ''}`}
                style={{
                  cursor: kpi.filterType ? "pointer" : "default",
                  transition: "all 0.3s ease",
                  transform: activeKpiFilter === kpi.filterType ? "scale(1.02)" : "scale(1)"
                }}
                onClick={() => {
                  if (!kpi.filterType) return;
                  if (activeKpiFilter === kpi.filterType) {
                    setActiveKpiFilter(null);
                    setToast({ show: true, message: "Filter cleared", variant: "info" });
                  } else {
                    setActiveKpiFilter(kpi.filterType);
                    setToast({ show: true, message: `Filtered by ${kpi.title}`, variant: "success" });
                  }
                }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <p className="text-muted mb-1 small">{kpi.title}</p>
                      <h2 className={`fw-bold text-${kpi.color} mb-0`}>{kpi.value}</h2>
                    </div>
                    <div className={`bg-${kpi.color} bg-opacity-10 p-3 rounded position-relative`}>
                      <i className={`${kpi.icon} text-${kpi.color} fs-4`}></i>
                      {activeKpiFilter === kpi.filterType && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                          <i className="bi bi-check"></i>
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-muted small mb-0">{kpi.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------ NAV + TABLE - SIDEBAR NOW RELATIVE AND ELASTIC ------------------------------ */}
      <div className="row g-3">
        {/* Left Navigation Buttons - STICKY SIDEBAR (NOT FIXED) */}
        <div className="col-md-2">
          <div className="card shadow-sm sticky-top" style={{ top: "100px" }}>
            <div className="card-body p-2">
              <div className="d-grid gap-2">
                <button
                  className={`btn ${viewMode === "mrfIds" ? "btn-primary" : "btn-outline-primary"} text-start`}
                  onClick={() => setViewMode("mrfIds")}
                >
                  <i className="bi bi-list-check me-2"></i>
                  MRF IDs
                  <span className="badge bg-light text-dark float-end">{departmentMrfs.length}</span>
                </button>

                <button
                  className={`btn ${viewMode === "candidates" ? "btn-primary" : "btn-outline-primary"} text-start`}
                  onClick={() => setViewMode("candidates")}
                >
                  <i className="bi bi-people me-2"></i>
                  Candidates
                  <span className="badge bg-light text-dark float-end">{forwardedCandidates.length}</span>
                </button>

                <button
                  className={`btn ${viewMode === "interviews" ? "btn-primary" : "btn-outline-primary"} text-start`}
                  onClick={() => setViewMode("interviews")}
                >
                  <i className="bi bi-calendar-event me-2"></i>
                  Interviews
                  <span className="badge bg-light text-dark float-end">{scheduledInterviews.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Dynamic Table View - NO MARGIN LEFT NEEDED */}
        <div className="col-md-10">
          {/* MRF IDs Table */}
          {viewMode === "mrfIds" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-list-check me-2"></i>
                  MRF IDs ({departmentMrfs.length})
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3">MRF ID</th>
                        <th className="py-3">Position</th>
                        <th className="py-3">Department</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Priority</th>
                        <th className="py-3">Target Date</th>
                        <th className="py-3">Candidates</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentMrfs.map((mrf) => (
                        <tr key={mrf.id}>
                          <td className="px-4 py-3">
                            <span className="badge bg-info">{mrf.id}</span>
                          </td>
                          <td className="py-3 fw-semibold">{mrf.position}</td>
                          <td className="py-3">{mrf.department}</td>
                          <td className="py-3">
                            <span className={`badge bg-${mrf.status === "Open" ? "success" : mrf.status === "In Progress" ? "warning" : "secondary"}`}>
                              {mrf.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`badge bg-${mrf.priority === "High" ? "danger" : mrf.priority === "Medium" ? "warning" : "info"}`}>
                              {mrf.priority}
                            </span>
                          </td>
                          <td className="py-3">{mrf.targetDate}</td>
                          <td className="py-3">
                            <span className="badge bg-primary">
                              {forwardedCandidates.filter(c => String(c.mrfId) === String(mrf.id)).length}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setSelectedMrfId(mrf.id);
                                setViewMode("candidates");
                              }}
                            >
                              <i className="bi bi-eye me-1"></i> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------ CANDIDATES TABLE ------------------------------ */}
          {viewMode === "candidates" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">
                    <i className="bi bi-people me-2"></i>
                    Candidate Pool ({filteredCandidates.length})
                    {selectedMrfId && <span className="badge bg-info ms-2">{selectedMrfId}</span>}
                  </h5>
                  <div className="d-flex gap-2">
                    {selectedMrfId && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setSelectedMrfId(null)}
                      >
                        <i className="bi bi-x me-1"></i> Clear MRF Filter
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setFilters({
                          candidateId: "",
                          name: "",
                          email: "",
                          qualification: "",
                          contactNumber: "",
                          designation: "",
                          experience: "",
                          mrfId: "",
                          status: "",
                          source: "",
                        });
                        setActiveKpiFilter(null);
                        setToast({ show: true, message: "All filters cleared", variant: "info" });
                      }}
                    >
                      <i className="bi bi-x-circle me-1"></i> Clear All Filters
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="py-3">MRF ID</th>
                        <th className="py-3">Name</th>
                        <th className="py-3">Email</th>
                        <th className="py-3">Phone</th>
                        <th className="py-3">Designation</th>
                        <th className="py-3">Experience</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((candidate) => (
                        <tr key={candidate.id}>
                          <td className="px-4 py-3">
                            <span className="badge bg-secondary">#{candidate.id}</span>
                          </td>
                          <td className="py-3">
                            <span className="badge bg-info">{candidate.mrfId}</span>
                          </td>
                          <td className="py-3 fw-semibold">{candidate.name}</td>
                          <td className="py-3 small">{candidate.email}</td>
                          <td className="py-3 small">{candidate.contactNumber}</td>
                          <td className="py-3">{candidate.designation}</td>
                          <td className="py-3">{candidate.experience} yrs</td>
                          <td className="py-3">
                            <span className={`badge bg-${
                              candidate.hmReviewStatus === "Shortlisted" ? "success" :
                              candidate.hmReviewStatus === "Rejected" ? "danger" : "warning"
                            }`}>
                              {candidate.hmReviewStatus || "Pending"}
                            </span>
                          </td>

                          <td className="py-3">
                            <div className="btn-group btn-group-sm">
                              {candidate.suggestedInterviewSlots?.length > 0 && (
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => handleCandidateClick(candidate)}
                                  title="Interview"
                                >
                                  <i className="bi bi-camera-video-fill"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleCandidateClick(candidate)}
                                title="View Details"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------ INTERVIEWS TABLE ------------------------------ */}
          {viewMode === "interviews" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-calendar-event me-2"></i>
                  Scheduled Interviews ({scheduledInterviews.length})
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3">Candidate</th>
                        <th className="py-3">MRF ID</th>
                        <th className="py-3">Position</th>
                        <th className="py-3">Contact</th>
                        <th className="py-3">Interview Slots</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledInterviews.map((candidate) => {
                        const mrfDetails = mockMrfs.find(m => m.id === candidate.mrfId);
                        return (
                          <tr key={candidate.id}>
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                  <i className="bi bi-person-fill text-primary"></i>
                                </div>
                                <div>
                                  <div className="fw-semibold">{candidate.name}</div>
                                  <small className="text-muted">{candidate.email}</small>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="badge bg-info">{candidate.mrfId}</span>
                            </td>
                            <td className="py-3">{mrfDetails?.position || "N/A"}</td>
                            <td className="py-3">
                              <div className="small">
                                <div><i className="bi bi-telephone me-1"></i>{candidate.contactNumber}</div>
                                <div className="text-muted">{candidate.email}</div>
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="d-flex flex-column gap-1">
                                {candidate.suggestedInterviewSlots.map((slot, idx) => (
                                  <span key={idx} className="badge bg-success small">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    {new Date(slot.date).toLocaleDateString()} at {slot.time}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3">
                              {candidate.interviewCompleted ? (
                                <span className="badge bg-primary">Evaluated</span>
                              ) : (
                                <span className="badge bg-success">Scheduled</span>
                              )}
                            </td>
                            <td className="py-3">
                              <div className="btn-group-vertical btn-group-sm gap-1">
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleCandidateClick(candidate)}
                                >
                                  <i className="bi bi-camera-video-fill me-1"></i>
                                  Join
                                </button>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleOpenEvaluationForm(candidate)}
                                >
                                  <i className="bi bi-clipboard-check me-1"></i>
                                  {candidate.interviewCompleted ? "View" : "Evaluate"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------ CANDIDATE DETAIL MODAL ------------------------------ */}
      {showCandidateDetailModal && selectedCandidateDetail && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowCandidateDetailModal(false)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-circle me-2"></i>
                  Candidate Details - {selectedCandidateDetail.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCandidateDetailModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Interview Section */}
                {selectedCandidateDetail.suggestedInterviewSlots?.length > 0 ? (
                  <div className="card border-primary mb-4">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">
                        <i className="bi bi-camera-video-fill me-2"></i>
                        Scheduled Interview
                      </h6>
                    </div>

                    <div className="card-body">
                      {selectedCandidateDetail.suggestedInterviewSlots.map((slot, idx) => (
                        <div
                          key={idx}
                          className="d-flex justify-content-between align-items-center border p-3 rounded mb-2"
                        >
                          <div className="d-flex align-items-center gap-3">
                            <i className="bi bi-camera-video-fill fs-3 text-primary"></i>
                            <div>
                              <div className="fw-bold">{new Date(slot.date).toLocaleDateString()}</div>
                              <div className="text-muted">{slot.time}</div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <small className="text-muted me-2">{slot.time}</small>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => window.open("https://meet.google.com/new", "_blank")}
                            >
                              <i className="bi bi-camera-video-fill me-1"></i>
                              Join Interview
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="mt-3">
                        <button
                          className="btn btn-success w-100"
                          onClick={() => handleOpenEvaluationForm(selectedCandidateDetail)}
                        >
                          <i className="bi bi-clipboard-check me-1"></i>
                          {selectedCandidateDetail.interviewCompleted ? "View Evaluation" : "Evaluate Interview"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-light border mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    No interview scheduled for this candidate.
                  </div>
                )}

                {/* Candidate Information */}
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3 text-primary">
                      <i className="bi bi-person-badge me-2"></i>
                      Personal Information
                    </h6>
                    <table className="table table-sm table-bordered">
                      <tbody>
                        <tr>
                          <td className="fw-semibold bg-light">MRF ID:</td>
                          <td><span className="badge bg-info">{selectedCandidateDetail.mrfId}</span></td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Candidate ID:</td>
                          <td><span className="badge bg-secondary">#{selectedCandidateDetail.id}</span></td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Name:</td>
                          <td>{selectedCandidateDetail.name}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Email:</td>
                          <td>{selectedCandidateDetail.email}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">WhatsApp / Phone:</td>
                          <td>{selectedCandidateDetail.contactNumber}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Gender:</td>
                          <td>{selectedCandidateDetail.gender}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Age:</td>
                          <td>{selectedCandidateDetail.age} years</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Languages:</td>
                          <td>{selectedCandidateDetail.languages?.join(", ")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3 text-primary">
                      <i className="bi bi-briefcase me-2"></i>
                      Professional Information
                    </h6>
                    <table className="table table-sm table-bordered">
                      <tbody>
                        <tr>
                          <td className="fw-semibold bg-light">Qualification:</td>
                          <td>{selectedCandidateDetail.qualification}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Designation:</td>
                          <td>{selectedCandidateDetail.designation}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Experience:</td>
                          <td>{selectedCandidateDetail.experience} years</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Notice Period:</td>
                          <td>{selectedCandidateDetail.noticePeriod}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Current Salary:</td>
                          <td>₹{selectedCandidateDetail.currentSalary}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Expected Salary:</td>
                          <td>₹{selectedCandidateDetail.expectedSalary}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Source:</td>
                          <td><span className="badge bg-primary">{selectedCandidateDetail.source}</span></td>
                        </tr>
                        <tr>
                          <td className="fw-semibold bg-light">Current Status:</td>
                          <td>
                            <span className={`badge bg-${
                              selectedCandidateDetail.hmReviewStatus === "Shortlisted" ? "success" :
                              selectedCandidateDetail.hmReviewStatus === "Rejected" ? "danger" : "warning"
                            }`}>
                              {selectedCandidateDetail.hmReviewStatus || "Pending"}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Manager Feedback Section */}
                  <div className="col-12">
                    <div className="card border-primary">
                      <div className="card-header bg-primary text-white">
                        <h6 className="mb-0">
                          <i className="bi bi-chat-square-text me-2"></i>
                          Manager Feedback
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Decision <span className="text-danger">*</span></label>
                          <div className="btn-group w-100" role="group">
                            <button
                              className={`btn ${selectedCandidateDetail.hmReviewStatus === "Shortlisted" ? "btn-success" : "btn-outline-success"}`}
                              onClick={() => {
                                const remark = document.getElementById("hmRemark")?.value || "";
                                handleManagerFeedback(selectedCandidateDetail.id, "Shortlisted", remark);
                                setSelectedCandidateDetail(prev => ({ ...prev, hmReviewStatus: "Shortlisted", hmReviewRemark: remark }));
                                setToast({ show: true, message: "Candidate shortlisted", variant: "success" });
                              }}
                            >
                              <i className="bi bi-check-circle me-1"></i> Shortlist
                            </button>
                            <button
                              className={`btn ${selectedCandidateDetail.hmReviewStatus === "Rejected" ? "btn-danger" : "btn-outline-danger"}`}
                              onClick={() => {
                                const remark = document.getElementById("hmRemark")?.value || "";
                                handleManagerFeedback(selectedCandidateDetail.id, "Rejected", remark);
                                setSelectedCandidateDetail(prev => ({ ...prev, hmReviewStatus: "Rejected", hmReviewRemark: remark }));
                                setToast({ show: true, message: "Candidate rejected", variant: "warning" });
                              }}
                            >
                              <i className="bi bi-x-circle me-1"></i> Reject
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Remark</label>
                          <textarea
                            id="hmRemark"
                            className="form-control"
                            rows="3"
                            defaultValue={selectedCandidateDetail.hmReviewRemark || ""}
                            placeholder="Add your detailed feedback here..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interview Slot Suggestions */}
                  {selectedCandidateDetail.hmReviewStatus === "Shortlisted" && (
                    <div className="col-12">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0">
                            <i className="bi bi-calendar-check me-2"></i>
                            Interview Slot Suggestions
                          </h6>
                        </div>
                        <div className="card-body">
                          <p className="text-muted small">Suggest available interview slots for this candidate</p>
                          <div className="row g-2">
                            <div className="col-md-4">
                              <label className="form-label small">Date</label>
                              <input type="date" className="form-control" id="slot1Date" />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label small">Time</label>
                              <input type="time" className="form-control" id="slot1Time" />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label small">&nbsp;</label>
                              <button
                                className="btn btn-primary w-100"
                                onClick={() => {
                                  const date = document.getElementById("slot1Date").value;
                                  const time = document.getElementById("slot1Time").value;
                                  if (date && time) {
                                    const idx = mockCandidates.findIndex(c => c.id === selectedCandidateDetail.id);
                                    if (idx !== -1) {
                                      const newSlots = [...(mockCandidates[idx].suggestedInterviewSlots || []), { date, time }];
                                      mockCandidates[idx].suggestedInterviewSlots = newSlots;
                                      mockCandidates[idx].interviewSlotsSuggested = true;
                                      setSelectedCandidateDetail(prev => ({ ...prev, suggestedInterviewSlots: newSlots }));
                                      setToast({ show: true, message: "Interview slot added", variant: "success" });
                                      document.getElementById("slot1Date").value = "";
                                      document.getElementById("slot1Time").value = "";
                                    }
                                  } else {
                                    setToast({ show: true, message: "Please select both date and time", variant: "warning" });
                                  }
                                }}
                              >
                                <i className="bi bi-plus-circle me-1"></i> Add Slot
                              </button>
                            </div>
                          </div>

                          {selectedCandidateDetail.suggestedInterviewSlots?.length > 0 && (
                            <div className="mt-3">
                              <h6 className="small fw-semibold">Suggested Slots:</h6>
                              <div className="d-flex flex-wrap gap-2">
                                {selectedCandidateDetail.suggestedInterviewSlots.map((slot, idx) => (
                                  <span key={idx} className="badge bg-info fs-6">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    {new Date(slot.date).toLocaleDateString()} at {slot.time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => window.open(`/documents/resume-${selectedCandidateDetail.id}.pdf`, "_blank")}
                >
                  <i className="bi bi-file-earmark-pdf me-2"></i> View Resume
                </button>

                {selectedCandidateDetail.suggestedInterviewSlots?.length > 0 && (
                  <button
                    className="btn btn-success"
                    onClick={() => handleOpenEvaluationForm(selectedCandidateDetail)}
                  >
                    <i className="bi bi-clipboard-check me-2"></i>
                    {selectedCandidateDetail.interviewCompleted ? "View Evaluation" : "Evaluate Interview"}
                  </button>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCandidateDetailModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------ EVALUATION MODAL ------------------------------ */}
      {showEvaluationForm && evaluationCandidate && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEvaluationForm(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-clipboard-check me-2"></i>
                  Interview Evaluation - {evaluationCandidate.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEvaluationForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Rate the candidate on a scale of 1-10 for each criterion
                </div>

                <div className="row g-4">
                  {/* Technical Skills */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-code-square me-2"></i>
                      Technical Skills
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="range"
                        className="form-range flex-grow-1"
                        min="1"
                        max="10"
                        value={evaluationData.technicalSkills}
                        onChange={(e) => setEvaluationData({ ...evaluationData, technicalSkills: parseInt(e.target.value) })}
                      />
                      <span className="badge bg-primary fs-5" style={{ minWidth: "50px" }}>{evaluationData.technicalSkills}/10</span>
                    </div>
                  </div>

                  {/* Communication */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-chat-dots me-2"></i>
                      Communication Skills
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="range"
                        className="form-range flex-grow-1"
                        min="1"
                        max="10"
                        value={evaluationData.communication}
                        onChange={(e) => setEvaluationData({ ...evaluationData, communication: parseInt(e.target.value) })}
                      />
                      <span className="badge bg-primary fs-5" style={{ minWidth: "50px" }}>{evaluationData.communication}/10</span>
                    </div>
                  </div>

                  {/* Problem Solving */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-puzzle me-2"></i>
                      Problem Solving
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="range"
                        className="form-range flex-grow-1"
                        min="1"
                        max="10"
                        value={evaluationData.problemSolving}
                        onChange={(e) => setEvaluationData({ ...evaluationData, problemSolving: parseInt(e.target.value) })}
                      />
                      <span className="badge bg-primary fs-5" style={{ minWidth: "50px" }}>{evaluationData.problemSolving}/10</span>
                    </div>
                  </div>

                  {/* Culture Fit */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-people me-2"></i>
                      Culture Fit
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="range"
                        className="form-range flex-grow-1"
                        min="1"
                        max="10"
                        value={evaluationData.cultureFit}
                        onChange={(e) => setEvaluationData({ ...evaluationData, cultureFit: parseInt(e.target.value) })}
                      />
                      <span className="badge bg-primary fs-5" style={{ minWidth: "50px" }}>{evaluationData.cultureFit}/10</span>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-star me-2"></i>
                      Overall Rating
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="range"
                        className="form-range flex-grow-1"
                        min="1"
                        max="10"
                        value={evaluationData.overallRating}
                        onChange={(e) => setEvaluationData({ ...evaluationData, overallRating: parseInt(e.target.value) })}
                      />
                      <span className="badge bg-success fs-5" style={{ minWidth: "50px" }}>{evaluationData.overallRating}/10</span>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-hand-thumbs-up me-2"></i>
                      Strengths
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={evaluationData.strengths}
                      onChange={(e) => setEvaluationData({ ...evaluationData, strengths: e.target.value })}
                      placeholder="What are the candidate's key strengths?"
                    />
                  </div>

                  {/* Weaknesses */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-hand-thumbs-down me-2"></i>
                      Areas for Improvement
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={evaluationData.weaknesses}
                      onChange={(e) => setEvaluationData({ ...evaluationData, weaknesses: e.target.value })}
                      placeholder="What areas need improvement?"
                    />
                  </div>

                  {/* Recommendation */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-clipboard-check me-2"></i>
                      Final Recommendation <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={evaluationData.recommendation}
                      onChange={(e) => setEvaluationData({ ...evaluationData, recommendation: e.target.value })}
                    >
                      <option value="">Select Recommendation</option>
                      <option value="Strong Hire">Strong Hire</option>
                      <option value="Hire">Hire</option>
                      <option value="Hold">Hold</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEvaluationForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleEvaluationSubmit();
                  }}
                  disabled={!evaluationData.recommendation}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------ TOAST ------------------------------ */}
      {toast.show && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className={`toast show align-items-center text-white bg-${toast.variant} border-0`}>
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast({ ...toast, show: false })}
              ></button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HiringManagerDashboard;
