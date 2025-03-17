import React, { useEffect } from "react";
import { useTaskCommentsStore } from "../../store/taskComments";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number } from "zod";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import useStore from "../../store";
import InputField from "../../components/InputField";
import { TypeOf } from "zod";
import { TaskComments } from "../../api/types";
import { z } from "zod";
import { Button } from "../../components/Button";
const taskCommentsSchema = object({
  content: string(),
  //  createdAt: z.date().optional(),
});
// export type TaskInput = Omit<TypeOf<typeof taskSchema>, "userId">;
export type TaskCommentInput = TypeOf<typeof taskCommentsSchema>;
const AddTaskComment = () => {
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
      taskId: 2,
      userId: user.authUser?.id || 0,
      content: values.content,
    };
    mutation.mutate(newTask);
  };

  return (
    <div className="p-3 rounded-[20px] shadow-lg w-[450px] max-w-full">
      <h3>Create a New Task</h3>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="form ">
          <InputField label="Content" name="content" />
          <Button loading={store.requestLoading}>Add Task</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddTaskComment;
