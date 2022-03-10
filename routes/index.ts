import {Express} from "express";
import {userRouter} from "./user_router";

export function buildRouter(app: Express) {
    app.use("/crashDetectorApi/user", userRouter);
}