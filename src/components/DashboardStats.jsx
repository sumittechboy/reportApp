import React from 'react';

const DashboardStats = ({ studentCount }) => {
  return (
    <section className="dashboard-stats">
      <div className="stats-grid">
        <div className="stats-card">
          <span className="stats-label">Total Students</span>
          <span className="stats-value">{studentCount}</span>
        </div>
      </div>
      {studentCount === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <h3>Please upload a CSV file to view reports.</h3>
        </div>
      )}
    </section>
  );
};

export default DashboardStats;
