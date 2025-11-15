import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const CandidateDetailsPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { mockCandidates, updateCandidate, currentUser } = useAppContext();

  // Side tab navigation state
  const [activeSideTab, setActiveSideTab] = useState("pitch");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Pitch Call State - REMOVED trackerUpdated (now automatic)
  const [pitchCallForm, setPitchCallForm] = useState({
    status: "",
    remarks: "",
    callDate: "",
  });

  // Assessment State
  const [assessmentForm, setAssessmentForm] = useState({
    assessmentDate: "",
    assessmentType: "",
    mode: "",
    assessmentDateTime: "",
    status: "",
    remarks: "",
  });

  // Interview State
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: "",
    interviewDateTime: "",
    interviewer1Name: "",
    interviewer2Name: "",
    status: "",
    remarks: "",
  });

  // Offer State
  const [offerForm, setOfferForm] = useState({
    offerDate: "",
    offerAmount: "",
    joiningDate: "",
    status: "",
    remarks: "",
  });

  const candidate = mockCandidates.find(c => String(c.id) === String(candidateId));

  useEffect(() => {
    if (candidate) {
      // Load Pitch Call data
      setPitchCallForm({
        status: candidate.pitchCallStatus || "",
        remarks: candidate.pitchCallRemarks || "",
        callDate: candidate.pitchCallDate || "",
      });

      // Load Assessment data
      setAssessmentForm({
        assessmentDate: candidate.assessmentDate || "",
        assessmentType: candidate.assessmentType || "",
        mode: candidate.assessmentMode || "",
        assessmentDateTime: candidate.assessmentDateTime || "",
        status: candidate.assessmentStatus || "",
        remarks: candidate.assessmentRemarks || "",
      });

      // Load Interview data
      setInterviewForm({
        interviewDate: candidate.interviewDate || "",
        interviewDateTime: candidate.interviewDateTime || "",
        interviewer1Name: candidate.interviewer1Name || "",
        interviewer2Name: candidate.interviewer2Name || "",
        status: candidate.interviewStatus || "",
        remarks: candidate.interviewRemarks || "",
      });

      // Load Offer data
      setOfferForm({
        offerDate: candidate.offerDate || "",
        offerAmount: candidate.offerAmount || "",
        joiningDate: candidate.joiningDate || "",
        status: candidate.offerStatus || "",
        remarks: candidate.offerRemarks || "",
      });
    }
  }, [candidate]);

  if (!candidate) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Candidate not found.</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const companyInfo = {
    name: "TalentHub",
    logo: "https://ui-avatars.com/api/?name=TH&background=4F46E5&color=fff&bold=true&size=40",
  };

  const loggedInUser = currentUser || {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "HR Manager",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
  };

  const handleRoleChange = (newRole) => {
    setToast({ show: true, message: `Switched to ${newRole} view`, variant: "info" });
    setShowUserDropdown(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // Handle Call Feature
  const handleStartCall = () => {
    const teamsLink = `https://teams.microsoft.com/l/call/0/0?users=${candidate.email}`;
    window.open(teamsLink, '_blank');
    setToast({ 
      show: true, 
      message: "Initiating call with candidate...", 
      variant: "info" 
    });
  };

  // Handle Pitch Call Submission - UPDATED to auto-update tracker
  const handlePitchCallSubmit = (decision) => {
    if (!pitchCallForm.remarks) {
      setToast({ show: true, message: "Please add remarks before proceeding.", variant: "warning" });
      return;
    }

    if (decision === "Proceed") {
      updateCandidate(candidate.id, {
        pitchCallStatus: "Completed",
        pitchCallRemarks: pitchCallForm.remarks,
        pitchCallDate: pitchCallForm.callDate,
        pitchTrackerUpdated: true,
        sentToHiringManager: true,
        currentStage: "Assessment",
      });
      setToast({ 
        show: true, 
        message: "Candidate forwarded to Hiring Manager. Tracker updated automatically!", 
        variant: "success" 
      });
      setActiveSideTab("assessment");
    } else if (decision === "Reject") {
      updateCandidate(candidate.id, {
        pitchCallStatus: "Rejected",
        pitchCallRemarks: pitchCallForm.remarks,
        pitchCallDate: pitchCallForm.callDate,
        pitchTrackerUpdated: true,
        status: "Rejected",
        isActive: false,
      });
      setToast({ 
        show: true, 
        message: "Candidate rejected. Tracker updated automatically!", 
        variant: "danger" 
      });
      setTimeout(() => navigate(-1), 2000);
    }
  };

  // Handle Assessment Submission
  const handleAssessmentSubmit = () => {
    if (!assessmentForm.status) {
      setToast({ show: true, message: "Please select assessment status.", variant: "warning" });
      return;
    }

    updateCandidate(candidate.id, {
      assessmentDate: assessmentForm.assessmentDate,
      assessmentType: assessmentForm.assessmentType,
      assessmentMode: assessmentForm.mode,
      assessmentDateTime: assessmentForm.assessmentDateTime,
      assessmentStatus: assessmentForm.status,
      assessmentRemarks: assessmentForm.remarks,
      currentStage: assessmentForm.status === "Passed" ? "Interview" : "Assessment",
    });

    setToast({ 
      show: true, 
      message: "Assessment details saved successfully!", 
      variant: "success" 
    });

    if (assessmentForm.status === "Passed") {
      setActiveSideTab("interview");
    }
  };

  // Handle Interview Submission
  const handleInterviewSubmit = () => {
    if (!interviewForm.status) {
      setToast({ show: true, message: "Please select interview status.", variant: "warning" });
      return;
    }

    updateCandidate(candidate.id, {
      interviewDate: interviewForm.interviewDate,
      interviewDateTime: interviewForm.interviewDateTime,
      interviewer1Name: interviewForm.interviewer1Name,
      interviewer2Name: interviewForm.interviewer2Name,
      interviewStatus: interviewForm.status,
      interviewRemarks: interviewForm.remarks,
      currentStage: interviewForm.status === "Selected" ? "Offer" : "Interview",
    });

    setToast({ 
      show: true, 
      message: "Interview details saved successfully!", 
      variant: "success" 
    });

    if (interviewForm.status === "Selected") {
      setActiveSideTab("offer");
    }
  };

  // Handle Offer Submission
  const handleOfferSubmit = () => {
    if (!offerForm.status) {
      setToast({ show: true, message: "Please select offer status.", variant: "warning" });
      return;
    }

    updateCandidate(candidate.id, {
      offerDate: offerForm.offerDate,
      offerAmount: offerForm.offerAmount,
      joiningDate: offerForm.joiningDate,
      offerStatus: offerForm.status,
      offerRemarks: offerForm.remarks,
      currentStage: "Offer",
    });

    setToast({ 
      show: true, 
      message: "Offer details saved successfully!", 
      variant: "success" 
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <nav style={{
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: "72px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={companyInfo.logo} alt="Company Logo" style={{ height: "40px" }} />
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>{companyInfo.name}</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 16px",
              backgroundColor: "white",
              border: "1px solid #6c757d",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#6c757d"
            }}
          >
            ← Back
          </button>

          <div style={{ position: "relative" }}>
            <div 
              style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <img 
                src={loggedInUser.avatar} 
                alt={loggedInUser.name}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <div>
                <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{loggedInUser.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>{loggedInUser.role}</div>
              </div>
            </div>

            {showUserDropdown && (
              <div style={{
                position: "absolute",
                right: 0,
                marginTop: "8px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                minWidth: "200px",
                zIndex: 1000,
                padding: "8px"
              }}>
                <button 
                  onClick={() => handleRoleChange('HR Manager')}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Switch to HR Manager
                </button>
                <button 
                  onClick={() => handleRoleChange('Hiring Manager')}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Switch to Hiring Manager
                </button>
                <hr style={{ margin: "8px 0" }} />
                <button 
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#dc3545",
                    fontSize: "0.9rem"
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content - with margin-top for fixed header */}
      <div style={{ flex: 1, display: "flex", marginTop: "72px" }}>
        {/* Side Navigation Tabs - FIXED SIDEBAR */}
        <div style={{
          position: "fixed",
          top: "72px",
          left: 0,
          width: "250px",
          height: "calc(100vh - 72px)",
          backgroundColor: "white",
          borderRight: "1px solid #dee2e6",
          padding: "20px",
          overflowY: "auto",
          zIndex: 100
        }}>
          <h6 style={{ marginBottom: "20px", color: "#6c757d", fontSize: "0.85rem", fontWeight: "600" }}>
            CANDIDATE TRACKING
          </h6>
          
          <button
            onClick={() => setActiveSideTab("pitch")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              marginBottom: "8px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: activeSideTab === "pitch" ? "#007bff" : "transparent",
              color: activeSideTab === "pitch" ? "white" : "#212529",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: activeSideTab === "pitch" ? "600" : "400",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <i className="bi bi-telephone" style={{ fontSize: "1.1rem" }}></i>
            Pitch Call
          </button>

          <button
            onClick={() => setActiveSideTab("assessment")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              marginBottom: "8px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: activeSideTab === "assessment" ? "#007bff" : "transparent",
              color: activeSideTab === "assessment" ? "white" : "#212529",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: activeSideTab === "assessment" ? "600" : "400",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <i className="bi bi-clipboard-check" style={{ fontSize: "1.1rem" }}></i>
            Assessment
          </button>

          <button
            onClick={() => setActiveSideTab("interview")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              marginBottom: "8px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: activeSideTab === "interview" ? "#007bff" : "transparent",
              color: activeSideTab === "interview" ? "white" : "#212529",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: activeSideTab === "interview" ? "600" : "400",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <i className="bi bi-people" style={{ fontSize: "1.1rem" }}></i>
            Interview
          </button>

          <button
            onClick={() => setActiveSideTab("offer")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              marginBottom: "8px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: activeSideTab === "offer" ? "#007bff" : "transparent",
              color: activeSideTab === "offer" ? "white" : "#212529",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: activeSideTab === "offer" ? "600" : "400",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <i className="bi bi-envelope-check" style={{ fontSize: "1.1rem" }}></i>
            Offer
          </button>
        </div>

        {/* Content Area - with margin-left to account for fixed sidebar */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto", marginLeft: "250px" }}>
          {/* Candidate Information Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h4 style={{ marginBottom: "20px", color: "#007bff" }}>Candidate Information</h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>MRF ID</div>
                <div style={{ fontWeight: "600" }}>{candidate.mrfId || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Candidate ID</div>
                <div style={{ fontWeight: "600" }}>{candidate.id}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Name</div>
                <div style={{ fontWeight: "600" }}>{candidate.name}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>WhatsApp Number</div>
                <div style={{ fontWeight: "600" }}>{candidate.contactNumber || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Email</div>
                <div style={{ fontWeight: "600" }}>{candidate.email}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Highest Qualification</div>
                <div style={{ fontWeight: "600" }}>{candidate.qualification || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Gender</div>
                <div style={{ fontWeight: "600" }}>{candidate.gender || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Age</div>
                <div style={{ fontWeight: "600" }}>{candidate.age || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Languages</div>
                <div style={{ fontWeight: "600" }}>{candidate.languages?.join(", ") || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Experience</div>
                <div style={{ fontWeight: "600" }}>{candidate.experience ? `${candidate.experience} years` : "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Notice Period</div>
                <div style={{ fontWeight: "600" }}>{candidate.noticePeriod || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Current Salary</div>
                <div style={{ fontWeight: "600" }}>{candidate.currentSalary ? `₹${candidate.currentSalary}` : "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Expected Salary</div>
                <div style={{ fontWeight: "600" }}>{candidate.expectedSalary ? `₹${candidate.expectedSalary}` : "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Source</div>
                <div>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    backgroundColor: "#007bff",
                    color: "white"
                  }}>
                    {candidate.source || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Status</div>
                <div>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    backgroundColor: candidate.inviteStatus === "Interested" ? "#28a745" : "#6c757d",
                    color: "white"
                  }}>
                    {candidate.inviteStatus || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shortlisted Checkbox & View Resume */}
            <div style={{ marginTop: "20px", display: "flex", gap: "16px", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  defaultChecked={candidate.shortlisted}
                  onChange={(e) => {
                    if (updateCandidate) {
                      updateCandidate(candidate.id, { shortlisted: e.target.checked });
                    }
                  }}
                />
                <span style={{ fontWeight: "500" }}>Shortlisted</span>
              </label>
            </div>

            {/* Remark Field */}
            <div style={{ marginTop: "16px" }}>
              <label style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "8px", display: "block", fontWeight: "500" }}>
                Remark
              </label>
              <textarea
                placeholder="Add remarks about the candidate..."
                defaultValue={candidate.remark || ""}
                onBlur={(e) => {
                  if (updateCandidate) {
                    updateCandidate(candidate.id, { remark: e.target.value });
                  }
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  minHeight: "80px",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Documents Section */}
            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #dee2e6" }}>
              <h5 style={{ marginBottom: "16px", color: "#212529", fontSize: "1.1rem", fontWeight: "600" }}>
                <i className="bi bi-folder me-2"></i>
                Documents
              </h5>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                <button
                  onClick={() => {
                    window.open(`/documents/resume-${candidate.id}.pdf`, '_blank');
                    setToast({ show: true, message: "Downloading resume...", variant: "success" });
                  }}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "white",
                    color: "#007bff",
                    border: "1px solid #007bff",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#007bff";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#007bff";
                  }}
                >
                  <i className="bi bi-file-earmark-pdf" style={{ fontSize: "1.2rem" }}></i>
                  <span>Resume</span>
                  <i className="bi bi-download" style={{ fontSize: "0.9rem" }}></i>
                </button>

                <button
                  onClick={() => {
                    window.open(`/documents/cover-letter-${candidate.id}.pdf`, '_blank');
                    setToast({ show: true, message: "Downloading cover letter...", variant: "success" });
                  }}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "white",
                    color: "#28a745",
                    border: "1px solid #28a745",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#28a745";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#28a745";
                  }}
                >
                  <i className="bi bi-file-earmark-text" style={{ fontSize: "1.2rem" }}></i>
                  <span>Cover Letter</span>
                  <i className="bi bi-download" style={{ fontSize: "0.9rem" }}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeSideTab === "pitch" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "24px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h4 style={{ margin: 0 }}>Pitch Call Details</h4>
                
                <button
                  onClick={handleStartCall}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <i className="bi bi-telephone-fill" style={{ fontSize: "1.1rem" }}></i>
                  <span>Start Call</span>
                </button>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidate.name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    backgroundColor: "#e9ecef"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Call Date
                </label>
                <input
                  type="date"
                  value={pitchCallForm.callDate}
                  onChange={(e) => setPitchCallForm({ ...pitchCallForm, callDate: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Remarks *
                </label>
                <textarea
                  value={pitchCallForm.remarks}
                  onChange={(e) => setPitchCallForm({ ...pitchCallForm, remarks: e.target.value })}
                  placeholder="Add screening feedback and remarks..."
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    minHeight: "120px"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => handlePitchCallSubmit("Proceed")}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}
                >
                  Proceed
                </button>
                <button
                  onClick={() => handlePitchCallSubmit("Reject")}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {activeSideTab === "assessment" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "24px"
            }}>
              <h4 style={{ marginBottom: "20px" }}>Assessment Details</h4>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidate.name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    backgroundColor: "#e9ecef"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                    Assessment Date
                  </label>
                  <input
                    type="date"
                    value={assessmentForm.assessmentDate}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, assessmentDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                    Assessment Type
                  </label>
                  <input
                    type="text"
                    value={assessmentForm.assessmentType}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, assessmentType: e.target.value })}
                    placeholder="e.g., Technical, Aptitude"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                    Mode (Online/Offline)
                  </label>
                  <select
                    value={assessmentForm.mode}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, mode: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px"
                    }}
                  >
                    <option value="">Select mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                    Assessment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={assessmentForm.assessmentDateTime}
                    onChange={(e) => setAssessmentForm({ ...assessmentForm, assessmentDateTime: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Remarks
                </label>
                <textarea
                  value={assessmentForm.remarks}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, remarks: e.target.value })}
                  placeholder="Add assessment feedback..."
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    minHeight: "100px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Status 
                </label>
                <select
                  value={assessmentForm.status}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px"
                  }}
                >
                  <option value="">Select status</option>
                  <option value="Scheduled">Shortlisted</option>
                  <option value="Failed">Rejected</option>
                </select>
              </div>

              <button
                onClick={handleAssessmentSubmit}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}
              >
                Save Assessment Details
              </button>
            </div>
          )}

          {activeSideTab === "interview" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "24px"
            }}>
              <h4 style={{ marginBottom: "20px" }}>Interview Details</h4>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidate.name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    backgroundColor: "#e9ecef"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                    Interview Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={interviewForm.interviewDateTime}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewDateTime: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                    Interviewer 1 Name
                  </label>
                  <input
                    type="text"
                    value={interviewForm.interviewer1Name}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewer1Name: e.target.value })}
                    placeholder="Enter interviewer name"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Interviewer 2 Name
                </label>
                <input
                  type="text"
                  value={interviewForm.interviewer2Name}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewer2Name: e.target.value })}
                  placeholder="Enter interviewer name (optional)"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Remarks
                </label>
                <textarea
                  value={interviewForm.remarks}
                  onChange={(e) => setInterviewForm({ ...interviewForm, remarks: e.target.value })}
                  placeholder="Add interview feedback..."
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    minHeight: "100px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Status 
                </label>
                <select
                  value={interviewForm.status}
                  onChange={(e) => setInterviewForm({ ...interviewForm, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px"
                  }}
                >
                  <option value="">Select status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button
                onClick={handleInterviewSubmit}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}
              >
                Save Interview Details
              </button>
            </div>
          )}

          {activeSideTab === "offer" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "24px"
            }}>
              <h4 style={{ marginBottom: "20px" }}>Offer Details</h4>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidate.name}
                  disabled
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    backgroundColor: "#e9ecef"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                    Offer Date
                  </label>
                  <input
                    type="date"
                    value={offerForm.offerDate}
                    onChange={(e) => setOfferForm({ ...offerForm, offerDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                    Offer Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={offerForm.offerAmount}
                    onChange={(e) => setOfferForm({ ...offerForm, offerAmount: e.target.value })}
                    placeholder="Enter offer amount"
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ced4da",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Joining Date
                </label>
                <input
                  type="date"
                  value={offerForm.joiningDate}
                  onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Status *
                </label>
                <select
                  value={offerForm.status}
                  onChange={(e) => setOfferForm({ ...offerForm, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px"
                  }}
                >
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Negotiating">Negotiating</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Remarks
                </label>
                <textarea
                  value={offerForm.remarks}
                  onChange={(e) => setOfferForm({ ...offerForm, remarks: e.target.value })}
                  placeholder="Add offer-related notes..."
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    minHeight: "100px"
                  }}
                />
              </div>

              <button
                onClick={handleOfferSubmit}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}
              >
                Save Offer Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: toast.variant === "success" ? "#28a745" : 
                          toast.variant === "danger" ? "#dc3545" :
                          toast.variant === "warning" ? "#ffc107" : "#17a2b8",
          color: toast.variant === "warning" ? "#000" : "white",
          padding: "16px 24px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          zIndex: 9999,
          minWidth: "300px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ ...toast, show: false })}
              style={{
                marginLeft: "16px",
                background: "none",
                border: "none",
                color: "inherit",
                fontSize: "1.2rem",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetailsPage;
