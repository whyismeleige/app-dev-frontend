import styles from "../Styles/Login.module.css";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import Iridescence from "../Utils/Iridescence";
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const stableBackground = useRef(<Iridescence color={[1, 1, 1]}
    mouseReact={false}
    amplitude={0.1}
    speed={1.0} />)
  return (
    <>
      {stableBackground.current}

      <div className={styles.wrap}>
        <form action="">
          <h1 className={styles.header}>Login</h1>

          <div className={styles.inputBox}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              className={styles.input}
              required
            />
            <FaUserAlt className={styles.icon} />
          </div>

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

          <div className={styles.rememberForgot}>
            <a href="#" className={styles.aTag}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          <div className={styles.registerLink}>
            <div className={styles.googleWrapper}>
              <GoogleLogin id={styles.googleButton} />
            </div>
            <div className={styles.dontHave}>
              <p className={styles.text}>
                Don't have an account?{" "}
                <a href="#" className={styles.aTag}>
                  Register now
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
