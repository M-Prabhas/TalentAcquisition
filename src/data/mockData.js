export const mockEmployees = {
  e1001: { 
    id: "e1001", 
    name: "Priya Sharma", 
    dept: "HR", 
    designation: "Talent Acquisition",
    role: "hr",
    reportingTo: "e1005",
    activeMrfs: 2,
    performance: { timeToFill: 35, offerAcceptRate: 85 }
  },
  e1002: { 
    id: "e1002", 
    name: "Amit Singh", 
    dept: "HR", 
    designation: "Talent Acquisition",
    role: "hr",
    reportingTo: "e1005",
    activeMrfs: 3,
    performance: { timeToFill: 32, offerAcceptRate: 90 }
  },
  e1003: { 
    id: "e1003", 
    name: "Rohan Gupta", 
    dept: "Engineering", 
    designation: "Engineering Manager",
    role: "hm"
  },
  e1004: { 
    id: "e1004", 
    name: "Sneha Reddy", 
    dept: "Marketing", 
    designation: "Marketing Head",
    role: "hm"
  },
  e1005: { 
    id: "e1005", 
    name: "Vikram Rao", 
    dept: "HR", 
    designation: "HR Head",
    role: "hr_head",
    teamMembers: ["e1001", "e1002"]
  },
  e1006: { 
    id: "e1006", 
    name: "Anjali Mehta", 
    dept: "Management", 
    designation: "CEO",
    role: "management"
  },
};

export const mockMrfs = [
  { id: "MRF-001", designation: "Senior Software Engineer", department: "Engineering", hiringManagerId: "e1003", status: "Open", postingDate: "2025-10-25", assignedTo: null, location: "Bangalore" },
  { id: "MRF-002", designation: "Marketing Manager", department: "Marketing", hiringManagerId: "e1004", status: "Open", postingDate: "2025-10-22", assignedTo: "e1001", location: "Mumbai" },
];

export const mockCandidates = [
  { id: "C-001", mrfId: "MRF-001", name: "Arjun Verma", email: "arjun@example.com", experience: 5, expectedSalary: 22, noticePeriod: 30, status: "New", source: "LinkedIn", assignedTo: "e1001" },
  { id: "C-002", mrfId: "MRF-001", name: "Neha Sharma", email: "neha@example.com", experience: 7, expectedSalary: 25, noticePeriod: 60, status: "New", source: "Naukri", assignedTo: null },
];

export const mockThirdPartyCandidates = [
  { id: "C-101", mrfId: "MRF-001", name: "Deepak Agency", email: "deepak.agency@example.com", experience: 4, expectedSalary: 18, noticePeriod: 30, status: "New", source: "Agency", assignedTo: "e1002" },
  { id: "C-102", mrfId: "MRF-002", name: "Lakshmi Recruiters", email: "lakshmi.agency@example.com", experience: 6, expectedSalary: 20, noticePeriod: 45, status: "New", source: "Agency", assignedTo: null },
];
