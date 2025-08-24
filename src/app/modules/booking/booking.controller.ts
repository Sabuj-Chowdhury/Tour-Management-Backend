/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";

const createBooking = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const payload = req.body;

    const booking = await bookingService.createBooking(
      payload,
      decodedToken.userID
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  }
);

export const bookingController = {
  createBooking,
};
