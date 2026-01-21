import React from 'react';

const TopBar = ({ searchQuery, setSearchQuery, onPrintAll }) => {
  const handlePrint = () => {
    // For mobile devices, trigger print dialog
    window.print();
  };

  return (
    <header className="top-bar no-print">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search student..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button className="primary-btn" onClick={onPrintAll}>Bulk Print All Reports</button>
      <button className="primary-btn" onClick={handlePrint} style={{ background: '#666' }}>
        🖨️ Print Page
      </button>
    </header>
  );
};

export default TopBar;
