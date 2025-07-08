import express, { Request, Response } from "express";
import { userRouter } from "./app/modules/user/user.route";
import cors from "cors";
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to tour management system!",
  });
});

export default app;
