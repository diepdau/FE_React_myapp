import * as React from "react";
import {
  DataGrid,
  GridRowModel,
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  GridCellEditStopParams,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTaskStore } from "../../store/task";
import { useCategoryStore } from "../../store/category";
import { toast } from "react-toastify";
import {
  MenuItem,
  Select,
  Dialog,
  DialogContent,
  Button,
  Paper,
} from "@mui/material";
import useStore from "../../store/auth";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddTask from "./addTask";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useTaskLabelsStore } from "../../store/taskLabels";
import { useLabelsStore } from "../../store/labels";
import SelectReact from "react-select";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Checkbox } from "@mui/material";
import { green, red } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
export default function TaskList() {
  const user = useStore();
  const { tasks, getTasks, updateTask, deleteTask } = useTaskStore();
  const { categories, getCategories } = useCategoryStore();
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const { createTaskLabels } = useTaskLabelsStore();
  const { labels, getLabels } = useLabelsStore();
  const [selectedLabels, setSelectedLabels] = React.useState<number[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getTasks();
    getLabels();
    getCategories();
  }, []);
  const handleSuccess = () => {
    getTasks();
  };
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
        const newTaskLabels = selectedLabels.map((labelId) => ({
          taskId: newRow.id,
          labelId,
          labelName: labels.find((label) => label.id === labelId)?.name || "",
        }));
        console.log(selectedLabels);
        await Promise.all(
          newTaskLabels.map((label) => createTaskLabels(label))
        );
        handleSuccess();
        toast.success("Task updated successfully!");
        return updatedTask;
      } catch (error: any) {
        console.log("err update task", error);
        toast.error(error?.response.data.message || "Failed to update task.");
        throw error;
      }
    },
    [updateTask, selectedLabels, createTaskLabels, labels]
  );
  const handleDeleteConfirm = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one task to delete.");
      return;
    }
    try {
      await Promise.all(selectedRows.map((id) => deleteTask(id)));
      toast.success("Task deleted successfully!");
      setSelectedRows([]);
      handleSuccess();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response.data.message || "Failed to delete task.");
      console.log(error);
    }
  };
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [editingTaskLabels, setEditingTaskLabels] = React.useState<{
    [key: number]: number[];
  }>({});

  const handleLabelChange = (taskId: number, selectedOptions: any) => {
    console.log("handleChange", selectedOptions);
    const selectedIds = selectedOptions.map(
      (option: { value: number }) => option.value
    );
    console.log("selectedIds", selectedIds);
    setEditingTaskLabels((prev) => ({ ...prev, [taskId]: selectedIds }));
  };

  const handleCellEditStop = async (params: GridCellEditStopParams) => {
    if (params.field === "labels" && editingTaskLabels[params.id as number]) {
      try {
        const selectedLabels = editingTaskLabels[params.id as number];
        const newTaskLabels = selectedLabels.map((labelId) => ({
          taskId: params.id as number,
          labelId,
          labelName: labels.find((label) => label.id === labelId)?.name || "",
        }));
        await Promise.all(
          newTaskLabels.map((label) => createTaskLabels(label))
        );
        handleSuccess();
        toast.success("Labels updated successfully!");
        setEditingTaskLabels((prev) => {
          const updated = { ...prev };
          delete updated[params.id as number];
          return updated;
        });
      } catch (error) {
        toast.error("Failed to update labels.");
      }
    }
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
      width: 80,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <CheckBoxIcon style={{ color: green[500] }} />
        ) : (
          <CheckBoxOutlineBlankIcon style={{ color: red[500] }} />
        );
      },
      renderEditCell: (params: GridRenderCellParams) => {
        return (
          <Checkbox
            checked={params.value}
            onChange={(e) => {
              const newValue = e.target.checked;
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newValue,
              });
            }}
            style={{
              color: params.value ? green[500] : red[500],
            }}
          />
        );
      },
    },
    {
      field: "categoryId",
      headerName: "Category",
      width: 80,
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
      headerName: "CreatedAt",
      width: 120,
      type: "dateTime",
      editable: true,
      valueFormatter: (params) => dayjs(params).format("DD/MM/YYYY"),
    },
    { field: "userName", headerName: "User Name", width: 100 },
    {
      field: "labels",
      headerName: "Labels",
      width: 350,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        const labelIds = params.row.labels || [];
        const taskLabels = labels.filter((label) =>
          labelIds.includes(label.name)
        );

        if (taskLabels.length > 0) {
          return taskLabels.map((label, index) => (
            <span
              key={index}
              style={{
                backgroundColor: getRandomPastelColor(),
                borderRadius: "12px",
                padding: "5px 10px",
                margin: "2px",
                color: "#fff",
                fontSize: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {label.name}
            </span>
          ));
        } else {
          return <span style={{ color: "#888" }}>No Labels</span>;
        }
      },
      renderEditCell: (params) => {
        if (!labels.length) return null;
        const taskId = Number(params.id);
        const labelIds = editingTaskLabels[taskId] || params.row.labels || [];
        return (
          // <SelectReact
          //   isMulti
          //   options={labels.map((label) => ({
          //     value: label.id,
          //     label: label.name,
          //   }))}
          //   value={labels
          //     .filter((label) => labelIds.includes(label.id))
          //     .map((label) => ({ value: label.id, label: label.name }))}
          //   onChange={(selectedOptions) =>
          //     handleLabelChange(taskId, selectedOptions)
          //   }
          //   className="basic-multi-select w-full"
          //   classNamePrefix="select"
          //   menuPortalTarget={document.body}
          //   menuPosition="fixed"
          // />
          <SelectReact
            isMulti
            options={labels
              .filter((label) => !labelIds.includes(label.id))
              .map((label) => ({
                value: label.id,
                label: label.name,
              }))}
            value={labels
              .filter((label) => labelIds.includes(label.id))
              .map((label) => ({
                value: label.id,
                label: label.name,
              }))}
            onChange={(selectedOptions) => {
              handleLabelChange(taskId, selectedOptions);
            }}
            className="basic-multi-select w-full"
            classNamePrefix="select"
            placeholder="Select Labels"
            menuPortalTarget={document.body}
          />
        );
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DriveFileRenameOutlineIcon style={{ color: "orange" }} />}
          label="View"
          onClick={() => navigate(`/tasks/${id}`)}
          color="primary"
        />,

        <GridActionsCellItem
          icon={<DeleteIcon style={{ color: "red" }} />}
          label="Delete"
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
          color="inherit"
        />,
      ],
    },
  ];
  const getRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 127 + 127);
    const g = Math.floor(Math.random() * 127 + 127);
    const b = Math.floor(Math.random() * 127 + 127);
    return `rgb(${r}, ${g}, ${b})`;
  };
  return (
    <Paper sx={{ width: "100%", padding: "1rem" }}>
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl">Task List</p>
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            backgroundColor: "#ff9800",
            color: "white",
            "&:hover": {
              backgroundColor: "#f57c00",
            },
          }}
        >
          Add
        </Button>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <AddTask
            handleCloseDialog={handleCloseDialog}
            handleOnSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      <DataGrid
        rows={tasks}
        columns={columns}
        checkboxSelection
        processRowUpdate={processRowUpdate}
        onRowSelectionModelChange={(newSelection) =>
          setSelectedRows(newSelection as number[])
        }
        onCellEditStop={handleCellEditStop}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Alert"
        description="Are you sure you want to delete this task?"
      />
    </Paper>
  );
}
