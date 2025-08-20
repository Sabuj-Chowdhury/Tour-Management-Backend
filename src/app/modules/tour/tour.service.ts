import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { searchConst, tourTypeConstant } from "./tour.constant";
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

const getAllTourTypes = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourType.find(), query);

  const allTourTypes = queryBuilder
    .filter()
    .search(tourTypeConstant)
    .fields()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    allTourTypes.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleTourType = async (id: string) => {
  const tourType = await TourType.findById(id);

  return {
    data: tourType,
  };
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

/** OLD get all tours */
// const getAllTours = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.search || "";
//   const sort = query.sort || "-createdAt";
//   const fieldFiltering = query.field?.split(",").join(" ") || "";

//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   // to delete field from the filter
//   for (const field of excludeFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const search = {
//     $or: searchConst.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   // const tours = await Tour.find(search)
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fieldFiltering)
//   //   .skip(skip)
//   //   .limit(limit);

//   const filterQuery = Tour.find(filter);
//   const tours = filterQuery.find(search);
//   const allTours = await tours
//     .sort(sort)
//     .select(fieldFiltering)
//     .skip(skip)
//     .limit(limit);

//   const totalTours = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalTours / limit);

//   const meta = {
//     total: totalTours,
//     totalPage: totalPage,
//     currentPage: page,
//     limit: limit,
//   };

//   return {
//     data: allTours,
//     meta: meta,
//   };
// };

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(searchConst)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleTour = async (slug: string) => {
  const tour = await Tour.findOne({ slug });

  return {
    data: tour,
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
  getSingleTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
