import React, { useEffect, useState } from "react";
import { useTaskAttachmentsStore } from "../../store/taskAttachments";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import useStore from "../../store";
import {  ButtonDialog } from "../../components/ButtonDialog";

const taskAttachmentSchema = z.object({
  files: z
    .any()
    .refine((files) => files?.length > 0, "Please select at least one file"),
});

type TaskAttachmentInput = z.infer<typeof taskAttachmentSchema>;

const AddTaskAttachment = () => {
  const { createTaskAttachments, getTaskAttachmentsByTaskId } =
    useTaskAttachmentsStore();
  const store = useStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [taskId] = useState(2);

  const methods = useForm<TaskAttachmentInput>({
    resolver: zodResolver(taskAttachmentSchema),
  });

  useEffect(() => {
    getTaskAttachmentsByTaskId(taskId);
  }, [taskId, getTaskAttachmentsByTaskId]);

  const mappedAttachments: {
    id: number;
    taskId: number;
    FileName: string;
    FileUrl: string;
  }[] = [
    {
      id: 1,
      taskId: 2,
      FileName: "example.txt",
      FileUrl:
        "https://miro.medium.com/v2/resize:fit:720/format:webp/1*dk4PZkdTrKuzbL7EAmQe-g.png",
    },
  ];

  const files: File[] = mappedAttachments.map((attachment) => {
    return new File(
      [
        /* file data here */
      ],
      attachment.FileName,
      { type: "application/octet-stream" }
    );
  });

  const mutation = useMutation({
    mutationFn: async () => createTaskAttachments(taskId, files),
    onMutate: () => store.setRequestLoading(true),
    onSuccess: () => {
      store.setRequestLoading(false);
      toast.success("Attachments uploaded successfully!");
      // setSelectedFiles([]);
      // getTaskAttachmentsByTaskId(taskId);
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      toast.error(error.response?.data || "Failed to upload attachments.");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const onSubmitHandler = () => {
    if (selectedFiles.length === 0) {
      toast.warning("Please select at least one file.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="p-3 rounded-[20px] shadow-lg w-[450px] max-w-full">
      <h3>Upload Task Attachments</h3>
      <FormProvider {...methods}>
        <form onSubmit={onSubmitHandler} className="form">
          <input type="file" multiple onChange={handleFileChange} />
          <ButtonDialog loading={store.requestLoading}>Upload Files</ButtonDialog>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddTaskAttachment;
// public async Task<IActionResult> UploadAttachments(int taskId, List<IFormFile> files)
// {
//     if (files == null || files.Count == 0)
//     {
//         return BadRequest("No files uploaded.");
//     }

//     List<TaskAttachment> attachments = new List<TaskAttachment>();

//     foreach (var file in files)
//     {
//         string fileUrl = await _blobService.UploadFileAsync(file);

//         var attachment = new TaskAttachment
//         {
//             TaskId = taskId,
//          nhận cái này thì là cái gì
// cần sửa thành gì export async function createTaskAttachments(
//  id: number,
//  files: File[]
// ): Promise<Array<TaskAttachments>> {
//  const formData = new FormData();
//  for (const file of files) {
//    formData.append("files", file);
//  }
//  const response = await apiClient.post(task-attachments/${id}, formData);
//  return response.data;
// }
// export type TaskAttachmentsStore = {
//  taskAttachments: Array<TaskAttachments>;
//  getTaskAttachmentsByTaskId: (id: number) => Promise<void>;
//  createTaskAttachments: (id: number, files: File[]) => Promise<void>;
//  deleteTaskAttachments: (id: number) => Promise<void>;
// };  createTaskAttachments: async (id: number, files: File[]) => {
//      const uploadedAttachments = await createTaskAttachments(id, files);
//      return set((state) => ({
//        ...state,
//        taskAttachments: [...state.taskAttachments, ...uploadedAttachments],
//      }));
//    },