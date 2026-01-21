import React, { useMemo } from 'react';
import { Chart } from "react-google-charts";

const ReportPage = ({ student, classInfo, classAvg, subjectToppers }) => {
  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

    const chartData = useMemo(() => {
        const sData = student.metrics.map(m => m.p);
        const labels = student.metrics.map(m => {
            // Create abbreviated labels for chart (max 4 chars)
            const name = m.name.toUpperCase();
            return name.length > 4 ? name.substring(0, 4) : name;
        });
        
        const data = [['Subject', 'Student', 'Class Avg', 'Sub. Topper']];
        for (let i = 0; i < labels.length; i++) {
            data.push([
                labels[i], 
                sData[i] || 0, 
                (classAvg && classAvg[i]) || 0, 
                (subjectToppers && subjectToppers[i]) || 0
            ]);
        }
        return data;
    }, [student, classAvg, subjectToppers]);

    const chartOptions = {
        hAxis: { minValue: 0, maxValue: 100 },
        vAxis: { 
            minValue: 0, 
            maxValue: 100,
            ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        },
        legend: { position: 'bottom' },
        colors: ['#333333', '#777777', '#AAAAAA'],
        chartArea: { width: '80%', height: '75%' }
    };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className="primary-btn no-print"
        onClick={handlePrint}
        style={{
          position: 'sticky',
          top: '10px',
          right: '10px',
          zIndex: '10',
          float: 'right',
          marginBottom: '10px'
        }}
      >
        🖨️ Print
      </button>
      <div className="report-page">
      <div className="report-header">
        <img 
            src="/logo.png" 
            className="header-logo" 
            style={{ filter: 'grayscale(100%)' }} 
            alt="Logo"
            onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=Logo'}
        />
        <div className="school-info">
          <h1>THE PRESIDENT</h1>
          <p style={{ fontStyle: 'italic', fontSize: '12px', marginBottom: '2px', marginTop: '-2px' }}>
            "A Premier CBSE School"
          </p>
          <p className="address">Daniyari, Kushinagar, Uttar Pradesh (274403)</p>
          <p style={{ fontSize: '11px' }}>Affiliation No: 2134234 | Contact: +91 91202 54484</p>
          <p className="report-name">Yearly Homework and Attendance Report</p>
        </div>
        <div className="session-info">
          <p>Session: 2025-26</p>
          <p>Term: Final</p>
        </div>
      </div>

      <div className="student-info-grid">
        <div className="info-item">
          <strong>Student Name</strong>
          <span>{student.Name ? student.Name.toUpperCase() : ''}</span>
        </div>
        <div className="info-item">
          <strong>Class</strong>
          <span>{classInfo.className.toUpperCase()}</span>
        </div>
        <div className="info-item">
          <strong>H.W. Rank</strong>
          <span>#{student.HomeworkRank}</span>
        </div>
        <div className="info-item">
          <strong>Att. Rank</strong>
          <span>#{student.AttendanceRank}</span>
        </div>
        <div className="info-item">
          <strong>Attendance</strong>
          <span style={{ fontSize: '12px', fontWeight: 700 }}>
            {student.PresentDays}/{student.TotalDays} ({student.attP}%)
          </span>
        </div>
      </div>

      <div className="content-grid">
        <div className="left-col">
          <table className="marks-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '40%' }}>Subject</th>
                <th>Score</th>
                <th>Max</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {student.metrics.map((m) => (
                <tr key={m.name}>
                  <td style={{ textAlign: 'left', fontWeight: 600 }}>{m.name.toUpperCase()}</td>
                  <td>{m.score}</td>
                  <td>{m.max}</td>
                  <td>{m.p.toFixed(0)}%</td>
                </tr>
              ))}
              <tr style={{ background: '#f9f9f9', fontWeight: 900, borderTop: '2px solid #000' }}>
                <td style={{ textAlign: 'left' }}>GRAND TOTAL</td>
                <td>{student.TotalScore}</td>
                <td>{student.TotalMaxScore}</td>
                <td>{student.totalP}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="right-col">
          <div className="chart-wrapper">
            <h4 style={{ textAlign: 'center', marginTop: 0, marginBottom: '10px', textTransform: 'uppercase', fontSize: '13px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                Performance Analysis
            </h4>
            <div style={{ width: '100%' }}>
               <Chart
                  chartType="ColumnChart"
                  width="100%"
                  height="300px"
                  data={chartData}
                  options={chartOptions}
               />
            </div>
          </div>
        </div>
      </div>

      <div className="signatures">
        <div className="sig-box">
          <div style={{ minHeight: '45px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            {classInfo.teacherSignature && (
              <img 
                src={classInfo.teacherSignature} 
                alt="Teacher Signature" 
                style={{ 
                  maxWidth: '120px', 
                  maxHeight: '40px'
                }} 
              />
            )}
          </div>
          <div className="sig-line">
            {classInfo.teacherName}
            <br />
            Class Teacher
          </div>
        </div>
        <div className="sig-box">
          <div style={{ minHeight: '45px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            {classInfo.principalSignature && (
              <img 
                src={classInfo.principalSignature} 
                alt="Principal Signature" 
                style={{ 
                  maxWidth: '120px', 
                  maxHeight: '40px'
                }} 
              />
            )}
          </div>
          <div className="sig-line">
            {classInfo.principalName}
            <br />
            Principal
          </div>
        </div>
        <div className="sig-box">
          <div style={{ minHeight: '45px' }}>
            {/* Space for manual signature */}
          </div>
          <div className="sig-line">
            Parent / Guardian
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '5mm', left: 0, width: '100%', textAlign: 'center', fontSize: '10px', color: '#666', fontWeight: '600' }}>
        Registration Open for New Session (Nursery to Class 11th) | Contact: +91 91202 54484 | www.thepresidents.in
      </div>
    </div>
    </div>
  );
};

export default ReportPage;
