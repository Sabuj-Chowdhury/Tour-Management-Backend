import { Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { paymentService } from "./payment.service";
import { envVariable } from "../../config/env";

const successPayment = tryCatch(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.successPayment(
    query as Record<string, string>
  );
  if (result.success) {
    res.redirect(
      `${envVariable.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=success&message=${result.message}`
    );
  }
});

export const paymentController = {
  successPayment,
};
