import React, { useContext } from "react";
import { UserContext } from "../../../context/userContext";

export const EmailSent = () => {
    const {userDetails} = useContext(UserContext)
    return <div>
        <p>Your OTP has sent to your {userDetails.email}.</p>
        <p>Verify OTP.</p>
    </div>;
};
