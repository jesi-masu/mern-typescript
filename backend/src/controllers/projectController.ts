import { Request, Response } from "express";
import mongoose from "mongoose";
import Project from "../models/projectModel";
import { ProjectRequestBody } from "../types/express.d";

// CREATE a new project
export const createProject = async (
  req: Request<{}, {}, ProjectRequestBody>,
  res: Response
) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};

// READ all projects
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// READ a single project by ID
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Project not found (Invalid ID format)" });
    return;
  }

  try {
    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching project", error });
  }
};

// UPDATE a project by ID
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Project not found (Invalid ID format)" });
    return;
  }

  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Server error updating project", error });
  }
};

// DELETE a project by ID
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Project not found (Invalid ID format)" });
    return;
  }

  try {
    const deletedProject = await Project.findOneAndDelete({ _id: id });

    if (!deletedProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting project", error });
  }
};
