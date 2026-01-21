import React from 'react';

const StudentTable = ({ students, onView, onPrint }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.ID}>
              <td>#{s.HomeworkRank}</td>
              <td><b>{s.Name}</b></td>
              <td>{s.totalP}%</td>
              <td>
                <button 
                  className="primary-btn" 
                  onClick={() => onView(s.ID)}
                  style={{ padding: '5px 10px', fontSize: '12px', background: '#eab308', color: 'black', marginRight: '5px' }}
                  title="View Report"
                >
                  View
                </button>
                <button 
                  className="primary-btn" 
                  onClick={() => onPrint(s.ID)}
                  style={{ padding: '5px 10px', fontSize: '12px' }}
                  title="Print Report"
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
