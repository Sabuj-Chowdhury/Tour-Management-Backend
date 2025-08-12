/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { tourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

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

export const tourController = {
  createTour,
};
