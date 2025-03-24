import React, { useState } from "react";
import {
  useTaskCommentsByTaskId,
  useDeleteTaskComment,
} from "../../hooks/useTaskComments";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { Dialog, DialogContent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ConfirmDialog from "../../components/ConfirmDialog";
import AddIcon from "@mui/icons-material/Add";
import AddTaskComments from "./AddTaskComments";
const TaskCommentList = ({ taskId }: { taskId: number }) => {
  const { data: taskComments = [], isLoading } =
    useTaskCommentsByTaskId(taskId);
  const deleteTaskCommentMutation = useDeleteTaskComment();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const handleDeleteConfirm = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one task comment to delete.");
      return;
    }
    try {
      await Promise.all(
        selectedRows.map((id) => deleteTaskCommentMutation.mutateAsync(id))
      );
      toast.success("Task comment deleted successfully!");
      setSelectedRows([]);
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response.data.message || "Failed to delete task comment."
      );
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
    {
      field: "userName",
      headerName: "userName",
      width: 130,
      editable: true,
    },
    {
      field: "content",
      headerName: "Content",
      width: 330,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      width: 130,
      type: "dateTime",
      editable: true,
      valueFormatter: (params) => dayjs(params).format("DD/MM/YYYY"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon style={{ color: "red" }} />}
            label="Delete"
            onClick={() => setDeleteDialogOpen(true)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return (
    <Paper className="p-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl">Task Comments</p>
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
          <AddTaskComments Id={taskId} handleCloseDialog={handleCloseDialog} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Alert"
        description="Are you sure you want to delete this task comment?"
      />
      <DataGrid
        editMode="row"
        rows={taskComments}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) =>
          setSelectedRows(newSelection as number[])
        }
        loading={isLoading}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default TaskCommentList;
