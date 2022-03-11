import express from "express";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import {UserController, UserDataTwilio} from "../controllers";
import {DatabaseUtils} from "../database/database";

const twillio_router = express.Router();

twillio_router.get("/:email/:coordonnee",async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const userData = await userController.getUserTelWithEmail(req.params.email)
    console.log(userData?.firstName)
    if(userData?.firstName === null)
        res.status(406).end();
    client.calls
        .create({
            twiml: '<Response>\n' +
                `<Say voice="alice" language="fr-fr">Une de vos connaissances : ${userData!.firstName} ${userData!.lastName}, a fait une chute en scooter</Say>\n` +
                '<Play>http://demo.twilio.com/docs/classic.mp3</Play>\n' +
                '</Response>',
            to:  userData!.tel,
            from: process.env.TWILIO_PHONE_NUMBER,
        })
        .then((call: { sid: any; }) => console.log(call.sid))
        .catch((reason: any) => console.log(reason));

    client.messages.create({
        body:`Une de vos connaissances : ${userData!.firstName} ${userData!.lastName}, a fait une chute en scooter ! La position de la personnne est à cette adresse : 
https://maps.google.com/?q=${req.params.coordonnee}\nCordialement, Brum rider`, //51.03841,-114.01679
        from: process.env.TWILIO_PHONE_NUMBER,
        to:userData!.tel
    }).then((call: { sid: any; }) => console.log(call.sid))

    res.status(204).send({message: "call request OK"}).end();
});

export {
    twillio_router
}
