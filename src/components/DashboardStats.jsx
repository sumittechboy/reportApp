import React from 'react';

const DashboardStats = ({ studentCount, studentData, classInfo }) => {
  const getStats = () => {
    if (!studentData || studentData.length === 0) return {};
    
    const totalScore = studentData.reduce((sum, s) => sum + (s.TotalScore || 0), 0);
    const avgScore = (totalScore / studentData.length).toFixed(2);
    const avgAttendance = (studentData.reduce((sum, s) => sum + (s.attP || 0), 0) / studentData.length).toFixed(2);
    const topStudent = studentData.length > 0 ? studentData[0] : null;
    
    return {
      totalScore,
      avgScore,
      avgAttendance,
      topStudent: topStudent?.Name || 'N/A',
      topStudentScore: topStudent?.totalP || 0
    };
  };

  const stats = getStats();

  return (
    <section className="dashboard-stats">
      {studentCount === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <h3>Please upload a CSV file to view reports.</h3>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ marginBottom: '15px', color: '#003366' }}>Class Overview - {classInfo.className}</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Teacher: <strong>{classInfo.teacherName}</strong></p>
          </div>
          <div className="stats-grid">
            <div className="stats-card">
              <span className="stats-label">Total Students</span>
              <span className="stats-value">{studentCount}</span>
            </div>
            <div className="stats-card">
              <span className="stats-label">Avg Score</span>
              <span className="stats-value">{stats.avgScore}%</span>
            </div>
            <div className="stats-card">
              <span className="stats-label">Avg Attendance</span>
              <span className="stats-value">{stats.avgAttendance}%</span>
            </div>
            <div className="stats-card">
              <span className="stats-label">Total Score</span>
              <span className="stats-value">{stats.totalScore}</span>
            </div>
            <div className="stats-card">
              <span className="stats-label">Top Student</span>
              <span className="stats-value" style={{ fontSize: '16px' }}>{stats.topStudent}</span>
            </div>
            <div className="stats-card">
              <span className="stats-label">Top Score</span>
              <span className="stats-value">{stats.topStudentScore}%</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default DashboardStats;
