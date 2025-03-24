import { useEffect, useState } from "react";
import { useCreateTask } from "../../hooks/useTasks";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number, boolean, array } from "zod";
import useStore from "../../store/auth";
import InputField from "../../components/InputField";
import { TypeOf } from "zod";
import { TaskCreate } from "../../api/types";
import Select from "react-select";
import { useCategories } from "../../hooks/useCategory";
import { useLabels } from "../../hooks/useLabels";
import { ButtonDialog } from "../../components/ButtonDialog";
import { toast } from "react-toastify";
const taskSchema = object({
  title: string().min(1, "Title is required"),
  description: string().min(1, "Description is required"),
  categoryId: number().min(1, "Required"),
  isCompleted: boolean().default(false).optional(),
  labels: array(number()).min(1, "At least one label is required"),
});

export type TaskInput = TypeOf<typeof taskSchema>;

const AddTask = ({
  handleCloseDialog,
  handleOnSuccess,
}: {
  handleCloseDialog: () => void;
  handleOnSuccess: () => void;
}) => {
  const createTaskMutation = useCreateTask();
  const { data: categories = [] } = useCategories();
  const { data: labels = [] } = useLabels();
  const user = useStore();
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);

  const methods = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
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

  const onSubmitHandler: SubmitHandler<TaskInput> = async (values) => {
    const newTask: TaskCreate = {
      id: 0,
      title: values.title,
      description: values.description,
      userId: Number(user?.authUser?.id),
      categoryId: values.categoryId,
      isCompleted: values.isCompleted || false,
      labels: selectedLabels.map((label) => Number(label)),
    };

    try {
      await createTaskMutation.mutate(newTask, {
        onSettled: () => {
          handleOnSuccess();
          handleCloseDialog();
        },
      });
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to create task.");
    }
  };
  useEffect(() => {
    setValue("labels", selectedLabels);
  }, [selectedLabels, setValue]);

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
              const updatedLabels = selectedOptions.map(
                (option) => option.value
              );
              setSelectedLabels(updatedLabels);
              setValue("labels", updatedLabels);
            }}
            className="basic-multi-select rounded-full"
            classNamePrefix="select"
            placeholder="Select Labels"
          />
          {errors.labels && (
            <p className="text-red-500 text-sm">{errors.labels.message}</p>
          )}
          <div className="flex items-center justify-between">
            <label>
              <input type="checkbox" {...methods.register("isCompleted")} />{" "}
              Completed
            </label>
          </div>
          {/* add task với add attachment */}
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
