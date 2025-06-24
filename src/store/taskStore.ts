import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../models/task";
import { nanoid } from "nanoid/non-secure";

interface TaskStore {
  tasks: Task[];
  addTask: (title: string, description?: string) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (title, description) => {
        const newTask: Task = {
          id: nanoid(),
          title,
          description,
          status: "inbox",
          createdAt: Date.now(),
        };
        set({ tasks: [newTask, ...get().tasks] });
      },
      updateTask: (id, data) => {
        set({
          tasks: get().tasks.map((task) =>
            task.id === id ? { ...task, ...data } : task
          ),
        });
      },
      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((task) => task.id !== id) });
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
