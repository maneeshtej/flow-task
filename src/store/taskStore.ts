import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../models/task";
import { nanoid } from "nanoid/non-secure";

// Define the shape of the store
interface TaskStore {
  tasks: Task[];
  addTask: (title: string, description?: string) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  clearTasks: () => void;
}

// Create Zustand store with persistence using AsyncStorage
export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],

      // Add a new task to the top of the list
      addTask: (title, description) => {
        const newTask: Task = {
          id: nanoid(), // unique id for each task
          title,
          description,
          status: "inbox", // default GTD status
          createdAt: Date.now(),
        };
        set({ tasks: [newTask, ...get().tasks] });
      },

      // Update a task by merging changes using its ID
      updateTask: (id, data) => {
        set({
          tasks: get().tasks.map((task) =>
            task.id === id ? { ...task, ...data } : task
          ),
        });
      },

      // Remove a task by ID
      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((task) => task.id !== id) });
      },

      // Clear all tasks (used when resetting or cleaning up)
      clearTasks: () => {
        set({ tasks: [] });
      },
    }),
    {
      name: "task-storage", // Key name in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Use React Native's AsyncStorage
    }
  )
);
