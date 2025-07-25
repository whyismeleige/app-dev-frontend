import { Fragment, useEffect, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";

const startMonth = 5; // June
const endMonth = 9; // October
const startDate = 11;
const endDate = 15;
let gazettedHolidays;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const url = process.env.REACT_APP_SERVER_URL;

const getHolidays = async () => {
  const res = await fetch(`${url}/api/holidays`);
  const data = await res.json();
  const holidays = [];
  data.forEach((entry) => {
    if (entry.type === "Gazetted Holiday") holidays.push(entry.date);
  });
  return new Set(holidays);
};

const generateDates = (totalDays) => {
  const result = {};
  const year = new Date().getFullYear();

  for (let month = startMonth; month <= endMonth; month++) {
    let dateNum = month === startMonth ? startDate : 1;
    const date = new Date(year, month, dateNum);
    const days = [];

    while (date.getMonth() === month) {
      if (date.getDay() !== 0 && date.getDay() !== 6) totalDays.days += 1;
      if (month === endMonth && dateNum > endDate) break;
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
      dateNum++;
    }

    result[month] = days;
  }

  return result;
};

const calculateClassesRequired = (e) => {
  e.preventDefault();
  
}

export default function Attendance() {
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        gazettedHolidays = await getHolidays();
        console.log(gazettedHolidays);
      } catch (error) {
        console.error("Error Fetching Holidays Data");
      }
    };
    fetchData();
  }, []);

  const totalDays = { days: 0 };
  const datesByMonth = generateDates(totalDays);

  const handleCheckboxChange = (dateStr) => {
    setAttendance((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };

  const totalPresent = Object.values(attendance).filter(Boolean).length;
  const holidays = totalDays.days - totalPresent;

  return (
    <>
      <div className={styles.curvedBackground}></div>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileHeading}>Attendance Tracker</h1>

        <div className={styles.profileLayout}>
          {/* Days Present Card */}
          <div className={styles.attendanceCardStatBox}>
            <h3>Days Present</h3>
            <p className={styles.statValue}>{totalPresent}</p>
          </div>

          {/* Holidays Taken Card */}
          <div className={styles.gpaCardStatBox}>
            <h3>Holidays Taken</h3>
            <p className={styles.statValue}>{holidays}</p>
          </div>

          {/* Attendance Calculator Card */}
          <div className={styles.calculatorCard}>
            <h3>Attendance Calculator</h3>
            <div className={styles.calculatorContent}>
              <form onSubmit={calculateClassesRequired}>
                {days.map((day) => {
                  return (
                    <Fragment key={day}>
                      <label for={day}>{`Enter the Classes of ${day}`}</label>
                      <input type="number" name={day} required />
                      <br></br>
                    </Fragment>
                  );
                })}
                <label for="joining_date">
                  Enter your Joining Date (MM-DD-YYYY):
                </label>
                <input type="date" id="joining_date" name="joining_date" />
                <br />
                <label for="end_date">
                  Enter your end date of semester (MM-DD-YYYY):
                </label>
                <input type="date" id="end_date" name="end_date" />
                <br />
                <label for="current_attendance">
                  What is your current attendance (in %)?
                </label>
                <input
                  type="number"
                  id="current_attendance"
                  name="current_attendance"
                />
                <br />
                <label for="cutoff_required">
                  What percentage is required to write the exam?
                </label>
                <input
                  type="number"
                  id="cutoff_required"
                  name="cutoff_required"
                />
                <br />
                <button type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* Attendance Calendar Card */}
          <div className={styles.profileCard}>
            <h3>Attendance Calendar</h3>
            <div className={styles.attendanceGridWrapper}>
              {Object.entries(datesByMonth).map(([month, dates]) => {
                // Build weekly columns
                const columns = [];
                let currentColumn = new Array(7).fill(null);

                dates.forEach((date) => {
                  const day = date.getDay();
                  const dateStr = date.toLocaleDateString("en-CA");
                  currentColumn[day] = dateStr;

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
                          {column.map((dateStr, rowIdx) => {
                            if (!dateStr)
                              return (
                                <div key={rowIdx} className={styles.emptyBox} />
                              );

                            const dateObj = new Date(dateStr);
                            const isWeekend =
                              dateObj.getDay() === 0 || dateObj.getDay() === 6;

                            return (
                              <input
                                key={rowIdx}
                                type="checkbox"
                                className={clsx(styles.dayCheckbox, {
                                  [styles.weekendCheckbox]: isWeekend,
                                })}
                                checked={
                                  isWeekend
                                    ? true
                                    : attendance[dateStr] || false
                                }
                                onChange={() => {
                                  if (!isWeekend) handleCheckboxChange(dateStr);
                                }}
                                disabled={isWeekend}
                                readOnly={isWeekend}
                                data-tooltip={new Date(dateStr).toDateString()}
                              />
                            );
                          })}
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
