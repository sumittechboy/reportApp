import React, { useState } from 'react';
import Papa from 'papaparse';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardStats from './components/DashboardStats';
import StudentTable from './components/StudentTable';
import ReportPage from './components/ReportPage';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentData, setStudentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classInfo, setClassInfo] = useState({
    className: '',
    teacherName: '',
    principalName: 'Aryan Gupta',
    teacherSignature: null,
    principalSignature: null
  });
  const [previewStudent, setPreviewStudent] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printData, setPrintData] = useState([]); // Array of students to print
  const [paperSize, setPaperSize] = useState('A4');

  // Derived stats
  const [classAvg, setClassAvg] = useState([]);
  const [subjectToppers, setSubjectToppers] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate that class name and teacher name are filled
    if (!classInfo.className || classInfo.className.trim() === '') {
      alert('Please enter the Class/Standard before uploading CSV');
      e.target.value = ''; // Reset file input
      return;
    }

    if (!classInfo.teacherName || classInfo.teacherName.trim() === '') {
      alert('Please enter the Class Teacher name before uploading CSV');
      e.target.value = ''; // Reset file input
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => processData(res.data)
    });
  };

  const processData = (data) => {
    if (data.length === 0) return;
    
    // Dynamically detect subjects from CSV headers
    // Exclude known non-subject columns
    const excludedColumns = ['Name', 'ID', 'Rank', 'Present', 'Absent', 'TotalScore', 'TotalMaxScore'];
    const firstRow = data[0];
    const subjects = Object.keys(firstRow).filter(key => !excludedColumns.includes(key));
    
    let processed = data.map(row => {
      // Basic validation to avoid crashes on bad lines
      if (!row['Name']) return null;

      const s = { ...row };
      s.metrics = subjects.map(name => {
        const val = String(row[name] || "0/100");
        const parts = val.split('/').map(v => parseInt(v.trim()));
        const score = parts[0] || 0;
        const max = parts.length > 1 ? (parts[1] || 100) : 100;
        return { name, score, max, p: max > 0 ? (score / max) * 100 : 0 };
      });
      s.totalP = s.TotalMaxScore > 0 ? (s.TotalScore / s.TotalMaxScore * 100).toFixed(1) : 0;

      s.PresentDays = parseInt(row.Present) || 0;
      const absentDays = parseInt(row.Absent) || 0;
      s.TotalDays = s.PresentDays + absentDays;
      s.attP = s.TotalDays > 0 ? ((s.PresentDays / s.TotalDays) * 100).toFixed(1) : 0;
      return s;
    }).filter(s => s !== null);

    // 1. Homework Rank (TotalScore)
    processed.sort((a, b) => b.TotalScore - a.TotalScore);
    processed.forEach((s, i) => s.HomeworkRank = i + 1);

    // 2. Attendance Rank (attP)
    processed.sort((a, b) => parseFloat(b.attP) - parseFloat(a.attP));
    processed.forEach((s, i) => s.AttendanceRank = i + 1);

    // Sort back by Rank for display
    processed.sort((a, b) => a.HomeworkRank - b.HomeworkRank);

    // Stats
    const averages = subjects.map(name => {
        const vals = processed.map(s => s.metrics.find(m => m.name === name).p);
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });

    const toppers = subjects.map(name => {
        const vals = processed.map(s => s.metrics.find(m => m.name === name).p);
        return vals.length ? Math.max(...vals) : 0;
    });

    setClassAvg(averages);
    setSubjectToppers(toppers);
    setStudentData(processed);
  };

  const filteredStudents = studentData.filter(s => 
    s.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewReport = (id) => {
    const s = studentData.find(x => x.ID === id);
    setPreviewStudent(s);
    document.body.classList.add('preview-mode');
  };

  const handleClosePreview = () => {
    setPreviewStudent(null);
    document.body.classList.remove('preview-mode');
  };

  const handlePrintOne = (id) => {
    const s = studentData.find(x => x.ID === id);
    setPrintData([s]);
    setIsPrinting(true);
    document.body.classList.add('printing');
    // inject print @page size based on selection
    injectPrintStyle(paperSize);
    // Using setTimeout to allow render before print
    setTimeout(() => {
        window.print();
        // Cleanup after print dialog usage
        setTimeout(() => {
             setIsPrinting(false);
             setPrintData([]);
             document.body.classList.remove('printing');
             removePrintStyle();
        }, 500);
    }, 500);
  };

  const handlePrintAll = () => {
    if (studentData.length === 0) {
        alert("No data loaded!");
        return;
    }
    setPrintData(studentData);
    setIsPrinting(true);
    document.body.classList.add('printing');
    injectPrintStyle(paperSize);
     setTimeout(() => {
        window.print();
        setTimeout(() => {
             setIsPrinting(false);
             setPrintData([]);
             document.body.classList.remove('printing');
             removePrintStyle();
        }, 500);
    }, 1000); // More time for many charts
  };

  // Inject or update a <style id="print-size"> tag to control @page size dynamically
  const injectPrintStyle = (size) => {
    try {
      const existing = document.getElementById('print-size-style');
      // Also include .report-page size tweaks for A4/A5 so layout scales well in preview and print
      // Keep printed page size as requested, and ensure the report container matches 20.5cm x 28.5cm
      const reportCss = `.report-page { width: 20.5cm !important; height: 28.5cm !important; min-height: 28.5cm !important; padding: 8mm !important; box-sizing: border-box; overflow: hidden; }`;
      const css = `@page { size: ${size} portrait; margin: 5mm; }\n${reportCss}`;
      if (existing) {
        existing.innerHTML = css;
      } else {
        const s = document.createElement('style');
        s.id = 'print-size-style';
        s.innerHTML = css;
        document.head.appendChild(s);
      }
    } catch (e) {
      // ignore for non-browser env
    }
  };

  const removePrintStyle = () => {
    try {
      const existing = document.getElementById('print-size-style');
      if (existing) existing.remove();
    } catch (e) {}
  };

  return (
    <>
      <div className="app-container" id="app">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          classInfo={classInfo}
          setClassInfo={setClassInfo}
          onFileUpload={handleFileUpload}
        />

        <main className="content">
          <TopBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onPrintAll={handlePrintAll}
            paperSize={paperSize}
            setPaperSize={setPaperSize}
          />

          {activeTab === 'dashboard' && (
            <DashboardStats 
              studentCount={studentData.length}
              studentData={studentData}
              classInfo={classInfo}
            />
          )}

          {activeTab === 'students' && (
            <StudentTable 
              students={filteredStudents}
              onView={handleViewReport}
              onPrint={handlePrintOne}
            />
          )}

        </main>
      </div>
    
      {/* Preview Overlay */}
      {previewStudent && (
          <div id="print-container">
               <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                 <button 
                    onClick={handleClosePreview}
                    style={{
                        padding: '10px 20px',
                        background: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                 >
                    Close Preview
                 </button>
               </div>
               <ReportPage 
                 student={previewStudent} 
                 classInfo={classInfo} 
                 classAvg={classAvg}
                 subjectToppers={subjectToppers}
                 paperSize={paperSize}
                 onPreparePrint={(sz) => { injectPrintStyle(sz); window.__removePrintStyle = removePrintStyle; }}
               />
          </div>
      )}

      {/* Actual Print Container (Hidden unless printing) */}
      {isPrinting && (
          <div id="print-container">
              {printData.map((s, i) => (
                  <ReportPage 
                    key={i} 
                    student={s} 
                    classInfo={classInfo}
                    classAvg={classAvg}
                    subjectToppers={subjectToppers}
              paperSize={paperSize}
              onPreparePrint={(sz) => { injectPrintStyle(sz); window.__removePrintStyle = removePrintStyle; }}
                  />
              ))}
          </div>
      )}
    </>
  );
}

export default App;
