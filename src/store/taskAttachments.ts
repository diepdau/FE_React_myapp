import { create } from "zustand";
import { TaskAttachmentsStore } from "../api/types";
import {
  createTaskAttachments,
  deleteTaskAttachments,
  downloadFileTaskAttachments,
  getTaskAttachmentsByTaskId,
} from "../api/task-attachment";

export const useTaskAttachmentsStore = create<TaskAttachmentsStore>()(
  (set) => ({
    taskAttachments: [],
    getTaskAttachmentsByTaskId: async (id: number) => {
      const taskAttachments = await getTaskAttachmentsByTaskId(id);
      return set((state) => ({ ...state, taskAttachments }));
    },
    createTaskAttachments: async (id: number, files: File[]) => {
      const uploadedAttachments = await createTaskAttachments(id, files);
      return set((state) => ({
        ...state,
        taskAttachments: [...state.taskAttachments, ...uploadedAttachments],
      }));
    },
    deleteTaskAttachments: async (id: number) => {
      await deleteTaskAttachments(id);
      return set((state) => ({
        ...state,
        taskAttachments: state.taskAttachments.filter((t) => id !== t.taskId),
      }));
    },
    downloadFileTaskAttachments: async (nameFile: string) => {
      await downloadFileTaskAttachments(nameFile);
      set((state: any) => ({
        ...state,
      }));
    },
  })
);
