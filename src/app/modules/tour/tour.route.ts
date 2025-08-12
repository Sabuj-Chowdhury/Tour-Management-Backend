import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
} from "./tour.validation";
import { tourController } from "./tour.controller";

export const tourRouter = Router();

/* ------------------ TOUR TYPE ROUTES -------------------- */
tourRouter.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourController.createTourTypes
);

tourRouter.get("/tour-types", tourController.getAllTourTypes);

tourRouter.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourController.updateTourType
);

/* --------------------- TOUR ROUTES ---------------------- */
tourRouter.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  tourController.createTour
);
