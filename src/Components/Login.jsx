import styles from "../Styles/Login.module.css";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tickBox, setTickBox] = useState(false);

  const responseMessage = (response) => console.log(response);
  const errorMessage = (error) => console.log(error);

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h1>Login Form</h1>
        <input
          type="email"
          className={styles.textInput}
          id={styles.loginEmail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your College Email"
          required
        />
        <div className={styles.passwordSection}>
          <input
            type="password"
            className={styles.textInput}
            id={styles.loginPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            required
          />
        </div>
        <div className={styles.privacySection}>
          <input
            type="checkbox"
            onChange={() => setTickBox(!tickBox)}
            id={styles.tickBox}
            required
          />
          <span>We agree to the <b>Terms and Conditions</b> and <b>Privacy Policy</b>.</span>
        </div>
        <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY} required />
        <button type="submit" id={styles.loginButton}>Log In</button>
        <span>- Or -</span>
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage}  />
      </form>
    </div>
  );
}
