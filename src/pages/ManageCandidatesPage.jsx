import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import AppToast from "../components/Toast";
import AddCandidateModal from "../components/AddCandidateModal";

const ManageCandidatesPage = () => {
  const { mrfId } = useParams();
  const navigate = useNavigate();
  const {
    mockCandidates = [],
    mockMrfs = [],
    currentUser,
    updateCandidate,
    updateUser
  } = useAppContext();

  const [mrf, setMrf] = useState(null);
  
  // NEW: State for the three mandatory fields
  const [jobDescription, setJobDescription] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobResponsibilities, setJobResponsibilities] = useState("");
  
  // NEW: State for modals
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [showResponsibilitiesModal, setShowResponsibilitiesModal] = useState(false);
  
  // NEW: Temporary state for modal inputs
  const [tempDescription, setTempDescription] = useState("");
  const [tempRequirements, setTempRequirements] = useState("");
  const [tempResponsibilities, setTempResponsibilities] = useState("");
  
  const [filters, setFilters] = useState({
    candidateId: "",
    name: "",
    qualification: "",
    contactNumber: "",
    email: "",
    department: "",
    status: "",
    source: "",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    noticePeriod: "",
    designation: "",
    keywords: "",
    languages: "",
    dateApplied: ""
  });

  const [expandedFilterCategories, setExpandedFilterCategories] = useState({
    basic: true,
    contact: false,
    qualification: false,
    job: false
  });
  const [dateSortOrder, setDateSortOrder] = useState("recent");

  const [showAllPostings, setShowAllPostings] = useState(false);
  const [viewMode, setViewMode] = useState("selection");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPostingModal, setShowAddPostingModal] = useState(false);
  const [showInterestFormModal, setShowInterestFormModal] = useState(false);
  const [interestFormUrl, setInterestFormUrl] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [proceedClicked, setProceedClicked] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPitchCallScheduler, setShowPitchCallScheduler] = useState(false);
  const [selectedForPitchCall, setSelectedForPitchCall] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success"
  });

  const GENERAL_CALL_NUMBER = "9876543210";

  const loggedInUser = currentUser || {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "HR Manager",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
  };

  const companyInfo = {
    name: "TalentHub",
    logo: "https://ui-avatars.com/api/?name=TH&background=4F46E5&color=fff&bold=true&size=40"
  };

  // NEW: Check if all three mandatory fields are filled
  const areAllMandatoryFieldsFilled = () => {
    return jobDescription.trim() !== "" && 
           jobRequirements.trim() !== "" && 
           jobResponsibilities.trim() !== "";
  };

  // NEW: Handlers for the three modals
  const handleSaveDescription = () => {
    if (tempDescription.trim() === "") {
      setToast({ show: true, message: "Please enter a description.", variant: "warning" });
      return;
    }
    setJobDescription(tempDescription);
    setShowDescriptionModal(false);
    setTempDescription("");
    setToast({ show: true, message: "Job description saved successfully!", variant: "success" });
  };

  const handleSaveRequirements = () => {
    if (tempRequirements.trim() === "") {
      setToast({ show: true, message: "Please enter requirements.", variant: "warning" });
      return;
    }
    setJobRequirements(tempRequirements);
    setShowRequirementsModal(false);
    setTempRequirements("");
    setToast({ show: true, message: "Job requirements saved successfully!", variant: "success" });
  };

  const handleSaveResponsibilities = () => {
    if (tempResponsibilities.trim() === "") {
      setToast({ show: true, message: "Please enter responsibilities.", variant: "warning" });
      return;
    }
    setJobResponsibilities(tempResponsibilities);
    setShowResponsibilitiesModal(false);
    setTempResponsibilities("");
    setToast({ show: true, message: "Job responsibilities saved successfully!", variant: "success" });
  };

 useEffect(() => {
  const currentMrf = mockMrfs.find((m) => String(m.id) === String(mrfId));
  if (!currentMrf) {
    if (loggedInUser.role !== "Hiring Manager") {
      navigate("/manage_mrf");
    }
  } else {
    setMrf(currentMrf);
  }
}, [mrfId, mockMrfs, loggedInUser.role, navigate]);


  const candidates = mockCandidates?.filter((c) => String(c.mrfId) === String(mrfId)) || [];

  const getFilteredCandidatesByRole = () => {
    let roleCandidates = candidates;

    if (loggedInUser.role === "HR Manager" && inviteSent) {
      roleCandidates = candidates.filter((c) => c.inviteStatus === "Interested");
    }

    if (loggedInUser.role === "Hiring Manager") {
      roleCandidates = candidates.filter(
        (c) => c.sentToHiringManager === true && c.pitchCallStatus === "Satisfactory"
      );
    }

    return roleCandidates;
  };

  const getFilteredAndSortedCandidates = () => {
    let candidatesList = getFilteredCandidatesByRole();

    const effectiveDateFilter = filters.dateApplied;

    if (effectiveDateFilter) {
      candidatesList = candidatesList.filter((c) => {
        if (c.dateApplied) {
          const appliedDate = new Date(c.dateApplied).toISOString().split("T")[0];
          return appliedDate === effectiveDateFilter;
        }
        return false;
      });
    }

    candidatesList = [...candidatesList].sort((a, b) => {
      const dateA = a.dateApplied ? new Date(a.dateApplied) : new Date(0);
      const dateB = b.dateApplied ? new Date(b.dateApplied) : new Date(0);

      if (dateSortOrder === "recent") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return candidatesList;
  };

  const filteredCandidates = getFilteredAndSortedCandidates().filter((c) => {
    if (showOnlySelected && !selectedCandidates.includes(c.id)) {
      return false;
    }

    const candidateId = filters.candidateId
      ? String(c.id).toLowerCase().includes(filters.candidateId.toLowerCase())
      : true;
    const name = filters.name ? c.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const email = filters.email ? c.email.toLowerCase().includes(filters.email.toLowerCase()) : true;
    const qualification = filters.qualification
      ? c.qualification?.toLowerCase().includes(filters.qualification.toLowerCase())
      : true;
    const contactNumber = filters.contactNumber ? c.contactNumber?.includes(filters.contactNumber) : true;
    const department = filters.department
      ? mrf?.department.toLowerCase().includes(filters.department.toLowerCase())
      : true;
    const status = filters.status ? c.inviteStatus?.toLowerCase() === filters.status.toLowerCase() : true;
    const source = filters.source ? c.source?.toLowerCase().includes(filters.source.toLowerCase()) : true;

    const experienceMatch = () => {
      if (!filters.experienceMin && !filters.experienceMax) return true;
      const exp = c.experience || 0;
      const minMatch = filters.experienceMin ? exp >= parseInt(filters.experienceMin, 10) : true;
      const maxMatch = filters.experienceMax ? exp <= parseInt(filters.experienceMax, 10) : true;
      return minMatch && maxMatch;
    };

    const salaryMatch = () => {
      if (!filters.salaryMin && !filters.salaryMax) return true;
      const salary = c.expectedSalary || c.currentSalary || 0;
      const minMatch = filters.salaryMin ? salary >= parseInt(filters.salaryMin, 10) : true;
      const maxMatch = filters.salaryMax ? salary <= parseInt(filters.salaryMax, 10) : true;
      return minMatch && maxMatch;
    };

    const noticePeriod = filters.noticePeriod
      ? c.noticePeriod?.toLowerCase().includes(filters.noticePeriod.toLowerCase())
      : true;

    const designation = filters.designation
      ? c.designation?.toLowerCase().includes(filters.designation.toLowerCase())
      : true;

    const keywords = filters.keywords
      ? c.skills?.some((skill) => skill.toLowerCase().includes(filters.keywords.toLowerCase()))
      : true;

    const languages = filters.languages
      ? c.languages?.some((lang) => lang.toLowerCase().includes(filters.languages.toLowerCase()))
      : true;

    return (
      candidateId &&
      name &&
      email &&
      qualification &&
      contactNumber &&
      department &&
      status &&
      source &&
      experienceMatch() &&
      salaryMatch() &&
      noticePeriod &&
      designation &&
      keywords &&
      languages
    );
  });

  const getSourceBadgeColor = (source) => {
    if (!source) return "bg-secondary";

    const sourceLower = source.toLowerCase();

    if (sourceLower.includes("linkedin")) return "bg-primary";
    if (sourceLower.includes("naukri")) return "bg-info";
    if (sourceLower.includes("referral")) return "bg-success";
    if (sourceLower.includes("indeed")) return "bg-warning text-dark";
    if (sourceLower.includes("company") || sourceLower.includes("website")) return "bg-purple";

    return "bg-secondary";
  };

  const renderProcessBreadcrumb = (currentStage = 0) => {
    const stages = ["Screening", "Technical", "HR Round"];
    return (
      <div className="d-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>
        {stages.map((stage, index) => (
          <React.Fragment key={index}>
            <span
              className={`badge ${index <= currentStage ? "bg-warning text-dark" : "bg-secondary"}`}
              style={{ fontSize: "0.6rem", padding: "2px 4px" }}
            >
              {stage}
            </span>
            {index < stages.length - 1 && <i className="bi bi-chevron-right text-muted" style={{ fontSize: "0.5rem" }}></i>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const toggleFilterCategory = (category) => {
    setExpandedFilterCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleAddCandidate = (newCandidateData) => {
    console.log("Adding new candidate:", newCandidateData);
    setToast({ show: true, message: "Candidate added successfully!", variant: "success" });
    setShowAddModal(false);
  };

  const handleAddPosting = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log("Adding new posting:", {
      website: formData.get("website"),
      url: formData.get("url"),
      datePosted: formData.get("datePosted")
    });
    setToast({ show: true, message: "Posting added successfully!", variant: "success" });
    setShowAddPostingModal(false);
  };

  const handleCandidateClick = (candidateId) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    navigate(`/candidate/${candidateId}`, {
      state: { callerNumber: GENERAL_CALL_NUMBER, dateApplied: candidate?.dateApplied }
    });
  };

  const handleViewResume = (e, candidateId) => {
    e.stopPropagation();
    console.log("View resume for:", candidateId);
    setToast({ show: true, message: "Resume opened (simulated).", variant: "info" });
  };

  const toggleSelectCandidate = (candidateId) => {
    // NEW: Prevent selection if mandatory fields are not filled
    if (!areAllMandatoryFieldsFilled()) {
      setToast({ 
        show: true, 
        message: "Please fill Description, Requirements, and Responsibilities first!", 
        variant: "warning" 
      });
      return;
    }
    setSelectedCandidates((prev) => (prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]));
  };

  const toggleSelectAll = () => {
    // NEW: Prevent selection if mandatory fields are not filled
    if (!areAllMandatoryFieldsFilled()) {
      setToast({ 
        show: true, 
        message: "Please fill Description, Requirements, and Responsibilities first!", 
        variant: "warning" 
      });
      return;
    }
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map((c) => c.id));
    }
  };

  const handleSchedulePitchCall = (candidateId) => {
    setSelectedForPitchCall([candidateId]);
    setShowPitchCallScheduler(true);
  };

  const handleBulkSchedulePitchCall = () => {
    if (selectedCandidates.length === 0) {
      setToast({ show: true, message: "Please select at least one candidate.", variant: "warning" });
      return;
    }
    setSelectedForPitchCall(selectedCandidates);
    setShowPitchCallScheduler(true);
  };

  const handleSavePitchCallSchedule = (scheduleData) => {
    selectedForPitchCall.forEach((candidateId) => {
      if (updateCandidate) {
        updateCandidate(candidateId, {
          pitchCallDate: scheduleData.date,
          pitchCallTime: scheduleData.time,
          pitchCallInterviewer: scheduleData.interviewer,
          pitchCallDuration: scheduleData.duration,
          pitchCallStatus: "Scheduled"
        });
      }
    });

    setToast({ show: true, message: `Pitch call scheduled for ${selectedForPitchCall.length} candidate(s).`, variant: "success" });
    setShowPitchCallScheduler(false);
    setSelectedForPitchCall([]);
  };

  const handleShareInterestForm = () => {
    if (!selectedCandidates.length) {
      setToast({ show: true, message: "Please select candidates first.", variant: "warning" });
      return;
    }
    setShowInterestFormModal(true);
  };

  const handleSaveInterestForm = () => {
    if (!interestFormUrl.trim()) {
      setToast({ show: true, message: "Please enter a valid form URL.", variant: "warning" });
      return;
    }

    selectedCandidates.forEach((candidateId) => {
      if (updateCandidate) {
        updateCandidate(candidateId, { interestFormShared: true, interestFormUrl: interestFormUrl });
      }
    });

    setToast({ show: true, message: `Interest form shared with ${selectedCandidates.length} candidate(s).`, variant: "success" });
    setShowInterestFormModal(false);
    setInterestFormUrl("");
  };

  const handleProceed = () => {
    if (selectedCandidates.length === 0) {
      setToast({ show: true, message: "Please select at least one candidate first.", variant: "warning" });
      return;
    }

    if (loggedInUser.role === "HR Manager") {
      if (!inviteSent && !proceedClicked) {
        setProceedClicked(true);
        setShowOnlySelected(true);
        setToast({ show: true, message: `Showing ${selectedCandidates.length} selected candidate(s). Click "Send Invite" to proceed.`, variant: "info" });
        return;
      }

      if (!inviteSent && proceedClicked) {
        selectedCandidates.forEach((candidateId) => {
          if (updateCandidate) updateCandidate(candidateId, { inviteStatus: "Interested" });
        });
        setToast({ show: true, message: `Invitations sent to ${selectedCandidates.length} candidate(s).`, variant: "success" });
        setProceedClicked(false);
        setShowOnlySelected(false);
        setInviteSent(true);
        setSelectedCandidates([]);
        setViewMode("pitch");
        return;
      }

      if (inviteSent) {
        selectedCandidates.forEach((candidateId) => {
          if (updateCandidate) updateCandidate(candidateId, { sentToHiringManager: true });
        });
        setToast({ show: true, message: `${selectedCandidates.length} candidate(s) sent to Hiring Manager for review.`, variant: "success" });
        setSelectedCandidates([]);
        return;
      }
    }

    if (loggedInUser.role === "Hiring Manager") {
      if (!proceedClicked) {
        setProceedClicked(true);
        setShowOnlySelected(true);
        setToast({ show: true, message: `Showing ${selectedCandidates.length} selected candidate(s). Click "Finalize" to proceed.`, variant: "info" });
        return;
      } else {
        selectedCandidates.forEach((candidateId) => {
          if (updateCandidate) updateCandidate(candidateId, { hmReviewStatus: "Approved" });
        });
        setToast({ show: true, message: `${selectedCandidates.length} candidate(s) finalized for next round.`, variant: "success" });
        setProceedClicked(false);
        setShowOnlySelected(false);
        setSelectedCandidates([]);
      }
    }
  };

  const handleCancel = () => {
    setProceedClicked(false);
    setShowOnlySelected(false);
    setSelectedCandidates([]);
    setToast({ show: true, message: "Selection cancelled. Showing all candidates.", variant: "info" });
  };

  const handleRoleChange = (newRole) => {
    if (updateUser) {
      updateUser({ ...loggedInUser, role: newRole });
    }
    setToast({ show: true, message: `Switched to ${newRole} view`, variant: "info" });
    setShowUserDropdown(false);
    if (newRole === "Hiring Manager") {
      window.location.reload();
    } else {
      navigate("/manage_mrf");
    }
  };

  const handleLogout = () => {
    setToast({ show: true, message: "Logged out (simulated).", variant: "info" });
    navigate("/login");
  };

  if (!mrf && loggedInUser.role === "HR Manager") {
    return <div className="container-fluid py-4">Loading MRF details...</div>;
  }

  const displayedPostings = showAllPostings ? mrf?.postings : mrf?.postings?.slice(0, 2);

  const getActionButtonText = () => {
    if (loggedInUser.role === "HR Manager") {
      if (!inviteSent && proceedClicked) return "Send Invite";
      if (!inviteSent && !proceedClicked) return "Proceed";
      if (inviteSent) return "Send to Hiring Manager";
    }
    if (loggedInUser.role === "Hiring Manager") {
      return proceedClicked ? "Finalize" : "Proceed";
    }
    return "Proceed";
  };

  const hiringManagerHasNoCandidates = loggedInUser.role === "Hiring Manager" && getFilteredCandidatesByRole().length === 0;

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <img src={companyInfo.logo} alt={companyInfo.name} style={{ width: 40, height: 40 }} />
              <h5 className="mb-0 fw-bold text-primary">{companyInfo.name}</h5>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <img src={loggedInUser.avatar} alt={loggedInUser.name} className="rounded-circle" style={{ width: 35, height: 35, objectFit: "cover" }} />
                <div>
                  <p className="mb-0 small fw-semibold">{loggedInUser.name}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>{loggedInUser.email}</p>
                </div>
              </div>

              <div className="position-relative">
                <button className="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-2" onClick={() => setShowUserDropdown((s) => !s)}>
                  <span className="badge bg-primary" style={{ fontSize: "0.7rem" }}>{loggedInUser.role}</span>
                </button>

                {showUserDropdown && (
                  <div className="dropdown-menu show position-absolute end-0 mt-2 shadow" style={{ minWidth: 220, zIndex: 1050 }}>
                    <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => handleRoleChange("HR Manager")}>
                      <i className="bi bi-person-badge"></i>
                      HR Manager
                    </button>

                    <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => handleRoleChange("Hiring Manager")}>
                      <i className="bi bi-briefcase"></i>
                      Hiring Manager
                    </button>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item text-danger d-flex align-items-center gap-2 py-2" onClick={handleLogout}>
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

      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">
          Manage Candidates {mrf && `- ${mrf.designation}`}
          {loggedInUser.role === "Hiring Manager" && <span className="badge bg-info ms-3">Hiring Manager View</span>}
        </h3>

        {loggedInUser.role === "HR Manager" && (
          <button className="btn btn-secondary" onClick={() => navigate("/manage_mrf")}>Back to MRFs</button>
        )}
      </div>

      {/* MRF Overview + Postings */}
      {mrf && (
        <div className="row mb-4 g-3">
          <div className="col-lg-6 d-flex">
            <div className="card shadow-sm w-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-3">MRF Details</h5>
                <div className="row g-2 flex-grow-1">
                  <div className="col-6">
                    <p className="mb-2"><small className="text-muted d-block">Department</small><strong>{mrf.department}</strong></p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2"><small className="text-muted d-block">Location</small><strong>{mrf.location}</strong></p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2"><small className="text-muted d-block">Experience</small><strong>{mrf.expMin}-{mrf.expMax} years</strong></p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2"><small className="text-muted d-block">Status</small><span className={`badge bg-${mrf.status === "Open" ? "success" : "danger"}`}>{mrf.status}</span></p>
                  </div>
                  <div className="col-12">
                    <p className="mb-0"><small className="text-muted d-block">Skills Required</small>
                      <div className="mt-1">{mrf.skills?.map((skill, idx) => (<span key={idx} className="badge bg-info me-1 mb-1">{skill}</span>))}</div>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-flex">
            <div className="card shadow-sm w-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Posting Details</h5>
                  <button className="btn btn-sm btn-primary" onClick={() => setShowAddPostingModal(true)}><i className="bi bi-plus-lg me-1"></i>Add Posting</button>
                </div>

                {mrf.postings && mrf.postings.length > 0 ? (
                  <div className="flex-grow-1 d-flex flex-column">
                    <div className="flex-grow-1">
                      {displayedPostings?.map((post, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-start py-2 border-bottom">
                          <div className="flex-shrink-0" style={{ minWidth: 120 }}>
                            <span className="badge bg-primary" style={{ fontSize: "0.85rem" }}>{post.website}</span>
                          </div>
                          <div className="flex-grow-1 ms-3 text-end">
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none small d-block text-truncate" style={{ maxWidth: "100%", fontSize: "0.85rem", color: "#0a66c2" }} title={post.url}>{post.url}</a>
                            <small className="text-muted d-block mt-1" style={{ fontSize: "0.75rem" }}>Posted: {new Date(post.datePosted).toLocaleDateString()}</small>
                          </div>
                        </div>
                      ))}
                    </div>

                    {mrf.postings.length > 2 && (
                      <div className="text-center mt-3">
                        <button className="btn btn-sm btn-link text-decoration-none" onClick={() => setShowAllPostings((s) => !s)}>
                          {showAllPostings ? (<><i className="bi bi-chevron-up me-1"></i>Show Less</>) : (<><i className="bi bi-chevron-down me-1"></i>Show More ({mrf.postings.length - 2} more)</>)}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No posting data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If Hiring Manager has no candidates */}
      {hiringManagerHasNoCandidates ? (
        <div className="row g-3">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <h4 className="mt-3 text-muted">No Candidates Forwarded Yet</h4>
                  <p className="text-muted">The HR team hasn't forwarded any candidates for your review yet. Please check back later or contact the HR department for updates.</p>
                </div>

                <div className="table-responsive mt-4">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 50 }}>
                          <input 
                            type="checkbox" 
                            disabled={!areAllMandatoryFieldsFilled()}
                            title={!areAllMandatoryFieldsFilled() ? "Fill all mandatory fields first" : ""}
                          />
                        </th>
                        <th style={{ fontSize: "0.875rem" }}>Candidate ID</th>
                        <th style={{ fontSize: "0.875rem" }}>Name</th>
                        <th style={{ fontSize: "0.875rem" }}>Department</th>
                        <th style={{ fontSize: "0.875rem" }}>Contact Number</th>
                        <th style={{ fontSize: "0.875rem" }}>Email</th>
                        <th style={{ fontSize: "0.875rem" }}>Highest Qualification</th>
                        <th style={{ fontSize: "0.875rem" }}>Source</th>
                        <th style={{ fontSize: "0.875rem" }}>HM Review</th>
                        <th style={{ fontSize: "0.875rem", minWidth: 200 }}>Interview Process</th>
                        <th style={{ fontSize: "0.875rem" }} className="text-center">Resume</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="11" className="text-center text-muted py-4"><em>No candidates to display</em></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {/* Filters panel */}
          <div className="col-lg-3">
            <div className="card shadow-sm sticky-top" style={{ top: "1rem" }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Filters</h6>
                  <button
                    className="btn btn-sm btn-link text-decoration-none p-0"
                    onClick={() =>
                      setFilters({
                        candidateId: "",
                        name: "",
                        qualification: "",
                        contactNumber: "",
                        email: "",
                        department: "",
                        status: "",
                        source: "",
                        experienceMin: "",
                        experienceMax: "",
                        salaryMin: "",
                        salaryMax: "",
                        noticePeriod: "",
                        designation: "",
                        keywords: "",
                        languages: "",
                        dateApplied: new Date().toISOString().split("T")[0]
                      })
                    }
                    disabled={showOnlySelected}
                  >
                    Clear All
                  </button>
                </div>

                {/* Basic */}
                <div className="border-bottom mb-2">
                  <button className="btn btn-link text-decoration-none w-100 text-start p-2 d-flex justify-content-between align-items-center" onClick={() => toggleFilterCategory("basic")} disabled={showOnlySelected}>
                    <span className="fw-semibold text-dark">Basic Information</span>
                    <i className={`bi bi-chevron-${expandedFilterCategories.basic ? "up" : "down"}`}></i>
                  </button>
                  {expandedFilterCategories.basic && (
                    <div className="px-2 pb-3">
                      <div className="mb-2">
                        <label className="form-label small">Candidate ID</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Search ID" value={filters.candidateId} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, candidateId: e.target.value })} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small">Name</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Search name" value={filters.name} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="border-bottom mb-2">
                  <button className="btn btn-link text-decoration-none w-100 text-start p-2 d-flex justify-content-between align-items-center" onClick={() => toggleFilterCategory("contact")} disabled={showOnlySelected}>
                    <span className="fw-semibold text-dark">Contact Information</span>
                    <i className={`bi bi-chevron-${expandedFilterCategories.contact ? "up" : "down"}`}></i>
                  </button>
                  {expandedFilterCategories.contact && (
                    <div className="px-2 pb-3">
                      <div className="mb-2">
                        <label className="form-label small">Contact Number</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Phone number" value={filters.contactNumber} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, contactNumber: e.target.value })} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small">Email</label>
                        <input type="email" className="form-control form-control-sm" placeholder="Email address" value={filters.email} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Education */}
                <div className="border-bottom mb-2">
                  <button className="btn btn-link text-decoration-none w-100 text-start p-2 d-flex justify-content-between align-items-center" onClick={() => toggleFilterCategory("qualification")} disabled={showOnlySelected}>
                    <span className="fw-semibold text-dark">Education</span>
                    <i className={`bi bi-chevron-${expandedFilterCategories.qualification ? "up" : "down"}`}></i>
                  </button>
                  {expandedFilterCategories.qualification && (
                    <div className="px-2 pb-3">
                      <div className="mb-2">
                        <label className="form-label small">Qualification</label>
                        <input type="text" className="form-control form-control-sm" placeholder="e.g., B.Tech, MBA" value={filters.qualification} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, qualification: e.target.value })} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Details */}
                <div className="border-bottom mb-2">
                  <button className="btn btn-link text-decoration-none w-100 text-start p-2 d-flex justify-content-between align-items-center" onClick={() => toggleFilterCategory("job")} disabled={showOnlySelected}>
                    <span className="fw-semibold text-dark">Job Details</span>
                    <i className={`bi bi-chevron-${expandedFilterCategories.job ? "up" : "down"}`}></i>
                  </button>

                  {expandedFilterCategories.job && (
                    <div className="px-2 pb-3">
                      <div className="mb-2">
                        <label className="form-label small">Department</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Search department" value={filters.department} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, department: e.target.value })} />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Source</label>
                        <select className="form-select form-select-sm" value={filters.source} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, source: e.target.value })}>
                          <option value="">All</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Naukri">Naukri</option>
                          <option value="Referral">Referral</option>
                          <option value="Indeed">Indeed</option>
                          <option value="Company Website">Company Website</option>
                        </select>
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Min Experience (years)</label>
                        <input type="number" className="form-control form-control-sm" placeholder="Min" value={filters.experienceMin} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, experienceMin: e.target.value })} />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Max Experience (years)</label>
                        <input type="number" className="form-control form-control-sm" placeholder="Max" value={filters.experienceMax} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, experienceMax: e.target.value })} />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Min Salary (₹)</label>
                        <input type="number" className="form-control form-control-sm" placeholder="Min" value={filters.salaryMin} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })} />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Max Salary (₹)</label>
                        <input type="number" className="form-control form-control-sm" placeholder="Max" value={filters.salaryMax} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })} />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Notice Period</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Immediate, 30 days" value={filters.noticePeriod} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, noticePeriod: e.target.value })} />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Designation</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Search designation" value={filters.designation} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, designation: e.target.value })} />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Keywords</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Search skills/keywords" value={filters.keywords} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, keywords: e.target.value })} />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small">Languages</label>
                        <input type="text" className="form-control form-control-sm" placeholder="Search languages" value={filters.languages} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, languages: e.target.value })} />
                      </div>

                      {/* Date Applied */}
                      <div className="mb-2">
                        <label className="form-label small">Date Applied</label>
                        <input type="date" className="form-control form-control-sm" value={filters.dateApplied} max={new Date().toISOString().split("T")[0]} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, dateApplied: e.target.value })} />
                      </div>

                      {/* Sort Order */}
                      <div className="mb-2">
                        <label className="form-label small">Sort by Date</label>
                        <select className="form-select form-select-sm" value={dateSortOrder} disabled={showOnlySelected} onChange={(e) => setDateSortOrder(e.target.value)}>
                          <option value="recent">Recent → Oldest</option>
                          <option value="oldest">Oldest → Recent</option>
                        </select>
                      </div>

                      {loggedInUser.role === "HR Manager" && inviteSent && (
                        <div className="mb-2">
                          <label className="form-label small">Interest Status</label>
                          <select className="form-select form-select-sm" value={filters.status} disabled={showOnlySelected} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                            <option value="">All</option>
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">Not Interested</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* NEW: Tab buttons for Pitch, Assessment, Interview at bottom of filters */}
              {loggedInUser.role === "HR Manager" && inviteSent && (
                <div className="card-footer bg-light">
                  <h6 className="mb-2 small text-muted">VIEW MODE</h6>
                  <div className="d-flex flex-column gap-2">
                    <button 
                      className={`btn btn-sm ${viewMode === "selection" ? "btn-primary" : "btn-outline-primary"} w-100`}
                      onClick={() => setViewMode("selection")}
                      disabled={showOnlySelected}
                    >
                      <i className="bi bi-list-check me-1"></i>
                      Selection
                    </button>
                    <button 
                      className={`btn btn-sm ${viewMode === "pitch" ? "btn-primary" : "btn-outline-primary"} w-100`}
                      onClick={() => setViewMode("pitch")}
                      disabled={showOnlySelected}
                    >
                      <i className="bi bi-telephone me-1"></i>
                      Pitch
                    </button>
                    <button 
                      className={`btn btn-sm ${viewMode === "assessment" ? "btn-primary" : "btn-outline-primary"} w-100`}
                      onClick={() => setViewMode("assessment")}
                      disabled={showOnlySelected}
                    >
                      <i className="bi bi-clipboard-check me-1"></i>
                      Assessment
                    </button>
                    <button 
                      className={`btn btn-sm ${viewMode === "interview" ? "btn-primary" : "btn-outline-primary"} w-100`}
                      onClick={() => setViewMode("interview")}
                      disabled={showOnlySelected}
                    >
                      <i className="bi bi-people me-1"></i>
                      Interview
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right side: Action buttons + table */}
          <div className="col-lg-9">
            {/* NEW: All 4 buttons in same section - always visible */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <span className="text-muted small">
                  {areAllMandatoryFieldsFilled() ? (
                    <><i className="bi bi-check-circle-fill text-success me-1"></i>All fields complete</>
                  ) : (
                    <><i className="bi bi-exclamation-triangle-fill text-warning me-1"></i>Fill all 3 fields to enable selection</>
                  )}
                </span>
              </div>
              
              <div className="d-flex gap-2 flex-wrap">
                {loggedInUser.role === "HR Manager" && !inviteSent && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowAddModal(true)} 
                    disabled={showOnlySelected}
                  >
                    <i className="bi bi-person-plus me-2"></i>Add Candidate
                  </button>
                )}
                
                <button 
                  className={`btn ${jobDescription ? 'btn-success' : 'btn-outline-primary'}`}
                  onClick={() => {
                    setTempDescription(jobDescription);
                    setShowDescriptionModal(true);
                  }}
                  disabled={showOnlySelected}
                >
                  <i className="bi bi-file-text me-1"></i>
                  {jobDescription ? '✓' : ''} Description
                </button>
                
                <button 
                  className={`btn ${jobRequirements ? 'btn-success' : 'btn-outline-info'}`}
                  onClick={() => {
                    setTempRequirements(jobRequirements);
                    setShowRequirementsModal(true);
                  }}
                  disabled={showOnlySelected}
                >
                  <i className="bi bi-list-check me-1"></i>
                  {jobRequirements ? '✓' : ''} Requirements
                </button>
                
                <button 
                  className={`btn ${jobResponsibilities ? 'btn-success' : 'btn-outline-warning'}`}
                  onClick={() => {
                    setTempResponsibilities(jobResponsibilities);
                    setShowResponsibilitiesModal(true);
                  }}
                  disabled={showOnlySelected}
                >
                  <i className="bi bi-clipboard-check me-1"></i>
                  {jobResponsibilities ? '✓' : ''} Responsibilities
                </button>
              </div>
            </div>
           


            <div className="card shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 50 }}>
                          <input 
                            type="checkbox" 
                            checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0} 
                            onChange={toggleSelectAll} 
                            disabled={showOnlySelected || !areAllMandatoryFieldsFilled()}
                            title={!areAllMandatoryFieldsFilled() ? "Fill all mandatory fields first" : ""}
                          />
                        </th>

                        {/* Selection view columns */}
                        {viewMode === "selection" && (
                          <>
                            <th>Candidate ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Contact</th>
                            <th>Call</th>
                            <th>Email</th>
                            <th>Qualification</th>
                            <th>Source</th>
                            <th>Date Applied</th>

                            {inviteSent && loggedInUser.role === "HR Manager" && (
                              <>
                                <th>Status</th>
                                <th>Pitch Opinion</th>
                                <th>Pitch Call</th>
                              </>
                            )}

                            {loggedInUser.role === "Hiring Manager" && <th>HM Review</th>}
                            <th>Interview Process</th>
                            <th className="text-center">Resume</th>
                          </>
                        )}

                        {viewMode === "pitch" && (
                          <>
                            <th>Candidate ID</th>
                            <th>Candidate Name</th>
                            <th>Preferred Call Time</th>
                            <th>Call Option</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </>
                        )}

                        {viewMode === "assessment" && (
                          <>
                            <th>Candidate ID</th>
                            <th>Candidate Name</th>
                            <th>Assessment Date</th>
                            <th>Assessment Type</th>
                            <th>Mode</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </>
                        )}

                        {viewMode === "interview" && (
                          <>
                            <th>Candidate ID</th>
                            <th>Candidate Name</th>
                            <th>Interview Date & Time</th>
                            <th>Interviewer 1</th>
                            <th>Interviewer 2</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((c) => (
                          <tr key={c.id} className="table-row-hover">
                            <td onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={selectedCandidates.includes(c.id)} 
                                onChange={() => toggleSelectCandidate(c.id)} 
                                disabled={showOnlySelected || !areAllMandatoryFieldsFilled()}
                                title={!areAllMandatoryFieldsFilled() ? "Fill all mandatory fields first" : ""}
                              />
                            </td>

                            {viewMode === "selection" && (
                              <>
                                <td style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}><span className="text-primary fw-semibold">{c.id}</span></td>
                                <td className="fw-semibold" style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}>{c.name}</td>
                                <td style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}>{mrf?.department || "N/A"}</td>
                                <td style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}>{c.contactNumber || "N/A"}</td>

                                <td><a href={`tel:${GENERAL_CALL_NUMBER}`} className="text-decoration-none">📞 {GENERAL_CALL_NUMBER}</a></td>

                                <td style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}>{c.email}</td>
                                <td style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}>{c.qualification || "N/A"}</td>
                                <td style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}><span className={`badge ${getSourceBadgeColor(c.source)}`}>{c.source || "N/A"}</span></td>
                                <td style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}>{c.dateApplied ? new Date(c.dateApplied).toLocaleDateString() : "N/A"}</td>

                                {inviteSent && loggedInUser.role === "HR Manager" && (
                                  <>
                                    <td><span className={`badge bg-${c.inviteStatus === "Interested" ? "success" : "secondary"}`}>{c.inviteStatus || "Pending"}</span></td>
                                    <td><span className={`badge bg-${c.pitchCallStatus === "Satisfactory" ? "success" : c.pitchCallStatus === "Unsatisfactory" ? "danger" : "secondary"}`}>{c.pitchCallStatus || "Pending"}</span></td>
                                    <td>
                                      {c.inviteStatus === "Interested" && !c.pitchCallDate && (
                                        <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); handleSchedulePitchCall(c.id); }}>
                                          <i className="bi bi-calendar-plus me-1"></i>Schedule
                                        </button>
                                      )}
                                      {c.pitchCallDate && (
                                        <div className="small">
                                          <i className="bi bi-calendar-check text-success me-1"></i>
                                          {new Date(c.pitchCallDate).toLocaleDateString()}<br /><small className="text-muted">{c.pitchCallTime}</small>
                                        </div>
                                      )}
                                    </td>
                                  </>
                                )}

                                {loggedInUser.role === "Hiring Manager" && (
                                  <td><span className={`badge bg-${c.hmReviewStatus === "Approved" ? "success" : c.hmReviewStatus === "Rejected" ? "danger" : "warning"}`}>{c.hmReviewStatus || "Pending"}</span></td>
                                )}

                                <td style={{ cursor: "pointer" }} onClick={() => handleCandidateClick(c.id)}>{renderProcessBreadcrumb(c.currentStage || 0)}</td>

                                <td className="text-center"><button className="btn btn-sm btn-outline-primary" onClick={(e) => handleViewResume(e, c.id)} title="View Resume"><i className="bi bi-file-earmark-pdf"></i></button></td>
                              </>
                            )}

                            {viewMode === "pitch" && (
                              <>
                                <td>{c.id}</td>
                                <td>{c.name}</td>
                                <td>{c.preferredCallTime || "Not specified"}</td>
                                <td>{c.callOption || "Phone/Video"}</td>
                                <td><span className={`badge bg-${c.pitchCallStatus === "Completed" ? "success" : c.pitchCallStatus === "Scheduled" ? "info" : "warning"}`}>{c.pitchCallStatus || "Pending"}</span></td>
                                <td><button className="btn btn-sm btn-primary" onClick={() => handleSchedulePitchCall(c.id)}>Schedule Call</button></td>
                              </>
                            )}

                            {viewMode === "assessment" && (
                              <>
                                <td>{c.id}</td>
                                <td>{c.name}</td>
                                <td>{c.assessmentDate || "Not scheduled"}</td>
                                <td>{c.assessmentType || "Not assigned"}</td>
                                <td><span className={`badge bg-${c.assessmentMode === "Online" ? "primary" : "secondary"}`}>{c.assessmentMode || "Not specified"}</span></td>
                                <td>{c.assessmentDateTime || "Not scheduled"}</td>
                                <td><span className={`badge bg-${c.assessmentStatus === "Completed" ? "success" : c.assessmentStatus === "Scheduled" ? "info" : "warning"}`}>{c.assessmentStatus || "Pending"}</span></td>
                                <td><button className="btn btn-sm btn-primary" onClick={() => console.log("Schedule assessment", c.id)}>Schedule</button></td>
                              </>
                            )}

                            {viewMode === "interview" && (
                              <>
                                <td>{c.id}</td>
                                <td>{c.name}</td>
                                <td>{c.interviewDateTime || "Not scheduled"}</td>
                                <td>{c.interviewer1Name || "Not assigned"}</td>
                                <td>{c.interviewer2Name || "Not assigned"}</td>
                                <td><span className={`badge bg-${c.interviewStatus === "Completed" ? "success" : c.interviewStatus === "Scheduled" ? "info" : "warning"}`}>{c.interviewStatus || "Pending"}</span></td>
                                <td><button className="btn btn-sm btn-primary" onClick={() => console.log("Schedule interview", c.id)}>Schedule</button></td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="20" className="text-center text-muted py-4">{showOnlySelected ? "No candidates selected." : "No candidates found matching your filters."}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="card-footer bg-light text-muted small">Showing {filteredCandidates.length} of {getFilteredCandidatesByRole().length} candidate(s){selectedCandidates.length > 0 && (<span className="text-primary fw-semibold"> {" "} | {selectedCandidates.length} selected</span>)}</div>
              </div>
            </div>

            {/* Action buttons */}
            {selectedCandidates.length > 0 && (
              <div className="card shadow-sm mt-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0"><i className="bi bi-check-circle-fill text-success me-2"></i>{selectedCandidates.length} candidate(s) selected</h6>
                    <div className="d-flex gap-2">
                      {proceedClicked && (<button className="btn btn-outline-secondary" onClick={handleCancel}><i className="bi bi-x-circle me-2"></i>Cancel</button>)}
                      {!inviteSent && loggedInUser.role === "HR Manager" && (<button className="btn btn-outline-primary" onClick={handleShareInterestForm} disabled={proceedClicked}><i className="bi bi-file-earmark-text me-2"></i>send form</button>)}
                      {inviteSent && loggedInUser.role === "HR Manager" && (<button className="btn btn-outline-info" onClick={handleBulkSchedulePitchCall}><i className="bi bi-calendar-plus me-2"></i>Schedule Pitch Calls</button>)}
                      <button className={`btn ${proceedClicked || inviteSent ? "btn-success" : "btn-primary"}`} onClick={handleProceed}>
                        {getActionButtonText() === "Send Invite" && <i className="bi bi-send me-2"></i>}
                        {getActionButtonText() === "Proceed" && <i className="bi bi-arrow-right-circle me-2"></i>}
                        {getActionButtonText() === "Send to Hiring Manager" && <i className="bi bi-send me-2"></i>}
                        {getActionButtonText() === "Finalize" && <i className="bi bi-check-circle me-2"></i>}
                        {getActionButtonText()}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddCandidateModal show={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddCandidate} />

      {/* NEW: Description Modal */}
      {showDescriptionModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-file-text me-2"></i>Job Description</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowDescriptionModal(false);
                  setTempDescription("");
                }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Enter Job Description <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control" 
                    rows="8" 
                    placeholder="Enter detailed job description..."
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                  />
                  <small className="text-muted">This field is mandatory to enable candidate selection</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowDescriptionModal(false);
                  setTempDescription("");
                }}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveDescription}>
                  <i className="bi bi-check-circle me-2"></i>Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Requirements Modal */}
      {showRequirementsModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-list-check me-2"></i>Job Requirements</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowRequirementsModal(false);
                  setTempRequirements("");
                }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Enter Job Requirements <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control" 
                    rows="8" 
                    placeholder="Enter job requirements..."
                    value={tempRequirements}
                    onChange={(e) => setTempRequirements(e.target.value)}
                  />
                  <small className="text-muted">This field is mandatory to enable candidate selection</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowRequirementsModal(false);
                  setTempRequirements("");
                }}>Cancel</button>
                <button type="button" className="btn btn-info" onClick={handleSaveRequirements}>
                  <i className="bi bi-check-circle me-2"></i>Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Responsibilities Modal */}
      {showResponsibilitiesModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-clipboard-check me-2"></i>Job Responsibilities</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowResponsibilitiesModal(false);
                  setTempResponsibilities("");
                }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Enter Job Responsibilities <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control" 
                    rows="8" 
                    placeholder="Enter job responsibilities..."
                    value={tempResponsibilities}
                    onChange={(e) => setTempResponsibilities(e.target.value)}
                  />
                  <small className="text-muted">This field is mandatory to enable candidate selection</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowResponsibilitiesModal(false);
                  setTempResponsibilities("");
                }}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={handleSaveResponsibilities}>
                  <i className="bi bi-check-circle me-2"></i>Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddPostingModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleAddPosting}>
                <div className="modal-header">
                  <h5 className="modal-title"><i className="bi bi-plus-circle me-2"></i>Add New Posting</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddPostingModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Website/Platform <span className="text-danger">*</span></label>
                    <select name="website" className="form-select" required>
                      <option value="">Select Platform</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Naukri">Naukri</option>
                      <option value="Indeed">Indeed</option>
                      <option value="Company Website">Company Website</option>
                      <option value="Glassdoor">Glassdoor</option>
                      <option value="Monster">Monster</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Posting URL <span className="text-danger">*</span></label>
                    <input type="url" name="url" className="form-control" placeholder="https://example.com/job" required />
                    <small className="text-muted">Enter full job posting URL</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date Posted <span className="text-danger">*</span></label>
                    <input type="date" name="datePosted" className="form-control" required max={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddPostingModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary"><i className="bi bi-check-circle me-2"></i>Add Posting</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showInterestFormModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-file-earmark-text me-2"></i>Share Interest Form</h5>
                <button type="button" className="btn-close" onClick={() => { setShowInterestFormModal(false); setInterestFormUrl(""); }}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">Share an interest form link with {selectedCandidates.length} selected candidate(s).</p>
                <div className="mb-3">
                  <label className="form-label">Form URL <span className="text-danger">*</span></label>
                  <input type="url" className="form-control" placeholder="https://forms.google.com/..." value={interestFormUrl} onChange={(e) => setInterestFormUrl(e.target.value)} />
                  <small className="text-muted">Enter Google/Microsoft Form URL</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowInterestFormModal(false); setInterestFormUrl(""); }}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveInterestForm}><i className="bi bi-share me-2"></i>Share Form</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPitchCallScheduler && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-calendar-plus me-2"></i>Schedule Pitch Call</h5>
                <button type="button" className="btn-close" onClick={() => { setShowPitchCallScheduler(false); setSelectedForPitchCall([]); }}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">Schedule call for {selectedForPitchCall.length} candidate(s).</p>
                <form id="pitchCallForm" onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.target); handleSavePitchCallSchedule({ date: formData.get("date"), time: formData.get("time"), interviewer: formData.get("interviewer"), duration: formData.get("duration") }); }}>
                  <div className="mb-3">
                    <label className="form-label">Date *</label>
                    <input type="date" name="date" className="form-control" required min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time *</label>
                    <input type="time" name="time" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interviewer *</label>
                    <select name="interviewer" className="form-select" required>
                      <option value="">Select Interviewer</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                      <option value="Rahul Verma">Rahul Verma</option>
                      <option value="Priya Singh">Priya Singh</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration *</label>
                    <select name="duration" className="form-select" required>
                      <option value="">Select</option>
                      <option value="15 minutes">15 minutes</option>
                      <option value="30 minutes">30 minutes</option>
                      <option value="45 minutes">45 minutes</option>
                      <option value="1 hour">1 hour</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowPitchCallScheduler(false); setSelectedForPitchCall([]); }}>Cancel</button>
                <button type="submit" form="pitchCallForm" className="btn btn-primary"><i className="bi bi-check-circle me-2"></i>Schedule Call</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AppToast show={toast.show} message={toast.message} variant={toast.variant} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
};

export default ManageCandidatesPage;
