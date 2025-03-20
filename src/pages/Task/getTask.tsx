import { useParams } from "react-router-dom";
import { useTaskStore } from "../../store/task";
import { CircularProgress } from "@mui/material";
import { Task } from "../../api/types";
import TaskCommentList from "../TaskComment/TaskCommentList";
import TaskAttachment from "../TaskAttachment/getAttachment";
import { useState, useEffect } from "react";
const TaskDetail = () => {
  const { id } = useParams();
  const { getTaskById } = useTaskStore();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comments");
  useEffect(() => {
    const fetchTask = async () => {
      const fetchedTask = await getTaskById(Number(id));
      setTask(fetchedTask);
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!task) return <p>Không tìm thấy công việc!</p>;
  return (
    <>
      <div className="w-full min-w-0">
        <p className="text-black-600 font-bold text-2xl">{task.title}</p>
        <p className="mt-3">Description: {task.description}</p>
        <p className="mt-3">
          Status: {task.isCompleted ? "Completed ✅" : "Pending ⏳"}
        </p>
        <p className="mt-3">Category Name: {task.categoryName}</p>
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
              activeTab === "comments"
                ? "border-b-2 border-green-200 text-green-800"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "attachments"
                ? "border-b-2 border-green-200 text-green-800"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("attachments")}
          >
            Attachments
          </button>
        </div>
        <div className="mt-3">
          {activeTab === "comments" ? (
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
