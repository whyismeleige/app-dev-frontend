import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NavBar(props) {
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

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownVisible(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 1000);
  };

  const { avatar } = JSON.parse(localStorage.getItem("userServerData"));

  return (
    <>
      <nav className={styles.topNav}>
        <div className={styles.navLogo}>MyApp</div>

        <div className={styles.navInner}>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/material">Materials</Link>
            </li>

            <li>
              <Link to="/attendance">Attendance</Link>
            </li>
            <li>
              <Link to="/chats">Live Chats</Link>
            </li>
            <li>
              <Link to="/chatgpt">ChatGPT</Link>
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
                    src={avatar}
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
