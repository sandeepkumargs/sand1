//routes for sv-user
// /:id - personal info, aggregated scores and certifications

import express from "express";
import userController from "../../controllers/userController.js";
const userRouter = express.Router();

userRouter.get("/master",userController.getMaster);
userRouter.get("/:empId",userController.getUser);
userRouter.post("/:empId",userController.updateUser);
userRouter.post("/education/:empId",userController.updateEducation);
userRouter.post("/experience/:empId",userController.updateExperience);
userRouter.post("/certificates/:empId",userController.updateCertificates);

export default userRouter;