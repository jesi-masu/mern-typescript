import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController";

const router = Router();

// Route to get all projects and create a new project
router.route("/").get(getAllProjects).post(createProject);

// Route to get, update, and delete a specific project by its ID
router
  .route("/:id")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

export default router;
