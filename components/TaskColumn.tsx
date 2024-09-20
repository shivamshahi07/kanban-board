// CHANGE: Added useState and useMemo imports
import React, { useState, useMemo } from 'react';
import Task from "@/model/Task";
import { Draggable, Droppable } from "react-beautiful-dnd";
import PriorityBadge from "./prioritybadge";
// CHANGE: Added ChevronDown import for the dropdown icon
import { ChevronDown } from 'lucide-react';

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
  // CHANGE: Added state for sorting criteria
  const [sortCriteria, setSortCriteria] = useState<'none' | 'priority' | 'date'>('none');

  // CHANGE: Added useMemo hook for sorting tasks
  const sortedTasks = useMemo(() => {
    let sorted = [...col.tasks];
    if (sortCriteria === 'priority') {
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      sorted.sort((a, b) => priorityOrder[a.priority.toLowerCase()] - priorityOrder[b.priority.toLowerCase()]);
    } else if (sortCriteria === 'date') {
      sorted.sort((a, b) => new Date(a.duedate).getTime() - new Date(b.duedate).getTime());
    }
    return sorted;
  }, [col.tasks, sortCriteria]);

  return (
    <div className="w-[280px] shrink-0 h-full">
      {/* CHANGE: Modified header to include sorting dropdown */}
      <div className="flex mb-6 justify-between items-center">
        <div className="flex items-center">
          <div
            className={`w-4 h-4 ${
              colColors?.[parseInt(id)] ||
              colColors?.[parseInt(id) - colColors.length]
            } rounded-full inline-block mr-3`}
          ></div>
          <h4 className="text-gray3">
            {col.name} ({sortedTasks.length})
          </h4>
        </div>
        {/* CHANGE: Added sorting dropdown */}
        <div className="relative">
          <select
            className="appearance-none bg-white2 dark:bg-black2 border border-gray3 dark:border-gray3 rounded-md py-2 px-3 pr-8 leading-tight focus:outline-none focus:border-blue-500 text-sm"
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value as 'none' | 'priority' | 'date')}
          >
            <option value="none">Sort by</option>
            <option value="priority">Priority</option>
            <option value="date">Date</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <Droppable droppableId={`${id}`}>
        {(provided) => (
          <ul
            className="space-y-5 pb-6"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* CHANGE: Now mapping over sortedTasks instead of col.tasks */}
            {sortedTasks.map((task, index) => (
              <Draggable
                draggableId={id + index.toString()}
                index={index}
                key={index}
              >
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <section
                      className="py-6 px-4 bg-white dark:bg-black2 rounded-lg shadow-task cursor-pointer"
                      onClick={(e) => onClickedTask(index)}
                    >
                      <h3 className="mb-2">{task.title||'No title'}</h3>
                      {/* CHANGE: Added container for priority badge and due date */}
                      <div className="flex justify-between items-center mb-2">
                        <PriorityBadge priority={task.priority||'Low'} />
                        {/* CHANGE: Added due date display */}
                        <span className="text-sm text-gray3">{task.duedate||'No due date'}</span>
                      </div>
                    </section>
                  </li>
                )}
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