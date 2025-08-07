import { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import FileViewer from "../FileViewer";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const getSemesterData = async (credentials) => {
  console.log("Fetching");
  return fetch(`${SERVER_URL}/api/users/get-semesters`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

const getMaterialsData = async (subject) => {
  return fetch(`${SERVER_URL}/api/materials`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(subject),
  }).then((data) => data.json());
};

export default function Materials() {
  // const [previewFile, setPreviewFile] = useState(null);
  // const [hoveredButton, setHoveredButton] = useState(null);

  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterList, setSemesterList] = useState([]);
  const [subjectsBySemester, setSubjectsBySemester] = useState({});
  const [materials, setMaterials] = useState([]);
  const [pdfurls, setPdfurls] = useState({});
  const [currentFile, setCurrentFile] = useState(null);

  const previewTimeout = useRef(null);

  const handleBack = () => {
    if (selectedSubject) setSelectedSubject(null);
    else if (selectedSemester) setSelectedSemester(null);
    setMaterials([]);
    setPdfurls({});
    setCurrentFile(null);
  };

  const studentDataJSON = localStorage.getItem("userData");
  const { dept, specialization, year } = JSON.parse(studentDataJSON);

  useEffect(() => {
    const SemesterData = async () => {
      const semesterData = await getSemesterData({
        dept,
        specialization,
        year,
      });
      console.log(semesterData);
      setSemesterList(Object.keys(semesterData[0].data));
      setSubjectsBySemester(semesterData[0].data);
    };

    SemesterData();
  }, []);

  const getMaterials = async (subject) => {
    const materialsData = await getMaterialsData({ subject });
    if (materialsData.message) return;
    setMaterials(
      materialsData.units.map((obj) => {
        return obj.fileName;
      })
    );
    setPdfurls(
      materialsData.units.reduce((acc, f) => {
        acc[f.fileName] = f.pdfUrl;
        return acc;
      }, {})
    );
  };

  const viewFile = (fileURL, fileName) => {
    const obj = {
      fileName: fileName,
      fileURL: fileURL,
    };
    setCurrentFile(obj);
  };

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
      : (materials || []).filter((f) =>
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
                  getMaterials(subj);
                  setSelectedSubject(subj);
                  setSearchTerm("");
                }}
              >
                <img
                  src={"https://img.icons8.com/fluency/48/file.png"}
                  className={styles.folderIcon}
                  alt=""
                />
                <p className={styles.fileName}>{subj}</p>
              </div>
            ))}

          {view === "materials" &&
            list.map((file, idx) => {
              // const isHovered = hoveredButton === idx;

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
                        // onMouseEnter={() => {
                        //   clearTimeout(previewTimeout.current);
                        //   setHoveredButton(idx);
                        //   setPreviewFile(file);
                        // }}
                        // onMouseLeave={() => {
                        //   previewTimeout.current = setTimeout(() => {
                        //     setHoveredButton(null);
                        //     setPreviewFile(null);
                        //   }, 300);
                        // }}
                      >
                        <button
                          className={styles.btn}
                          onClick={() => viewFile(pdfurls[file], file)}
                        >
                          View
                        </button>
                      </div>

                      <button className={styles.btn}>Download</button>
                    </div>
                  </div>

                  {/* {isHovered && (
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
                  )} */}
                </div>
              );
            })}
        </motion.div>
      </AnimatePresence>
      {currentFile && (
        <FileViewer
          fileURL={currentFile.fileURL}
          fileName={currentFile.fileName}
          closeFile={() => setCurrentFile(null)}
        />
      )}
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
