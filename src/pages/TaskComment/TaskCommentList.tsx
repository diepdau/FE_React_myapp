import React, { useEffect, useState } from "react";
import { useTaskCommentsStore } from "../../store/taskComments";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import AddTaskComment from "./addTaskComments";
import { Dialog, DialogContent } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ConfirmDialog from "../../components/ConfirmDialog";

const TaskCommentList = ({ taskId }: { taskId: number }) => {
  const { taskComments, getTaskCommentsByTaskId, deleteTaskComments } =
    useTaskCommentsStore();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  useEffect(() => {
    getTaskCommentsByTaskId(taskId);
  }, [taskId]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const handleDeleteConfirm = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one task comment to delete.");
      return;
    }
    try {
      await Promise.all(selectedRows.map((id) => deleteTaskComments(id)));
      toast.success("Task comment deleted successfully!");
      setSelectedRows([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete task comment.");
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
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => setDeleteDialogOpen(true)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Paper sx={{ height: 400, width: "100%" }}>
        <Button variant="outlined" onClick={handleOpenDialog}>
          Add Task
        </Button>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogContent>
            <AddTaskComment
              Id={taskId || 0}
              handleCloseDialog={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Are you sure you want to delete this task?"
        />
        <DataGrid
          editMode="row"
          rows={taskComments}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) =>
            setSelectedRows(newSelection as number[])
          }
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
};

export default TaskCommentList;
