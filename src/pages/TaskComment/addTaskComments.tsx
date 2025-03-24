import React, { useEffect } from "react";
import { useCreateTaskComment } from "../../hooks/useTaskComments";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { toast } from "react-toastify";
import useStore from "../../store/auth";
import InputField from "../../components/InputField";
import { TypeOf } from "zod";
import { ButtonDialog } from "../../components/ButtonDialog";
const taskCommentsSchema = object({
  content: string().min(1, { message: "Please enter an content task comment" }),
});
export type TaskCommentInput = TypeOf<typeof taskCommentsSchema>;
const AddTaskComments = ({
  Id,
  handleCloseDialog,
}: {
  Id: number;
  handleCloseDialog: () => void;
}) => {
  const createTaskCommentMutation = useCreateTaskComment();
  const user = useStore();
  const methods = useForm<TaskCommentInput>({
    resolver: zodResolver(taskCommentsSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<TaskCommentInput> = async (values) => {
    try {
      await createTaskCommentMutation.mutateAsync({
        taskId: Id,
        userId: user.authUser?.id || 0,
        content: values.content,
      });
      toast.success("Task comment created successfully!");
      methods.reset();
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to create task comment.");
    }
  };

  return (
    <div className="w-[460px] p-2">
      <h3 className="text-2xl font-semibold text-center mb-6">
        Create a Task comment
      </h3>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="form ">
          <InputField label="Content" name="content" textarea={true} />
          <div className="flex justify-end space-x-3 mt-5">
            <ButtonDialog
              loading={false}
              btnColor="bg-[#000000] hover:border-gray-700"
              showCancel={true}
              onCancel={handleCloseDialog}
              onClick={handleSubmit(onSubmitHandler)}
            >
              Add
            </ButtonDialog>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddTaskComments;
