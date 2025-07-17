import styles from "./index.module.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const semesterDocs = {
  "Semester 1": [
    { url: "https://picsum.photos/seed/sem1doc1/100/120", label: "Sem1 - Doc1" },
    { url: "https://picsum.photos/seed/sem1doc2/100/120", label: "Sem1 - Doc2" },
    { url: "https://picsum.photos/seed/sem1doc3/100/120", label: "Sem1 - Doc3" },
    { url: "https://picsum.photos/seed/sem1doc4/100/120", label: "Sem1 - Doc4" }
  ],
  "Semester 2": [
    { url: "https://picsum.photos/seed/sem2doc1/100/120", label: "Sem2 - Doc1" },
    { url: "https://picsum.photos/seed/sem2doc2/100/120", label: "Sem2 - Doc2" },
    { url: "https://picsum.photos/seed/sem2doc3/100/120", label: "Sem2 - Doc3" },
    { url: "https://picsum.photos/seed/sem2doc4/100/120", label: "Sem2 - Doc4" }
  ],
  "Semester 3": [
    { url: "https://picsum.photos/seed/sem3doc1/100/120", label: "Sem3 - Doc1" },
    { url: "https://picsum.photos/seed/sem3doc2/100/120", label: "Sem3 - Doc2" },
    { url: "https://picsum.photos/seed/sem3doc3/100/120", label: "Sem3 - Doc3" },
    { url: "https://picsum.photos/seed/sem3doc4/100/120", label: "Sem3 - Doc4" }
  ],
  "Semester 4": [
    { url: "https://picsum.photos/seed/sem4doc1/100/120", label: "Sem4 - Doc1" },
    { url: "https://picsum.photos/seed/sem4doc2/100/120", label: "Sem4 - Doc2" },
    { url: "https://picsum.photos/seed/sem4doc3/100/120", label: "Sem4 - Doc3" },
    { url: "https://picsum.photos/seed/sem4doc4/100/120", label: "Sem4 - Doc4" }
  ]
};

export default function NavBar() {
  const [hoveredSemester, setHoveredSemester] = useState(null);
  const [fullscreenSem, setFullscreenSem] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  let dropdownTimeout;

  useEffect(() => {
    document.querySelector(`.${styles.topNav}`)?.classList.add(styles.slideDown);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotifications(false);
  };

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownVisible(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 1000);
  };

  return (
    <>
      <nav className={styles.topNav}>
        <div className={styles.navLogo}>MyApp</div>

        <div className={styles.navInner}>
          <ul className={styles.navLinks}>
            <li><Link to="/home">Home</Link></li>

            <li
              className={styles.materialDropdown}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
              onClick={handleDropdownEnter}
            >
              <span>Material</span>
              <ul className={`${styles.dropdown} ${isDropdownVisible ? styles.showDropdown : ""}`}>
                {Object.keys(semesterDocs).map((sem) => (
                  <li
                    key={sem}
                    onMouseEnter={() => setHoveredSemester(sem)}
                    onMouseLeave={() => setHoveredSemester(null)}
                    onClick={() => setFullscreenSem(sem)}
                  >
                    {sem}
                  </li>
                ))}
              </ul>
            </li>

            <li><Link to="/attendance">Attendance</Link></li>
            <li><Link to="/chats">Live Chats</Link></li>
            <li><Link to="/chats">ChatGPT</Link></li>
          </ul>

          <div className={styles.navRight}>
            <div className={styles.notificationContainer}>
              <div className={styles.notificationIcon} onClick={handleNotificationClick}>
                {hasNewNotifications && <span className={styles.dot} />}
                <img
                  src="https://img.icons8.com/ios-filled/24/ffffff/appointment-reminders.png"
                  alt="Notifications"
                />
                {showNotifications && (
                  <ul className={styles.notificationDropdown}>
                    <li>You have 2 new messages</li>
                    <li>Assignment due tomorrow</li>
                    <li>Attendance report is ready</li>
                  </ul>
                )}
              </div>
            </div>

            <div className={styles.navbar}>
              <Link to="/profile">
                <div className={styles.profileIcon}>
                  <img
                    className={styles.profileImg}
                    src="https://i.pravatar.cc/40"
                    alt="user"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* {hoveredSemester && !fullscreenSem && (
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
      )}

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
        </div> */}
      )
    </>
  );
}
