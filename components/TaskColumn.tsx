import React, { useState } from "react"; // Added useState
import Task from "@/model/Task";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PriorityBadge from "./prioritybadge";
import { Calendar } from "lucide-react";

// Added SortOption type
type SortOption = "priority" | "duedate" | "none";

interface TaskColumnProps {
  col: { name: string; tasks: Task[] };
  onClickedTask: (index: number) => void;
  id: string;
}

const colColors = [
  "bg-[#49C4E5]",
  "bg-[#8471F2]",
  "bg-[#f3e849]",
  "bg-[#67E2AE]",
  "bg-[#ee9b57]",
  "bg-[#cbabe9]",
];

const TaskColumn: React.FC<TaskColumnProps> = ({ col, onClickedTask, id }) => {
  // Added state for sorting
  const [sortBy, setSortBy] = useState<SortOption>("none");

  // Added sorting function
  const sortTasks = (tasks: Task[]): Task[] => {
    if (sortBy === 'priority') {
      const priorityOrder = { Low: 1, Medium: 2, High: 3 };
      return [...tasks].sort((a, b) => 
        priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    } else if (sortBy === "duedate") {
      return [...tasks].sort(
        (a, b) => new Date(a.duedate).getTime() - new Date(b.duedate).getTime()
      );
    }
    return tasks;
  };

  // Sort the tasks
  const sortedTasks = sortTasks(col.tasks);
  console.log("TaskColumn - sortedTasks:", sortedTasks);

  return (
    <div className="w-[280px] shrink-0 h-full">
      <div className="flex mb-6">
        <div
          className={`w-4 h-4 ${
            colColors?.[parseInt(id)] ||
            colColors?.[parseInt(id) - colColors.length]
          } rounded-full inline-block mr-3`}
        ></div>
        <h4 className="text-gray3">
          {col.name} ({col.tasks.length})
        </h4>
      </div>

      {/* Added sorting options */}
      <div className="mb-4">
        <select
          className="p-2 bg-white dark:bg-black2 rounded border border-gray2 text-base focus:border-primary2 focus:ring-0"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="none">Sort by</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <Droppable droppableId={`${id}`}>
        {(provided) => (
          <ul
            className="space-y-5 pb-6 "
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sortedTasks.map((task, index) => (
              <Draggable
                draggableId={id + index.toString()}
                index={index}
                key={index}
              >
                {(provided, snapshot) => {
                  return (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <section
                        className="py-6 px-4 bg-white dark:bg-black2 rounded-lg shadow-task cursor-pointer"
                        onClick={(e) => onClickedTask(index)}
                      >
                        <h3 className="mb-2">{task.title}</h3>
                        {/* Added priority and due date display */}
                        <p className="text-sm text-gray3 font-bold">
                          <PriorityBadge  priority={task.priority} />
                        </p>
                        <p className="text-sm text-gray3 font-bold flex mt-2 items-center justify-center">
                         <Calendar /> Due: {task.duedate||'No due date'}
                        </p>
                      </section>
                    </li>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
