import { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// Subject icons
const subjectIcons = {
  "Functional English and Basic Computer Skills":
    "https://img.icons8.com/fluency/48/book.png",
  PMOB: "https://img.icons8.com/fluency/48/management.png",
  "Fundamentals of Business Economics":
    "https://img.icons8.com/fluency/48/economics.png",
  "Elements of Information Technology":
    "https://img.icons8.com/fluency/48/computer.png",
  "Programming with C": "https://img.icons8.com/fluency/48/c-programming.png",
  "Environmental Studies": "https://img.icons8.com/fluency/48/earth.png",
  "Principles of Marketing": "https://img.icons8.com/fluency/48/marketing.png",
  "Fundamentals of Accounting":
    "https://img.icons8.com/fluency/48/accounting.png",
  "Spreadsheets for Business Decisions":
    "https://img.icons8.com/fluency/48/spreadsheet.png",
  "Python Programming": "https://img.icons8.com/fluency/48/python.png",
  "Principles of Human Resource Management":
    "https://img.icons8.com/fluency/48/hr.png",
  "Legal Aspects of Business": "https://img.icons8.com/fluency/48/law.png",
  "Cost and Management Accounting":
    "https://img.icons8.com/fluency/48/cost-accounting.png",
  "Business Statistics Using SPSS":
    "https://img.icons8.com/fluency/48/statistics.png",
  "Database Management Systems":
    "https://img.icons8.com/fluency/48/database.png",
  UHVGS: "https://img.icons8.com/fluency/48/ethics.png",
  "Data Analytics": "https://img.icons8.com/fluency/48/analytics.png",
  "Research Methodology": "https://img.icons8.com/fluency/48/research.png",
  "Web Development": "https://img.icons8.com/fluency/48/html-5.png",
  Cybersecurity: "https://img.icons8.com/fluency/48/security-checked.png",
  "Cloud Computing": "https://img.icons8.com/fluency/48/cloud.png",
  "Digital Marketing": "https://img.icons8.com/fluency/48/seo.png",
  "Power BI": "https://img.icons8.com/fluency/48/business-intelligence.png",
  Finance: "https://img.icons8.com/fluency/48/finance.png",
  HR: "https://img.icons8.com/fluency/48/hr.png",
  Marketing: "https://img.icons8.com/fluency/48/marketing.png",
  "Entrepreneurship Development":
    "https://img.icons8.com/fluency/48/startup.png",
  "E-Commerce": "https://img.icons8.com/fluency/48/online-store.png",
  "Advanced Excel": "https://img.icons8.com/fluency/48/excel.png",
  "Startup Management":
    "https://img.icons8.com/fluency/48/entrepreneurship.png",
  "AI in Business":
    "https://img.icons8.com/fluency/48/artificial-intelligence.png",
};

// const subjectsBySemester = {
//   "Semester 1": [
//     "Functional English and Basic Computer Skills",
//     "Principles of Management and Organisation (PMOB)",
//     "Fundamentals of Business Economics",
//     "Elements of Information Technology",
//     "Programming with C",
//   ],
//   "Semester 2": [
//     "Environmental Studies",
//     "Functional English",
//     "Principles of Marketing",
//     "Fundamentals of Accounting",
//     "Spreadsheets for Business Decisions",
//     "Python Programming",
//   ],
//   "Semester 3": [
//     "Principles of Human Resource Management",
//     "Legal Aspects of Business",
//     "Cost and Management Accounting",
//     "Business Statistics Using SPSS",
//     "Database Management Systems",
//     "UHVGS",
//   ],
//   "Semester 4": [
//     "Data Analytics",
//     "Research Methodology",
//     "Web Development",
//     "Cybersecurity",
//     "Cloud Computing",
//   ],
//   "Semester 5": ["Digital Marketing", "Power BI", "Finance", "HR", "Marketing"],
//   "Semester 6": [
//     "Entrepreneurship Development",
//     "E-Commerce",
//     "Advanced Excel",
//     "Startup Management",
//     "AI in Business",
//   ],
// };

const materialsData = {
  "Digital Marketing": [
    "SEO Tips.pdf",
    "Content Strategy.pptx",
    "Campaign Report.docx",
  ],
  "Power BI": ["BI Dashboard.pptx", "Power BI Notes.pdf", "Data Models.xlsx"],
  Finance: [
    "Finance Notes.pdf",
    "Equity Analysis.pptx",
    "Budget Planning.docx",
    "Fin Elective 1.pdf",
    "Fin Elective 2.pptx",
    "Fin Elective 3.xlsx",
  ],
  HR: [
    "HR Notes.pdf",
    "Employee Engagement.pptx",
    "Recruitment Guide.docx",
    "HR Elective 1.pdf",
    "HR Elective 2.pptx",
    "HR Elective 3.xlsx",
  ],
  Marketing: [
    "Marketing Notes.pdf",
    "Brand Strategy.pptx",
    "Consumer Behaviour.docx",
    "Mkt Elective 1.pdf",
    "Mkt Elective 2.pptx",
    "Mkt Elective 3.xlsx",
  ],
  "Data Analytics": ["DA Intro.pdf", "Case Study.pptx"],
  "Research Methodology": ["ResearchDesign.docx", "SurveyData.xlsx"],
  "Web Development": ["HTML CSS Guide.pdf", "React Guide.docx"],
  Cybersecurity: ["Security Concepts.pdf", "Threat Report.pptx"],
  "Cloud Computing": ["AWS Overview.pdf"],
  "Entrepreneurship Development": [
    "StartupGuide.pdf",
    "BusinessModelCanvas.pptx",
  ],
  "E-Commerce": ["EcomTrends.pdf", "EcommerceLaw.docx"],
  "Advanced Excel": ["PivotTables.xlsx", "MacrosGuide.pdf"],
  "Startup Management": ["VentureCapital.docx", "PitchDeck.pptx"],
  "AI in Business": ["AIUseCases.pdf", "AIBusinessStrategy.pptx"],
  "Principles of Management and Organisation (PMOB)": [],
  "Fundamentals of Business Economics": [],
  "Elements of Information Technology": [],
  "Programming with C": [],
  "Environmental Studies": [],
  "Functional English": [],
  "Principles of Marketing": [],
  "Fundamentals of Accounting": [],
  "Spreadsheets for Business Decisions": [],
  "Python Programming": [],
  "Principles of Human Resource Management": [],
  "Legal Aspects of Business": [],
  "Cost and Management Accounting": [],
  "Business Statistics Using SPSS": [],
  "Database Management Systems": [],
  UHVGS: [],
};

const getSemesterData = async (credentials) => {
  return fetch(`${SERVER_URL}/api/users/get-semesters`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

export default function Materials() {
  const [previewFile, setPreviewFile] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterList, setSemesterList] = useState([]);
  const [subjectsBySemester, setSubjectsBySemester] = useState({});  const previewTimeout = useRef(null);

  const handleBack = () => {
    if (selectedSubject) setSelectedSubject(null);
    else if (selectedSemester) setSelectedSemester(null);
  };
  const studentDataJSON = localStorage.getItem("userData");
  const {dept,specialization,year} = JSON.parse(studentDataJSON);
  
  useEffect(() => {
    const SemesterData = async () => {
      const semesterData = await getSemesterData(
        {
          dept,
          specialization,
          year
        }
      );
      console.log(semesterData);
      setSemesterList(Object.keys(semesterData[0].data));
      setSubjectsBySemester(semesterData[0].data);
    };

    SemesterData();
  }, []);

  const view = selectedSubject
    ? "materials"
    : selectedSemester
    ? "subjects"
    : "semesterList";

  const list =
    view === "semesterList"
      ? semesterList.filter((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : view === "subjects"
      ? (subjectsBySemester[selectedSemester] || []).filter((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : (materialsData[selectedSubject] || []).filter((f) =>
          f.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className={styles.fullScreen}>
        <div className={styles.curvedBackground}></div>

      <h2 className={styles.heading}>
        {view === "semesterList" && "Materials"}
        {view === "subjects" && selectedSemester}
        {view === "materials" && selectedSubject}
      </h2>

      {(selectedSemester || selectedSubject) && (
        <button className={styles.backButton} onClick={handleBack}>
          ← Back
        </button>
      )}

      <div className={styles.searchBar}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          className={styles.grid}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
        >
          {list.length === 0 && (
            <p className={styles.noResults}>No items found</p>
          )}

          {/* SEMESTERS */}
          {view === "semesterList" &&
            list.map((sem) => (
              <div
                key={sem}
                className={styles.card}
                onClick={() => {
                  setSelectedSemester(sem);
                  setSearchTerm("");
                }}
              >
                <img
                  src="https://img.icons8.com/fluency/48/folder-invoices.png"
                  className={styles.folderIcon}
                  alt=""
                />
                <p className={styles.fileName}>{sem}</p>
              </div>
            ))}

          {/* SUBJECTS */}
          {view === "subjects" &&
            list.map((subj) => (
              <div
                key={subj}
                className={styles.card}
                onClick={() => {
                  setSelectedSubject(subj);
                  setSearchTerm("");
                }}
              >
                <img
                  src={
                    subjectIcons[subj] ||
                    "https://img.icons8.com/fluency/48/file.png"
                  }
                  className={styles.folderIcon}
                  alt=""
                />
                <p className={styles.fileName}>{subj}</p>
              </div>
            ))}

          {view === "materials" &&
            list.map((file, idx) => {
              const isHovered = hoveredButton === idx;

              return (
                <div key={idx} style={{ position: "relative" }}>
                  <div className={styles.card} title={file}>
                    <img
                      src={getIcon(file)}
                      className={styles.fileIcon}
                      alt="file"
                    />
                    <p className={styles.fileName}>{file}</p>

                    <div className={styles.actions}>
                      <div
                        className={styles.previewWrapper}
                        onMouseEnter={() => {
                          clearTimeout(previewTimeout.current);
                          setHoveredButton(idx);
                          setPreviewFile(file);
                        }}
                        onMouseLeave={() => {
                          previewTimeout.current = setTimeout(() => {
                            setHoveredButton(null);
                            setPreviewFile(null);
                          }, 300);
                        }}
                      >
                        <button className={styles.btn}>Preview</button>
                      </div>

                      <button className={styles.btn}>Download</button>
                    </div>
                  </div>

                  {isHovered && (
                    <div
                      className={styles.previewTooltip}
                      onMouseEnter={() => clearTimeout(previewTimeout.current)}
                      onMouseLeave={() => {
                        previewTimeout.current = setTimeout(() => {
                          setHoveredButton(null);
                          setPreviewFile(null);
                        }, 300);
                      }}
                    >
                      <img
                        src="https://via.placeholder.com/160x100.png?text=File+Preview"
                        alt="Preview"
                        className={styles.previewImage}
                      />
                      <span className={styles.previewText}>
                        Preview of {file}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function getIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (ext === "xlsx") return "https://img.icons8.com/color/48/excel.png";
  if (ext === "pdf") return "https://img.icons8.com/fluency/48/pdf.png";
  if (ext === "pptx")
    return "https://img.icons8.com/color/48/microsoft-powerpoint-2019--v1.png";
  if (ext === "docx") return "https://img.icons8.com/color/48/word.png";
  if (ext === "zip") return "https://img.icons8.com/color/48/zip.png";
  if (["png", "jpg", "jpeg"].includes(ext))
    return "https://img.icons8.com/color/48/image.png";
  return "https://img.icons8.com/ios-filled/48/file.png";
}
