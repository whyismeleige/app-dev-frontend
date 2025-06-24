import styles from './index.module.css';

export default function Profile() {
  const user = {
    Name: 'Bobby Anthene',
    Email: '121423408057@josephscollege.ac.in',
    Rollno: '121423408057',
    avatar: '/avatar.png', // Update this to a real image path
    Department: 'Management',
    Attendance: '75%',
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <img
          src={user.avatar}
          alt="User Avatar"
          className={styles.profileAvatar}
        />
        <h2 className={styles.profileName}>{user.Name}</h2>
        <p className={styles.profileRollno}>{user.Rollno}</p>
        <p className={styles.profileEmail}>{user.Email}</p>
        <p className={styles.profileDepartment}>{user.Department}</p>
        <p className={styles.profileAttendance}>{user.Attendance}</p>
      </div>
    </div>
  );
}
