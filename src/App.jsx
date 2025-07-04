import Profile from "./Components/Profile";
import Login from './Components/Login';
import ForgetPass from "./Components/ForgetPass";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState } from "react";
import UserHome from "./Components/UserHome";

export default function App() {
  const [clientToken, setClientToken] = useState(
    localStorage.getItem("clientToken")
  );
  const setToken = (token) => {
    setClientToken(token);
    localStorage.setItem("clientToken", token);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          // element={
          //   clientToken ? <UserHome /> : <Login setClientToken={setToken} />
          // }
          element={<UserHome/>}
        />
        <Route path="/forget-password" element={<ForgetPass />} />
      </Routes>
    </BrowserRouter>
  );
}
