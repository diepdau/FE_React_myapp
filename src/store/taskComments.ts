import { create } from "zustand";
import { TaskComments, TaskCommentsStore } from "../api/types";
import {
  createTaskComments,
  deleteTaskComments,
  getTaskCommentsByTaskId,
} from "../api/task-comments";

export const useTaskCommentsStore = create<TaskCommentsStore>()((set) => ({
  taskComments: [],
  getTaskCommentsByTaskId: async (id: number) => {
    const taskComments = await getTaskCommentsByTaskId(id);
    return taskComments;
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
