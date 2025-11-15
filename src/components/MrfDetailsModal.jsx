import React from 'react';
import Modal from './Modal';
import '../assets/styles/MrfDetailsModal.css';

const MrfDetailsModal = ({ show, onClose, mrfData }) => {
  if (!mrfData) return null;

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={`MRF Details (MRF ${mrfData.mrfId || ''})`}
    >
      <div className="mrf-info">
        <div className="info-row">
          <div className="info-column">
            <p><strong>Requirement Type:</strong> {mrfData.requirementType || 'N/A'}</p>
            <p><strong>Employment Type:</strong> {mrfData.employmentType || 'N/A'}</p>
            <p><strong>Annual CTC (LPA):</strong> {mrfData.annualCtc || 'N/A'}</p>
            <p><strong>Variable Pay (%):</strong> {mrfData.variablePay || 'N/A'}</p>
            <p><strong>Required Skill Set:</strong> {mrfData.requiredSkillSet || 'N/A'}</p>
            <p><strong>Age Range (Years):</strong> {mrfData.ageRange || 'N/A'}</p>
            <p><strong>Work Location City:</strong> {mrfData.workLocationCity || 'N/A'}</p>
            <p><strong>Targeted Companies:</strong> {mrfData.targetedCompanies || 'N/A'}</p>
            <p><strong>Interviewers:</strong> {mrfData.interviewers || 'N/A'}</p>
          </div>
          <div className="info-column">
            <p><strong>Replacement Employee:</strong> {mrfData.replacementEmployee || 'N/A'}</p>
            <p><strong>Job Description:</strong> {mrfData.jobDescription || 'N/A'}</p>
            <p><strong>Incentives (LPA):</strong> {mrfData.incentives || 'N/A'}</p>
            <p><strong>Required Qualifications:</strong> {mrfData.requiredQualifications || 'N/A'}</p>
            <p><strong>Experience Range (Years):</strong> {mrfData.experienceRange || 'N/A'}</p>
            <p><strong>State:</strong> {mrfData.state || 'N/A'}</p>
            <p><strong>Specific Consideration:</strong> {mrfData.specificConsideration || 'N/A'}</p>
            <p><strong>Modes of Interview:</strong> {mrfData.modesOfInterview || 'N/A'}</p>
          </div>
        </div>
        <div className="footer-info">
          <p><strong>Created By:</strong> {mrfData.createdBy || 'N/A'}</p>
          <p><strong>Created At:</strong> {mrfData.createdAt || 'N/A'}</p>
          <p><strong>Modified By:</strong> {mrfData.modifiedBy || 'N/A'}</p>
          <p><strong>Last Modified:</strong> {mrfData.lastModified || 'N/A'}</p>
          <p><strong>Vacancies:</strong> {mrfData.vacancies || 'N/A'}</p>
          <p><strong>Recruited Count:</strong> {mrfData.recruitedCount || 'N/A'}</p>
        </div>
      </div>
    </Modal>
  );
};

export default MrfDetailsModal;