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
import DownloadIcon from "@mui/icons-material/Download";
import { downloadFileTaskAttachments } from "../../api/task-attachment";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddIcon from "@mui/icons-material/Add";
const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "jfif":
      return <ImageIcon sx={{ color: "#67acd4", marginRight: 1 }} />;
    case "pdf":
      return <PictureAsPdfIcon sx={{ color: "red", marginRight: 1 }} />;
    case "doc":
    case "docx":
      return <DescriptionIcon sx={{ color: "blue", marginRight: 1 }} />;
    default:
      return <InsertDriveFileIcon sx={{ color: "#ffa939", marginRight: 1 }} />;
  }
};
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
      headerName: "File Name",
      width: 200,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {getFileIcon(params.value)}
          {params.value}
        </div>
      ),
    },
    {
      field: "fileUrl",
      headerName: "FileUrl",
      width: 230,
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
      width: 180,
      cellClassName: "actions",
      getActions: ({ id, row }) => [
        <GridActionsCellItem
          icon={<DeleteIcon style={{ color: "red" }} />}
          label="Delete"
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DownloadIcon style={{ color: "orange" }} />}
          label="Download"
          onClick={() => {
            downloadFileTaskAttachments(row.fileName);
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
    <Paper className="p-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl">Task Attachments</p>
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
          <AddTaskAttachment
            Id={taskId}
            handleCloseDialog={handleCloseDialog}
          />
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Alert"
        description="Are you sure you want to delete this task attachment?"
      />
    </Paper>
  );
};

export default TaskAttachment;
