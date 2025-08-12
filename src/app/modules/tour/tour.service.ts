import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes";

const createTourTypes = async (payload: ITourType) => {
  const existingTourTypes = await TourType.findOne({ name: payload.name });

  if (existingTourTypes) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour type already exists.");
  }

  const tourTypes = await TourType.create({ name });

  return tourTypes;
};

const getAllTourTypes = async () => {
  const allTourTypes = await TourType.find();
  return allTourTypes;
};

const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);

  if (!existingTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour type not found.");
  }

  const updateTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return updateTourType;
};

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
  createTourTypes,
  getAllTourTypes,
  updateTourType,
  createTour,
};
