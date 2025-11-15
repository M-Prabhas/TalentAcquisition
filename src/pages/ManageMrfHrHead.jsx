import React, { useState } from 'react';
import { useAppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import AppToast from "../components/Toast";

const ManageMrfHrHead = () => {
  const { mockMrfs, mockEmployees } = useAppContext();
  const [selectedMrf, setSelectedMrf] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const hrTeamMembers = Object.values(mockEmployees).filter(
    emp => emp.dept === "HR" && emp.designation === "Talent Acquisition"
  );

  const handleAssign = (mrfId, hrId) => {
    // In a real app, this would make an API call
    setToast({
      show: true,
      message: `MRF assigned to ${mockEmployees[hrId].name}`,
      variant: "success",
    });
    setShowAssignModal(false);
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold text-dark mb-4">Manage MRF Assignments</h3>

      {/* Team Overview intentionally removed per request (team performance removed) */}

      {/* MRF Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Pending MRF Assignments</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>MRF ID</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Posting Date</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                    {mockMrfs
                      // show only unassigned MRFs in pending assignments for HR Head
                      .filter(mrf => !mrf.assignedTo)
                      .map(mrf => (
                      <tr key={mrf.id}>
                    <td>{mrf.id}</td>
                    <td>{mrf.designation}</td>
                    <td>{mrf.department}</td>
                    <td>{mrf.postingDate}</td>
                    <td>
                      <span className={`badge bg-${
                        mrf.department === "Engineering" ? "danger" : "warning"
                      }`}>
                        {mrf.department === "Engineering" ? "High" : "Medium"}
                      </span>
                    </td>
                        <td>
                          <span className="text-muted">Unassigned</span>
                        </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedMrf(mrf);
                          setShowAssignModal(true);
                        }}
                      >
                            Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assign MRF Modal */}
      <Modal
        show={showAssignModal}
        title="Assign MRF"
        onClose={() => setShowAssignModal(false)}
        footer={
          <button
            className="btn btn-secondary"
            onClick={() => setShowAssignModal(false)}
          >
            Cancel
          </button>
        }
      >
        <div className="row g-3">
          {hrTeamMembers.map(member => (
            <div key={member.id} className="col-12">
              <div className="card cursor-pointer" onClick={() => handleAssign(selectedMrf?.id, member.id)}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{member.name}</h6>
                      <div className="small text-muted">
                        Currently handling {member.activeMrfs} MRFs
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="small text-muted">Avg. Time to Fill</div>
                      <div className="fw-bold">{member.performance.timeToFill} days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

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

export default ManageMrfHrHead;