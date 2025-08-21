import httpStatus from "http-status-codes";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { getTransactionId } from "../../utils/getTransactionId";
import { Tour } from "../tour/tour.model";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const user = await User.findById(userId);

  //   if user don't have phone or address than can't make booking

  if (!user?.phone || !user?.address) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Update Your Profile to Book a Tour."
    );
  }

  //   find the tour from Db and calculate booking cost
  const tour = await Tour.findById(payload.tour).select("costFrom");

  if (!tour?.costFrom) {
    throw new AppError(httpStatus.BAD_REQUEST, "No tour cost Found!");
  }

  //   calculate booking cost
  const amount = Number(tour.costFrom) * Number(payload.guestCount);

  //   create Booking into DB
  const booking = await Booking.create({
    ...payload,
    user: userId,
    status: BOOKING_STATUS.PENDING,
  });

  //   create payment for the above booking into DB
  const payment = await Payment.create({
    booking: booking._id,
    status: PAYMENT_STATUS.UNPAID,
    transactionId: transactionId,
    amount: amount,
  });

  //   then update booking with the payment ID
  const updateBooking = await Booking.findByIdAndUpdate(
    booking._id,
    { payment: payment._id },
    { new: true, runValidators: true }
  );

  //   lastly return the updated booking
  return updateBooking;
};

export const bookingService = {
  createBooking,
};
