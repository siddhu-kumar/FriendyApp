import React, { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import style from "./register.module.css";
import OTPValidate from "../otpValidate/OTPValidate";
import { useLocation } from "react-router-dom";

export const EmailSent = () => {
  const location = useLocation()
  const {id} = location.state || {};
    const { userDetails } = useContext(UserContext);
  return (
    <div className={style.EmailSentMessage}>
      <p>
        Hi {userDetails.name} your OTP has sent to your mail {userDetails.email}.
      </p>

      <OTPValidate id={id}/>
    </div>
  );
};
