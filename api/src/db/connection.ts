import mongoose, { ConnectOptions } from "mongoose";
// import * as config from "../config/config.json";
// const path = require('path');
require("dotenv").config();
export const connection = async()=> {
    mongoose.connect(process.env.DATABASE_URL!,
    {useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions).then((res) => {
    console.log('Connected to Distribution API Database - Initial Connection', "With URL" + process.env.DATABASE_URL)
  }).catch((err) => {
    console.log(
      `Initial Distribution API Database connection error occured -`,
      err
    );
  });
}