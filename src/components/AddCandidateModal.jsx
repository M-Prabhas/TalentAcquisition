import React from 'react';
import Modal from './Modal';

const AddCandidateModal = ({ show, onClose, onSave }) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Add New Candidate"
      footer={
        <button className="btn btn-primary" onClick={onSave}>Save Candidate</button>
      }
    >
      <form className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">WhatsApp Number</label>
          <input type="tel" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select className="form-select" required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Age</label>
          <input type="number" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Languages Known</label>
          <input type="text" className="form-control" placeholder="Comma separated" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Experience (Years)</label>
          <input type="number" className="form-control" step="0.1" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Notice Period (Days)</label>
          <input type="number" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Current Salary (LPA)</label>
          <input type="number" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Expected Salary (LPA)</label>
          <input type="number" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Source</label>
          <select className="form-select" required>
            <option value="">Select Source</option>
            <option value="linkedin">LinkedIn</option>
            <option value="naukri">Naukri</option>
            <option value="referral">Referral</option>
            <option value="agency">Agency</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Highest Qualification</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="col-12">
          <label className="form-label">Resume</label>
          <input type="file" className="form-control" accept=".pdf,.doc,.docx" required />
        </div>
        <div className="col-12">
          <label className="form-label">Remarks</label>
          <textarea className="form-control" rows="3"></textarea>
        </div>
      </form>
    </Modal>
  );
};

export default AddCandidateModal;