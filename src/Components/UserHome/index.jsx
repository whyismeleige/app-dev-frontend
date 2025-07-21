import NavBar from "../NavBar";
import ChatBot from "../ChatBot";
import Profile from "../Profile";
import Material from "../Material";
import ChatGPT from "../ChatGPT";
import Attendance from '../Attendance';
import styles from './index.module.css';
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

export default function UserHome() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><NavBar /><ChatBot /><Outlet /></>}>
          <Route path="profile" element={<Profile />} />
          <Route path="material" element={<Material />} />
          <Route path="chatgpt" element={<ChatGPT />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </>
  );
}
