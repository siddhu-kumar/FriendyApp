import React, { useContext, useEffect } from "react";
import style from "./navbar.module.css";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import "../../css/index.css"

const Navbar = () => {
  const { auth, userDetails } = useContext(UserContext);
  useEffect(() => {}, [auth]);

  return (
    <div className={style.Navbar}>
      {auth ? (
        <>
          <div className={`${style.Logo} items`}>
            <NavLink to="/">FriendyApp</NavLink>
          </div>
          <div className="items">
            <NavLink to="/chats">Chats</NavLink>
          </div>
          <div className="items">
            <NavLink to="/received_request">Received Request</NavLink>
          </div>
          <div className="items">         
            <NavLink to="/pending_request">Sent Request</NavLink>
          </div>

          <div className="items">
            <NavLink to="/profile">{userDetails.name}</NavLink>
          </div>
        </>
      ) : (
        <>
          <div className="items">
            <NavLink to="/">LogIn</NavLink>
          </div>
          <div className="items">
            <NavLink to="/register">SignIn</NavLink>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
