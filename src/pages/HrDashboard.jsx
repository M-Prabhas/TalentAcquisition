import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const HrDashboard = () => {
  // Mock data for charts
  const doughnutData = {
    labels: ['Open', 'In Progress', 'Closed', 'On Hold'],
    datasets: [{
      data: [12, 8, 15, 3],
      backgroundColor: ['#ffc107', '#17a2b8', '#28a745', '#dc3545'],
    }]
  };

  const timeToFillData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Average Time to Fill (Days)',
      data: [45, 42, 38, 35, 40, 38],
      borderColor: '#0d6efd',
      tension: 0.4,
    }]
  };

  const hiringTrendsData = {
    labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    datasets: [{
      label: 'Positions Filled',
      data: [15, 8, 12, 5, 7],
      backgroundColor: '#198754',
    }]
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold text-dark mb-4">HR Head Dashboard</h3>

      {/* KPI Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-primary h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Total Active MRFs</h6>
              <h3 className="text-primary fw-bold mb-1">38</h3>
              <p className="text-muted small mb-0">↑ 12% from last month</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Avg. Time to Fill</h6>
              <h3 className="text-success fw-bold mb-1">38 days</h3>
              <p className="text-muted small mb-0">↓ 5 days from target</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Offer Acceptance Rate</h6>
              <h3 className="text-info fw-bold mb-1">85%</h3>
              <p className="text-muted small mb-0">↑ 5% from last quarter</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning h-100">
            <div className="card-body">
              <h6 className="text-muted mb-1">Cost per Hire</h6>
              <h3 className="text-warning fw-bold mb-1">₹25,000</h3>
              <p className="text-muted small mb-0">Within budget</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">MRF Status Distribution</h5>
              <div style={{ height: '250px' }} className="d-flex align-items-center justify-content-center">
                <Doughnut 
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true
                        }
                      }
                    }
                  }}
                  fallbackContent="Loading chart..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Time to Fill Trend</h5>
              <div style={{ height: '250px' }}>
                <Line 
                  data={timeToFillData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: value => `${value} days`
                        }
                      }
                    }
                  }}
                  fallbackContent="Loading chart..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Hiring by Department</h5>
              <div style={{ height: '250px' }}>
                <Bar 
                  data={hiringTrendsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                  fallbackContent="Loading chart..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Pending Approvals</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>MRF ID</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Hiring Manager</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>MRF-1234</td>
                  <td>Senior Developer</td>
                  <td>Engineering</td>
                  <td>Rohan Gupta</td>
                  <td><span className="badge bg-warning text-dark">Pending Approval</span></td>
                  <td>
                    <button className="btn btn-sm btn-success">Approve</button>
                  </td>
                </tr>
                <tr>
                  <td>MRF-1235</td>
                  <td>Product Manager</td>
                  <td>Product</td>
                  <td>Neha Singh</td>
                  <td><span className="badge bg-warning text-dark">Pending Approval</span></td>
                  <td>
                    <button className="btn btn-sm btn-success">Approve</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;