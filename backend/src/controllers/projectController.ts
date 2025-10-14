import { Request, Response } from "express";
import Project from "../models/projectModel";
import { ProjectRequestBody } from "../types/express.d"; // <-- Import the new type

// CREATE a new project
export const createProject = async (
  req: Request<{}, {}, ProjectRequestBody>, // <-- Use the type here
  res: Response
) => {
  try {
    // Now, `req.body` will have autocompletion and type-checking!
    // For example, `req.body.projectTitle` is valid, but `req.body.title` would show an error.
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};

// READ all projects (for your main page)
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// READ a single project by ID
export const getProjectById = async (req: Request, res: Response) => {
  // ... logic to find one project
};

// UPDATE a project by ID
export const updateProject = async (req: Request, res: Response) => {
  // ... logic to find and update a project
};

// DELETE a project by ID
export const deleteProject = async (req: Request, res: Response) => {
  // ... logic to find and delete a project
};
