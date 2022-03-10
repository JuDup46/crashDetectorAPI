import express from "express";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import {UserController, UserDataTwilio} from "../controllers";
import {DatabaseUtils} from "../database/database";

const twillio_router = express.Router();

twillio_router.get("/:email",async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const userData = await userController.getUserTelWithEmail(req.params.email)
    client.calls
        .create({
            twiml: '<Response>\n' +
                `<Say voice="alice" language="fr-fr">Merci ${userData!.firstName} ${userData!.lastName}, votre demande a été traité !</Say>\n` +
                '<Play>http://demo.twilio.com/docs/classic.mp3</Play>\n' +
                '</Response>',
            to:  userData!.tel,
            from: '+12253073611',
        })
        .then((call: { sid: any; }) => console.log(call.sid))
        .catch((reason: any) => console.log(reason));

    client.messages.create({
        body:`Merci ${userData!.firstName} ${userData!.lastName}, votre demande a été traité !`,
        from:"+12253073611",
        to:userData!.tel
    }).then((call: { sid: any; }) => console.log(call.sid))

    res.status(204).send({message: "call request OK"}).end();
});

export {
    twillio_router
}
