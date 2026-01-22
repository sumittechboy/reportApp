import React from 'react';

const TopBar = ({ searchQuery, setSearchQuery, onPrintAll, paperSize, setPaperSize }) => {
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

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ fontSize: '13px', fontWeight: 700 }}>Paper:</label>
        <select
          value={paperSize}
          onChange={(e) => setPaperSize(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          <option value="A4">A4</option>
          <option value="A5">A5</option>
        </select>
        <button className="primary-btn" onClick={onPrintAll}>Bulk Print All Reports</button>
        <button className="primary-btn" onClick={handlePrint} style={{ background: '#666' }}>
          🖨️ Print Page
        </button>
      </div>
    </header>
  );
};

export default TopBar;
