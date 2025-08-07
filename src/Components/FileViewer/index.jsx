import { useEffect, useState } from "react";
import styles from "./index.module.css";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const getExtension = (filename) => filename.split(".").pop().toLowerCase();

export default function FileViewer(props) {
  const [blobURL, setBlobURL] = useState(null);
  const [loading, toggleLoading] = useState(true);
  const fileURL = props.fileURL;
  const fileName = props.fileName;

  console.log(fileURL);
  useEffect(() => {
    if (!fileURL) return;

    const fetchFile = async () => {
      const res = await fetch(`${SERVER_URL}/api/get-files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileURL, download: false }),
      });

      const disposition = res.headers.get("Content-Disposition");
      const nameMatch = disposition?.match(/filename="(.+)"/);
      const name = nameMatch?.[1] || "unknown.file";

      const type = res.headers.get("Content-Type");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      toggleLoading(false);
      setBlobURL(url);
    };
    fetchFile();
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = fileName || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.viewerWrapper}>
        <div className={styles.closeFileWrapper}>
            <button className={styles.closeFileButton} onClick={props.closeFile}>
                Close File
            </button>
        </div>
      <div className={styles.toolbar}>
        <span className={styles.fileName}>{fileName || "File Preview"}</span>
        <div className={styles.toolbarButtons}>
          <button onClick={handleDownload}>⬇ Download</button>
          <button onClick={() => window.open(blobURL, "_blank")}>↗ Open</button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading preview...</div>
      ) : (
        <div className={styles.iframeContainer}>{renderFile(fileName, blobURL)}</div>
      )}
    </div>
  );
}

const renderFile = (fileName, blobURL) => {
  const extension = getExtension(fileName);

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
    return (
      <img src={blobURL} alt={fileName} className={styles.responsiveImage} />
    );
  }

  if (["mp4", "webm", "ogg"].includes(extension)) {
    return (
      <video controls className={styles.responsiveIframe}>
        <source src={blobURL} type={`video/${extension}`} />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (["pdf"].includes(extension)) {
    return (
      <iframe
        src={blobURL}
        title={fileName}
        className={styles.responsiveIframe}
      />
    );
  }

  if (["txt", "csv"].includes(extension)) {
    return (
      <iframe
        src={blobURL}
        title={fileName}
        className={styles.responsiveIframe}
      />
    );
  }

  return (
    <div className={styles.unsupported}>
      <p>Preview not supported for this file type.</p>
      <a href={blobURL} download className={styles.downloadButton}>
        Download {fileName}
      </a>
    </div>
  );
};
