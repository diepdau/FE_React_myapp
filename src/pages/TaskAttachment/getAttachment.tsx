import React, { useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { Dialog, DialogContent } from "@mui/material";
import {
  useTaskAttachmentsByTaskId,
  useDeleteTaskAttachment,
  useDownloadTaskAttachment,
} from "../../hooks/useTaskAttachments";
import AddTaskAttachment from "./AddTaskAttachment";
import ConfirmDialog from "../../components/ConfirmDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddIcon from "@mui/icons-material/Add";
import TableViewOutlinedIcon from "@mui/icons-material/TableViewOutlined";
import { useQueryClient } from "@tanstack/react-query";
import PageviewOutlinedIcon from "@mui/icons-material/PageviewOutlined";
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
    case "xls":
    case "xlsx":
      return <TableViewOutlinedIcon sx={{ color: "green", marginRight: 1 }} />;
    default:
      return <InsertDriveFileIcon sx={{ color: "#ffa939", marginRight: 1 }} />;
  }
};
const TaskAttachment = ({ taskId }: { taskId: number }) => {
  const { data: taskAttachments = [], isLoading } =
    useTaskAttachmentsByTaskId(taskId);
  const deleteAttachment = useDeleteTaskAttachment();
  const downloadAttachment = useDownloadTaskAttachment();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["taskAttachments"] });
  };
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
      field: "uploadedAt",
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
          icon={<PageviewOutlinedIcon className="text-blue-300" />}
          label="View"
          onClick={() => {
            if (row.fileUrl) {
              window.open(row.fileUrl, "_blank");
            } else {
              console.error("No file URL available");
            }
          }}
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
        <GridActionsCellItem
          icon={<DownloadIcon style={{ color: "orange" }} />}
          label="Download"
          onClick={() => downloadAttachment.mutate(row.fileName)}
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
      await Promise.all(
        selectedRows.map((id) => deleteAttachment.mutateAsync(id))
      );
      toast.success("Task attachment deleted successfully!");
      setSelectedRows([]);
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response.data.message || "Failed to delete task attachment."
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <Paper className="p-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl">Task Attachments</p>
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
            handleOnSuccess={handleSuccess}
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
        loading={isLoading}
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
