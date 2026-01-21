import React, { useState } from 'react';

const Sidebar = ({ activeTab, setActiveTab, classInfo, setClassInfo, onFileUpload }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? '✕' : '☰'}
      </button>
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>
      <aside className={`sidebar no-print ${sidebarOpen ? 'active' : ''}`}>
      <div className="logo">
        <img src="/logo.png" alt="Logo" onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=Logo'} />
        <div className="logo-text">The President School</div>
      </div>

      <div className="input-group">
        <label>Class / Standard</label>
        <input 
          type="text" 
          placeholder="e.g. Class 10-A" 
          value={classInfo.className}
          onChange={(e) => setClassInfo({ ...classInfo, className: e.target.value })}
        />
      </div>
      <div className="input-group">
        <label>Class Teacher</label>
        <input 
          type="text" 
          placeholder="e.g. Mrs. Sharma" 
          value={classInfo.teacherName}
          onChange={(e) => setClassInfo({ ...classInfo, teacherName: e.target.value })}
        />
      </div>

      <div className="input-group">
        <label>Principal Name</label>
        <input 
          type="text" 
          placeholder="e.g. Dr. Aryan Gupta" 
          value={classInfo.principalName}
          onChange={(e) => setClassInfo({ ...classInfo, principalName: e.target.value })}
        />
      </div>

      <div className="input-group">
        <label>Teacher Signature</label>
        <input 
          type="file" 
          id="teacher-signature"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setClassInfo({ ...classInfo, teacherSignature: event.target.result });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <label htmlFor="teacher-signature" style={{ 
          cursor: 'pointer', 
          padding: '8px 12px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'block',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          {classInfo.teacherSignature ? '✓ Uploaded' : 'Upload Image'}
        </label>
      </div>

      <div className="input-group">
        <label>Principal Signature</label>
        <input 
          type="file" 
          id="principal-signature"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setClassInfo({ ...classInfo, principalSignature: event.target.result });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <label htmlFor="principal-signature" style={{ 
          cursor: 'pointer', 
          padding: '8px 12px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'block',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          {classInfo.principalSignature ? '✓ Uploaded' : 'Upload Image'}
        </label>
      </div>

      <ul className="nav-links">
        <li 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => {
            setActiveTab('dashboard');
            closeSidebar();
          }}
        >
          Dashboard
        </li>
        <li 
          className={activeTab === 'students' ? 'active' : ''}
          onClick={() => {
            setActiveTab('students');
            closeSidebar();
          }}
        >
          Student List
        </li>
      </ul>

      <div className="upload-section">
        <label htmlFor="csv-upload" className="upload-btn">
          <span>Upload CSV</span>
          <input 
            type="file" 
            id="csv-upload" 
            accept=".csv" 
            hidden 
            onChange={onFileUpload}
          />
        </label>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
