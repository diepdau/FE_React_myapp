import React, { useEffect, useState } from "react";
import { useTaskCommentsStore } from "../../store/taskComments";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import AddTaskComment from "./addTaskComments";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const TaskComments = ({ taskId }: { taskId: number }) => {
  if (!taskId) {taskId=0}; 
  const { taskComments, getTaskCommentsByTaskId, deleteTaskComments } =
    useTaskCommentsStore();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  useEffect(() => {
    getTaskCommentsByTaskId(taskId);
  }, [taskId]);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one task comment to delete.");
      return;
    }
    try {
      await Promise.all(selectedRows.map((id) => deleteTaskComments(id)));
      toast.success("Task comment deleted successfully!");
      setSelectedRows([]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete task comment.");
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "taskId", headerName: "taskId", width: 130, editable: true },
    {
      field: "userName",
      headerName: "userName",
      width: 130,
      editable: true,
    },
    {
      field: "content",
      headerName: "Content",
      width: 130,
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
            disabled={selectedRows.length === 0}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Paper sx={{ height: 800, width: "100%" }}>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add TaskComment
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AddTaskComment />
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button>Add task</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>
            Are you sure you want to delete the selected labels?
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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

export default TaskComments;
