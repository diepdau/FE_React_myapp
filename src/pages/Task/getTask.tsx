import { useEffect } from "react";
import { useTaskStore } from "../../store/task";

function Task() {
  const { tasks, getTaskById } = useTaskStore();
  useEffect(() => {
    getTaskById(2);
  }, []);
  return (
    <div className="App">
      <h1>Product Management</h1>
      <ul>
        {tasks.map((tasks) => (
          <li key={tasks.id}>
            {tasks.title} description {tasks.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Task;
