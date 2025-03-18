import { create } from "zustand";
import { TaskLabels, TaskLabelsStore } from "../api/types";
import {
  getTaskLabels,
  createTaskLabels,
  deleteTaskLabels,
  getTaskLabelsByTaskId,
} from "../api/task-labels";

export const useTaskLabelsStore = create<TaskLabelsStore>()((set) => ({
  taskLabels: [],
  getTaskLabels: async () => {
    const taskLabels = await getTaskLabels();
    return set((state) => ({ ...state, taskLabels }));
  },
  getTaskLabelsByTaskId: async (id: number) => {
    const taskLabels = await getTaskLabelsByTaskId(id);
    console.log("task Labels by taskId", taskLabels);
    return set((state) => ({ ...state, taskLabels }));
  },
  createTaskLabels: async (newProduct: TaskLabels) => {
    const t = await createTaskLabels(newProduct);
    return set((state) => ({
      ...state,
      products: [...state.taskLabels, t],
    }));
  },
  deleteTaskLabels: async (taskId: number, labelId: number) => {
    await deleteTaskLabels(taskId, labelId);
    return set((state) => ({
      ...state,
      products: state.taskLabels.filter((t) => taskId !== t.taskId),
    }));
  },
}));
