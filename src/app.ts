import express, { Request, Response } from "express";

import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to tour management system!",
  });
});

// global error Handler
app.use(globalErrorHandler);

// NOT found
app.use(notFound);

export default app;
