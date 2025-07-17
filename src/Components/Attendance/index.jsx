import React, { useState } from "react";
import styles from "./index.module.css";

const startMonth = 5; // June
const endMonth = 10;  // November

const generateDates = () => {
  const result = {};
  const year = new Date().getFullYear();

  for (let month = startMonth; month <= endMonth; month++) {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    result[month] = days;
  }

  return result;
};

export default function Attendance() {
  const [attendance, setAttendance] = useState({});
  const datesByMonth = generateDates();

  const handleCheckboxChange = (dateStr) => {
    setAttendance((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };

  const totalPresent = Object.values(attendance).filter(Boolean).length;
  const totalDays = Object.values(datesByMonth).flat().length;
  const holidays = totalDays - totalPresent;

  return (
    <>
      <div className={styles.curvedBackground}></div>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileHeading}>Attendance Tracker</h1>

        <div className={styles.profileLayout}>
          {/* Stat Card 1 */}
          <div className={styles.attendanceCardStatBox}>
            <h3>Days Present</h3>
            <p className={styles.statValue}>{totalPresent}</p>
          </div>

          {/* Stat Card 2 */}
          <div className={styles.gpaCardStatBox}>
            <h3>Holidays</h3>
            <p className={styles.statValue}>{holidays}</p>
          </div>

          {/* Calendar Card */}
          <div className={styles.profileCard}>
            <h3>Attendance Calendar</h3>

            <div className={styles.attendanceGridWrapper}>
              {Object.entries(datesByMonth).map(([month, dates]) => {
                // Build weekly columns
                const columns = [];
                let currentColumn = new Array(7).fill(null);

                dates.forEach((date) => {
                  const day = date.getDay(); // Sunday = 0 ... Saturday = 6
                  const dateStr = date.toISOString().split("T")[0];

                  currentColumn[day] = dateStr;

                  // If day is Saturday or end of month, push the column
                  if (day === 6 || date === dates[dates.length - 1]) {
                    columns.push(currentColumn);
                    currentColumn = new Array(7).fill(null);
                  }
                });

                return (
                  <div key={month} className={styles.monthBlock}>
                    <div className={styles.monthLabel}>
                      {new Date(2024, month).toLocaleString("default", {
                        month: "long",
                      })}
                    </div>

                    <div className={styles.weekColumns}>
                      {columns.map((column, colIdx) => (
                        <div key={colIdx} className={styles.weekColumn}>
                          {column.map((dateStr, rowIdx) =>
                            dateStr ? (
                              <input
                                key={rowIdx}
                                type="checkbox"
                                className={styles.dayCheckbox}
                                checked={attendance[dateStr] || false}
                                onChange={() => handleCheckboxChange(dateStr)}
                              />
                            ) : (
                              <div
                                key={rowIdx}
                                className={styles.emptyBox}
                              />
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
