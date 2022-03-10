import express from "express";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import {UserController} from "../controllers";
import {DatabaseUtils} from "../database/database";

const twillio_router = express.Router();

twillio_router.get("/:email",async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    client.calls
        .create({
            twiml: '<Response><Say>bonjour monsieur, comment vas tu ?</Say></Response>',
            to: await userController.getUserTelWithEmail(req.params.email) as string,
            from: '+12253073611',
        })
        .then((call: { sid: any; }) => console.log(call.sid))
        .catch((reason: any) => console.log(reason));

    res.status(204).send({message: "call request OK"}).end();
});

export {
    twillio_router
}
