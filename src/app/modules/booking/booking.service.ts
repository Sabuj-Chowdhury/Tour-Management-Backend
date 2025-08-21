/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { getTransactionId } from "../../utils/getTransactionId";
import { Tour } from "../tour/tour.model";

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  // start session -> virtual session in DB
  const session = await Booking.startSession();

  // start transaction
  session.startTransaction();

  try {
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
    const booking = await Booking.create(
      [
        {
          ...payload,
          user: userId,
          status: BOOKING_STATUS.PENDING,
        },
      ],
      { session: session }
    );

    //   create payment for the above booking into DB
    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session: session }
    );

    //   then update booking with the payment ID
    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session: session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    // transaction needs to committed after all operation
    await session.commitTransaction(); /**** Transaction ****/

    // then end the session
    session.endSession();

    //   lastly return the updated booking
    return updateBooking;
  } catch (error: any) {
    // abort operation if any error occurs
    await session.abortTransaction(); /**** Rollback ****/
    // end the session
    session.endSession();
    // throw the error
    throw error;
  }
};

export const bookingService = {
  createBooking,
};
