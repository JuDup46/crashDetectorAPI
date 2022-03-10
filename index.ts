import {config} from "dotenv";
config();
import {buildRouter} from "./routes";
import express, {Express} from "express";
import bodyParser from "body-parser";

const app: Express = express();

app.use(bodyParser.json());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//création des routes utilisables par l'application
buildRouter(app);

const port = process.env.PORT || 3003;
app.listen(port, function () {
    console.log(`Listening on ${port}...`);
});