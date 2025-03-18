import { create } from "zustand";
import { Task, TaskCreate, TaskStore } from "../api/types";
import {
  createTasks,
  deleteTasks,
  getTaskById,
  getTasks,
  updateTasks,
} from "../api/task";

export const useTaskStore = create<TaskStore>()((set) => ({
  tasks: [],  
  getTasks: async () => {
    const tasks = await getTasks();
    return set((state) => ({ ...state, tasks }));
  },
  getTaskById: async (id: number) => {
    const task = await getTaskById(id);
    return task; 
  },
  createTask: async (newProduct: TaskCreate) => {
    const t = await createTasks(newProduct);
    return set((state) => ({
      ...state,
      products: [...state.tasks, t],
    }));
  },
  updateTask: async (updatedTask: Task) => {
    const product = await updateTasks(updatedTask, updatedTask.id);
    return set((state) => ({
      ...state,
      products: state.tasks.map((p) => (p.id === updatedTask.id ? product : p)),
    }));
  },
  deleteTask: async (id: number) => {
    await deleteTasks(id);
    return set((state) => ({
      ...state,
      products: state.tasks.filter((t) => id !== t.id),
    }));
  },
}));
