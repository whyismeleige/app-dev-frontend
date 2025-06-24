import Login from './Components/Login';
import ForgetPass from "./Components/ForgetPass";
import UserHome from "./Components/UserHome";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState } from "react";

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
         path="/"
         element={
           clientToken ? <UserHome /> : <Login setClientToken={setToken} />
         }
       />
       <Route path="/forget-password" element={<ForgetPass />} />
     </Routes>
   </BrowserRouter>
  );
}
