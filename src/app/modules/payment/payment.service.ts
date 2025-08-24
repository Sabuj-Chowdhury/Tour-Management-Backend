/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../SSLCOMMERZ/sslcommerz.interface";
import { SSLService } from "../SSLCOMMERZ/sslcommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // 1. update payment status to -> PAID
    const updatePaymentStatus = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    // 2. update booking status to -> Complete
    await Booking.findOneAndUpdate(
      updatePaymentStatus?.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  // start the session
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // 1. update the payment status
    const updatePaymentStatus = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { new: true, runValidators: true, session }
    );

    // 2. update booking status
    await Booking.findOneAndUpdate(
      updatePaymentStatus?.booking,
      {
        status: BOOKING_STATUS.CANCEL,
      },
      { new: true, runValidators: true, session }
    );

    // commit the transaction --> save the change in the DB
    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Canceled!" };
  } catch (error) {
    // abort the session
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  // start the transaction in the session
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePaymentStatus = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    await Booking.findOneAndUpdate(
      updatePaymentStatus?.booking,
      { status: BOOKING_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment failed!" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// if user/client need a payment URL for cancel/fail payment
const newPaymentUrl = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "No payment found!");
  }
  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhone = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPaymentPayload: ISSLCommerz = {
    address: userAddress,
    name: userName,
    phoneNumber: userPhone,
    email: userEmail,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  // call to SSL payment initiate API
  const sslPayment = await SSLService.sslPaymentInitiate(sslPaymentPayload);
  // console.log(sslPayment);

  //   lastly return the updated booking
  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

export const paymentService = {
  successPayment,
  cancelPayment,
  failPayment,
  newPaymentUrl,
};
