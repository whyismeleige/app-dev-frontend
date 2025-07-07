import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useState } from 'react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  }
  return (
    <>
      <button onClick={toggleNav} className={styles.toggleBtn}>
        {isOpen ? "Close" : "Menu"}
      </button>

      <nav className={`${styles.topNav} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.navLogo}>MyApp</div>
        <ul className={styles.navLinks}>
          <li className={styles.navLinksLine}>
            <Link to="profile" className={styles.navLinksAnchor}>Profile</Link>
          </li>
          <li className={styles.navLinksLine}>
            <Link to="dashboard" className={styles.navLinksAnchor}>Dashboard</Link>
          </li>
          <li className={styles.materialDropdown}>
            <Link to="material" className={styles.navLinksAnchor}>Material</Link>
          </li>
          <li className={styles.navLinksLine}>
            <Link to="attendance" className={styles.navLinksAnchor}>Attendance</Link>
          </li>
        </ul>
      </nav>

      {/* Preview on hover
            {hoveredSemester && !fullscreenSem && (
                <div className={styles.semPreview}>
                    <h4>{hoveredSemester} Materials</h4>
                    <div className={styles.thumbGrid}>
                        {semesterDocs[hoveredSemester].map((doc, i) => (
                            <div key={i} className={styles.thumbItem}>
                                <img src={doc.url} alt={doc.label} />
                                <small>{doc.label}</small>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

      {/* Fullscreen on click
            {fullscreenSem && (
                <div className={styles.materialFullscreen} onClick={() => setFullscreenSem(null)}>
                    <h3>{fullscreenSem}</h3>
                    <div className={styles.thumbGrid}>
                        {semesterDocs[fullscreenSem].map((doc, i) => (
                            <div key={i} className={styles.thumbItem}>
                                <img src={doc.url.replace("/100/120", "/300/400")} alt={doc.label} />
                                <small>{doc.label}</small>
                            </div>
                        ))}
                    </div>
                    <small>Click anywhere to close</small>
                </div>
            )} */}
    </>
  );
}
