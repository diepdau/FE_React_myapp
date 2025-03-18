import { useParams } from "react-router-dom";
import { useTaskStore } from "../../store/task";
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { Task } from "../../api/types";
import TaskComments from "../TaskComment/taskComments";

const TaskDetail = () => {
  const { id } = useParams();
  const { getTaskById } = useTaskStore();
  const [task, setTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const fetchedTask = await getTaskById(Number(id)); 
      setTask(fetchedTask); 
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!task) return <Typography>Không tìm thấy công việc!</Typography>;

  return (
    <Card className="p-5 mx-auto w-1/2 mt-10 shadow-lg">
      <CardContent>
        <Typography variant="h5" className="text-blue-600 font-bold">
          {task.title}
        </Typography>
        <Typography variant="body1">{task.description}</Typography>
        <Typography variant="body2" className="mt-3">
          Status: {task.isCompleted ? "Completed ✅" : "Pending ⏳"}
        </Typography>
      </CardContent>
      <TaskComments taskId={task.id || 0} />
    </Card>
  );
};

export default TaskDetail;
