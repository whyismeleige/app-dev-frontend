// === Attendance.jsx ===
import { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import Loader from "../../Utils/Loader";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register everything needed for bar and pie charts
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const startMonth = 5; // June
const endMonth = 9; // October
const startDate = 11;
const endDate = 15;

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

const getStudentAttendance = async (id) => {
  return fetch(`${url}/api/users/get-attendance`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(id),
  }).then((data) => data.json());
};

const generateDates = () => {
  const result = {};
  const year = new Date().getFullYear();

  for (let month = startMonth; month <= endMonth; month++) {
    let dateNum = month === startMonth ? startDate : 1;
    const date = new Date(year, month, dateNum);
    const days = [];

    while (date.getMonth() === month) {
      if (month === endMonth && dateNum > endDate) break;
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
      dateNum++;
    }
    result[month] = days;
  }

  return result;
};

const getRandomDates = (dates, count) => {
  const shuffled = [...dates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const BarChart = (props) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const data = props.data;
  const subjects = data.map((item) => item.subject);
  const percentages = data.map((item) => item.percentage);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: subjects,
        datasets: [
          {
            label: "Percentage",
            data: percentages,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className={styles.barChart}>
      <canvas ref={chartRef} />
    </div>
  );
};

// PIE CHART
const PieChart = (props) => {
  const pieRef = useRef(null);
  const pieInstanceRef = useRef(null);
  const data = props.data;
  let presentWorkingDays = 0,
    absentWorkingDays = 0;
  data.forEach((item) => {
    presentWorkingDays += item.daysPresent;
    absentWorkingDays += item.daysAbsent;
  });
  const total = presentWorkingDays + absentWorkingDays;
  const presentPercent = Math.floor((presentWorkingDays / total) * 100);
  const absentPercent = Math.floor((absentWorkingDays / total) * 100);
  useEffect(() => {
    const ctx = pieRef.current.getContext("2d");

    if (pieInstanceRef.current) {
      pieInstanceRef.current.destroy();
    }

    pieInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Present", "Absent"],
        datasets: [
          {
            label: "Attendance",
            data: [presentPercent, absentPercent],
            backgroundColor: [
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 206, 86, 0.6)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    return () => {
      pieInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className={styles.pieChart}>
      <canvas ref={pieRef} />
    </div>
  );
};

export default function Attendance() {
  // const [attendance, setAttendance] = useState({});
  const [attendanceMessage, setAttendanceMessage] = useState(null);
  const [gazettedHolidays, setGazettedHolidays] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [presentDates, setPresentDates] = useState([]);
  const [absentDates, setAbsentDates] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const datesByMonth = generateDates();
  let currentWorkingDays = 0;

  useEffect(() => {
    const fetchData = async () => {
      const { id } = JSON.parse(localStorage.getItem("userData"));
      try {
        const holidays = await getHolidays();
        setGazettedHolidays(holidays);
        let data = await getStudentAttendance({ id });
        const allDates = Object.values(datesByMonth).flat();
        let currentDate = new Date();
        setAttendanceData(data);
        let currentPresentClasses = 0;
        let currentTotalClasses = 0;

        const workingDays = allDates.filter((date) => {
          const day = date.getDay();
          const dateStr = date.toLocaleDateString("en-CA");
          const isWorkingDay = day !== 0 && day !== 6 && !holidays.has(dateStr);
          if (date <= currentDate && isWorkingDay) currentWorkingDays += 1;
          return isWorkingDay;
        });

        const currentWorkingDates = allDates.filter((date) => {
          const day = date.getDay();
          const dateStr = date.toLocaleDateString("en-CA");
          const isWorkingDay =
            day !== 0 &&
            day !== 6 &&
            date <= currentDate &&
            !holidays.has(dateStr);
          return isWorkingDay;
        });

        data.forEach((obj) => {
          currentTotalClasses += obj.workingDays;
          currentPresentClasses += obj.daysPresent;
        });

        const averageClassPerDay = Math.floor(
          currentTotalClasses / currentWorkingDays
        );
        const currentPresentDays = Math.floor(
          currentPresentClasses / averageClassPerDay
        );

        const presentDates = getRandomDates(
          currentWorkingDates,
          currentPresentDays
        );
        const presentSet = new Set(presentDates.map((d) => d.toDateString()));
        const absentDates = currentWorkingDates.filter(
          (d) => !presentSet.has(d.toDateString())
        );

        setAbsentDates(absentDates);
        setPresentDates(presentDates);
        setTotalDays(workingDays.length);
      } catch (error) {
        console.error("Error Fetching Holidays Data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // const handleCheckboxChange = (dateStr) => {
  //   setAttendance((prev) => ({
  //     ...prev,
  //     [dateStr]: !prev[dateStr],
  //   }));
  // };

  const calculateClassesRequired = () => {
    const futureHolidays = Math.floor(0.25 * totalDays) - absentDates.length;
    if (futureHolidays <= 0) return "Go to All Classes";
    else return `You can take ${futureHolidays} holidays in the Future.`;
  };

  const totalPresent = presentDates.length;
  const holidays =
    presentDates.length + absentDates.length - presentDates.length;

  if (loading) {
    return <Loader />;
  }
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

                            const isHoliday =
                              dateObj.getDay() === 0 ||
                              dateObj.getDay() === 6 ||
                              gazettedHolidays.has(dateStr);

                            const target = dateObj.toDateString();
                            const isPresent = presentDates.some(
                              (date) => date.toDateString() === target
                            );

                            return (
                              <input
                                key={rowIdx}
                                type="checkbox"
                                className={clsx(styles.dayCheckbox, {
                                  [styles.weekendCheckbox]: isHoliday,
                                  [styles.absentCheckbox]:
                                    !isPresent &&
                                    dateObj <= new Date() &&
                                    !isHoliday,
                                })}
                                checked={isPresent}
                                // onChange={() => {
                                //   if (!isHoliday) handleCheckboxChange(dateStr);
                                // }}
                                disabled={true}
                                readOnly={true}
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
            <div className={styles.calculateWrapper}>
              <span>{calculateClassesRequired()}</span>
              <button className={styles.futureButton}>
                <span className={styles.text}>See The Future</span>
                <span aria-hidden="" className={styles.marquee}>
                  Future
                </span>
              </button>
            </div>
          </div>
          <div className={styles.barChartBox}>
            <span>Subject Wise Attendance</span>
            <BarChart data={attendanceData} />
          </div>
          <div className={styles.pieChartBox}>
            <span>Pie Chart</span>
            <PieChart data={attendanceData} />
          </div>
        </div>
      </div>
    </>
  );
}
