import styles from './index.module.css';

export default function NavBar() {

    return (
        <>
            <nav className={styles.topNav}>
                <div className={styles.navLogo}>MyApp</div>
                <ul className={styles.navLinks}>
                    <li className={styles.navLinksLine}><a className={styles.navLinksAnchor}>Profile</a></li>
                    <li className={styles.navLinksLine}><a className={styles.navLinksAnchor}>Dashboard</a></li>
                    <li className={styles.materialDropdown}>
                        <span className={styles.navLinksSpan}>Material</span>

                    </li>
                    <li className={styles.navLinksLine}><a className={styles.navLinksAnchor}>Attendance</a></li>
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
};
