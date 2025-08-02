import { Fragment, useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import clsx from "clsx";

const startMonth = 5; // June
const endMonth = 9; // October
const startDate = 11;
const endDate = 15;
let gazettedHolidays;

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

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

const weeksBetween = (start_date, end_date) => {
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const delta = end_date - start_date;
  return Math.floor(delta / oneWeek);
};

export default function Attendance() {
  const [attendance, setAttendance] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const resultRef = useRef(null);

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

  const calculateClassesRequired = (e) => {
    e.preventDefault();
    let total = 0;
    const formData = new FormData(e.target);
    const daysData = days.map((day) => {
      const value = parseInt(formData.get(day));
      total += value;
      return value;
    });

    const avg = total / 5;
    const joining_date = new Date(formData.get("joining_date"));
    const end_date = new Date(formData.get("end_date"));
    const current_date = new Date();

    const weeks_done = weeksBetween(joining_date, current_date);
    const weeks_left = weeksBetween(current_date, end_date);
    const today_total_classes = weeks_done * total;

    const current_attendance = parseInt(formData.get("current_attendance"));
    const cutoff_required = parseInt(formData.get("cutoff_required"));
    const current_classes_attended =
      (current_attendance / 100) * today_total_classes;

    const classes_left = weeks_left * total;
    const total_classes = today_total_classes + classes_left;
    const classes_cutoff = (cutoff_required / 100) * total_classes;
    const added_classes = current_classes_attended + classes_left;
    const max_attendance = (added_classes / total_classes) * 100;

    const canSkip = Math.floor(added_classes - classes_cutoff);
    const message = canSkip >= 0
      ? `(resulttt will be displayed here )You can skip ${canSkip} more ${canSkip === 1 ? "class" : "classes"} and still meet the cutoff.`
      : `You need to attend all upcoming classes to meet the required cutoff.`;

    setResultData({
      message,
    });

    setShowResult(true);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleGoBack = () => {
    setShowResult(false);
  };

  return (
    <>
      <div className={styles.curvedBackground}></div>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileHeading}>Attendance Tracker</h1>

        <div className={styles.profileLayout}>
          <div className={styles.attendanceCardStatBox}>
            <h3>Days Present</h3>
            <p className={styles.statValue}>{totalPresent}</p>
          </div>

          <div className={styles.gpaCardStatBox}>
            <h3>Holidays Taken</h3>
            <p className={styles.statValue}>{holidays}</p>
          </div>

          <div className={styles.calculatorCard}>
            <h3>Attendance Calculator</h3>
            <div className={styles.calculatorContent}>
              <form onSubmit={calculateClassesRequired}>
                {days.map((day) => (
                  <Fragment key={day}>
                    <label htmlFor={day}>{`Enter the Classes of ${day}`}</label>
                    <input type="number" name={day} required />
                    <br />
                  </Fragment>
                ))}
                <label htmlFor="joining_date">
                  Enter your Joining Date (MM-DD-YYYY):
                </label>
                <input type="date" id="joining_date" name="joining_date" />
                <br />
                <label htmlFor="end_date">
                  Enter your end date of semester (MM-DD-YYYY):
                </label>
                <input type="date" id="end_date" name="end_date" />
                <br />
                <label htmlFor="current_attendance">
                  What is your current attendance (in %)?
                </label>
                <input
                  type="number"
                  id="current_attendance"
                  name="current_attendance"
                />
                <br />
                <label htmlFor="cutoff_required">
                  What percentage is required to write the exam?
                </label>
                <input
                  type="number"
                  id="cutoff_required"
                  name="cutoff_required"
                />
                <br />
                {!showResult && (
                  <div className={styles.buttonWrapper}>
                    <button type="submit" className={styles.submitBtn}>
                      Submit
                    </button>
                  </div>
                )}
              </form>

              {showResult && resultData && (
                <div ref={resultRef} className={styles.resultCard}>
                  <p className={styles.resultMessage}>{resultData.message}</p>
                  <button className={styles.goBackBtn} onClick={handleGoBack}>
                    Go Back
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.profileCard}>
            <h3>Attendance Calendar</h3>
            <div className={styles.attendanceGridWrapper}>
              {Object.entries(datesByMonth).map(([month, dates]) => {
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
