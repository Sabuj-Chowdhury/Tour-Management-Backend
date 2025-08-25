import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVariable } from "./app/config/env";

const app = express();

// middleware
app.use(
  expressSession({
    secret: envVariable.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

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
