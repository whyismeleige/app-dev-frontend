// import {
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// const attendanceData = [
//   { name: "Present", value: 75 },
//   { name: "Absent", value: 25 },
// ];

// const COLORS = ["#9900FF", "#FF66CC"];

// const academicData = [
//   { semester: "Sem 1", GPA: 7.8 },
//   { semester: "Sem 2", GPA: 8.2 },
//   { semester: "Sem 3", GPA: 8.4 },
//   { semester: "Sem 4", GPA: 8.7 },
//   { semester: "Sem 5", GPA: 9.0 },
//   { semester: "Sem 6", GPA: 9.0 },
// ];

// export function AttendancePie() {
//   return (
//     <PieChart width={250} height={250}>
//       <Pie
//         data={attendanceData}
//         cx="50%"
//         cy="50%"
//         innerRadius={60}
//         outerRadius={90}
//         dataKey="value"
//         label
//       >
//         {attendanceData.map((entry, index) => (
//           <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//       <Legend />
//     </PieChart>
//   );
// }

// export function AcademicLine() {
//   return (
//     <LineChart width={850} height={250} data={academicData}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="semester" />
//       <YAxis domain={[0, 10]} />
//       <Tooltip />
//       <Legend />
//       <Line
//         type="monotone"
//         dataKey="GPA"
//         stroke="#9900FF"
//         strokeWidth={3}
//         dot={{ stroke: "#ffffff", strokeWidth: 2, fill: "#fff" }}
//         activeDot={{ r: 8 }}
//       />
//     </LineChart>
//   );
// }