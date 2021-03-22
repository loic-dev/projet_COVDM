import express, { Router } from "express";
import config from "../config/dev.mjs";
import httpController from './controllers/http.controller.mjs';
import { connectDatabase } from './utils/database.util.mjs';
import  bodyParser from "body-parser";



const createServer = async () => {
    const dbclient = await connectDatabase();
    const app = express();
    const router = Router();
    const port = config.dev.port;
    const urlencodedParser = bodyParser.urlencoded({extended: true});
    const jsonParser = bodyParser.json()

    app.use(urlencodedParser);
    app.listen(port, () => console.log(`Listening on port ${port}`));
    app.use(jsonParser);
    app.use("/api", router);
    httpController(router);
}

createServer();





