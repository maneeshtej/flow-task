import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project } from "../models/project";
import { nanoid } from "nanoid/non-secure";

// Initial default project list
const defaultProjects: Project[] = [
  { id: nanoid(), name: "Personal" },
  { id: nanoid(), name: "Work" },
  { id: nanoid(), name: "Grocery" },
  { id: nanoid(), name: "Assignments" },
];

// Define the shape of the store's state and actions
interface ProjectState {
  projects: Project[];
  addProject: (name: string) => void;
  deleteProject: (id: string) => void;
}

// Create Zustand store with persistence
export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: defaultProjects,

      // Add a project if it doesn't already exist (case-insensitive)
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

      // Delete a project by its ID
      deleteProject: (id) => {
        const { projects } = get();
        const newProjects = projects.filter((project) => project.id !== id);

        set({
          projects: newProjects,
        });
      },
    }),
    {
      name: "project-storage", // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
