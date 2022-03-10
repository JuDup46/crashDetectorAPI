import express from "express";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
import { Device } from '@twilio/voice-sdk';
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

const twillio_router = express.Router();

twillio_router.get("/",async function (req, res) {
    client.calls
        .create({
            twiml: '<Response><Say>bonjour monsieur, comment vas tu ?</Say></Response>',
            to: process.env.PHONENUMBER,
            from: '+12253073611',
        })
        .then((call: { sid: any; }) => console.log(call.sid))
        .catch((reason: any) => console.log(reason));

    res.status(204).send({message: "call request OK"}).end();
});

export {
    twillio_router
}
