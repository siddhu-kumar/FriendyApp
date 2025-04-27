import React, { useContext, useEffect } from "react";
import style from "./navbar.module.css";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

const Navbar = () => {
  const { auth, userDetails } = useContext(UserContext);
  useEffect(() => {}, [auth]);

  return (
    <div className={style.Navbar}>
      {auth ? (
        <>
          <div className={`${style.Logo} ${style.items}`}>
            <NavLink to="/">FriendyApp</NavLink>
          </div>
          <div className={style.items}>
            <NavLink to="/chats">Chats</NavLink>
          </div>
          <div className={style.items}>
            <NavLink to="/received_request">Received Request</NavLink>
          </div>
          <div className={style.items}>
            <NavLink to="/pending_request">Sent Request</NavLink>
          </div>

          <div className={style.items}>
            <NavLink to="/profile">{userDetails.name}</NavLink>
          </div>
        </>
      ) : (
        <>
          <div className={style.items}>
            <NavLink to="/">LogIn</NavLink>
          </div>
          <div className={style.items}>
            <NavLink to="/register">SignIn</NavLink>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
