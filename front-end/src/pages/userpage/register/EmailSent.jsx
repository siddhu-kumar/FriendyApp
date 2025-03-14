import React, { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import style from "./register.module.css"
import { Link } from "react-router-dom";

export const EmailSent = () => {
    const {userDetails} = useContext(UserContext)
    return <div className={style.EmailSentMessage}>
        <p>Hi {userDetails.name} your OTP has sent to your {userDetails.email}.</p>
        <Link to="/otp-validate">Verify OTP.</Link>
    </div>;
};
