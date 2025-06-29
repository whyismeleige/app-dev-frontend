// import Profile from "./Components/Profile";
// import Login from './Components/Login';
// import ForgetPass from "./Components/ForgetPass";
// import UserHome from "./Components/UserHome";
// import { Routes, Route, BrowserRouter } from "react-router-dom";
// import { useState } from "react";
// import UserDashboard from "./Components/UserDashboard";
import ChatBot from "./Components/ChatBot"

export default function App() {
  // const [clientToken, setClientToken] = useState(
  //   localStorage.getItem("clientToken")
  // );
  // const setToken = (token) => {
  //   setClientToken(token);
  //   localStorage.setItem("clientToken", token);
  // };

  return (
    <ChatBot/>
    // <UserDashboard/>
    // <Profile />
    // <BrowserRouter>
    //   <Routes>
    //     <Route
    //       path="/"
    //       element={
    //         clientToken ? <UserHome /> : <Login setClientToken={setToken} />
    //       }
    //     />
    //     <Route path="/forget-password" element={<ForgetPass />} />
    //   </Routes>
    // </BrowserRouter>
  );
}
