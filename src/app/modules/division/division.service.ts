import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";

const createDivision = async (payload: IDivision) => {
  const existingDivision = await Division.findOne({ name: payload.name });

  if (existingDivision) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A division with this name already exists!"
    );
  }

  const division = await Division.create(payload);

  return division;
};

export const divisionService = {
  createDivision,
};
