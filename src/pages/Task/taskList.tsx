import { useMemo, useState } from "react";
import {
  DataGrid,
  GridRowModel,
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useTasks, useUpdateTask, useDeleteTask } from "../../hooks/useTasks";
import { useCategories } from "../../hooks/useCategory";
import { useLabels } from "../../hooks/useLabels";
import {
  useCreateTaskLabel,
  useDeleteTaskLabel,
  useTaskLabels,
} from "../../hooks/useTaskLabels";

import { toast } from "react-toastify";
import {
  MenuItem,
  Select,
  Dialog,
  DialogContent,
  Button,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddTask from "./AddTask";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import SelectReact from "react-select";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Checkbox } from "@mui/material";
import { green, red } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import { ButtonDialog } from "../../components/ButtonDialog";
import SaveIcon from "@mui/icons-material/Save";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useQueryClient } from "@tanstack/react-query";

export default function TaskList() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data: tasks, isLoading, error } = useTasks();
  const { data: categories } = useCategories();
  const { data: labels } = useLabels();
  const { data: taskLabels } = useTaskLabels();
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [selectedTaskLabels, setSelectedTaskLabels] = useState<number[]>([]);
  const navigate = useNavigate();
  const [openLabelDialog, setOpenLabelDialog] = useState(false);
  const [editedRows, setEditedRows] = useState<{ [key: number]: any }>({});
  const [taskToDelete, setTaskToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const { mutateAsync: createTaskLabel } = useCreateTaskLabel();
  const { mutateAsync: deleteTaskLabel } = useDeleteTaskLabel();
  const filteredTasks = useMemo(() => {
    return tasks?.filter((task) => {
      const categoryMatch = selectedCategory
        ? task.categoryId === Number(selectedCategory)
        : true;
      const labelMatch =
        selectedLabels.length > 0
          ? selectedLabels.every((selectedLabelName) =>
              task.labels?.includes(selectedLabelName)
            )
          : true;
      const statusMatch =
        selectedStatus !== null ? task.isCompleted === selectedStatus : true;

      return categoryMatch && labelMatch && statusMatch;
    });
  }, [tasks, selectedCategory, selectedLabels, selectedStatus]);

  const handleEditClick = (id: number, row: any) => {
    setEditingTaskId(id);
    setEditedRows({ ...editedRows, [id]: row });
  };

  const handleSaveClick = async () => {
    if (editingTaskId === null) return;
    try {
      await updateTaskMutation.mutateAsync(editedRows[editingTaskId]);
      setEditingTaskId(null);
      setEditedRows({});
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    setEditedRows((prev) => ({ ...prev, [newRow.id]: newRow }));
    return newRow;
  };
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTaskMutation.mutateAsync(taskToDelete.id);
      setTaskToDelete(null);
      handleSuccess();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenLabelDialog = (
    taskId: number,
    currentLabelNames: string[]
  ) => {
    setEditingTaskId(taskId);
    const selectedLabelIds = labels
      ? labels
          .filter((label) => currentLabelNames.includes(label.name))
          .map((label) => label.id)
      : [];
    setSelectedTaskLabels(selectedLabelIds);
    setOpenLabelDialog(true);
  };

  const handleCloseLabelDialog = () => {
    setOpenLabelDialog(false);
    setEditingTaskId(null);
    setSelectedTaskLabels([]);
  };

  const handleLabelSelectionChange = (selectedOptions: any) => {
    setSelectedTaskLabels(selectedOptions.map((opt: any) => opt.value));
  };
  const handleSaveLabels = async () => {
    if (editingTaskId === null) return;
    const originalLabels = (
      tasks?.find((task) => task.id === editingTaskId)?.labels || []
    )
      .map((label) => {
        if (typeof label === "number") return label;
        const foundLabel = labels?.find((l) => l.name === label);
        return foundLabel ? foundLabel.id : NaN;
      })
      .filter((id) => !isNaN(id));

    const newLabels = selectedTaskLabels.map(Number);
    const labelsToAdd = newLabels.filter((id) => !originalLabels.includes(id));
    const labelsToRemove = originalLabels.filter(
      (id) => !newLabels.includes(id)
    );

    try {
      await Promise.all(
        labelsToAdd.map(async (labelId) => {
          const labelName =
            labels?.find((label) => label.id === labelId)?.name || "";
          await createTaskLabel({ taskId: editingTaskId, labelId, labelName });
        })
      );
      await Promise.all(
        labelsToRemove.map(async (labelId) => {
          await deleteTaskLabel({ taskId: editingTaskId, labelId });
        })
      );
      handleSuccess();
      handleCloseLabelDialog();
      toast.success("Labels updated successfully!");
    } catch (error) {
      toast.error("Failed to update labels.");
    }
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200, editable: true },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      editable: true,
    },
    {
      field: "isCompleted",
      headerName: "Status",
      width: 80,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <CheckBoxIcon style={{ color: green[500] }} />
        ) : (
          <CheckBoxOutlineBlankIcon style={{ color: red[500] }} />
        );
      },
      renderEditCell: (params: GridRenderCellParams) => {
        return (
          <Checkbox
            checked={params.value}
            onChange={(e) => {
              const newValue = e.target.checked;
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newValue,
              });
            }}
            style={{
              color: params.value ? green[500] : red[500],
            }}
          />
        );
      },
    },
    {
      field: "categoryId",
      headerName: "Category",
      width: 80,
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        const category = categories?.find(
          (c) => c.id === params.row.categoryId
        );
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
          {categories?.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      width: 120,
      type: "dateTime",
      editable: true,
      valueFormatter: (params) => dayjs(params).format("DD/MM/YYYY"),
    },
    { field: "userName", headerName: "User Name", width: 100 },
    {
      field: "labels",
      headerName: "Labels",
      width: 350,
      renderCell: (params: GridRenderCellParams) => {
        const labelIds = params.row.labels || [];
        const taskLabels =
          labels?.filter((label) => labelIds.includes(label.name)) || [];
        return (
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => handleOpenLabelDialog(params.row.id, labelIds)}
          >
            {taskLabels?.length > 0 ? (
              taskLabels?.map((label, index) => (
                <span
                  key={index}
                  style={{
                    marginRight: "6px",
                    backgroundColor: getRandomPastelColor(),
                    borderRadius: "12px",
                    padding: "5px 10px",
                    color: "#fff",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {label.name}
                </span>
              ))
            ) : (
              <span style={{ color: "#888" }}>No Labels</span>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: ({ row }) => {
        return editingTaskId === row.id
          ? [
              <GridActionsCellItem
                icon={<SaveIcon style={{ color: "green" }} />}
                label="Save"
                onClick={handleSaveClick}
                color="primary"
              />,
            ]
          : [
              <GridActionsCellItem
                icon={<WysiwygIcon style={{ color: "blue" }} />}
                label="View"
                onClick={() => navigate(`/tasks/${row.id}`)}
                color="primary"
              />,
              <GridActionsCellItem
                icon={
                  <DriveFileRenameOutlineIcon style={{ color: "orange" }} />
                }
                label="Edit"
                onClick={() => handleEditClick(row.id, row)}
                color="primary"
              />,
              <GridActionsCellItem
                icon={<DeleteIcon style={{ color: "red" }} />}
                label="Delete"
                onClick={() => {
                  setTaskToDelete({ id: row.id, title: row.title });
                  setDeleteDialogOpen(true);
                }}
                color="inherit"
              />,
            ];
      },
    },
  ];
  const getRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 127 + 127);
    const g = Math.floor(Math.random() * 127 + 127);
    const b = Math.floor(Math.random() * 127 + 127);
    return `rgb(${r}, ${g}, ${b})`;
  };
  return (
    <>
      {error ? (
        <p>Error loading task!</p>
      ) : (
        <Paper sx={{ width: "100%", padding: "1rem" }}>
          <p className="text-2xl">Task List</p>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogContent>
              <AddTask
                handleCloseDialog={handleCloseDialog}
                handleOnSuccess={handleSuccess}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={openLabelDialog}
            onClose={handleCloseLabelDialog}
            maxWidth="md"
            fullWidth
            PaperProps={{
              style: { minHeight: "160px", minWidth: "240px", padding: "10px" },
            }}
          >
            <DialogContent>
              <h3 className="text-lg font-semibold mb-3">Edit Labels</h3>
              <SelectReact
                isMulti
                options={labels?.map((label) => ({
                  value: label.id,
                  label: label.name,
                }))}
                value={selectedTaskLabels
                  .map((id) => {
                    const label = labels?.find((label) => label.id === id);
                    return label
                      ? { value: label.id, label: label.name }
                      : null;
                  })
                  .filter(Boolean)}
                onChange={handleLabelSelectionChange}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                placeholder="Select Labels"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
              <div className="flex justify-end space-x-3">
                <ButtonDialog
                  loading={false}
                  btnColor="bg-[#000000] hover:border-gray-100"
                  showCancel={true}
                  onCancel={handleCloseLabelDialog}
                  onClick={handleSaveLabels}
                >
                  Add
                </ButtonDialog>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-start space-x-3 mb-4">
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
            <Button
              variant="contained"
              startIcon={showFilters ? <CloseIcon /> : <FilterListIcon />}
              onClick={() => {
                if (showFilters) {
                  setSelectedCategory(null);
                  setSelectedStatus(null);
                  setSelectedLabels([]);
                }
                setShowFilters(!showFilters);
              }}
              sx={{
                textTransform: "none",
                borderRadius: "12px",
                backgroundColor: "#1976d2",
                color: "white",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              {showFilters ? "Close" : "Filter"}
            </Button>

            {showFilters && (
              <div className="flex space-x-3 items-start">
                <Select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  displayEmpty
                  sx={{ minWidth: 150, height: 40 }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  value={selectedStatus === null ? "" : selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value === "" ? null : e.target.value === "true"
                    )
                  }
                  displayEmpty
                  sx={{ minWidth: 150, height: 40 }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="true">Completed</MenuItem>
                  <MenuItem value="false">Not Completed</MenuItem>
                </Select>

                <div className="relative w-64">
                  <SelectReact
                    isMulti
                    options={labels?.map((label) => ({
                      value: label.name,
                      label: label.name,
                    }))}
                    value={selectedLabels.map((name) => ({
                      value: name,
                      label: name,
                    }))}
                    onChange={(selected) =>
                      setSelectedLabels(selected.map((opt) => opt.value))
                    }
                    placeholder="Filter by Labels"
                    className="basic-multi-select w-full"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: 40,
                        overflowY: "auto",
                        maxHeight: "none",
                      }),
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <DataGrid
            loading={isLoading}
            rows={filteredTasks}
            columns={columns}
            checkboxSelection
            processRowUpdate={processRowUpdate}
          />
          <ConfirmDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Alert"
            description={`Are you sure you want to delete "${taskToDelete?.title}"?`}
          />
        </Paper>
      )}
    </>
  );
}
