import NavBar from "../NavBar";
import ChatBot from "../ChatBot";
import Profile from "../Profile";
import Material from "../Material";
import ChatGPT from "../ChatGPT";
import Attendance from '../Attendance';
import styles from './index.module.css';
import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";

export default function UserHome() {
  const location = useLocation();
  const isRoot = location.pathname === '/';
  
  return (
    <>
      <Routes>
        <Route path="/" element={<><NavBar /><ChatBot /><Outlet /></>}>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="material" element={<Material />}></Route>
          <Route path="chatpage" element={<ChatGPT />}></Route>
          <Route path="attendance" element={<Attendance />}></Route>
        </Route>
      </Routes>
      {isRoot && <><ProfileButton /></>}
    </>
  );
}

const ProfileButton = (props) => {
  return (
    <div className={styles.navbar}>
      <Link to="profile" >
        <div className={styles.profileIcon}>
          <img className={styles.profileImg}src="https://i.pravatar.cc/40" alt="user" />
        </div>
      </Link>
    </div>
  )
}