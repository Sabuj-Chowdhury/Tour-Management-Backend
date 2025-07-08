import express, { Request, Response } from "express";

import cors from "cors";
import { router } from "./app/routes";
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

export default app;
