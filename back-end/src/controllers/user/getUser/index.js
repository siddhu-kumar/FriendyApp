
import { User } from "../../../models/models.js";

export const getUser = async (req, res) => {
    console.log("// get user data or profile");
    try {
        const id = req.userId;
        console.log(id);
        const data = await User.findOne({
            id: id,
        });
        const { _id, friends, password, ...userData } = data.toObject();
        res.status(200).json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Data has not fetched!!",
        });
    }
};