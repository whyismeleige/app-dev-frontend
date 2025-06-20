import styles from "../Styles/ForgetPass.module.css";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import Iridescence from "../Utils/Iridescence";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const SERVER_URL = "http://localhost:8080/";

const sendOTP = async (email) => {
  return fetch(`${SERVER_URL}/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(email),
  }).then((data) => data.json());
};

const verifyOTP = async (credentials) => {
  return fetch(`${SERVER_URL}/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(email),
  }).then((data) => data.json());
};

const changePassword = async (password) => {
  return fetch(`${SERVER_URL}/`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(password),
  }).then((data) => data.json());
};

export default function ForgetPass() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, toggleShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [confirmPass, setConfirmPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response =
      (await stepForm) === 1
        ? sendOTP({ email })
        : stepForm === 2
        ? verifyOTP({ email, otp })
        : changePassword({ password });
        
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              iconType="mail"
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
                toggleShowPassword={toggleShowPassword}
              />
              <InputField
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm Password"
                iconType="password"
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
              />
            </>
          )}

          <div className={styles.backLogin}>
            <Link to="/" className={styles.aTag}>
              Go back to Login
            </Link>
          </div>

          <button className={styles.loginButton}>
            {formStep === 1
              ? "Send OTP"
              : formStep === 2
              ? "Verify OTP"
              : "Change Password"}
          </button>
        </form>
      </div>
    </>
  );
}

const getColorSchema = () => {
  const first = Math.ceil(Math.random() * 4);
  const second = Math.ceil(Math.random() * 4);
  const third = Math.ceil(Math.random() * 4);
  return [first, second, third];
};

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
