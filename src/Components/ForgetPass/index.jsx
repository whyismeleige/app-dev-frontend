import styles from "./index.module.css";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import Iridescence from "../../Utils/Iridescence"
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Utils/Loader"

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const sendOTP = async (email) => {
  return fetch(`${SERVER_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(email),
  }).then((data) => data.json());
};

const verifyOTP = async (credentials) => {
  return fetch(`${SERVER_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

const changePassword = async (credentials, token) => {
  return fetch(`${SERVER_URL}/api/auth/change-password`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

export default function ForgetPass() {
  const [hallTicketNo, setHallTicketNo] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, toggleShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [confirmPass, setConfirmPass] = useState("");
  const [token, setToken] = useState();
  const [loading, toggleLoading] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toggleLoading(true);
    if (formStep === 3 && confirmPass !== password) return;
    const email = `${hallTicketNo}@josephscollege.ac.in`;
    const response =
      formStep === 1
        ? await sendOTP({ email })
        : formStep === 2
        ? await verifyOTP({ email, otp })
        : await changePassword({ email, password }, token);
    toggleLoading(false);
    if (response.error) return;
    if (response.token) setToken(response.token);
    if (formStep === 3) {
      navigate("/");
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
            {formStep === 1
              ? "Forgot password?"
              : formStep === 2
              ? "Verify OTP"
              : "Change Passoword"}
          </h1>
          {formStep === 1 && (
            <InputField
              type="text"
              value={hallTicketNo}
              onChange={(e) => setHallTicketNo(e.target.value)}
              placeholder="Enter Hall Ticket No"
              iconType="mail"
              maxLength="12"
            />
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
          {formStep === 3 && (
            <>
              <InputField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                iconType="password"
                showPassword={showPassword}
                toggleShowPassword={() => toggleShowPassword(!showPassword)}
              />
              <InputField
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm Password"
                iconType="password"
                showPassword={showPassword}
                toggleShowPassword={() => toggleShowPassword(!showPassword)}
              />
            </>
          )}

          <div className={styles.backLogin}>
            <Link to="/" className={styles.aTag}>
              Go back to Login
            </Link>
          </div>

          <button
            className={styles.loginButton}
            disabled={loading ? true : false}
          >
            {loading ? (
              <Loader />
            ) : formStep === 1 ? (
              "Send OTP"
            ) : formStep === 2 ? (
              "Verify OTP"
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

// const getColorSchema = () => {
//   const first = Math.ceil(Math.random() * 4);
//   const second = Math.ceil(Math.random() * 4);
//   const third = Math.ceil(Math.random() * 4);
//   return [first, second, third];
// };

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
