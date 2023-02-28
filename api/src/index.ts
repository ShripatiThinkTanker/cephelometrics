import cors from "cors";
import express, { Application } from 'express';
import app from './controller/cephelometrics';
import { connection } from "./db/connection";

const path = require('path');
require("dotenv").config();
const appIndex: Application = express();
connection();
appIndex.use(cors({'origin' : "*"}))
appIndex.use(express.urlencoded({limit: '50mb'}))
appIndex.use(express.json({limit: '50mb'}));

appIndex.use('/cephelometrics', app);
if (process.env.ENVIRONMENT == 'Production') {

  appIndex.use(express.static(path.join(__dirname, '../../dist')));

  appIndex.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

appIndex.listen(5000, () => {
  console.log('App Running on port 5000');
});