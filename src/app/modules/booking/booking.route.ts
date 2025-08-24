import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookingZodSchema,
  updateBookingStatusZodSchema,
} from "./booking.validation";
import { bookingController } from "./booking.controller";

export const bookingRouter = Router();

// api/v1/booking
bookingRouter.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  bookingController.createBooking
);

// api/v1/booking/my-bookings
bookingRouter.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  bookingController.getUserBookings
);

// api/v1/booking/bookingId
bookingRouter.get(
  "/:bookingID",
  checkAuth(...Object.values(Role)),
  bookingController.getBookingById
);

// api/v1/booking/bookingId
bookingRouter.patch(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingStatusZodSchema),
  bookingController.updateBookingStatus
);

// api/v1/booking
bookingRouter.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getAllBookings
);
