import AppError from "../../errorHelpers/AppError";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";
import httpStatus from "http-status-codes";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });

  if (existingTour) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A tour with this title already exists."
    );
  }

  const tour = await Tour.create(payload);
  return tour;
};

export const tourService = {
  createTour,
};
