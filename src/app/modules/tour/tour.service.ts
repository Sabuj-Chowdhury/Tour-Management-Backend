import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes";

const createTourTypes = async (payload: ITourType) => {
  const existingTourTypes = await TourType.findOne({ name: payload.name });

  if (existingTourTypes) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour type already exists.");
  }

  const tourTypes = await TourType.create(payload);

  return tourTypes;
};

const getAllTourTypes = async () => {
  const allTourTypes = await TourType.find({});
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

const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);

  if (!existingTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour type not found.");
  }

  const deleteTourType = await TourType.findByIdAndDelete(id);

  return deleteTourType;
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

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  return updatedTour;
};

const deleteTour = async (id: string) => {
  const existingTour = await Tour.findOne({ _id: id });

  if (!existingTour) {
    throw new AppError(httpStatus.BAD_REQUEST, "No Tour found.");
  }

  const tour = await Tour.findByIdAndDelete(id);
  return tour;
};

export const tourService = {
  createTourTypes,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  updateTour,
  deleteTour,
};
