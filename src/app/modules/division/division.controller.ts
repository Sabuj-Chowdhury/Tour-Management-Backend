/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { divisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createDivision = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const newDivision = await divisionService.createDivision(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division created!",
      data: newDivision,
    });
  }
);

const getAllDivisions = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisions = await divisionService.getAllDivisions();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All divisions!",
      data: divisions.data,
      meta: divisions.meta,
    });
  }
);

const getSingleDivision = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;

    const division = await divisionService.getSingleDivision(slug);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single division!",
      data: division.data,
    });
  }
);

const updateDivision = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const updatedDivision = await divisionService.updateDivision(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division updated successfully!",
      data: updateDivision,
    });
  }
);

export const divisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
};
