import { TempUser, User, Image } from "../../../models/models.js";
import { generateEndpoint } from "../../chat.js";
import { namespace } from "../../../index.js";
import { Namespace } from "../../../class/Namespace.js";
import { fileURLToPath } from "node:url";
import path from "node:path"
import bcrypt from "bcrypt"

const secret_key = process.env.AUTH_SECRET_KEY;


const readFile = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filepath = path.join(__dirname, "./logo192.png");
  const fileTxt = await promises.readFile(filepath, "utf-8");
  return fileTxt;
};

export const createUser = async (otp, res) => {
  console.log("// creating new user");
  try {
      const getUser = await TempUser.findOne({
          otp,
      });

      const { name, email, contact, password } = getUser.toObject();
      // console.log(req.body)
      // const doesExists = await User.findOne({contact:req.body.contact,email:req.body.email});
      // if(doesExists !== null) {
      //     res.status(409).json({message:'user already exists!'})
      //     return;
      // }
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("h", hashedPassword);
      const endPoint = await generateEndpoint(contact);
      const uuid = uuidv4();
      console.log(uuid);
      try {
          const newUser = new User({
              id: uuid,
              name: name,
              email: email,
              contact: contact,
              endpoint: endPoint,
              password: hashedPassword,
          });
          const defaultImage = new Image({
              id: uuid,
              image: {
                  data: readFile,
                  contentType: "image/png",
              },
          });
          await defaultImage.save();
          const saveUser = await newUser.save();
          console.log(saveUser);
      } catch (error) {
          console.log("ct", error);
          if (error.code === 11000) {
              if (error.keyValue.email) {
                  console.log("Email already exists");
                  res.status(400).json({
                      message: error.keyValue.email,
                      isValid: false,
                      object: "mail",
                  });
                  return;
              }
              if (error.keyValue.contact) {
                  console.log("Contact already exists");
                  res.status(400).json({
                      message: error.keyValue.contact,
                      isValid: false,
                      object: "contact",
                  });
                  return;
              }
          }
      }
      namespace[uuid] = new Namespace(uuid, name, endPoint);

      const token = jwt.sign(
          {
              userId: uuid,
          },
          secret_key,
          {
              expiresIn: "100h",
          }
      );
      const data = {
          name,
          email,
          contact,
      };

      res.status(status.CREATED).json({
          data,
          token,
      });
      const deleteTempUser = await TempUser.findOneAndDelete({
          otp: otp,
      });
      console.log(deleteTempUser);
  } catch (error) {
      console.log("c", error.errors);
      if (error.code === 11000) {
          // Extract the field that caused the duplicate key error
          const duplicateField = Object.keys(error.keyValue)[0];
          const duplicateValue = error.keyValue[duplicateField];
          console.log(
              `Duplicate key error on field: ${duplicateField} with value: ${duplicateValue}`
          );
      }
      if (error.code === 11000) {
          if (error.keyValue.email) {
              console.log("Email already exists");
              return res.status(400).json({
                  message: `Email already exists: ${error.keyValue.email}`,
              });
          }
          if (error.keyValue.contact) {
              console.log("Contact already exists");
              return res.status(400).json({
                  message: `Contact already exists: ${error.keyValue.contact}`,
              });
          }
      }
      res.status(500).json({
          message: "Sorry it's us!!",
      });
  }
};