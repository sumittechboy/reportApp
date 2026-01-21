import React from 'react';

const TopBar = ({ searchQuery, setSearchQuery, onPrintAll }) => {
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
    </header>
  );
};

export default TopBar;
