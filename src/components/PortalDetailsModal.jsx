import React from 'react';
import Modal from './Modal';

const PortalDetailsModal = ({ show, onClose, onSave }) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Portal Details"
      footer={
        <button className="btn btn-primary" onClick={onSave}>Save Portal Details</button>
      }
    >
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Job Portal</label>
          <select className="form-select">
            <option value="">Select Portal</option>
            <option value="naukri">Naukri</option>
            <option value="linkedin">LinkedIn</option>
            <option value="indeed">Indeed</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Portal Link</label>
          <input type="url" className="form-control" placeholder="Enter job posting URL" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Posting Date</label>
          <input type="date" className="form-control" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default PortalDetailsModal;