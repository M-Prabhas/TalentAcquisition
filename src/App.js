import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManageMrf from "./pages/ManageMrf";
import ManageCandidatesPage from "./pages/ManageCandidatesPage";
import CandidateDetailsPage from "./pages/CandidateDetailsPage";
import HiringManagerDashboard from "./pages/HiringManagerDashboard";
import HMCandidateDetailsPage from "./pages/HiringManagerCandidateDetails";
// ... other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/manage_mrf" element={<ManageMrf />} />
        <Route path="/manage_candidates/:mrfId" element={<ManageCandidatesPage />} />
        <Route path="/candidate/:candidateId" element={<CandidateDetailsPage />} />
        <Route path="/hiring-manager/dashboard" element={<HiringManagerDashboard />} />
        <Route path="/hiring-manager/candidate/:candidateId" element={<HMCandidateDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
