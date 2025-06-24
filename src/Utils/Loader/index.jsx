import styles from "./index.module.css";

export default function Loader() {
  return (
    <svg viewBox="25 25 50 50" className={styles.svg}>
      <circle className={styles.circle} r="20" cy="50" cx="50"></circle>
    </svg>
  );
}
