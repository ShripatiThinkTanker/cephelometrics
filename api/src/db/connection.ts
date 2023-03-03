import mongoose, { ConnectOptions } from "mongoose";

require("dotenv").config();
export const connection = async()=> {
    mongoose.connect("mongodb+srv://shripati:hoSEDJk5LhJMFYgS@cephelometrics.ep8yigr.mongodb.net/?retryWrites=true&w=majority",
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