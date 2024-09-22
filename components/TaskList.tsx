import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useBoard } from "@/hooks/useBoard";
import Task from "@/model/Task";

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const dispatch = useDispatch();
  const activeBoard = useSelector((state: any) => state.ui.activeBoard);
  const { boards, isLoading, error } = useBoard();
  const board = boards && boards.length > activeBoard ? boards[activeBoard] : null;

  // State for sorting
  const [sortBy, setSortBy] = useState<"priority" | "duedate" | "none">("none");

  // Sorting function
  const sortTasks = (tasks: Task[]) => {
    if (sortBy === 'priority') {
      const priorityOrder = { Low: 1, Medium: 2, High: 3 };
      return [...tasks].sort((a, b) => 
        priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    } else if (sortBy === "duedate") {
      return [...tasks].sort(
        (a, b) => (new Date(a.duedate).getTime() || 0) - (new Date(b.duedate).getTime() || 0)
      );
    }
    return tasks;
  };

  const sortedTasks = sortTasks(tasks);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading boards</div>;
  if (!board || !board.columns?.length) return <div>No tasks found</div>;

  return (
    <div className="p-10 max-w-5xl min-w-4xl overflow-x-auto ">
      <h2 className="text-2xl font-bold mb-6">Task List</h2>

      {/* Sorting options */}
      <div className="mb-4">
        <select
          className="p-2 bg-white dark:bg-black2 rounded border border-gray2 text-base focus:border-primary2 focus:ring-0"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "priority" | "duedate" | "none")}
        >
          <option value="none">Sort by</option>
          <option value="priority">Priority</option>
          <option value="duedate">Due Date</option>
        </select>
      </div>

      <table className="min-w-full table-auto max-w-5xl">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-r border-l">Title</th>
            <th className="py-2 px-4 border-b border-r border-l">Description</th>
            <th className="py-2 px-4 border-b border-r border-l">Priority</th>
            <th className="py-2 px-4 border-b border-r border-l">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task, taskIndex) => (
            <tr key={taskIndex} className="min-w-3xl">
              <td className="py-2 px-4 border-b border-r border-l">{task.title}</td>
              <td className="py-2 px-4 border-b border-r">{task.description || "No Task Description"}</td>
              <td className="py-2 px-4 border-b border-r">{task.priority}</td>
              <td className="py-2 px-4 border-b border-r">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
