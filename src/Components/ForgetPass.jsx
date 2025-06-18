import styles from "../Styles/ForgetPass.module.css";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import Iridescence from "../Utils/Iridescence";
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const stableBackground = useRef(<Iridescence color={[2, 2, 1]}
    mouseReact={false}
    amplitude={0.1}
    speed={1.0} />)
  return (
    <>
      {stableBackground.current}

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
              placeholder="Password"
              className={styles.input}
              required
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
            <a href="" className={styles.aTag}>
              Go back to Login
            </a>
          </div>

          <button className={styles.loginButton} onClick={() => setShowOTP(!showOTP)}>
            Send OTP
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgetPass;
