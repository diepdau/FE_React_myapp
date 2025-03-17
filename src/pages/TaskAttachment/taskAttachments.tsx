import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useTaskAttachmentsStore } from "../../store/taskAttachments";
import { useForm } from "react-hook-form";
import AddTaskAttachment from "./addTaskAttachment";
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "taskId", headerName: "TaskId", width: 130, editable: true },
  {
    field: "fileName",
    headerName: "FileName",
    width: 130,
    editable: true,
  },
  {
    field: "fileUrl",
    headerName: "FileUrl",
    width: 130,
    editable: true,
  },
  {
    field: "UploadedAt",
    headerName: "UploadedAt",
    width: 130,
    type: "dateTime",
    editable: true,
    valueFormatter: (params) => dayjs(params).format("DD/MM/YYYY"),
  },
];

const TaskAttachments = () => {
  const { taskAttachments, getTaskAttachmentsByTaskId, deleteTaskAttachments } =
    useTaskAttachmentsStore();

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  useEffect(() => {
    getTaskAttachmentsByTaskId(2);
  }, []);
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one task attachment to delete.");
      return;
    }
    try {
      await Promise.all(selectedRows.map((id) => deleteTaskAttachments(id)));
      toast.success("Task attachment deleted successfully!");
      setSelectedRows([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete task attachment.");
    }
  };
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <Paper sx={{ height: 800, width: "100%" }}>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add TaskComment
        </Button>
        <div className="py-3">
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={selectedRows.length === 0}
          >
            Delete
          </Button>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AddTaskAttachment />

          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button>Add task</Button>
          </DialogActions>
        </Dialog>
        <DataGrid
          editMode="row"
          rows={taskAttachments}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) =>
            setSelectedRows(newSelection as number[])
          }
          sx={{ border: 0 }}
        />
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Are you sure you want to delete the selected task TaskAttachments
          comment?
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
    </>
  );
};

export default TaskAttachments;
