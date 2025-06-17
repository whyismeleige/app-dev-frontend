import styles from "../Styles/Login.module.css";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import Iridescence from "../Utils/Iridescence";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />

      <div className={styles.wrap}>
        <form action="">
          <h1 className={styles.header}>Login</h1>

          <div className={styles.inputBox}>
            <input
              type="text"
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
            <label className={styles.checkBoxLabel}>
              <input type="checkbox" className={styles.checkBox} />
              Remember me
            </label>
            <a href="#" className={styles.aTag}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          <div className={styles.registerLink}>
            <p className={styles.text}>
              Don't have an account?{" "}
              <a href="#" className={styles.aTag}>
                Register now
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
