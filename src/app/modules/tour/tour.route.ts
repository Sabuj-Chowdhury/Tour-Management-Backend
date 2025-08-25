import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.validation";
import { tourController } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

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

tourRouter.get("/tour-types/:id", tourController.getSingleTourType);

tourRouter.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTourType
);

/* --------------------- TOUR ROUTES ---------------------- */
tourRouter.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  tourController.createTour
);

tourRouter.get("/", tourController.getAllTours);

tourRouter.get("/:slug", tourController.getSingleTour);

tourRouter.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  tourController.updateTour
);

tourRouter.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTour
);
