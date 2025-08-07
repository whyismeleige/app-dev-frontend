import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminBar(props) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  let dropdownTimeout;

  useEffect(() => {
    document
      .querySelector(`.${styles.topNav}`)
      ?.classList.add(styles.slideDown);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotifications(false);
  };

  return (
    <>
      <nav className={styles.topNav}>
        <div className={styles.navLogo}>Admin</div>

        <div className={styles.navInner}>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/scraping">Web Scraping</Link>
            </li>
            <li>
              <Link to="/issues">Issues</Link>
            </li>
            <li>
              <Link to="/data-change">Modify Data</Link>
            </li>
          </ul>

          <div className={styles.navRight}>
            <div className={styles.notificationContainer}>
              <div
                className={styles.notificationIcon}
                onClick={handleNotificationClick}
              >
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

            {/*Logout button */}
            <button className={styles.logoutButton} onClick={props.logOutUser}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
