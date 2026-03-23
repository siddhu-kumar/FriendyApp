import crypto from "crypto";
import { totp } from "otplib";
import { User, TempUser } from "../../../models/models.js";
import { sendEmail } from "../../userValidation/user_validate.js";
import { pubClient } from "../../../redis/clusterredis.js";

export const validateUserData = async (req, res) => {
  console.log("does user data exissts");
  try {
    const { name, email, contact, password } = req.body;
    const doesExists = await User.findOne({
      $or: [
        {
          contact: req.body.contact,
        },
        {
          email: req.body.email,
        },
      ],
    });
    // const {contact, email } = doesExists.toObject();
    console.log("is", doesExists);
    if (doesExists === null) {
      // flag = true, it allows to create new user
      const hash = crypto.createHash("sha256");
      hash.update(email + Math.random() * 100);
      const sskey = hash.digest("hex");
      totp.options = {
        step: 1000,
      };
      const otp = totp.generate(sskey);
      //   console.log(otp);
      
      const tempId = Math.ceil( Math.random()*1000000)
      const tempUserObj = {
        tempId: tempId,
        name: name,
        email: email,
        contact: contact,
        sskey: sskey,
        otp: otp,
        password: password,
      }

      const res1 = await pubClient.multi().call('JSON.SET', `TempUser-${email}`, '$', JSON.stringify(tempUserObj)).expire(`TempUser-${email}`, 300).exec();
      console.log('Temp user saved in redis - ', res1 )
      const tempUser = new TempUser({
        name: name,
        email: email,
        contact: contact,
        sskey: sskey,
        otp: tempId,
        password: password,
      });
      
      await tempUser.save();
      await sendEmail(email, otp, tempId);
      res.status(200).json({
        message: "doesNotExists",
        flag: true,
      });

      return;
    }
		// flag = false, it dose not allow to create new user
    res.status(400).json({
      message: "doesExists",
      flag: false,
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
