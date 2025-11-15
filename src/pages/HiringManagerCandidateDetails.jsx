import { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";

const HMCandidateDetailsPage = () => {
  const navigate = useNavigate();

  // Mock candidate data
  const mockCandidate = {
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
    hmReviewStatus: "",
    hmReviewRemark: "",
    hmReviewDate: "",
    shortlisted: true,
    inviteStatus: "Interested",
    suggestedInterviewSlots: [],
    interviewSlotsSubmitted: false,
    assessmentStatus: "",
    assessmentDate: "",
    assessmentType: "",
    assessmentMode: "",
    assessmentRemarks: "",
    interviewStatus: "",
    interviewDateTime: "",
    interviewer1Name: "",
    interviewer2Name: "",
    interviewRemarks: "",
  };

  const [candidate, setCandidate] = useState(mockCandidate);
  
  // Side tab navigation state
  const [activeSideTab, setActiveSideTab] = useState("feedback");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Manager Feedback State
  const [feedbackForm, setFeedbackForm] = useState({
    status: "",
    remarks: "",
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
    interviewDateTime: "",
    interviewer1Name: "",
    interviewer2Name: "",
    status: "",
    remarks: "",
  });

  // Interview Slot Suggestion State
  const [interviewSlots, setInterviewSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: "", time: "" });

  useEffect(() => {
    if (candidate) {
      // Load Manager Feedback data
      setFeedbackForm({
        status: candidate.hmReviewStatus || "",
        remarks: candidate.hmReviewRemark || "",
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
        interviewDateTime: candidate.interviewDateTime || "",
        interviewer1Name: candidate.interviewer1Name || "",
        interviewer2Name: candidate.interviewer2Name || "",
        status: candidate.interviewStatus || "",
        remarks: candidate.interviewRemarks || "",
      });

      // Load suggested interview slots
      setInterviewSlots(candidate.suggestedInterviewSlots || []);
    }
  }, [candidate]);

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

  const handleRoleChange = (newRole) => {
    setToast({ show: true, message: `Switched to ${newRole} view`, variant: "info" });
    setShowUserDropdown(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  // Handle Manager Feedback Submission
  const handleFeedbackSubmit = (decision) => {
    if (!feedbackForm.remarks && decision !== "Pending") {
      setToast({ show: true, message: "Please add remarks before submitting.", variant: "warning" });
      return;
    }

    setCandidate({
      ...candidate,
      hmReviewStatus: decision,
      hmReviewRemark: feedbackForm.remarks,
      hmReviewDate: new Date().toISOString(),
      suggestedInterviewSlots: interviewSlots,
    });

    setToast({ 
      show: true, 
      message: `Candidate ${decision.toLowerCase()} successfully!`, 
      variant: decision === "Shortlisted" ? "success" : decision === "Rejected" ? "danger" : "info"
    });

    if (decision === "Shortlisted") {
      setActiveSideTab("assessment");
    }
  };

  // Handle Assessment Submission
  const handleAssessmentSubmit = () => {
    if (!assessmentForm.status) {
      setToast({ show: true, message: "Please select assessment status.", variant: "warning" });
      return;
    }

    setCandidate({
      ...candidate,
      assessmentDate: assessmentForm.assessmentDate,
      assessmentType: assessmentForm.assessmentType,
      assessmentMode: assessmentForm.mode,
      assessmentDateTime: assessmentForm.assessmentDateTime,
      assessmentStatus: assessmentForm.status,
      assessmentRemarks: assessmentForm.remarks,
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

    setCandidate({
      ...candidate,
      interviewDateTime: interviewForm.interviewDateTime,
      interviewer1Name: interviewForm.interviewer1Name,
      interviewer2Name: interviewForm.interviewer2Name,
      interviewStatus: interviewForm.status,
      interviewRemarks: interviewForm.remarks,
    });

    setToast({ 
      show: true, 
      message: "Interview details saved successfully!", 
      variant: "success" 
    });
  };

  // Handle Add Interview Slot
  const handleAddSlot = () => {
    if (!newSlot.date || !newSlot.time) {
      setToast({ show: true, message: "Please select both date and time.", variant: "warning" });
      return;
    }

    const updatedSlots = [...interviewSlots, { ...newSlot }];
    setInterviewSlots(updatedSlots);
    setNewSlot({ date: "", time: "" });
    setToast({ show: true, message: "Interview slot added successfully!", variant: "success" });
  };

  // Handle Remove Slot
  const handleRemoveSlot = (index) => {
    const updatedSlots = interviewSlots.filter((_, idx) => idx !== index);
    setInterviewSlots(updatedSlots);
    setToast({ show: true, message: "Interview slot removed.", variant: "info" });
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
        alignItems: "center"
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
            ← Back to Dashboard
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

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Side Navigation Tabs */}
        <div style={{
          width: "250px",
          backgroundColor: "white",
          borderRight: "1px solid #dee2e6",
          padding: "20px",
        }}>
          <h6 style={{ marginBottom: "20px", color: "#6c757d", fontSize: "0.85rem", fontWeight: "600" }}>
            HIRING MANAGER REVIEW
          </h6>
          
          <button
            onClick={() => setActiveSideTab("feedback")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              marginBottom: "8px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: activeSideTab === "feedback" ? "#007bff" : "transparent",
              color: activeSideTab === "feedback" ? "white" : "#212529",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: activeSideTab === "feedback" ? "600" : "400",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <i className="bi bi-chat-square-text" style={{ fontSize: "1.1rem" }}></i>
            Manager Feedback
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
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
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
                <div style={{ fontWeight: "600" }}>{candidate.mrfId}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Candidate ID</div>
                <div style={{ fontWeight: "600" }}>#{candidate.id}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Name</div>
                <div style={{ fontWeight: "600" }}>{candidate.name}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>WhatsApp Number</div>
                <div style={{ fontWeight: "600" }}>{candidate.contactNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Email</div>
                <div style={{ fontWeight: "600" }}>{candidate.email}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Highest Qualification</div>
                <div style={{ fontWeight: "600" }}>{candidate.qualification}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Gender</div>
                <div style={{ fontWeight: "600" }}>{candidate.gender}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Age</div>
                <div style={{ fontWeight: "600" }}>{candidate.age}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Languages</div>
                <div style={{ fontWeight: "600" }}>{candidate.languages.join(", ")}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Experience</div>
                <div style={{ fontWeight: "600" }}>{candidate.experience} years</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Notice Period</div>
                <div style={{ fontWeight: "600" }}>{candidate.noticePeriod}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Current Salary</div>
                <div style={{ fontWeight: "600" }}>₹{candidate.currentSalary}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6c757d", marginBottom: "4px" }}>Expected Salary</div>
                <div style={{ fontWeight: "600" }}>₹{candidate.expectedSalary}</div>
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
                    {candidate.source}
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
                    backgroundColor: candidate.hmReviewStatus === "Shortlisted" ? "#28a745" : 
                                   candidate.hmReviewStatus === "Rejected" ? "#dc3545" : "#ffc107",
                    color: "white"
                  }}>
                    {candidate.hmReviewStatus || "Pending"}
                  </span>
                </div>
              </div>
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

                <button
                  onClick={() => {
                    window.open(`/documents/certificates-${candidate.id}.pdf`, '_blank');
                    setToast({ show: true, message: "Downloading certificates...", variant: "success" });
                  }}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "white",
                    color: "#ffc107",
                    border: "1px solid #ffc107",
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
                    e.target.style.backgroundColor = "#ffc107";
                    e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#ffc107";
                  }}
                >
                  <i className="bi bi-file-earmark-check" style={{ fontSize: "1.2rem" }}></i>
                  <span>Certificates</span>
                  <i className="bi bi-download" style={{ fontSize: "0.9rem" }}></i>
                </button>

                <button
                  onClick={() => {
                    window.open(`/documents/id-proof-${candidate.id}.pdf`, '_blank');
                    setToast({ show: true, message: "Downloading ID proof...", variant: "success" });
                  }}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "white",
                    color: "#17a2b8",
                    border: "1px solid #17a2b8",
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
                    e.target.style.backgroundColor = "#17a2b8";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#17a2b8";
                  }}
                >
                  <i className="bi bi-card-text" style={{ fontSize: "1.2rem" }}></i>
                  <span>ID Proof</span>
                  <i className="bi bi-download" style={{ fontSize: "0.9rem" }}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeSideTab === "feedback" && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "24px"
            }}>
              <h4 style={{ marginBottom: "20px" }}>Manager Feedback & Decision</h4>

              <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h6 style={{ marginBottom: "12px", color: "#495057" }}>Current Status</h6>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    backgroundColor: candidate.hmReviewStatus === "Shortlisted" ? "#28a745" : 
                                   candidate.hmReviewStatus === "Rejected" ? "#dc3545" : "#ffc107",
                    color: "white"
                  }}>
                    {candidate.hmReviewStatus || "Pending Review"}
                  </span>
                  {candidate.hmReviewDate && (
                    <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                      Updated on: {new Date(candidate.hmReviewDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Interview Slot Suggestions - SHOW FOR PENDING CANDIDATES ONLY */}
              {(!candidate.hmReviewStatus || candidate.hmReviewStatus === "Pending") && (
                <div style={{ marginBottom: "24px", padding: "20px", backgroundColor: "#fff3cd", borderRadius: "8px", border: "1px solid #ffc107" }}>
                  <h6 style={{ color: "#856404", marginBottom: "12px" }}>
                    <i className="bi bi-calendar-check me-2"></i>
                    Suggest Interview Slots
                  </h6>
                  <p style={{ fontSize: "0.9rem", color: "#856404", marginBottom: "16px" }}>
                    Before making a decision, suggest available interview slots for this candidate
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ fontSize: "0.85rem", marginBottom: "4px", display: "block", color: "#856404" }}>Date</label>
                      <input
                        type="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ffc107",
                          borderRadius: "4px"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.85rem", marginBottom: "4px", display: "block", color: "#856404" }}>Time</label>
                      <input
                        type="time"
                        value={newSlot.time}
                        onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #ffc107",
                          borderRadius: "4px"
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                      <button
                        onClick={handleAddSlot}
                        style={{
                          padding: "8px 20px",
                          backgroundColor: "#ffc107",
                          color: "#000",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <i className="bi bi-plus-circle"></i>
                        Add Slot
                      </button>
                    </div>
                  </div>

                  {interviewSlots.length > 0 && (
                    <div>
                      <h6 style={{ fontSize: "0.9rem", color: "#856404", marginBottom: "12px" }}>Suggested Slots:</h6>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                        {interviewSlots.map((slot, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "white",
                              border: "1px solid #ffc107",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "0.9rem"
                            }}
                          >
                            <i className="bi bi-calendar3" style={{ color: "#ffc107" }}></i>
                            <span>{new Date(slot.date).toLocaleDateString()} at {slot.time}</span>
                            <button
                              onClick={() => handleRemoveSlot(idx)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#dc3545",
                                cursor: "pointer",
                                padding: "0 4px"
                              }}
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Submit Interview Slots Button */}
                      <button
                        onClick={() => {
                          setCandidate({
                            ...candidate,
                            suggestedInterviewSlots: interviewSlots,
                            interviewSlotsSubmitted: true,
                          });
                          setToast({ 
                            show: true, 
                            message: `${interviewSlots.length} interview slot(s) submitted successfully!`, 
                            variant: "success" 
                          });
                        }}
                        style={{
                          padding: "10px 24px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <i className="bi bi-check-circle"></i>
                        Submit Interview Slots
                      </button>
                    </div>
                  )}

                  {/* Interview Evaluation Form - Show after slots are submitted */}
                  {candidate.interviewSlotsSubmitted && (
                    <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "2px solid #ffc107" }}>
                      <h6 style={{ color: "#856404", marginBottom: "16px" }}>
                        <i className="bi bi-clipboard-check me-2"></i>
                        Post-Interview Evaluation
                      </h6>
                      <p style={{ fontSize: "0.9rem", color: "#856404", marginBottom: "16px" }}>
                        Complete this evaluation after the interview is conducted
                      </p>

                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block", color: "#856404" }}>
                          Interview Conducted Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={interviewForm.interviewDateTime}
                          onChange={(e) => setInterviewForm({ ...interviewForm, interviewDateTime: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ffc107",
                            borderRadius: "4px",
                            backgroundColor: "white"
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div>
                          <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block", color: "#856404" }}>
                            Interviewer 1 Name
                          </label>
                          <input
                            type="text"
                            value={interviewForm.interviewer1Name}
                            onChange={(e) => setInterviewForm({ ...interviewForm, interviewer1Name: e.target.value })}
                            placeholder="Enter primary interviewer name"
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ffc107",
                              borderRadius: "4px",
                              backgroundColor: "white"
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block", color: "#856404" }}>
                            Interviewer 2 Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={interviewForm.interviewer2Name}
                            onChange={(e) => setInterviewForm({ ...interviewForm, interviewer2Name: e.target.value })}
                            placeholder="Enter second interviewer name"
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ffc107",
                              borderRadius: "4px",
                              backgroundColor: "white"
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block", color: "#856404" }}>
                          Interview Result *
                        </label>
                        <select
                          value={interviewForm.status}
                          onChange={(e) => setInterviewForm({ ...interviewForm, status: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ffc107",
                            borderRadius: "4px",
                            backgroundColor: "white"
                          }}
                        >
                          <option value="">Select interview result</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block", color: "#856404" }}>
                          Detailed Evaluation & Remarks *
                        </label>
                        <textarea
                          value={interviewForm.remarks}
                          onChange={(e) => setInterviewForm({ ...interviewForm, remarks: e.target.value })}
                          placeholder="Provide detailed feedback about the candidate's performance, technical skills, communication, cultural fit, etc."
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ffc107",
                            borderRadius: "4px",
                            minHeight: "120px",
                            fontSize: "0.95rem",
                            backgroundColor: "white"
                          }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (!interviewForm.status || !interviewForm.remarks) {
                            setToast({ show: true, message: "Please complete all required fields.", variant: "warning" });
                            return;
                          }
                          
                          handleInterviewSubmit();
                        }}
                        style={{
                          padding: "10px 24px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <i className="bi bi-check2-square"></i>
                        Submit Interview Evaluation
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Remarks *
                </label>
                <textarea
                  value={feedbackForm.remarks}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, remarks: e.target.value })}
                  placeholder="Add your detailed feedback about the candidate..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    minHeight: "120px",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => handleFeedbackSubmit("Shortlisted")}
                  style={{
                    padding: "12px 28px",
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
                  <i className="bi bi-check-circle"></i>
                  Shortlist for Assessment
                </button>
                <button
                  onClick={() => handleFeedbackSubmit("Rejected")}
                  style={{
                    padding: "12px 28px",
                    backgroundColor: "#dc3545",
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
                  <i className="bi bi-x-circle"></i>
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

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Status *
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
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                </select>
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

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "500", marginBottom: "8px", display: "block" }}>
                  Status *
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
                  <option value="Completed">Completed</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
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

export default HMCandidateDetailsPage;
