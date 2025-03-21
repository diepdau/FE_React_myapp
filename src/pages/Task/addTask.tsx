import React, { useEffect, useState } from "react";
import { useTaskStore } from "../../store/task";
import { useCategoryStore } from "../../store/category";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number, boolean, array } from "zod";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import useStore from "../../store/auth";
import InputField from "../../components/InputField";
import { TypeOf } from "zod";
import { TaskCreate } from "../../api/types";
import Select from "react-select";
import { useLabelsStore } from "../../store/labels";
import { ButtonDialog } from "../../components/ButtonDialog";
import { Button, Dialog, DialogContent } from "@mui/material";
import AddTaskAttachment from "../TaskAttachment/addTaskAttachment";
import AddIcon from "@mui/icons-material/Add";
const taskSchema = object({
  title: string().min(1, "Title is required"),
  description: string().min(1, "Description is required"),
  categoryId: number().min(1, "Category is required"),
  isCompleted: boolean().default(false).optional(),
  // labels: array(number()).min(1, "At least one label is required"),
});

export type TaskInput = TypeOf<typeof taskSchema>;

const AddTask = ({
  handleCloseDialog,
  handleOnSuccess,
}: {
  handleCloseDialog: () => void;
  handleOnSuccess: () => void;
}) => {
  const { createTask } = useTaskStore();
  const user = useStore();
  const store = useStore();
  const { categories, getCategories } = useCategoryStore();
  const { labels, getLabels } = useLabelsStore();
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);

  useEffect(() => {
    getCategories();
    getLabels();
  }, [getCategories, getLabels]);

  const methods = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
  });
  const mutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      console.log("Mutating with newTask:", newTask);
      store.setRequestLoading(true);
    },
    onSuccess: async (data) => {
      store.setRequestLoading(false);
      handleOnSuccess();
      toast.success("Task created successfully");
      handleCloseDialog();
    },
    onError: (error: any) => {
      store.setRequestLoading(false);
      console.log("error", error);
      toast.error(error.response?.data || "Create task failed. Try again.");
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
    setValue,
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setSelectedLabels([]);
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<TaskInput> = (values) => {
    const newTask: TaskCreate = {
      id: 0,
      title: values.title,
      description: values.description,
      userId: Number(user?.authUser?.id),
      categoryId: values.categoryId,
      isCompleted: values.isCompleted || false,
      labels: selectedLabels.map((label) => Number(label)),
    };
    mutation.mutate(newTask);
  };
  return (
    <div className="w-[460px] max-w-full p-2">
      <h3 className="text-2xl font-semibold text-center mb-6">
        Create a New Task
      </h3>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="form space-y-5"
        >
          <InputField label="Title" name="title" add={true} />
          <InputField label="Description" name="description" textarea={true} />

          <label className="block font-medium text-gray-700">Category</label>
          <Select
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            onChange={(selectedOption) => {
              setValue("categoryId", selectedOption?.value || 0);
            }}
            className="basic-single rounded-full"
            classNamePrefix="select"
            placeholder="Select Category"
          />
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}

          <label className="block font-medium text-gray-700">Labels</label>
          <Select
            isMulti
            options={labels.map((label) => ({
              value: label.id,
              label: label.name,
            }))}
            onChange={(selectedOptions) => {
              setSelectedLabels(
                selectedOptions.map((option: { value: number }) => option.value)
              );
            }}
            className="basic-multi-select rounded-full"
            classNamePrefix="select"
            placeholder="Select Labels"
          />
          {/* {errors.labels && (
            <p className="text-red-500 text-sm">{errors.labels.message}</p>
          )} */}
          <div className="flex items-center justify-between">
            <label>
              <input type="checkbox" {...methods.register("isCompleted")} />{" "}
              Completed
            </label>
          </div>
          {/* add task cùng với add attachment */}
          {/* <AddTaskAttachment Id={2} handleCloseDialog={handleCloseDialog} /> */}
          <div className="flex justify-end space-x-3 mt-5">
            <ButtonDialog
              loading={false}
              btnColor="bg-[#000000] hover:border-gray-100"
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

export default AddTask;
