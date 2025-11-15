import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import AppToast from '../components/Toast';
import { Tabs, Tab } from 'react-bootstrap';

const HmReview = () => {
  const { mockCandidates = [], state = {}, updateCandidate } = useAppContext();
  const [activeTab, setActiveTab] = useState('sent');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [feedback, setFeedback] = useState({ status: 'Pending', remark: '' });

  // Filter candidates forwarded to this manager
  const sentCandidates = mockCandidates.filter(c => c.forwardedTo && c.forwardedTo.managerId === state.currentUserId);

  const handleOpenCandidate = (c) => {
    setSelectedCandidate(c);
    setFeedback({ status: c.managerFeedback?.status || 'Pending', remark: c.managerFeedback?.remark || '' });
    setShowModal(true);
  }

  const saveManagerFeedback = () => {
    if (!selectedCandidate) return;
    const { id } = selectedCandidate;
    updateCandidate(id, { managerFeedback: { status: feedback.status, remark: feedback.remark, updatedAt: new Date().toISOString() }, status: feedback.status === 'Shortlisted' ? 'Manager Shortlisted' : feedback.status === 'Rejected' ? 'Manager Rejected' : 'Pending' });
    setToast({ show: true, message: 'Feedback saved', variant: 'success' });
    setShowModal(false);
  }

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold text-dark mb-4">Hiring Manager — Sent Profiles</h3>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="sent" title="View Sent Profiles">
          <div className="card shadow-sm">
            <div className="card-body table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Candidate ID</th>
                    <th>Name</th>
                    <th>Resume</th>
                    <th>Status</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {sentCandidates.length > 0 ? sentCandidates.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>
                        <button className="btn btn-link p-0" onClick={() => handleOpenCandidate(c)}>{c.name}</button>
                      </td>
                      <td>
                        {c.resumeUrl ? (
                          <a href={c.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">View</a>
                        ) : (
                          <span className="text-muted small">No Resume</span>
                        )}
                      </td>
                      <td><span className="badge bg-info text-dark">{c.status}</span></td>
                      <td className="small text-muted">{c.managerFeedback?.remark || '-'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="text-center text-muted py-3">No profiles sent to you.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tab>
        <Tab eventKey="track" title="Track Manager Feedback">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Feedback Summary</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card p-3">
                    <div className="small text-muted">Shortlisted</div>
                    <div className="fw-bold">{sentCandidates.filter(c => c.managerFeedback?.status === 'Shortlisted').length}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card p-3">
                    <div className="small text-muted">Rejected</div>
                    <div className="fw-bold">{sentCandidates.filter(c => c.managerFeedback?.status === 'Rejected').length}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card p-3">
                    <div className="small text-muted">Pending</div>
                    <div className="fw-bold">{sentCandidates.filter(c => !c.managerFeedback || c.managerFeedback?.status === 'Pending').length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>

      <Modal show={showModal} title={`Candidate ${selectedCandidate?.id || ''}`} onClose={() => setShowModal(false)}>
        {selectedCandidate && (
          <div className="row g-3">
            <div className="col-md-6">
              <p><strong>Name:</strong> {selectedCandidate.name}</p>
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Experience:</strong> {selectedCandidate.experience} Yrs</p>
              <p><strong>Notice:</strong> {selectedCandidate.noticePeriod} Days</p>
            </div>
            <div className="col-md-6">
              <div className="mb-2">
                <label className="form-label small">Manager Feedback</label>
                <select className="form-select" value={feedback.status} onChange={(e)=>setFeedback(prev=>({...prev, status: e.target.value}))}>
                  <option>Pending</option>
                  <option>Shortlisted</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label small">Remark</label>
                <textarea className="form-control" rows={3} value={feedback.remark} onChange={(e)=>setFeedback(prev=>({...prev, remark: e.target.value}))} />
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveManagerFeedback}>Save Feedback</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <AppToast show={toast.show} message={toast.message} variant={toast.variant} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
};

export default HmReview;
