import { createUser } from "./createUser/index.js";
import { getAllUser } from "./getAllUser/index.js";
import { getUser } from "./getUser/index.js";
import { loginUser } from "./loginUser/index.js";
import { logoutUser } from "./logout/index.js";
import { pagination } from "./pagination/index.js";
import { updateUser, updateProfile } from "./updateProfile/index.js";
import { newUserRegistration } from "./validateUserData/index.js";

export const Users = {
  createUser,
  getAllUser,
  getUser,
  loginUser,
  logoutUser,
  pagination,
  updateUser,
  updateProfile,
  newUserRegistration,
};
