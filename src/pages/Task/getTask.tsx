import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import TaskCommentList from "../TaskComment/TaskCommentList";
import TaskAttachment from "../TaskAttachment/GetAttachment";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useState } from "react";
import { useTaskById } from "../../hooks/useTasks";
const TaskDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Comments");
  const { data: task, isLoading, error } = useTaskById(Number(id));
  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error loading task!</p>;
  if (!task) return <p>Task not found!</p>;
  return (
    <>
      <div className="w-full min-w-0">
        <p className="text-blue-300 font-bold text-2xl flex items-center gap-2 mb-3">
          <DescriptionIcon className="text-blue-300 text-2xl" /> Task Details
        </p>
        <p className="text-black-600 font-semibold text-xl">{task.title}</p>
        <p className="mt-3">Description: {task.description}</p>
        <p className="mt-3 text-gray-700 flex items-center gap-2">
          <span>Status:</span>
          {task.isCompleted ? (
            <AssignmentTurnedInIcon className="text-green-600" />
          ) : (
            <HourglassEmptyIcon className="text-yellow-600" />
          )}
          <span
            className={task.isCompleted ? "text-green-600" : "text-yellow-600"}
          >
            {task.isCompleted ? "Completed" : "Pending"}
          </span>
        </p>
        <p className="mt-3">Category: {task.categoryName}</p>
        <p className="mt-3">
          <span className="text-gray-600">Label: </span>
          <span className="text-blue-500">
            {task.labels?.join(", ") || "No labels"}
          </span>
        </p>
      </div>
      <div className="mt-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2${
              activeTab === "Comments"
                ? "border-b-2 border-green-200 text-green-800"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("Comments")}
          >
            Comments
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "Attachments"
                ? "border-b-2 border-green-200 text-green-800"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("Attachments")}
          >
            Attachments
          </button>
        </div>
        <div className="mt-3">
          {activeTab === "Comments" ? (
            <TaskCommentList taskId={task.id || 0} />
          ) : (
            <TaskAttachment taskId={task.id || 0} />
          )}
        </div>
      </div>
    </>
  );
};

export default TaskDetail;
