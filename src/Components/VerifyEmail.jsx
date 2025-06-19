import styles from "../Styles/verify.module.css";
import Iridescence from "../Utils/Iridescence";
import { useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

export  const VerifyEmail = () => {
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
          <h1 className={styles.header}>Verify Email</h1>

          <div className={styles.inputBox}>
            <input
              type="OTP"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the OTP"
              className={styles.input}
              required
              maxLength={6}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default VerifyEmail;
