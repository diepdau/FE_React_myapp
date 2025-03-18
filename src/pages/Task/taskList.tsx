import * as React from "react";
import {
  DataGrid,
  GridRowModel,
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTaskStore } from "../../store/task";
import { useCategoryStore } from "../../store/category";
import { toast } from "react-toastify";
import { MenuItem, Select, Dialog, DialogContent, Button } from "@mui/material";
import useStore from "../../store";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddTask from "./addTask";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useTaskLabelsStore } from "../../store/taskLabels";
import { useLabelsStore } from "../../store/labels";
import SelectReact from "react-select";
export default function TaskList() {
  const user = useStore();
  const { tasks, getTasks, updateTask, deleteTask } = useTaskStore();
  const { categories, getCategories } = useCategoryStore();
  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const { createTaskLabels } = useTaskLabelsStore();
  const { labels, getLabels } = useLabelsStore();
  const [selectedLabels, setSelectedLabels] = React.useState<number[]>([]);
  const navigate = useNavigate();

  const handleRowDoubleClick = (params: GridRowParams) => {
    navigate(`/tasks/${params.row.id}`);
  };
  React.useEffect(() => {
    getTasks();
    getLabels();
    getCategories();
  }, []);

  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel) => {
      try {
        const updatedTask = {
          id: newRow.id,
          title: newRow.title,
          description: newRow.description,
          isCompleted: newRow.isCompleted ?? false,
          createdAt: newRow.createdAt || new Date().toISOString(),
          userId: Number(user?.authUser?.id),
          categoryId: newRow.categoryId,
        };

        await updateTask(updatedTask);
        console.log("selectedlables", selectedLabels);
        const newTaskLabels = selectedLabels.map((labelId) => ({
          taskId: newRow.id,
          labelId,
          labelName: labels.find((label) => label.id === labelId)?.name || "",
        }));
        await Promise.all(
          newTaskLabels.map((label) => createTaskLabels(label))
        );
        toast.success("Task updated successfully!");
        return updatedTask;
      } catch (error) {
        toast.error("Failed to update task.");
        throw error;
      }
    },
    [updateTask, selectedLabels, createTaskLabels, labels]
  );

  const handleDeleteConfirm = async () => {
    if (selectedRow !== null) {
      try {
        await deleteTask(selectedRow);
        toast.success("Task deleted successfully!");
        setSelectedRow(null);
        setDeleteDialogOpen(false);
      } catch (error) {
        toast.error("Failed to delete task.");
      }
    }
  };
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200, editable: true },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      editable: true,
    },
    {
      field: "isCompleted",
      headerName: "Status",
      type: "boolean",
      width: 120,
      editable: true,
    },
    {
      field: "categoryId",
      headerName: "Category",
      width: 150,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        const category = categories.find((c) => c.id === params.row.categoryId);
        return category ? category.name : "Unknown";
      },
      renderEditCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          fullWidth
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      type: "dateTime",
      editable: true,
      valueFormatter: (params: { value: any }) =>
        dayjs(params.value).format("DD/MM/YYYY"),
    },
    { field: "userName", headerName: "User Name", width: 150 },
    {
      field: "labels",
      headerName: "Labels",
      width: 250,
      editable: true,
      renderEditCell: (params) => (
        <SelectReact
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
          className="basic-multi-select"
          classNamePrefix="select"
          menuPortalTarget={document.body}
          menuPosition="fixed"
          placeholder="Select Labels"
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            setSelectedRow(id as number);
            setDeleteDialogOpen(true);
          }}
          color="inherit"
        />,
      ],
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Button variant="outlined" onClick={handleOpenDialog}>
        Add Task
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <AddTask handleCloseDialog={handleCloseDialog} />
        </DialogContent>
      </Dialog>

      <DataGrid
        rows={tasks}
        columns={columns}
        checkboxSelection
        processRowUpdate={processRowUpdate}
        onRowDoubleClick={handleRowDoubleClick}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure you want to delete this task?"
      />
    </div>
  );
}
