import { create } from "zustand";
import { Project } from "../models/project";
import { nanoid } from "nanoid";

interface ProjectState {
  projects: Project[];
  addProject: (name: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  addProject: (name) => {
    const newProject: Project = {
      id: nanoid(),
      name,
    };
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
  },
}));
