import React, {useState } from "react";
import { useCreateTaskAttachment } from "../../hooks/useTaskAttachments"; 
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { ButtonDialog } from "../../components/ButtonDialog";

const taskAttachmentSchema = z.object({
  files: z
    .any()
    .refine((files) => files?.length > 0, "Please select at least one file"),
});

type TaskAttachmentInput = z.infer<typeof taskAttachmentSchema>;

const AddTaskAttachment = ({
  Id,
  handleCloseDialog,
  handleOnSuccess,
}: {
  Id: number;
  handleCloseDialog: () => void;
  handleOnSuccess: () => void;
}) => {
  const createTaskAttachmentsMutation = useCreateTaskAttachment();
  const methods = useForm<TaskAttachmentInput>({
    resolver: zodResolver(taskAttachmentSchema),
  });
  const { handleSubmit, setValue } = methods;
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/jfif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];
  const maxFileSize = 5 * 1024 * 1024;

  const onSubmitHandler = () => {
    createTaskAttachmentsMutation.mutate(
      { taskId: Id, files },
      {
        onSuccess: () => {
          handleOnSuccess();
          handleCloseDialog();
          toast.success("Attachments uploaded successfully!");
        },
        onError: (error: any) => {
          toast.error(error.response?.data || "Failed to upload attachments.");
        },
      }
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const invalidFiles = selectedFiles.filter((file) => {
        return (
          !acceptedFileTypes.includes(file.type) || file.size > maxFileSize
        );
      });

      if (invalidFiles.length > 0) {
        setErrorMessage(
          "Invalid file type or file size exceeds 5MB. Only JPG, PNG, PDF files are allowed."
        );
      } else {
        setErrorMessage(null);
        setFiles(selectedFiles);
        setValue("files", selectedFiles);
      }
    }
  };

  return (
    <div className="w-[460px] p-2">
      <h3 className="text-2xl font-semibold text-center mb-6">
        Upload Task Attachments
      </h3>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="form">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(",")} 
          />
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
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
