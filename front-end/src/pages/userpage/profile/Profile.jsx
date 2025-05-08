import React, { useContext, useEffect, useState } from "react";
import style from "./profile.module.css";
import { doLogout, editStorage, isLoggedIn } from "../../../auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { editProfile } from "../../../services/user-service";
import { privateAxios } from "../../../services/helper";
const Profile = () => {
  const navigate = useNavigate();
  const { setAuth, userDetails, setUserDetails, setUserList } =
    useContext(UserContext);
  const [btn, setBtn] = useState(true);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(userDetails);

  const handleClick = () => {
    setBtn(!btn);
    if (!btn) {
      if (user === userDetails) {
        // console.log('nothing changed')
      } else {
        editProfile(user)
          .then((data) => {
            setUser({ ...user, ...data });
            editStorage(user);
          })
          .catch((err) => {
            if (err.response.status === 401) {
              doLogout();
              setAuth(isLoggedIn);
              navigate("/login");
            }
            console.log(err);
          });
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFile = async (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    const fileData = e.target.files[0];
    console.log(fileData);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(fileData.type)) {
      console.log("true");

      var reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1]; // Get the base64 data
        setFile(reader.result);
        const data = JSON.parse(localStorage.getItem("data"));
        data.data.image.contentType = fileData.type; // Use the actual file type
        data.data.image.data = base64Data; // Update with the new base64 data
        localStorage.setItem("data", JSON.stringify(data));
      };
      reader.readAsDataURL(fileData);
      const formData = new FormData();
      formData.append("imageFile", fileData);
      console.log(formData);
    
      privateAxios
        .patch("/user/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data); // Handle successful upload response
        })
        .catch((error) => {
          console.error(error); // Handle upload errors
        });
    } else {
      console.log("false");
      alert("Kindly select an image.");
    }
  };

  useEffect(() => {
    const image = localStorage.getItem("data");
    const parsedImage = JSON.parse(image);
    console.log('working',parsedImage)
    if (parsedImage.data.image) {
      console.log(parsedImage.data.image.contentType)
      setFile(  
        `data:${parsedImage.data.image.contentType};base64,${parsedImage.data.image.data}`
      );
    }
  }, []);

  // console.log(JSON.parse(localStorage.getItem("data")).imageObj)


  const handleLogout = (e) => {
    e.preventDefault();
    doLogout();
    setUserList("");
    setUserDetails("");
    setAuth(isLoggedIn);
    navigate("/login");
  };

  return (
    <div className={style.Profile}>
      <div className={style.ProfileHead}>
        {btn ? "Profile" : "Edit Profile"}
      </div>
      <div className={style.ProfilePicture}>
        {file ? <img src={file} alt="" /> : <img src="./logo192.png" alt="" />}
        {!btn ? (
          <div>
            <input
              type="file"
              name="file"
              className={style.ImgBtn}
              onChange={handleFile}
            />
            {/* <label for="file" className={style.file_label}>Add profile</label> */}
          </div>
        ) : (
          ""
        )}
      </div>
      <button className={style.logout} onClick={handleLogout}>
        Log Out
      </button>
      {btn ? (
        <>
          <div className={style.userInfo}>{user.name}</div>
          <div className={style.userInfo}>{user.email}</div>
          <div className={style.userInfo}>{user.contact}</div>
        </>
      ) : (
        <form className={style.EditProfile} onSubmit={handleClick}>
          <label htmlFor="text">Your Username</label>
          <input
            type="text"
            value={user.name}
            name="name"
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Your Email</label>
          <input
            type="text"
            value={user.email}
            name="email"
            onChange={handleChange}
            required
          />
          <label htmlFor="text">Your Contact</label>
          <input
            type="text"
            value={user.contact}
            name="contact"
            onChange={handleChange}
            required
          />
        </form>
      )}
      <button
        className={`${style.userInfo} ${style.ProfileBtn}`}
        type="submit"
        onClick={handleClick}
      >
        {btn ? "Edit" : "Save"}
      </button>
    </div>
  );
};

export default Profile;
