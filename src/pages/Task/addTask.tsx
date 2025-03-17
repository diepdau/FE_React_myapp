import React, { useEffect } from "react";
import { useTaskStore } from "../../store/task";
import { useCategoryStore } from "../../store/category";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number, boolean } from "zod";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import useStore from "../../store";
import InputField from "../../components/InputField";
import { TypeOf } from "zod";
import { TaskCreate } from "../../api/types";
import { Button } from "../../components/Button";
import Select from "react-select";

const taskSchema = object({
  title: string().min(1, "Title is required"),
  description: string().min(1, "Description is required"),
  categoryId: number().min(1, "Category is required"),
  isCompleted: boolean().default(false).optional(),
  // createdAt: z.date().optional(),
});

export type TaskInput = TypeOf<typeof taskSchema>;

const AddTask = () => {
  const { getTasks, createTask } = useTaskStore();
  const user = useStore();
  const { categories, getCategories } = useCategoryStore();
  const store = useStore();

  useEffect(() => {
    getCategories();
  }, []);

  const methods = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
  });

  const mutation = useMutation({
    mutationFn: createTask,
    onMutate: () => store.setRequestLoading(true),
    onSuccess: () => {
      store.setRequestLoading(false);
      toast.success("Task created successfully");
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      toast.error(error.response?.data || "Create task failed. Try again.");
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
    setValue,
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<TaskInput> = (values) => {
    console.log("Submitted values:", values);
    const newTask: TaskCreate = {
      title: values.title,
      description: values.description,
      userId: Number(user?.authUser?.id),
      categoryId: values.categoryId,
      isCompleted: false,
    };
    mutation.mutate(newTask);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
      <h3 className="text-2xl font-semibold text-center mb-6">
        Create a New Task
      </h3>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-5">
          <InputField label="Title" name="title" />
          <InputField label="Description" name="description" />

          <label className="block font-medium text-gray-700">Category</label>
          {/* Chua thong bao phai chon */}
          <Select
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            onChange={(selectedOption) => {
              setValue("categoryId", selectedOption?.value || 0);
            }}
            className="basic-single"
            classNamePrefix="select"
            placeholder="Select Category"
          />
          <div className="flex items-center justify-between">
            <label>
              <input type="checkbox" {...methods.register("isCompleted")} />
              Completed
            </label>
            <Button loading={store.requestLoading}>Add Task</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddTask;
