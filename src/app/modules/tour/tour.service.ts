import { excludeFields } from "../../constant";
import AppError from "../../errorHelpers/AppError";
import { searchConst } from "./tour.constant";
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

const getAllTours = async (query: Record<string, string>) => {
  const filter = query;
  const searchTerm = query.search || "";
  const sort = query.sort || "-createdAt";
  const fieldFiltering = query.field.split(",").join(" ") || "";

  // to delete field from the filter
  for (const field of excludeFields) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete filter[field];
  }

  const search = {
    $or: searchConst.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  const tours = await Tour.find(search)
    .find(filter)
    .sort(sort)
    .select(fieldFiltering);

  const totalTours = await Tour.countDocuments();

  return {
    data: tours,
    meta: {
      total: totalTours,
    },
  };
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
  getAllTours,
  updateTour,
  deleteTour,
};
