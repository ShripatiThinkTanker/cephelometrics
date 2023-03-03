import mongoose, { ConnectOptions } from "mongoose";

require("dotenv").config();
export const connection = async()=> {
    mongoose.connect("mongodb://admin:password@176.32.81.54:27017?authMechanism=DEFAULT",
    {useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions).then((res) => {
    console.log('Connected to Distribution API Database - Initial Connection', "With URL" + "mongodb://admin:password@176.32.81.54:27017?authMechanism=DEFAULT")
  }).catch((err) => {
    console.log(
      `Initial Distribution API Database connection error occured -`,
      err
    );
  });
}