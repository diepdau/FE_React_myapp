import React, { useEffect, useState } from "react";
import { useTaskLabelsStore } from "../../store/taskLabels";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ConfirmDialog from "../../components/ConfirmDialog";

const TaskLabels = () => {
  const { taskLabels, getTaskLabels, getTaskLabelsByTaskId, deleteTaskLabels } =
    useTaskLabelsStore();
  const [selectedRows, setSelectedRows] = useState<
    { taskId: number; labelId: number }[]
  >([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  useEffect(() => {
    getTaskLabelsByTaskId(3);
  }, []);
  const rowsWithId = taskLabels.map((label, index) => ({
    id: index,
    ...label,
  }));

  const handleRowSelection = (newSelection: GridRowSelectionModel) => {
    const selectedData = newSelection
      .map((rowId) => {
        const row = rowsWithId.find((r) => r.id === rowId);
        return row ? { taskId: row.taskId, labelId: row.labelId } : null;
      })
      .filter(Boolean) as { taskId: number; labelId: number }[];
    setSelectedRows(selectedData);
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(
        selectedRows.map(({ taskId, labelId }) =>
          deleteTaskLabels(taskId, labelId)
        )
      );
      toast.success("Task labels deleted successfully!");
      setSelectedRows([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete task label:", error);
      toast.error("Failed to delete task label.");
    }
  };

  const columns: GridColDef[] = [
    { field: "labelId", headerName: "Label ID", width: 130 },
    { field: "taskId", headerName: "Task ID", width: 130 },
    { field: "labelName", headerName: "Label Name", width: 200 },
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
      <div style={{ marginBottom: 10 }}></div>
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rowsWithId}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={handleRowSelection}
          sx={{ border: 0 }}
        />
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Alert"
        description="Are you sure you want to delete this label?"
      />
    </>
  );
};

export default TaskLabels;
