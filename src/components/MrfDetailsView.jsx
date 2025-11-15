import React from 'react';
import Modal from './Modal';

const MrfDetailsView = ({ mrf, show, onClose }) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={`MRF Details - ${mrf?.id}`}
    >
      <div className="row g-3">
        <div className="col-md-6">
          <div className="mb-2">
            <strong>Designation:</strong> {mrf?.designation}
          </div>
          <div className="mb-2">
            <strong>Department:</strong> {mrf?.department}
          </div>
          <div className="mb-2">
            <strong>Location:</strong> {mrf?.location}
          </div>
          <div className="mb-2">
            <strong>Employment Type:</strong> Full Time
          </div>
          <div className="mb-2">
            <strong>Experience Required:</strong> 5-7 years
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-2">
            <strong>Salary Range:</strong> Not Disclosed
          </div>
          <div className="mb-2">
            <strong>Skills Required:</strong> JavaScript, React, Node.js
          </div>
          <div className="mb-2">
            <strong>Education:</strong> B.Tech/B.E.
          </div>
          <div className="mb-2">
            <strong>Posting Date:</strong> {mrf?.postingDate}
          </div>
          <div className="mb-2">
            <strong>Status:</strong> {mrf?.status}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MrfDetailsView;