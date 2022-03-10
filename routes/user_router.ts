import express from "express";
import {DatabaseUtils} from "../database/database";
import {UserController} from "../controllers";

const userRouter = express.Router();

userRouter.get("/", async function (req, res) {

        const connection = await DatabaseUtils.getConnection();
        const userController = new UserController(connection);
        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
        const userList = await userController.getAllUsers({
            limit,
            offset
        });
        if (userList.length !== 0) {
            res.json(userList);
            return;
        } else {
            res.status(404).send("There is no user").end();
            return;
        }
        return;
});

export {
    userRouter
}