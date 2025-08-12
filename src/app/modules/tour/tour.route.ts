import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourZodSchema } from "./tour.validation";
import { tourController } from "./tour.controller";

export const tourRouter = Router();

/* --------------------- TOUR ROUTES ---------------------- */
tourRouter.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  tourController.createTour
);
