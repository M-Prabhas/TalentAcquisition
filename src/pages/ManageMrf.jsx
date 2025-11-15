import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import AppToast from "../components/Toast";






const ManageMrf = () => {
  const { mockCandidates = [], mockMrfs = [], state = {}, updateState, currentUser } = useAppContext() || {};
  const navigate = useNavigate();
  const [selectedMrf, setSelectedMrf] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    location: "",
    status: "",
    hiringManager: ""
  });

  // NEW: Date range filter for KPIs
  const [kpiDateFilter, setKpiDateFilter] = useState({
    startDate: "",
    endDate: "",
    preset: "all" // all, today, week, month, quarter
  });

  const [showModal, setShowModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showKpiFilterModal, setShowKpiFilterModal] = useState(false); // NEW
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  // NEW: Manage Rounds modal state
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [rounds, setRounds] = useState([]); // rounds for currently selected MRF in modal
  const [roundEditIndex, setRoundEditIndex] = useState(null); // index of row being edited
  const [newRound, setNewRound] = useState({
    name: "",
    interviewer: "",
    mode: "Phone",
    date: "",
    time: "",
    notes: ""
  });

  const userDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Mock current user data
  const loggedInUser = currentUser || {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Talent Acquisition Specialist",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
  };

  // Company details
  const companyInfo = {
    name: "TalentHub",
    logo: "https://ui-avatars.com/api/?name=TH&background=4F46E5&color=fff&bold=true&size=40"
  };

  // Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "reschedule",
      priority: "high",
      title: "Interview Rescheduling Request",
      message: "Hiring Manager Sarah Johnson has requested to reschedule John Smith's technical interview from Nov 15 to Nov 18.",
      candidateName: "John Smith",
      candidateId: 1,
      mrfId: "MRF001",
      from: "Sarah Johnson (Hiring Manager)",
      timestamp: "2025-11-10T14:30:00",
      read: false,
      actionRequired: true,
      actionTaken: null,
    },
    {
      id: 2,
      type: "candidate_update",
      priority: "medium",
      title: "Candidate Status Update Required",
      message: "Emily Chen has completed her technical interview. Please update the candidate status and proceed with next steps.",
      candidateName: "Emily Chen",
      candidateId: 2,
      mrfId: "MRF001",
      from: "System",
      timestamp: "2025-11-10T11:20:00",
      read: false,
      actionRequired: true,
      actionTaken: null,
    },
    {
      id: 3,
      type: "pitch_call",
      priority: "high",
      title: "Pitch Call Scheduled",
      message: "New candidate Michael Rodriguez has been assigned for pitch call screening on Nov 12 at 2:00 PM.",
      candidateName: "Michael Rodriguez",
      candidateId: 3,
      mrfId: "MRF002",
      from: "System",
      timestamp: "2025-11-09T16:45:00",
      read: true,
      actionRequired: false,
      actionTaken: null,
    },
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get MRFs assigned to current HR
  const hrMrfs = mockMrfs?.filter(mrf => mrf.assignedTo === state.currentUserId) || [];

  // Get unique values for filters
  const uniqueHiringManagers = [...new Set(hrMrfs.map(m => m.hiringManager).filter(Boolean))];
  const uniqueDepartments = [...new Set(hrMrfs.map(m => m.department).filter(Boolean))];

  // Calculate unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // NEW: Calculate KPIs based on date filter
  const calculateKPIs = () => {
    // Filter candidates based on date range if set
    let filteredCandidates = mockCandidates;

    if (kpiDateFilter.startDate || kpiDateFilter.endDate) {
      filteredCandidates = mockCandidates.filter(candidate => {
        const candidateDate = new Date(candidate.appliedDate || candidate.createdAt);
        const start = kpiDateFilter.startDate ? new Date(kpiDateFilter.startDate) : new Date('2000-01-01');
        const end = kpiDateFilter.endDate ? new Date(kpiDateFilter.endDate) : new Date();
        return candidateDate >= start && candidateDate <= end;
      });
    }

    // Get candidates for HR's MRFs only
    const hrCandidates = filteredCandidates.filter(c => 
      hrMrfs.some(mrf => mrf.id === c.mrfId)
    );

    return {
      totalMrfManaged: hrMrfs.length,
      candidatesReviewed: hrCandidates.length,
      pitchCalls: hrCandidates.filter(c => c.status === "Pitch Call" || c.pitchCallCompleted).length,
      assessments: hrCandidates.filter(c => c.status === "Assessment" || c.assessmentCompleted).length,
      interviews: hrCandidates.filter(c => c.status === "Interview" || c.interviewCompleted).length,
      offers: hrCandidates.filter(c => c.status === "Offer" || c.offerSent).length,
      hired: hrCandidates.filter(c => c.status === "Hired" || c.status === "Selected").length,
    };
  };

  const kpis = calculateKPIs();

  // NEW: Set date filter presets
  const setDatePreset = (preset) => {
    const today = new Date();
    let startDate = "";
    let endDate = today.toISOString().split('T')[0];

    switch(preset) {
      case "today":
        startDate = endDate;
        break;
      case "week":
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      case "month":
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      case "quarter":
        const quarterAgo = new Date(today.setMonth(today.getMonth() - 3));
        startDate = quarterAgo.toISOString().split('T')[0];
        break;
      case "all":
      default:
        startDate = "";
        endDate = "";
    }

    setKpiDateFilter({ startDate, endDate, preset });
    setShowKpiFilterModal(false);
    setToast({ show: true, message: `KPI filter set to: ${preset}`, variant: "info" });
  };

  // Calculate days since posting (Posting Age)
  const calculatePostingAge = (postingDate) => {
    const today = new Date();
    const posted = new Date(postingDate);
    const diffInTime = today.getTime() - posted.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  // Calculate fulfill by date status
  const getFulfillByStatus = (fulfillByDate) => {
    if (!fulfillByDate) return { text: "Not Set", class: "secondary" };

    const today = new Date();
    const targetDate = new Date(fulfillByDate);
    const diffInTime = targetDate.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return { text: "Overdue", class: "danger" };
    if (diffInDays <= 7) return { text: `${diffInDays} days left`, class: "warning" };
    return { text: `${diffInDays} days left`, class: "success" };
  };

  const handleRoleChange = (newRole) => {
    console.log("Switching to role:", newRole);
    setToast({ show: true, message: `Switched to ${newRole} view`, variant: "info" });
    setShowUserDropdown(false);

    if (newRole === "Hiring Manager") {
      navigate("/hiring-manager-dashboard");
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  const handleViewMrf = (e, mrf) => {
    e.stopPropagation();
    setSelectedMrf(mrf);
    setShowModal(true);
  };

  const handleMrfClick = (mrfId) => {
    updateState && updateState({ selectedMrfId: mrfId });
    navigate(`/manage_candidates/${mrfId}`);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setToast({ show: true, message: "All notifications marked as read", variant: "success" });
  };


  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    setToast({ show: true, message: "Notification deleted", variant: "info" });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reschedule": return "bi-calendar-x text-warning";
      case "candidate_update": return "bi-person-check text-info";
      case "pitch_call": return "bi-telephone text-primary";
      case "candidate_withdrawal": return "bi-person-x text-danger";
      case "approval": return "bi-clipboard-check text-success";
      case "reminder": return "bi-alarm text-warning";
      case "feedback": return "bi-chat-left-text text-info";
      default: return "bi-bell text-secondary";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // ========= Manage Rounds functions =========
  const openRoundsModal = (mrf) => {
    // Load rounds from the mrf (store rounds in mrf.rounds array)
    const mrfRounds = Array.isArray(mrf.rounds) ? [...mrf.rounds] : [];
    setSelectedMrf(mrf);
    setRounds(mrfRounds);
    setRoundEditIndex(null);
    setNewRound({
      name: "",
      interviewer: "",
      mode: "Phone",
      date: "",
      time: "",
      notes: ""
    });
    setShowRoundsModal(true);
  };

  const handleAddRound = () => {
    // Basic validation
    if (!newRound.name) {
      setToast({ show: true, message: "Please enter round name", variant: "warning" });
      return;
    }
    const nextRoundNo = rounds.length > 0 ? Math.max(...rounds.map(r => r.roundNo || 0)) + 1 : 1;
    const roundToAdd = { roundNo: nextRoundNo, ...newRound };
    const updated = [...rounds, roundToAdd];
    setRounds(updated);
    setNewRound({ name: "", interviewer: "", mode: "Phone", date: "", time: "", notes: "" });
  };

  const handleEditRound = (index) => {
    setRoundEditIndex(index);
  };

  const handleRoundChange = (index, field, value) => {
    const copy = [...rounds];
    copy[index] = { ...copy[index], [field]: value };
    setRounds(copy);
  };

  const handleDeleteRound = (index) => {
    if (!window.confirm("Delete this round?")) return;
    const updated = rounds.filter((_, i) => i !== index);
    // reassign roundNo sequentially
    const reindexed = updated.map((r, i) => ({ ...r, roundNo: i + 1 }));
    setRounds(reindexed);
    setRoundEditIndex(null);
  };

  const handleSaveRounds = () => {
    if (!selectedMrf) return;
    // Update selectedMrf's rounds locally and attempt to persist via updateState if provided
    const updatedMrfs = mockMrfs.map(m => {
      if (m.id === selectedMrf.id) {
        return { ...m, rounds: rounds.map((r, i) => ({ ...r, roundNo: r.roundNo || i + 1 })) };
      }
      return m;
    });

    // If updateState exists in app context, call it. Otherwise, just show toast and close modal.
    if (typeof updateState === "function") {
      updateState({ mockMrfs: updatedMrfs });
      setToast({ show: true, message: "Rounds saved to MRF", variant: "success" });
    } else {
      setToast({ show: true, message: "Rounds updated locally (no persistence)", variant: "info" });
      // Update selectedMrf reference so UI reflects change for this session
      setSelectedMrf(prev => ({ ...prev, rounds: rounds }));
    }

    setShowRoundsModal(false);
  };

  const handleCloseRounds = () => {
    setShowRoundsModal(false);
    setRoundEditIndex(null);
  };

  // ========= end Manage Rounds functions =========

  // Apply filters to MRF table
  const filteredMrfs = hrMrfs.filter(mrf => {
    const statusMatch = !filters.status || mrf.status === filters.status;
    const deptMatch = !filters.department || mrf.department === filters.department;
    const locationMatch = !filters.location || mrf.location.toLowerCase().includes(filters.location.toLowerCase());
    const hiringManagerMatch = !filters.hiringManager || mrf.hiringManager === filters.hiringManager;

    return statusMatch && deptMatch && locationMatch && hiringManagerMatch;
  });

  return (
    <div className="container-fluid py-4">
      {/* Header with Company Logo and User Profile */}
      <div className="card shadow-sm mb-4">
        <div className="card-body py-2">
          <div className="d-flex justify-content-between align-items-center">
            {/* Company Logo and Name */}
            <div className="d-flex align-items-center gap-2">
              <img 
                src={companyInfo.logo} 
                alt={companyInfo.name}
                style={{ width: "40px", height: "40px" }}
              />
              <h5 className="mb-0 fw-bold text-primary">{companyInfo.name}</h5>
            </div>

            {/* User Profile Section */}
            <div className="d-flex align-items-center gap-3">
              {/* Notification Bell */}
              <div className="position-relative" ref={notificationRef}>
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

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div 
                    className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg" 
                    style={{ 
                      minWidth: 380, 
                      maxWidth: 400, 
                      zIndex: 1050, 
                      right: 0, 
                      top: '100%',
                      marginTop: '0.5rem',
                      maxHeight: '500px',
                      overflowY: 'auto'
                    }}
                  >
                    <div className="dropdown-header d-flex justify-content-between align-items-center border-bottom py-2">
                      <h6 className="mb-0 fw-bold">Notifications</h6>
                      {unreadCount > 0 && (
                        <button 
                          className="btn btn-link btn-sm text-decoration-none p-0"
                          onClick={handleMarkAllAsRead}
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
                      <div>
                        {notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`dropdown-item py-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                            style={{ cursor: 'pointer', whiteSpace: 'normal' }}
                          >
                            <div className="d-flex gap-2">
                              <div>
                                <i className={`${getNotificationIcon(notification.type)} fs-5`}></i>
                              </div>
                              <div className="flex-grow-1">
                                <p className="mb-1 small fw-semibold">{notification.title}</p>
                                <p className="mb-1 small text-muted">{notification.message.substring(0, 80)}...</p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">
                                    <i className="bi bi-clock me-1"></i>
                                    {formatTimestamp(notification.timestamp)}
                                  </small>
                                  <div className="btn-group btn-group-sm">
                                    {!notification.read && (
                                      <button
                                        className="btn btn-link btn-sm text-decoration-none p-0 me-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMarkAsRead(notification.id);
                                        }}
                                        title="Mark as read"
                                      >
                                        <i className="bi bi-check2"></i>
                                      </button>
                                    )}
                                    <button
                                      className="btn btn-link btn-sm text-danger text-decoration-none p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNotification(notification.id);
                                      }}
                                      title="Delete"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {notifications.length > 0 && (
                      <div className="dropdown-footer text-center py-2 border-top">
                        <button className="btn btn-link btn-sm text-decoration-none">
                          View All Notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="d-flex align-items-center gap-2">
                <img 
                  src={loggedInUser.avatar} 
                  alt={loggedInUser.name}
                  className="rounded-circle"
                  style={{ width: "35px", height: "35px", objectFit: "cover" }}
                />
                <div>
                  <p className="mb-0 small fw-semibold">{loggedInUser.name}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{loggedInUser.email}</p>
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="position-relative" ref={userDropdownRef}>
                <button 
                  className="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <span className="badge bg-primary" style={{ fontSize: "0.7rem" }}>{loggedInUser.role}</span>
                </button>

                {showUserDropdown && (
                  <div className="dropdown-menu show position-absolute end-0 mt-2 shadow" style={{ minWidth: "220px", zIndex: 1050 }}>
                    <button 
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      onClick={() => handleRoleChange("HR Manager")}
                    >
                      <i className="bi bi-person-badge"></i>
                      HR Manager
                    </button>

                    <button 
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      onClick={() => handleRoleChange("Hiring Manager")}
                    >
                      <i className="bi bi-briefcase"></i>
                      Hiring Manager
                    </button>

                    <div className="dropdown-divider"></div>

                    <button 
                      className="dropdown-item text-danger d-flex align-items-center gap-2 py-2"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title and KPI Filter */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark">Talent Acquisition Dashboard</h3>
          <p className="text-muted mb-0">Track MRFs and hiring process metrics</p>
        </div>

        {/* NEW: KPI Date Filter Button */}
        <button 
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={() => setShowKpiFilterModal(true)}
        >
          <i className="bi bi-funnel"></i>
          Filter KPIs
          {kpiDateFilter.preset !== "all" && (
            <span className="badge bg-primary">{kpiDateFilter.preset}</span>
          )}
        </button>
      </div>

      {/* NEW: Employee KPIs Section */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-primary shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="text-muted mb-0">Total MRF Managed</h6>
                <i className="bi bi-folder text-primary fs-4"></i>
              </div>
              <h2 className="text-primary fw-bold mb-1">{kpis.totalMrfManaged}</h2>
              <p className="text-muted small mb-0">
                <i className="bi bi-check-circle text-success me-1"></i>
                Active requisitions
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-info shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="text-muted mb-0">Candidates Reviewed</h6>
                <i className="bi bi-people text-info fs-4"></i>
              </div>
              <h2 className="text-info fw-bold mb-1">{kpis.candidatesReviewed}</h2>
              <p className="text-muted small mb-0">
                <i className="bi bi-eye text-info me-1"></i>
                Total applications
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-secondary shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="text-muted mb-0">Pitch Calls</h6>
                <i className="bi bi-telephone text-secondary fs-4"></i>
              </div>
              <h2 className="text-secondary fw-bold mb-1">{kpis.pitchCalls}</h2>
              <p className="text-muted small mb-0">
                <i className="bi bi-arrow-right text-secondary me-1"></i>
                Initial screening
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-warning shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="text-muted mb-0">Assessments</h6>
                <i className="bi bi-clipboard-check text-warning fs-4"></i>
              </div>
              <h2 className="text-warning fw-bold mb-1">{kpis.assessments}</h2>
              <p className="text-muted small mb-0">
                <i className="bi bi-pencil text-warning me-1"></i>
                Tests completed
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-primary shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="text-muted mb-0">Interviews</h6>
                <i className="bi bi-person-video3 text-primary fs-4"></i>
              </div>
              <h2 className="text-primary fw-bold mb-1">{kpis.interviews}</h2>
              <p className="text-muted small mb-0">
                <i className="bi bi-calendar-check text-primary me-1"></i>
                Interviews conducted
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-info shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="text-muted mb-0">Offers</h6>
                <i className="bi bi-envelope-check text-info fs-4"></i>
              </div>
              <h2 className="text-info fw-bold mb-1">{kpis.offers}</h2>
              <p className="text-muted small mb-0">
                <i className="bi bi-send text-info me-1"></i>
                Offers extended
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-success shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="text-muted mb-0">Hired</h6>
                <i className="bi bi-person-check-fill text-success fs-4"></i>
              </div>
              <h2 className="text-success fw-bold mb-1">{kpis.hired}</h2>
              <p className="text-muted small mb-0">
                <i className="bi bi-trophy text-success me-1"></i>
                Successfully placed
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-danger shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="text-muted mb-0">Conversion Rate</h6>
                <i className="bi bi-graph-up-arrow text-danger fs-4"></i>
              </div>
              <h2 className="text-danger fw-bold mb-1">
                {kpis.candidatesReviewed > 0 
                  ? `${Math.round((kpis.hired / kpis.candidatesReviewed) * 100)}%`
                  : '0%'
                }
              </h2>
              <p className="text-muted small mb-0">
                <i className="bi bi-percent text-danger me-1"></i>
                Application to hire
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MRF Tracking Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-table me-2"></i>
            Assigned MRF Tracking
          </h5>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>MRF ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Hiring Manager</th>
                <th>Posting Age</th>
                <th>Fulfill By</th>
                <th>Location</th>
                <th>Status</th>
                <th>Rounds</th>
                <th>Actions</th>
              </tr>
              {/* Filter Row */}
              <tr className="table-secondary">
                <th></th>
                <th>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.department || ''}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  >
                    <option value="">All</option>
                    {uniqueDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </th>
                <th></th>
                <th>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.hiringManager || ''}
                    onChange={(e) => setFilters({ ...filters, hiringManager: e.target.value })}
                  >
                    <option value="">All</option>
                    {uniqueHiringManagers.map(hm => (
                      <option key={hm} value={hm}>{hm}</option>
                    ))}
                  </select>
                </th>
                <th></th>
                <th></th>
                <th>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Filter..."
                    value={filters.location || ''}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </th>
                <th>
                  <select 
                    className="form-select form-select-sm"
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </th>
                <th></th>
                <th>
                  <button 
                    className="btn btn-sm btn-secondary w-100"
                    onClick={() => setFilters({ status: "", department: "", location: "", hiringManager: "" })}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Clear
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMrfs.length > 0 ? (
                filteredMrfs.map(mrf => {
                  const postingAge = calculatePostingAge(mrf.postingDate);
                  const fulfillByStatus = getFulfillByStatus(mrf.fulfillBy);

                  return (
                    <tr 
                      key={mrf.id}
                      style={{ cursor: "pointer" }}
                      className="table-row-hover"
                    >
                      <td>
                        <button
                          className="btn btn-link text-primary fw-semibold text-decoration-none p-0"
                          onClick={() => handleMrfClick(mrf.id)}
                        >
                          {mrf.id}
                        </button>
                      </td>
                      <td>{mrf.department}</td>
                      <td>{mrf.designation}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-person-circle"></i>
                          {mrf.hiringManager || 'Not Assigned'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge bg-${
                          postingAge > 30 ? 'danger' : 
                          postingAge > 15 ? 'warning' : 
                          'success'
                        }`}>
                          {postingAge} {postingAge === 1 ? 'day' : 'days'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${fulfillByStatus.class}`}>
                          {fulfillByStatus.text}
                        </span>
                      </td>
                      <td>
                        <i className="bi bi-geo-alt me-1"></i>
                        {mrf.location}
                      </td>
                      <td>
                        <span className={`badge bg-${mrf.status === 'Open' ? 'success' : 'danger'}`}>
                          {mrf.status}
                        </span>
                      </td>

                      {/* Rounds summary */}
                      <td>
                        <span className="small text-muted">
                          {Array.isArray(mrf.rounds) && mrf.rounds.length > 0 
                            ? `${mrf.rounds.length} round(s)`
                            : "No rounds"}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={(e) => { e.stopPropagation(); openRoundsModal(mrf); }}
                            title="Manage Rounds"
                          >
                            <i className="bi bi-list-ul me-1"></i>
                            Manage Rounds
                          </button>

                          <button 
                            className="btn btn-sm btn-outline-info"
                            onClick={(e) => handleViewMrf(e, mrf)}
                            title="View MRF Details"
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1"></i>
                    <p className="mt-2">No MRFs found matching the filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW: Rounds Modal */}
      {showRoundsModal && selectedMrf && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">Manage Rounds - {selectedMrf.id}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseRounds}></button>
              </div>

              <div className="modal-body">
                <p className="small text-muted mb-3">
                  Add / edit interview rounds for this MRF. Previous scheduled interviews (if any) are listed below.
                </p>

                {/* Existing rounds table */}
                <div className="table-responsive mb-3">
                  <table className="table table-sm table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "80px" }}>Round No</th>
                        <th>Round Name</th>
                        <th>Interviewer</th>
                        <th>Mode</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Notes</th>
                        <th style={{ width: "140px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rounds.length === 0 && (
                        <tr>
                          <td colSpan="8" className="text-center text-muted py-3">No rounds defined yet.</td>
                        </tr>
                      )}

                      {rounds.map((r, idx) => (
                        <tr key={idx}>
                          <td>{r.roundNo || idx + 1}</td>

                          {/* If editing this row, show inputs */}
                          {roundEditIndex === idx ? (
                            <>
                              <td>
                                <input className="form-control form-control-sm" value={r.name || ""} onChange={(e) => handleRoundChange(idx, "name", e.target.value)} />
                              </td>
                              <td>
                                <input className="form-control form-control-sm" value={r.interviewer || ""} onChange={(e) => handleRoundChange(idx, "interviewer", e.target.value)} />
                              </td>
                              <td>
                                <select className="form-select form-select-sm" value={r.mode || "Phone"} onChange={(e) => handleRoundChange(idx, "mode", e.target.value)}>
                                  <option>Phone</option>
                                  <option>Video</option>
                                  <option>In-Person</option>
                                </select>
                              </td>
                              <td>
                                <input type="date" className="form-control form-control-sm" value={r.date || ""} onChange={(e) => handleRoundChange(idx, "date", e.target.value)} />
                              </td>
                              <td>
                                <input type="time" className="form-control form-control-sm" value={r.time || ""} onChange={(e) => handleRoundChange(idx, "time", e.target.value)} />
                              </td>
                              <td>
                                <input className="form-control form-control-sm" value={r.notes || ""} onChange={(e) => handleRoundChange(idx, "notes", e.target.value)} />
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-sm btn-success" onClick={() => setRoundEditIndex(null)}>Save</button>
                                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setRoundEditIndex(null)}>Cancel</button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{r.name || "-"}</td>
                              <td>{r.interviewer || "-"}</td>
                              <td>{r.mode || "-"}</td>
                              <td>{r.date ? new Date(r.date).toLocaleDateString() : "-"}</td>
                              <td>{r.time || "-"}</td>
                              <td>{r.notes ? <span className="small text-muted">{r.notes}</span> : "-"}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditRound(idx)}><i className="bi bi-pencil"></i> Edit</button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRound(idx)}><i className="bi bi-trash"></i> Delete</button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add new round form */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="fw-semibold mb-2">Add New Round</h6>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <label className="form-label small">Round Name</label>
                        <input className="form-control form-control-sm" value={newRound.name} onChange={(e) => setNewRound({ ...newRound, name: e.target.value })} placeholder="e.g., Screening" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small">Interviewer</label>
                        <input className="form-control form-control-sm" value={newRound.interviewer} onChange={(e) => setNewRound({ ...newRound, interviewer: e.target.value })} placeholder="Interviewer name" />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label small">Mode</label>
                        <select className="form-select form-select-sm" value={newRound.mode} onChange={(e) => setNewRound({ ...newRound, mode: e.target.value })}>
                          <option>Phone</option>
                          <option>Video</option>
                          <option>In-Person</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label className="form-label small">Date</label>
                        <input type="date" className="form-control form-control-sm" value={newRound.date} onChange={(e) => setNewRound({ ...newRound, date: e.target.value })} />
                      </div>
                      <div className="col-md-2 mt-2">
                        <label className="form-label small">Time</label>
                        <input type="time" className="form-control form-control-sm" value={newRound.time} onChange={(e) => setNewRound({ ...newRound, time: e.target.value })} />
                      </div>
                      <div className="col-md-12 mt-2">
                        <label className="form-label small">Notes</label>
                        <textarea className="form-control form-control-sm" rows="2" value={newRound.notes} onChange={(e) => setNewRound({ ...newRound, notes: e.target.value })} />
                      </div>
                    </div>

                    <div className="mt-3 text-end">
                      <button className="btn btn-sm btn-primary" onClick={handleAddRound}><i className="bi bi-plus-lg me-1"></i> Add Round</button>
                    </div>
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <small className="text-muted">Changes will be saved to this MRF when you click <strong>Save All Changes</strong>.</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-secondary" onClick={handleCloseRounds}>Close</button>
                    <button className="btn btn-primary" onClick={handleSaveRounds}><i className="bi bi-check2-circle me-1"></i> Save All Changes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: KPI Date Filter Modal */}
      {showKpiFilterModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-funnel me-2"></i>
                  Timeframe Filter
                </h5>
                <button 
                  type="button"
                  className="btn-close" 
                  onClick={() => setShowKpiFilterModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Quick Presets</label>
                  <div className="btn-group w-100" role="group">
                    <button 
                      className={`btn ${kpiDateFilter.preset === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setDatePreset('all')}
                    >
                      All Time
                    </button>
                    <button 
                      className={`btn ${kpiDateFilter.preset === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setDatePreset('today')}
                    >
                      Today
                    </button>
                    <button 
                      className={`btn ${kpiDateFilter.preset === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setDatePreset('week')}
                    >
                      Week
                    </button>
                  </div>
                  <div className="btn-group w-100 mt-2" role="group">
                    <button 
                      className={`btn ${kpiDateFilter.preset === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setDatePreset('month')}
                    >
                      Month
                    </button>
                  </div>
                </div>

                <div className="border-top pt-3 mt-3">
                  <label className="form-label fw-semibold">Custom Date Range</label>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label small">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={kpiDateFilter.startDate}
                        onChange={(e) => setKpiDateFilter({ ...kpiDateFilter, startDate: e.target.value, preset: 'custom' })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={kpiDateFilter.endDate}
                        onChange={(e) => setKpiDateFilter({ ...kpiDateFilter, endDate: e.target.value, preset: 'custom' })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  onClick={() => {
                    setKpiDateFilter({ startDate: "", endDate: "", preset: "all" });
                    setShowKpiFilterModal(false);
                  }}
                >
                  Reset
                </button>
                <button 
                  type="button"
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowKpiFilterModal(false);
                    setToast({ show: true, message: "KPI filters applied successfully", variant: "success" });
                  }}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* MRF Details Modal - COMPLETE VERSION MATCHING IMAGE */}
      {showModal && selectedMrf && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  MRF Details ({selectedMrf.id})
                </h5>
                <button 
                  type="button"
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMrf(null);
                  }}
                ></button>
              </div>

              {/* Body - Two Column Layout exactly as shown in image */}
              <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="row g-4">
                  {/* Left Column */}
                  <div className="col-md-6">
                    {/* Requirement Type */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Requirement Type:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.requirementType || 'N/A'}</p>
                    </div>

                    {/* Employment Type */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Employment Type:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.employmentType || 'Full Time'}</p>
                    </div>

                    {/* Annual CTC */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Annual CTC (LPA):</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.salaryRange || selectedMrf.annualCTC || '5 - 7'}</p>
                    </div>

                    {/* Variable Pay */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Variable Pay (%):</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.variablePay || '0'}</p>
                    </div>

                    {/* Required Skill Set */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Required Skill Set:</label>
                      <p className="mb-0 fw-semibold">
                        {Array.isArray(selectedMrf.skills) && selectedMrf.skills.length > 0
                          ? selectedMrf.skills.join(', ')
                          : selectedMrf.requiredSkills || 'N/A'}
                      </p>
                    </div>

                    {/* Age Range */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Age Range (Years):</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.ageRange || 'N/A - N/A'}</p>
                    </div>

                    {/* Work Location City */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Work Location City:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.workLocationCity || selectedMrf.location || 'N/A'}</p>
                    </div>

                    {/* Targeted Companies */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Targeted Companies:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.targetedCompanies || 'N/A'}</p>
                    </div>

                    {/* Interviewers */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Interviewers:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.interviewers || 'N/A'}</p>
                    </div>

                    {/* Created At */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Created At:</label>
                      <p className="mb-0 fw-semibold">
                        {selectedMrf.createdAt 
                          ? new Date(selectedMrf.createdAt).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          : selectedMrf.postingDate 
                            ? new Date(selectedMrf.postingDate).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })
                            : 'N/A'}
                      </p>
                    </div>

                    {/* Last Modified */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Last modified:</label>
                      <p className="mb-0 fw-semibold">
                        {selectedMrf.lastModified 
                          ? new Date(selectedMrf.lastModified).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          : 'N/A'}
                      </p>
                    </div>

                    {/* Vacancies */}
                    <div className="mb-3 pb-2">
                      <label className="text-muted small mb-1">Vacancies:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.positions || selectedMrf.vacancies || '1'}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-md-6">
                    {/* Replacement Employees */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Replacement Employees:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.replacementEmployees || 'N/A'}</p>
                    </div>

                    {/* Job Description */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Job description:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.jobDescription || selectedMrf.designation || 'Digital Marketing'}</p>
                    </div>

                    {/* Incentives */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Incentives (LPA):</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.incentives || '0'}</p>
                    </div>

                    {/* Required Qualifications */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Required Qualifications:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.educationQualification || selectedMrf.requiredQualifications || 'N/A'}</p>
                    </div>

                    {/* Experience Range */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Experience Range (Years):</label>
                      <p className="mb-0 fw-semibold">
                        {selectedMrf.expMin && selectedMrf.expMax 
                          ? `${selectedMrf.expMin} - ${selectedMrf.expMax}`
                          : selectedMrf.experienceRequired || 'N/A - N/A'}
                      </p>
                    </div>

                    {/* State */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">State:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.state || 'TELANGANA'}</p>
                    </div>

                    {/* Specific Consideration */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Specific Consideration:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.specificConsideration || 'N/A'}</p>
                    </div>

                    {/* Modes of Interview */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Modes of Interview:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.interviewModes || selectedMrf.workMode || 'N/A'}</p>
                    </div>

                    {/* Created By */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Created by:</label>
                      <p className="mb-0 fw-semibold">
                        {selectedMrf.createdBy || 'Aditya Ghosh'}
                        {selectedMrf.createdById && (
                          <span className="text-muted small d-block">({selectedMrf.createdById})</span>
                        )}
                      </p>
                    </div>

                    {/* Modified By */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Modified By:</label>
                      <p className="mb-0 fw-semibold">
                        {selectedMrf.modifiedBy || 'Aditya Ghosh'}
                        {selectedMrf.modifiedById && (
                          <span className="text-muted small d-block">({selectedMrf.modifiedById})</span>
                        )}
                      </p>
                    </div>

                    {/* Remarks */}
                    <div className="mb-3 pb-2 border-bottom">
                      <label className="text-muted small mb-1">Remarks:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.remarks || 'N/A'}</p>
                    </div>

                    {/* Recruited Count */}
                    <div className="mb-3 pb-2">
                      <label className="text-muted small mb-1">Recruited Count:</label>
                      <p className="mb-0 fw-semibold">{selectedMrf.recruitedCount || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMrf(null);
                  }}
                >
                  Close
                </button>
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleMrfClick(selectedMrf.id)}
                >
                  <i className="bi bi-people me-2"></i>
                  View Candidates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Toast */}
      <AppToast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default ManageMrf;