import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBoard } from "@/hooks/useBoard";

import Task from "@/model/Task";

interface TaskListProps {
    tasks: Task[];
    onEditTask: (taskIndex: number) => void;
    onDeleteTask: (taskIndex: number) => void;
  }

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  const dispatch = useDispatch();
  const activeBoard = useSelector((state: any) => state.ui.activeBoard);
  const { boards, isLoading, error } = useBoard();
  const board = boards && boards.length > activeBoard ? boards[activeBoard] : null;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading boards</div>;
  if (!board || !board.columns?.length) return <div>No tasks found</div>;



  return (
    <div className="p-10 max-w-5xl min-w-4xl overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">Task List</h2>
      <table className="min-w-full table-auto max-w-5xl ">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-r border-l">Title</th>
            <th className="py-2 px-4 border-b border-r  border-l">Description</th>
            <th className="py-2 px-4 border-b border-r border-l">Priority</th>
            <th className="py-2 px-4 border-b border-r border-l">Status</th>
            {/* <th className="py-2 px-4 border-b border-r border-l">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, taskIndex) => (
            <tr key={taskIndex} className="min-w-3xl ">
              <td className="py-2 px-4 border-b border-r border-l">{task.title}</td>
              <td className="py-2 px-4 border-b border-r">{task.description||"No Task Description"}</td>
              <td className="py-2 px-4 border-b border-r">{task.priority}</td>
              <td className="py-2 px-4 border-b border-r">{task.status}</td>
              {/* <td className="py-2 px-4 border-b border-r">
                <button
                  className="text-primary2 hover:underline mr-2"
                  onClick={() => onEditTask(taskIndex)}
                >
                  Edit
                </button>
                <button
                  className="text-destructive1 hover:underline"
                  onClick={() => onDeleteTask(taskIndex)}
                >
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
};

export default TaskList;
