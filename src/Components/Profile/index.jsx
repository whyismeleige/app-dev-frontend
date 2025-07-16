import styles from "./index.module.css";

export default function Profile() {
  const user = {
    name: "K Vyshnavi",
    roll: "121423408008",
    email: "121423408008@josephscollege.ac.in",
    dept: "BBA-IT",
    semester: "5th",
    // attendance: "99%",
    gpa: "9.11",
  };

  return (
    <>
      <div className={styles.curvedBackground}></div>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileHeading}>Student Profile</h1>

        <div className={styles.profileLayout}>
          <div className={styles.profileCard}>
            <div className={styles.profilePicWrapper}>
              <img
                className={styles.profilePic}
                src={'https://i.pravatar.cc/40'}
                alt="Profile"
              />
            </div>

            <div className={styles.profileInfo}>
              <h2>{user.name}</h2>
              <p>Roll No: {user.roll}</p>
              <p>Email: {user.email}</p>
              <p>Department: {user.dept}</p>
              <p>Semester: {user.semester}</p>
            </div>
          </div>

          <div className={styles.attendanceCardStatBox}>
            <h3>Attendance</h3>
            <img
                className={styles.attendence}
                src={'https://i.ibb.co/rJyrT3r/Screenshot-2025-07-16-210118.png'}
                alt="Graph"
              />
            <p>{user.attendance}</p>
          </div>

          <div className={styles.gpaCardStatBox}>
            <h3>GPA</h3>
            <p>{user.gpa}</p>
            <img
                className={styles.gpa}
                src={'https://i.ibb.co/KpRHBXMR/Screenshot-2025-07-16-211415.png'}
                alt="Graph"
              />
          </div>
        </div>

        <div className={styles.profileActions}>
          <button>Edit Profile</button>
        </div>
      </div>
    </>
  );
}
