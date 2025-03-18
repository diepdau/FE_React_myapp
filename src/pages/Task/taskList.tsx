// import * as React from "react";
// import {
//   DataGrid,
//   GridRowModel,
//   GridColDef,
//   GridRowSelectionModel,
//   GridRenderCellParams,
//   GridActionsCellItem,
// } from "@mui/x-data-grid";
// import Snackbar from "@mui/material/Snackbar";
// import Alert, { AlertProps } from "@mui/material/Alert";
// import dayjs from "dayjs";
// import { useTaskStore } from "../../store/task";
// import { useCategoryStore } from "../../store/category";
// import { toast } from "react-toastify";
// import {
//   Button,
//   MenuItem,
//   Select,
//   Dialog,
//   DialogActions,
//   DialogTitle,
// } from "@mui/material";
// import useStore from "../../store";
// import DeleteIcon from "@mui/icons-material/DeleteOutlined";
// import AddTask from "./addTask";
// import Task from "./getTask";
// export default function TaskList() {
//   const user = useStore();
//   const { tasks, getTasks, updateTask, deleteTask } = useTaskStore();
//   const { categories, getCategories } = useCategoryStore();
//   const [selectedRows, setSelectedRows] = React.useState<GridRowSelectionModel>(
//     []
//   );
//   const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

//   const [snackbar, setSnackbar] = React.useState<Pick<
//     AlertProps,
//     "children" | "severity"
//   > | null>(null);

//   React.useEffect(() => {
//     getTasks();
//     getCategories();
//   }, []);

//   const processRowUpdate = React.useCallback(
//     async (newRow: GridRowModel) => {
//       try {
//         const updatedTask = {
//           id: newRow.id,
//           title: newRow.title,
//           description: newRow.description,
//           isCompleted: newRow.isCompleted ?? false,
//           createdAt: newRow.createdAt || new Date().toISOString(),
//           userId: Number(user?.authUser?.id),
//           categoryId: newRow.categoryId,
//         };
//         console.log("update", updatedTask);
//         await updateTask(updatedTask);
//         toast.success("Task updated successfully!");
//         return updatedTask;
//       } catch (error) {
//         toast.error("Failed to update task.");
//         console.error("Update Task Error:", error);
//         throw error;
//       }
//     },
//     [updateTask]
//   );

//   const handleProcessRowUpdateError = React.useCallback((error: Error) => {
//     setSnackbar({ children: error.message, severity: "error" });
//   }, []);

//   const handleDeleteConfirm = async () => {
//     try {
//       await Promise.all(selectedRows.map((id) => deleteTask(id as number)));
//       toast.success("Task(s) deleted successfully!");
//       setSelectedRows([]); 
//       setDeleteDialogOpen(false);
//     } catch (error) {
//       toast.error("Failed to delete task(s).");
//     }
//   };
  

//   const columns: GridColDef[] = [
//     { field: "id", headerName: "ID", width: 70 },
//     { field: "title", headerName: "Title", width: 130, editable: true },
//     {
//       field: "description",
//       headerName: "Description",
//       width: 200,
//       editable: true,
//     },
//     {
//       field: "isCompleted",
//       headerName: "Status",
//       type: "boolean",
//       width: 120,
//       editable: true,
//     },
//     {
//       field: "categoryId",
//       headerName: "categoryId",
//       width: 150,
//       editable: true,
//       renderCell: (params: GridRenderCellParams) => {
//         const category = categories.find((c) => c.id === params.row.categoryId);
//         return category ? category.name: "Unknown";
//       },
//       renderEditCell: (params) => (
//         <Select
//           value={params.value}
//           onChange={(e) =>
//             params.api.setEditCellValue({
//               id: params.id,
//               field: params.field,
//               value: e.target.value,
//             })
//           }
//           fullWidth
//         >
//           {categories.map((category) => (
//             <MenuItem key={category.id} value={category.id}>
//               {category.name}
//             </MenuItem>
//           ))}
//         </Select>
//       ),
//     },
//     {
//       field: "createdAt",
//       headerName: "Created At",
//       width: 150,
//       type: "dateTime",
//       editable: true,
//       valueFormatter: (params: { value: any }) =>
//         dayjs(params.value).format("DD/MM/YYYY"),
//     },
//     { field: "userName", headerName: "User Name", width: 150 },
//     { field: "labels", headerName: "Labels", width: 120 },
//     {
//       field: "actions",
//       type: "actions",
//       headerName: "Actions",
//       width: 100,
//       cellClassName: "actions",
//       getActions: ({ id }) => {
//         return [
//           <GridActionsCellItem
//             icon={<DeleteIcon />}
//             label="Delete"
//             onClick={() => {
//               setSelectedRows([id]); 
//               setDeleteDialogOpen(true); 
//             }}
//             color="inherit"
//           />,
//         ];
//       },
//     },
//   ];
//   const [open, setOpen] = React.useState(false);
//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };
//   return (
//     <div style={{ height: 500, width: "100%" }}>
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Add Task
//       </Button>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <AddTask />
//         <DialogActions>
//           <Button autoFocus onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button>Add task</Button>
//         </DialogActions>
//       </Dialog>
//       <DataGrid
//         rows={tasks}
//         columns={columns}
//         checkboxSelection
//         onRowSelectionModelChange={(newSelection) =>
//           setSelectedRows(newSelection)
//         }
//         processRowUpdate={processRowUpdate}
//         onProcessRowUpdateError={handleProcessRowUpdateError}
//       />

//       {!!snackbar && (
//         <Snackbar
//           open
//           autoHideDuration={6000}
//           onClose={() => setSnackbar(null)}
//         >
//           <Alert {...snackbar} onClose={() => setSnackbar(null)} />
//         </Snackbar>
//       )}

//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>
//           Are you sure you want to delete the selected tasks?
//         </DialogTitle>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteConfirm} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Task />
//     </div>
//   );
// }

import * as React from "react";
import {
  DataGrid,
  GridRowModel,
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  GridRowParams 
} from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import dayjs from "dayjs";
import { useTaskStore } from "../../store/task";
import { useCategoryStore } from "../../store/category";
import { toast } from "react-toastify";
import { MenuItem, Select, Dialog,  DialogContent, Button } from "@mui/material";
import useStore from "../../store";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddTask from "./addTask";
import ConfirmDialog from "../../components/ConfirmDialog"; 
import { useNavigate } from "react-router-dom"; 
export default function TaskList() {
  const user = useStore();
  const { tasks, getTasks, updateTask, deleteTask } = useTaskStore();
  const { categories, getCategories } = useCategoryStore();
  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, "children" | "severity"> | null>(null);
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleRowDoubleClick = (params: GridRowParams) => {
    navigate(`/tasks/${params.row.id}`); 
  };
  React.useEffect(() => {
    getTasks();
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
        toast.success("Task updated successfully!");
        return updatedTask;
      } catch (error) {
        toast.error("Failed to update task.");
        throw error;
      }
    },
    [updateTask]
  );

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

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
  const handleAddTask = () => {
    console.log("Adding Task...");
    handleCloseDialog(); 
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 130, editable: true },
    { field: "description", headerName: "Description", width: 200, editable: true },
    { field: "isCompleted", headerName: "Status", type: "boolean", width: 120, editable: true },
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
      valueFormatter: (params: { value: any }) => dayjs(params.value).format("DD/MM/YYYY"),
    },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "labels", headerName: "Labels", width: 120 },
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
            setSelectedRow(id as number);
            setDeleteDialogOpen(true);
          }}
          color="inherit"
        />,
      ],
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
       <Button variant="outlined" onClick={handleOpenDialog}>
        Add Task
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
        onRowDoubleClick={handleRowDoubleClick} 
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />

      {!!snackbar && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSnackbar(null)}>
          <Alert {...snackbar} onClose={() => setSnackbar(null)} />
        </Snackbar>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure you want to delete this task?"
      />
    </div>
  );
}
