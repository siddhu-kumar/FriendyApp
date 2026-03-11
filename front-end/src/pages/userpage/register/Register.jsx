import React, { useContext, useState } from "react";
import style from "./register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { emailValidate, validateUserData } from "../../../services/user-service";
import { UserContext } from "../../../context/userContext";
import { validation } from "../../../auth/validation";

const Register = () => {
  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidated = validation(userInput);
 

    if (isValidated.length === 0) {
      setLoading(true);
      console.log("Submitting user data:", userInput);
      await validateUserData(userInput)
        .then((data) => {
          setLoading(false);
          console.log("Response from server:", data);
          if (data.flag) {
            setUserDetails(userInput);
            console.log("Navigating to /email_sent");
            setTimeout(() => {
              navigate("/email_sent");
            }, 100);
          } else {
            console.error("Flag was false:", data);
            setData("Registration failed. Please check your details.");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("Error during registration:", err);
          if (err.response && err.response.data && !err.response.data.flag) {
            setData("Contact/Email already exists.");
          } else {
            setData("Something went wrong. Please try again.");
          }
        });
    } else {
      isValidated.forEach((element) => {
        alert(element);
      });
      return;
    }
  };

  return (
    <div className={style.Register}>
      <div>{data}</div>
      <div className={style.RegisterHead}>
        <span>FriendyApp</span>
      </div>
      <div className={style.userInput}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="text">User Name</label>
          <input
            type="text"
            placeholder="Username must be atleast 4 letter."
            name="name"
            value={userInput.name}
            onChange={handleChange}
          />
          <label htmlFor="email">User Email</label>
          <input
            type="text"
            placeholder="Someone@example.com"
            name="email"
            value={userInput.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="contact">User Contact</label>
          <input
            type="text"
            placeholder="+91 0123456789"
            name="contact"
            value={userInput.contact}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">User Password</label>
          <input
            type="password"
            placeholder="Use strong password."
            name="password"
            value={userInput.password}
            onChange={handleChange}
            required
          />
          <button className={style.RegisterBtn} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <span>
            Already have an account? <Link to="/login">Log-In here</Link> !
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
