import {  useState } from "react";
import { useLabels,useDeleteLabel } from "../../hooks/useLabels";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ConfirmDialog from "../../components/ConfirmDialog";

const TaskLabels = () => {
  const { data: labels = [],isLoading  } = useLabels();
  const deleteLabelMutation = useDeleteLabel();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState<number | null>(null);
  const handleDelete = (labelId: number) => {
    setSelectedLabelId(labelId);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (selectedLabelId !== null) {
      deleteLabelMutation.mutate(selectedLabelId);
      setDeleteDialogOpen(false);
    }
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Label Name", width: 300 },
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
            onClick={() => handleDelete(id as number)}
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
          loading={isLoading} rows={labels}
          columns={columns}
          checkboxSelection
          sx={{ border: 0 }}
        />
         <ConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Delete"
          description="Are you sure you want to delete this label?"
        />
      </Paper>

    </>
  );
};

export default TaskLabels;
