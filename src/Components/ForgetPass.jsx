import styles from "../Styles/ForgetPass.module.css";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import Iridescence from "../Utils/Iridescence";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

export const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  return (
    <>
      <Iridescence/>

      <div className={styles.wrap}>
        <form action="">
          <h1 className={styles.header}>Forgot password?</h1>

          { !showOTP ? 
            <div className={styles.inputBox}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className={styles.input}
              required
            />
            <IoMail className={styles.icon} />
          </div>
          :
          <div className={styles.inputBox}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="OTP"
              className={styles.input}
              required
              maxLength={6}
            />
            {!password ? (
              <RiLockPasswordFill className={styles.icon} />
            ) : showPassword ? (
              <FaEye
                className={styles.icon}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEyeSlash
                className={styles.icon}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          }

          <div className={styles.backLogin}>
            <Link to="/" className={styles.aTag}>
              Go back to Login
            </Link>
          </div>

          <button className={styles.loginButton} onClick={() => setShowOTP(!showOTP)}>
            Send OTP
          </button>
        </form>
      </div>
    </>
  );
};

const getColorSchema = () => {
  const first = Math.ceil(Math.random() * 4);
  const second = Math.ceil(Math.random() * 4);
  const third = Math.ceil(Math.random() * 4);
  return [first,second,third]; 
}

export default ForgetPass;
