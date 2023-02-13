import cors from "cors";
import express, { Application } from 'express';
import app from './controller/cephelometrics';
import { connection } from "./db/connection";
const appIndex: Application = express();
connection();
appIndex.use(cors({'origin' : "*"}))
appIndex.use(express.urlencoded({limit: '50mb'}))
appIndex.use(express.json({limit: '50mb'}));

appIndex.use('/cephelometrics', app);

appIndex.listen(3000, () => {
    console.log("App Running on port 3000");
})