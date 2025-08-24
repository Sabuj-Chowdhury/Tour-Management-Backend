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
      `${envVariable.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`
    );
  }
});

const cancelPayment = tryCatch(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.cancelPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVariable.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`
    );
  }
});

const failPayment = tryCatch(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.failPayment(
    query as Record<string, string>
  );
  if (!result.success) {
    res.redirect(
      `${envVariable.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`
    );
  }
});

export const paymentController = {
  successPayment,
  cancelPayment,
  failPayment,
};
