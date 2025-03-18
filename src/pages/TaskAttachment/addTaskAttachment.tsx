import React, { useEffect, useState } from "react";
import { useTaskAttachmentsStore } from "../../store/taskAttachments";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import useStore from "../../store";
import { ButtonDialog } from "../../components/ButtonDialog";

const taskAttachmentSchema = z.object({
  files: z
    .any()
    .refine((files) => files?.length > 0, "Please select at least one file"),
});

type TaskAttachmentInput = z.infer<typeof taskAttachmentSchema>;

const AddTaskAttachment = ({
  handleCloseDialog,
}: {
  handleCloseDialog: () => void;
}) => {
  const { createTaskAttachments, getTaskAttachmentsByTaskId } =
    useTaskAttachmentsStore();
  const store = useStore();
  const [taskId] = useState(2);
  // const methods = useForm<TaskAttachmentInput>({
  //   resolver: zodResolver(taskAttachmentSchema),
  // });

  useEffect(() => {
    getTaskAttachmentsByTaskId(taskId);
  }, [taskId, getTaskAttachmentsByTaskId]);

  const methods = useForm();
  const { handleSubmit } = methods;
  const [files, setFiles] = useState<File[]>([]);

  const onSubmitHandler = (data: any) => {
    createTaskAttachmentsMutation.mutate();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const createTaskAttachmentsMutation = useMutation({
    mutationFn: async () => createTaskAttachments(taskId, files),
    onMutate: () => store.setRequestLoading(true),
    onSuccess: () => {
      store.setRequestLoading(false);
      toast.success("Attachments uploaded successfully!");
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      toast.error(error.response?.data || "Failed to upload attachments.");
    },
  });

  return (
    <div className="w-[460px] p-2">
      <h3 className="text-2xl font-semibold text-center mb-6">
        Upload Task Attachments
      </h3>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="form">
          <input type="file" multiple onChange={handleFileChange} />
          <div className="flex justify-end space-x-3 mt-5">
            <ButtonDialog
              loading={false}
              btnColor="bg-[#000000] hover:border-gray-700"
              showCancel={true}
              onCancel={handleCloseDialog}
              onClick={handleSubmit(onSubmitHandler)}
            >
              Upload file
            </ButtonDialog>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddTaskAttachment;
