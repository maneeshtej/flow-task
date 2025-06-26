import { create } from "zustand";
import { Project } from "../models/project";
import { nanoid } from "nanoid/non-secure";

// Initial default project options
const defaultProjects: Project[] = [
  { id: nanoid(), name: "Personal" },
  { id: nanoid(), name: "Work" },
  { id: nanoid(), name: "Grocery" },
  { id: nanoid(), name: "Assignments" },
];

interface ProjectState {
  projects: Project[];
  addProject: (name: string) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: defaultProjects,

  addProject: (name) => {
    const { projects } = get();

    const exists = projects.some(
      (proj) => proj.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return;

    const newProject: Project = {
      id: nanoid(),
      name,
    };

    set({
      projects: [...projects, newProject],
    });
  },

  deleteProject: (id) => {
    const { projects } = get();

    const newProjects = projects.filter((project) => project.id != id);

    set({
      projects: newProjects,
    });
  },
}));
