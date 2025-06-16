import styles from "../Styles/Login.module.css";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";
import { terms } from "../termsandprivacy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tickBox, setTickBox] = useState(false);
  const [termsState, setTermsState] = useState(false);
  const [privacyState, setPrivacyState] = useState(false);

  const responseMessage = (response) => console.log(response);
  const errorMessage = (error) => console.log(error);

  return (
    <>
      {termsState && <TermsConditions onClose={() => setTermsState(false)} />}
      {privacyState && <PrivacyPolicy onClose={() => setPrivacyState(false)} />}
      <div className={styles.container}>
        <form className={styles.form}>
          <h1>Login Form</h1>
          <div className={styles.emailSection}>
            <span>Email</span>
            <input
              type="email"
              className={styles.textInput}
              id={styles.loginEmail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your College Email"
              required
            />
          </div>
          <div className={styles.passwordSection}>
            <span>Password</span>
            <input
              type="password"
              className={styles.textInput}
              id={styles.loginPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              required
            />
            <span>Forget Password</span>
          </div>
          <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY} required />
          <button type="submit" id={styles.loginButton}>
            Log In
          </button>
          <span>- Or -</span>
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          <div>
            <span>Don't have an account? </span>
            <span>Sign Up</span>
          </div>
        </form>
      </div>
    </>
  );
}

const TermsConditions = (props) => {
  const termMap = terms.map((term, index) => {
    return (
      <li key={index} className={styles.term}>
        {term}
      </li>
    );
  });
  return (
    <div className={styles.termsContainer}>
      <FontAwesomeIcon
        icon={faXmark}
        className={styles.xmark}
        onClick={props.onClose}
      />
      <ul className={styles.termsList}>{termMap}</ul>
    </div>
  );
};

const PrivacyPolicy = (props) => {
  const policy = ["1.All the Data will be encrype"];
  return (
    <div className={styles.termsContainer}>
      <FontAwesomeIcon icon={faXmark} className={styles.xmark} />
      <ul className={styles.termsList}></ul>
    </div>
  );
};
