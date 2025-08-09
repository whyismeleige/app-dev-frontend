import styles from "./index.module.css";

export default function Profile() {
  const userDataJSON = localStorage.getItem("userData");
  const user = JSON.parse(userDataJSON);
  console.log(user);

  const { avatar } = JSON.parse(localStorage.getItem("userServerData"));

  return (
    <>
      <div className={styles.curvedBackground}></div>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileHeading}>Profile</h1>

        <div className={styles.profileLayout}>
          <div className={styles.profileCard}>
            <div className={styles.profilePicWrapper}>
              <img className={styles.profilePic} src={avatar} alt="Profile" />
            </div>

            <div className={styles.profileInfo}>
              <h2>{user.name}</h2>
              <p>Roll No: {user.roll}</p>
              <p>Email: {user.email}</p>
              <p>Department: {user.dept}</p>
              <p>Specialization: {user.specialization}</p>
              <p>Current Semester: {user.current_sem}</p>

              <button className={styles.editButton}>Edit Profile</button>
            </div>
          </div>

          <div className={styles.attendanceCardStatBox}>
            <h3>Attendance</h3>
            <img
              className={styles.attendence}
              src={"https://i.ibb.co/rJyrT3r/Screenshot-2025-07-16-210118.png"}
              alt="Graph"
            />
            <p>{user.attendance}</p>
          </div>

          <div className={styles.gpaCardStatBox}>
            <h3>GPA</h3>
            <p>{user.gpa}</p>
            <img
              className={styles.gpa}
              src={"https://i.ibb.co/KpRHBXMR/Screenshot-2025-07-16-211415.png"}
              alt="Graph"
            />
          </div>
        </div>
      </div>
    </>
  );
}
