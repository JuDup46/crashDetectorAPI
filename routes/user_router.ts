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
});


userRouter.delete("/:iduser",async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
console.log(req.params.iduser);
    if (!req.params.iduser) {
        res.status(400).send({state: "Bad id"}).end();
    }

    await userController.deleteUserById(req.params.iduser as string);
    res.status(204).send({state: "user deleted"}).end();
});

/**
 * Récupération d'un utilisateur selon son email
 * URL :
 * Requête : GET
 */
userRouter.get("/email", async function (req, res) {

    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const email = req.body.email;
    if (email === undefined || email === "") {
        res.status(400).send('User email is missing');
        return;
    }
    const user = await userController.getUserByEmail(email);
    if (user === null) {
        res.status(404).send("This user doesn't exist");
        return;
    } else {
        res.json(user);
        return;
    }
    return;
});

userRouter.get("/connexion", async function (req, res) {

    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const email = req.body.email;
    const idscooter = req.body.idscooter;
    if (email === undefined || email === "" || idscooter === undefined || idscooter === "") {
        res.status(400).send('User email or idscooter is missing');
        return;
    }
    const user = await userController.getUserByEmailAndidScooter(email,idscooter);
    if (user === null) {
        res.status(404).send("This user doesn't exist");
        return;
    } else {
        res.json(user);
        return;
    }
    return;
});

/**
 * Inscription d'un user
 * URL :
 * Requete : POST
 */
userRouter.post("/createUser", async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const tel = req.body.tel;
    const idgoogle = req.body.idgoogle;
    const idscooter = req.body.idscooter;

    if (nom === undefined || prenom === undefined || email === undefined || tel === undefined || idgoogle === undefined || idscooter === undefined) {
        res.status(400).send("All information must be provided").end();
        return;
    }

    const user = await userController.createUser(
        nom,
        prenom,
        email,
        tel,
        idgoogle,
        idscooter
    );
    if (user === null) {
        res.status(400).end();
        return;
    } else {
        res.status(201).send(user);
        return;
    }

});

export {
    userRouter
}
