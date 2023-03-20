import mongoose, { ConnectOptions } from "mongoose";
import * as config from '../config/config.json'
require("dotenv").config();
export const connection = async()=> {
    mongoose.connect(config.mongooseUrl.serverUrl,
    {useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions).then((res) => {
    console.log('Connected to Distribution API Database - Initial Connection', "With URL" + "mongodb+srv://shripati:hoSEDJk5LhJMFYgS@cephelometrics.ep8yigr.mongodb.net/?retryWrites=true&w=majority")
  }).catch((err) => {
    console.log(
      `Initial Distribution API Database connection error occured -`,
      err
    );
  });
}