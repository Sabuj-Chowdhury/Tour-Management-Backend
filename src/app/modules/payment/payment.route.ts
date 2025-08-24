import { Router } from "express";
import { paymentController } from "./payment.controller";

export const paymentRouter = Router();

paymentRouter.post("/success", paymentController.successPayment);
paymentRouter.post("/fail", paymentController.failPayment);
paymentRouter.post("/cancel", paymentController.cancelPayment);
