import { generateControllers } from "../../utils/lib/generator/index.ts";
import { Request, Response } from "express";
import User, { IUser } from "./model.ts";

const actions = generateControllers(User, "user");

actions.GetMe = async function (req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        const user = await User.findOne({ _id: (req.user as IUser)._id });
        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

actions.UpdateMe = async function (req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        const user = await User.findOne({ _id: (req.user as IUser)._id });
        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.username = req.body.username || user.username;

        const updatedUser = await user.save();
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

actions.UpdateMePassword = async function (req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        const user = await User.findOne({ _id: (req.user as IUser)._id });
        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        user.password = req.body.newPassword;
        const updatedUser = await user.save();
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export { actions };