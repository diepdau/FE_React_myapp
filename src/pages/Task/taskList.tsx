import * as React from "react";
import {
  DataGrid,
  GridRowModel,
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  GridRowParams,GridCellEditStopParams 
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTaskStore } from "../../store/task";
import { useCategoryStore } from "../../store/category";
import { toast } from "react-toastify";
import { MenuItem, Select, Dialog, DialogContent, Button, Paper } from "@mui/material";
import useStore from "../../store";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddTask from "./addTask";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useTaskLabelsStore } from "../../store/taskLabels";
import { useLabelsStore } from "../../store/labels";
import SelectReact from "react-select";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { green, red } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
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
  const [editingTaskLabels, setEditingTaskLabels] = React.useState<{ [key: number]: number[] }>({});

  const handleLabelChange = (taskId: number, selectedOptions: any) => {
    const selectedIds = selectedOptions.map((option: { value: number }) => option.value);
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
  
        await Promise.all(newTaskLabels.map((label) => createTaskLabels(label)));
  
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
      width: 120,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <CheckCircleIcon style={{ color: green[500] }} />
        ) : (
          <CancelIcon style={{ color: red[500] }} />
        );
      },
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
      renderCell: (params: GridRenderCellParams) => {
        const labelIds = params.row.labels || [];
        const taskLabels = labels.filter((label) => labelIds.includes(label.id));
        return taskLabels.length > 0
          ? taskLabels.map((label) => label.name).join(", ")
          : "No Labels";
      },
      renderEditCell: (params) => {
        if (!labels.length) return null;
        const taskId = Number(params.id); 
        const labelIds = editingTaskLabels[taskId] || params.row.labels || [];
        return (
          <SelectReact
            isMulti
            options={labels.map((label) => ({
              value: label.id,
              label: label.name,
            }))}
            value={labels
              .filter((label) => labelIds.includes(label.id))
              .map((label) => ({ value: label.id, label: label.name }))} 
            onChange={(selectedOptions) => handleLabelChange(taskId, selectedOptions)}
            className="basic-multi-select"
            classNamePrefix="select"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            placeholder="Select Labels"
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
          icon={<DeleteIcon  style={{ color: "red" }}/>}
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
   
    <Paper sx={{ maxHeight: 800, width: "100%", overflow: "auto" }}>
     <Button
      variant="contained"
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
      onClick={handleOpenDialog}
    >
      Add task
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
