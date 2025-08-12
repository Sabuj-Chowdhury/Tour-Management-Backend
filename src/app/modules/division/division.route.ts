import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDivisionZodSchema,
  updatedDivisionZodSchema,
} from "./division.validation";
import { divisionController } from "./division.controller";

export const divisionRouter = Router();

divisionRouter.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionZodSchema),
  divisionController.createDivision
);

divisionRouter.get("/", divisionController.getAllDivisions);

divisionRouter.get("/:slug", divisionController.getSingleDivision);

divisionRouter.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updatedDivisionZodSchema),
  divisionController.updateDivision
);

divisionRouter.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision
);
