import React, { useEffect } from "react";
import { useTaskCommentsStore } from "../../store/taskComments";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import useStore from "../../store/auth";
import InputField from "../../components/InputField";
import { TypeOf } from "zod";
import { TaskComments } from "../../api/types";
import { ButtonDialog } from "../../components/ButtonDialog";
const taskCommentsSchema = object({
  content: string().min(1, { message: "Please enter an content task comment" }),
  //  createdAt: z.date().optional(),
});
export type TaskCommentInput = TypeOf<typeof taskCommentsSchema>;
const AddTaskComment = ({
  Id,
  handleCloseDialog,
}: {
  Id: number;
  handleCloseDialog: () => void;
}) => {
  const { createTaskComments } = useTaskCommentsStore();
  const user = useStore();
  const store = useStore();
  const methods = useForm<TaskCommentInput>({
    resolver: zodResolver(taskCommentsSchema),
  });
  const mutation = useMutation({
    mutationFn: createTaskComments,
    onMutate: () => store.setRequestLoading(true),
    onSuccess: () => {
      store.setRequestLoading(false);
      toast.success("Create task atachment successful");
      handleCloseDialog();
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      console.log(error);
      toast.error(
        error.response?.data ||
          "Create task attachment failed. Please try again."
      );
    },
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

  const onSubmitHandler: SubmitHandler<TaskCommentInput> = (values) => {
    console.log("taskattachment", values);

    const newTask: TaskComments = {
      taskId: Id,
      userId: user.authUser?.id || 0,
      content: values.content,
    };
    mutation.mutate(newTask);
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

export default AddTaskComment;
