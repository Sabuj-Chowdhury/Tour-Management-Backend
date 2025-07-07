import { Server } from "http";
import mongoose from "mongoose";
import { envVariable } from "./app/config/env";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVariable.DB_URL);
    console.log("Connected to MongoDB!");

    server = app.listen(envVariable.PORT, () => {
      console.log(`Server is running at ${envVariable.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();

/* 
unhandled rejection error --->example
Promise.reject(new Error(`I forgot to handle this promise!`));
*/

// unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled rejection detected..Server shutting down.....`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

/**
 * uncaught exception error EXAMPLE
 * throw new Error(`I forgot to handle this local error!`);
 */

// uncaught exception error
process.on("uncaughtException", (err) => {
  console.log(`Uncaught exception detected ... Server shutting down ....`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
