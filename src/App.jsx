import Login from "./Components/Login";
import ForgetPass from "./Components/ForgetPass";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState } from "react";
import UserHome from "./Components/UserHome";

export default function App() {
  const [clientToken, setClientToken] = useState(
    localStorage.getItem("clientToken")
  );

  const setUserData = (data) =>
    localStorage.setItem("userData", JSON.stringify(data));

  const setUserId = (data) =>
    localStorage.setItem("userServerData", JSON.stringify(data));

  const logOutUser = () => {
    setClientToken(null);
    localStorage.removeItem("clientToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userServerData");
  };

  const setToken = (token) => {
    setClientToken(token);
    localStorage.setItem("clientToken", token);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            clientToken ? (
              <UserHome logOutUser={logOutUser} />
            ) : (
              <Login
                setUserId={setUserId}
                setClientToken={setToken}
                setUserData={setUserData}
              />
            )
          }
        />
        <Route path="/forget-password" element={<ForgetPass />} />
      </Routes>
    </BrowserRouter>
  );
}
