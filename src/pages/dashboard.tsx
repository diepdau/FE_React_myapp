import { Link } from "react-router-dom";
import TaskList from "./Task/taskList";
import TaskLabels from "./TaskLabel/taskLabel";

const Dashboard = () => {
  return (
    <div className="">
      <div className="my-9 hover:text-orange-600">
        <Link to="/task-attachments">Task atachment</Link>
      </div>
      <div className="my-9 hover:text-orange-600">
        <Link to="/task-labels">Task Labels</Link>
      </div>
      <div className="my-9 hover:text-orange-600">
        <Link to="/task-comments">Task Comment</Link>
      </div>
      <TaskList />
    </div>
  );
};

export default Dashboard;
