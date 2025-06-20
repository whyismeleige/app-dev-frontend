import styles from "../Styles/Login.module.css";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import Iridescence from "../Utils/Iridescence";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";

const SERVER_URL = "http://localhost:8080/";

async function loginUser(credentials) {
  return fetch(`${SERVER_URL}api/auth/signin`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser({ email, password });
    if (response.token) {
      navigate("/verify-email", { state: {email: email }});
    }
  };
  return (
    <>
      <Iridescence />

      <div className={styles.wrap}>
        <form onSubmit={handleSubmit}>
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
            <Link to="forget-password" className={styles.aTag}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          <div className={styles.registerLink}>
            <div className={styles.googlewrapper}>
              <GoogleLogin id={styles.googleButton} />
            </div>
            <div className={styles.dontHave}>
              <p className={styles.text}>
                Don't have an account?{" "}
                <Link to="/" className={styles.aTag}>
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
