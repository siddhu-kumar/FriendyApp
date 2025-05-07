
import { User, RequestSchema } from "../../../models/models.js";
import { allUsers } from "../../../index.js";
import { UserSharedData } from "../../../class/usersSharedData.js";

export const createRequest = async (req, res) => {
  console.log("// create new friend");
  const { email } = req.body;
  const userId = req.userId;
  console.log(userId, email)
  try {
    const userData = await User.findOne({
      id: userId,
    });
    const friendData = await User.findOne({
      email: email,
    });

    console.log(userId, friendData);
    const request = new RequestSchema({
      userId: userId,
      name: userData.name,
      friendId: friendData.id,
      friendName: friendData.name,
    });
    allUsers[userId].sentRequestList.push(new UserSharedData(friendData.id, friendData.name, friendData.email, friendData.createdAt));
    console.log("Request made",allUsers[userId].sentRequestList);
    const r = await request.save();
    console.log('r',request, r);
    res.status(200).json({
      message: `Request has been sent to`,
    });
    sendEmail(friendData.email)
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error on saving data",
    });
  }
};

const sendEmail = async (email) => {
    try {
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const filepath = path.join(__dirname, './Email.html')
        const htmlContent = await fs.readFile(filepath, "utf-8")

        const html = htmlContent
            .replace(/{{email}}/g, email)
            .replace(/{{frontendUrl}}/g, FRONTENDRUNNINGPORT);

        const message = {
            from: "browsers.192@gmail.com",
            to: email,
            sender: "browsers@gmail.com",
            subject: "Hello",
            replyTo: "abc@gmail.com",
            text: `Hello ${email}`,
            html: html,
        }
        const mailsent = await transporter.sendMail(message);
        console.log(mailsent)
        return mailsent;
    } catch (error) {
        console.error(error)
    }
}