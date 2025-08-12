/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { tourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createTourTypes = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await tourService.createTourTypes(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour type created successfully",
      data: tourType,
    });
  }
);

const getAllTourTypes = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await tourService.getAllTourTypes();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "ALL Tour types retrieved successfully",
      data: tourTypes,
    });
  }
);

const updateTourType = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const updateTourType = await tourService.updateTourType(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour type updated successfully",
      data: updateTourType,
    });
  }
);

const deleteTourType = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deleteTourType = await tourService.deleteTourType(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour type deleted successfully",
      data: deleteTourType,
    });
  }
);

const createTour = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await tourService.createTour(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour created successfully!",
      data: tour,
    });
  }
);

const updateTour = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const updatedTour = await tourService.updateTour(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour updated successfully!",
      data: updatedTour,
    });
  }
);

const deleteTour = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const tour = await tourService.deleteTour(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour deleted successfully!",
      data: tour,
    });
  }
);

export const tourController = {
  createTourTypes,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  updateTour,
  deleteTour,
};
