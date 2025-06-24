import styles from "./index.module.css";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import Iridescence from "../../Utils/Iridescence";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../Utils/Loader";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const loginUser = async (credentials) => {
  return fetch(`${SERVER_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

const verifyOtp = async (credentials) => {
  return fetch(`${SERVER_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

export const LoginForm = (props) => {
  const [hallTicketNo, setHallTicketNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, toggleShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = `${hallTicketNo}@josephscollege.ac.in`;
    const response =
      formStep === 1
        ? await loginUser({ email, password })
        : await verifyOtp({ email, otp });
    console.log(response);
    setLoading(false);
    if (response.error) return;
    if (response.token) {
      props.setClientToken(response.token);
      return;
    }
    setFormStep((prevStep) => prevStep + 1);
  };
  return (
    <>
      <Iridescence />

      <div className={styles.wrap}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.header}>
            {formStep === 1 ? "Login" : "Verify OTP"}
          </h1>
          {formStep === 1 && (
            <>
              <InputField
                type="text"
                value={hallTicketNo}
                onChange={(e) => setHallTicketNo(e.target.value)}
                placeholder="Enter Hall Ticket No"
                iconType="mail"
                maxLength="12"
              />
              <InputField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                iconType="password"
                showPassword={showPassword}
                toggleShowPassword={() => toggleShowPassword(!showPassword)}
              />
            </>
          )}
          {formStep === 2 && (
            <InputField
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              iconType="password"
            />
          )}

          <div className={styles.rememberForgot}>
            {formStep === 1 ? (
              <Link to="forget-password" className={styles.aTag}>
                Forgot password?
              </Link>
            ) : (
              <Link
                to="/"
                onClick={() => setFormStep(1)}
                className={styles.aTag}
              >
                Go back to Login
              </Link>
            )}
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading ? true : false}
          >
            {loading ? <Loader /> : formStep === 1 ? "Login" : "Verify OTP"}
          </button>

          {formStep === 1 && (
            <div className={styles.registerLink}>
              {/* <div className={styles.googlewrapper}>
                <GoogleLogin
                  id={styles.googleButton}
                  onSuccess={loginGmail}
                  onError={() => console.log("Login Failed")}
                />
              </div> */}
              <div className={styles.dontHave}>
                <p className={styles.text}>
                  Don't have an account?{" "}
                  <Link to="/" className={styles.aTag}>
                    Register now
                  </Link>
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default LoginForm;

const InputField = (props) => {
  return (
    <div className={styles.inputBox}>
      <input
        type={
          props.showPassword !== undefined
            ? props.showPassword
              ? "text"
              : "password"
            : props.type
        }
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        className={styles.input}
        maxLength={props.maxLength || undefined}
        required
      />
      {!props.value ? (
        props.iconType === "mail" ? (
          <IoMail className={styles.icon} />
        ) : (
          <RiLockPasswordFill className={styles.icon} />
        )
      ) : props.showPassword !== undefined ? (
        props.showPassword ? (
          <FaEye className={styles.icon} onClick={props.toggleShowPassword} />
        ) : (
          <FaEyeSlash
            className={styles.icon}
            onClick={props.toggleShowPassword}
          />
        )
      ) : null}
    </div>
  );
};
