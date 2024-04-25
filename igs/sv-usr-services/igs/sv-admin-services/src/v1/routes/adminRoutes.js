/*
 * SkillViz Routes defined for admin endpoint
 */
import express from "express";
import adminController from "../../controllers/adminController.js";
const adminRouter = express.Router();

adminRouter.get("/")
adminRouter.get("/hierarchy/all",adminController.getHierarchy);
adminRouter.get("/hierarchy/count",adminController.getEmployeesHierarchy);
adminRouter.get("/analytics",adminController.getAnalytics);
adminRouter.get("/user/all",adminController.getUsers);
adminRouter.get("/master/categories",adminController.getMasterCategories);

adminRouter.post("/user/status",adminController.setUserState);
adminRouter.post("/user/admin",adminController.setUserAdmin);
adminRouter.post("/user/add",adminController.addUser);
adminRouter.post("/search",adminController.searchSkills);
adminRouter.post("/user/password",adminController.resetPassword);


export default adminRouter;