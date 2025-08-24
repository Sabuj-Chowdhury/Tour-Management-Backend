/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";

const createBooking = tryCatch(async (req: Request, res: Response) => {
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
});

const getUserBookings = tryCatch(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  const userBookings = await bookingService.getUserBookings(user.userID);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: userBookings.userBookings,
  });
});

const getBookingById = tryCatch(async (req: Request, res: Response) => {
  const bookingID = req.params.bookingID;

  const booking = await bookingService.getBookingById(bookingID);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: booking.booking,
  });
});

const updateBookingStatus = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.bookingId;
  const payload = req.body;

  const updated = await bookingService.updateBookingStatus(id, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking Status Updated Successfully",
    data: updated,
  });
});

const getAllBookings = tryCatch(async (req: Request, res: Response) => {
  const query = req.query;
  const bookings = await bookingService.getAllBookings(
    query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: bookings.data,
    meta: bookings.meta,
  });
});

export const bookingController = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
