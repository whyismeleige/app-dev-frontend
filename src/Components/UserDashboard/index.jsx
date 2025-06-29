import { AcademicLine, AttendancePie } from "../../Utils/Recharts/Recharts";
import styles from "./index.module.css";
import Iridescence from "../../Utils/Iridescence";

export default function UserDashboard() {
  return (
    <>
      <Iridescence />
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <div className={`${styles.profileInfo} ${styles.card}`}>
            User Info
          </div>

          <div className={`${styles.attendanceInfo} ${styles.card}`}>
            Attendance
            <div className={styles.chartWrapper}>
              <AttendancePie />
            </div>
          </div>
        </div>

        <div className={`${styles.academicInfo} ${styles.card}`}>
          Academic Performance
          <div className={styles.chartWrapper}>
            <AcademicLine />
          </div>
        </div>
      </div>
    </>
  );
}
