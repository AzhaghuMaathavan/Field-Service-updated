import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { Link } from "react-router-dom";

const TaskList = () => {
  const { tasks } = useContext(TaskContext);

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id}>
          <p>
            {task.name} - {task.status}
          </p>
          <Link to={`/tasks/${task.id}`}>
            <button>View Details</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
