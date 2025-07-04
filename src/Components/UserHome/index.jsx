import NavBar from "../NavBar";
import ChatBot from "../ChatBot";
import Profile from "../Profile";
import Materials from "../Materials";
import ChatGPT from "../ChatGPT";
import { Routes, Route } from "react-router-dom";
export default function UserHome() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><NavBar/><ChatBot/></>}>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="materials" element={<Materials />}></Route>
          <Route path="chatpage" element={<ChatGPT />}></Route>
        </Route>
      </Routes>
      <NavBar />
      <ChatBot />
    </>
  );
}
