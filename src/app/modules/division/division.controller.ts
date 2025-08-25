/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import tryCatch from "../../utils/tryCatch";
import { divisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IDivision } from "./division.interface";

const createDivision = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IDivision = {
      ...req.body,
      thumbnail: req.file?.path,
    };

    const newDivision = await divisionService.createDivision(payload);

    // console.log({
    //   file: req.file,
    //   body: req.body,
    // });

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
    const query = req.query;
    const divisions = await divisionService.getAllDivisions(
      query as Record<string, string>
    );

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

const deleteDivision = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const deleteDivision = await divisionService.deleteDivision(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division deleted",
      data: deleteDivision,
    });
  }
);

export const divisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
