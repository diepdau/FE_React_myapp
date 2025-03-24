import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTaskAttachmentsByTaskId,
  createTaskAttachments,
  deleteTaskAttachments,
  downloadFileTaskAttachments,
} from "../api/task-attachment";

export const useTaskAttachmentsByTaskId = (taskId: number) => {
  return useQuery({
    queryKey: ["taskAttachments", taskId],
    queryFn: () => getTaskAttachmentsByTaskId(taskId),
    enabled: !!taskId,
  });
};

export const useCreateTaskAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, files }: { taskId: number; files: File[] }) =>
      createTaskAttachments(taskId, files),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["taskAttachments", taskId] });
    },
  });
};

export const useDeleteTaskAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId: number) => deleteTaskAttachments(attachmentId),
    onSuccess: (_, attachmentId) => {
      queryClient.invalidateQueries({ queryKey: ["taskAttachments"] });
    },
  });
};

export const useDownloadTaskAttachment = () => {
  return useMutation({
    mutationFn: async (fileName: string) => {
      await downloadFileTaskAttachments(fileName);
    },
  });
};
