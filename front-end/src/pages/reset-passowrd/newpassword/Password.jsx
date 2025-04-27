import React, { useState } from "react";
import style from "./password.module.css";
import { userPasswordReset } from "../../../services/reset-password";
import { useNavigate } from "react-router-dom";

function Password() {
  const navigate = useNavigate();
  const [password, setPassword] = useState({
    password: "",
    email: localStorage.getItem("email"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(password);
    userPasswordReset(password)
      .then((data) => {
        console.log(data);
        localStorage.removeItem("email");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className={style.Passsword}>
      <span>Verify Your Password</span>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Enter Password</label>
        <input
          type="text"
          placeholder=""
          name="password"
          value={password.password}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Password;
