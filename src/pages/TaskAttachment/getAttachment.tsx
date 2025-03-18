import React, { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { Dialog, DialogContent } from "@mui/material";
import { useTaskAttachmentsStore } from "../../store/taskAttachments";
import AddTaskAttachment from "./addTaskAttachment";
import ConfirmDialog from "../../components/ConfirmDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const TaskAttachment = ({ taskId }: { taskId: number }) => {
  const { taskAttachments, getTaskAttachmentsByTaskId, deleteTaskAttachments } =
    useTaskAttachmentsStore();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  useEffect(() => {
    getTaskAttachmentsByTaskId(taskId);
  }, []);
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
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
            setDeleteDialogOpen(true);
          }}
          color="inherit"
        />,
      ],
    },
  ];
  const handleDeleteConfirm = async () => {
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
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <Paper sx={{ height: 800, width: "100%" }}>
        <Button variant="outlined" onClick={handleOpenDialog}>
          Add Task
        </Button>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogContent>
            <AddTaskAttachment handleCloseDialog={handleCloseDialog} />
          </DialogContent>
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
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure you want to delete this task?"
      />
    </>
  );
};

export default TaskAttachment;
