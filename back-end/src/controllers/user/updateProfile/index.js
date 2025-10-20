import { User } from "../../../models/models.js";

export const updateUser = async (req, res) => {
  console.log("// update user profile");
  const userId = req.userId;
  // console.log(userId, req.body);
  try {
    const userData = await User.findOneAndUpdate(
      {
        id: userId,
      },
      req.body,
      {
        new: true,
      }
    );
    const { name, contact, email } = userData.toObject();
    const data = {
      name: name,
      contact: contact,
      email: email,
    };
    res.status(201).json(data);
  } catch (err) {
    console.log(err.errors);
    res.status(500).json({
      message: "Error updating user",
    });
  }
};

// update profile image
export const updateProfile = async (req, res) => {
  try {
    //   console.log('req',req.userId)
    const objImage = await User.findOne({
      id: req.userId,
    });
    objImage.image.data = req.file.buffer;
    objImage.image.contentType = req.file.mimetype;
    await objImage.save();
    res.status(200).json({
      message: "Hii",
    });
    return;
  } catch (err) {
    console.error("er", err);
    res.status(401).json({
      message: "Not",
    });
    return;
  }
};
