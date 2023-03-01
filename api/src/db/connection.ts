import mongoose, { ConnectOptions } from "mongoose";
import * as config from "../config/config.json";
export const connection = async()=> {
    console.log(config.mongooseUrl.serverUrl + "/"+config.mongooseUrl.db)
    mongoose.connect("mongodb+srv://shripatithinktanker:uHVIwxh8vqopAIXe@cluster0.ful0mlg.mongodb.net/cephelometrics",
    {useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions).then((res) => {
    console.log('Connected to Distribution API Database - Initial Connection')
  }).catch((err) => {
    console.log(
      `Initial Distribution API Database connection error occured -`,
      err
    );
  });
}