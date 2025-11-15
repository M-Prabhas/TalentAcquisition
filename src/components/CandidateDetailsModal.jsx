import React from 'react';
import Modal from './Modal';

const CandidateDetailsModal = ({ candidate, show, onClose, onAction }) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={`Candidate Details - ${candidate?.name}`}
      footer={
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={() => onAction('shortlist')}>
            Shortlist
          </button>
          <button className="btn btn-warning" onClick={() => onAction('hold')}>
            Hold
          </button>
          <button className="btn btn-danger" onClick={() => onAction('reject')}>
            Reject
          </button>
        </div>
      }
    >
      <div className="row g-3">
        <div className="col-md-6">
          <div className="mb-2">
            <strong>Name:</strong> {candidate?.name}
          </div>
          <div className="mb-2">
            <strong>Email:</strong> {candidate?.email}
          </div>
          <div className="mb-2">
            <strong>WhatsApp:</strong> {candidate?.whatsapp}
          </div>
          <div className="mb-2">
            <strong>Experience:</strong> {candidate?.experience} years
          </div>
          <div className="mb-2">
            <strong>Current Salary:</strong> {candidate?.currentSalary} LPA
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-2">
            <strong>Expected Salary:</strong> {candidate?.expectedSalary} LPA
          </div>
          <div className="mb-2">
            <strong>Notice Period:</strong> {candidate?.noticePeriod} days
          </div>
          <div className="mb-2">
            <strong>Source:</strong> {candidate?.source}
          </div>
          <div className="mb-2">
            <strong>Status:</strong> {candidate?.status}
          </div>
        </div>
        <div className="col-12">
          <div className="mb-2">
            <strong>Resume:</strong>
            {candidate?.resumeUrl ? (
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ms-2"
              >
                View Resume
              </a>
            ) : (
              <button className="btn btn-link p-0 ms-2" disabled>
                View Resume
              </button>
            )}
          </div>
          <div className="mb-2">
            <strong>Remarks:</strong>
            <p className="mt-1 mb-0 text-muted">{candidate?.remarks || 'No remarks added'}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CandidateDetailsModal;