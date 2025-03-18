import { create } from "zustand";
import { TaskComments, TaskCommentsStore } from "../api/types";
import {
  getTaskComments,
  createTaskComments,
  deleteTaskComments,
  getTaskCommentsByTaskId,
} from "../api/task-comments";

export const useTaskCommentsStore = create<TaskCommentsStore>()((set) => ({
  taskComments: [],
  getTaskComments: async () => {
    const taskComments = await getTaskComments();
    return set((state) => ({ ...state, taskComments }));
  },
  getTaskCommentsByTaskId: async (id: number) => {
    const taskComments = await await getTaskCommentsByTaskId(id);
    return set((state) => ({ ...state, taskComments }));
  },
  createTaskComments: async (newProduct: TaskComments) => {
    const t = await createTaskComments(newProduct);
    return set((state) => ({
      ...state,
      products: [...state.taskComments, t],
    }));
  },
  deleteTaskComments: async (id: number) => {
    await deleteTaskComments(id);
    return set((state) => ({
      ...state,
      products: state.taskComments.filter((t) => id !== t.taskId),
    }));
  },
}));
