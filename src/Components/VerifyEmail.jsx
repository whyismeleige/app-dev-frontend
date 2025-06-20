import styles from "../Styles/verify.module.css";
import Iridescence from "../Utils/Iridescence";
import { useState } from "react";
import { useLocation } from "react-router-dom";
export  const VerifyEmail = () => {
  const [otp,setOtp] = useState("");

  const location = useLocation();
  console.log(location.state.email);

  const handleSubmit = () => {
    
  }
  return (
    <>
      <Iridescence/>
      <div className={styles.wrap}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.header}>Verify Email</h1>

          <div className={styles.inputBox}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              className={styles.input}
              required
              maxLength={6}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default VerifyEmail;
