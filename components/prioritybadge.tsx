import React from 'react';

const PriorityBadge = ({ priority }) => {
  let badgeColor = "";
  
  switch (priority.toLowerCase()) {
    case "low":
      badgeColor = "bg-lowpriority   text-white hover:bg-blue-600";
      break;
    case "medium":
      badgeColor = "bg-mediumpriority text-white2 hover:bg-yellow-600";
      break;
    case "high":
      badgeColor = "bg-highpriority text-white3 hover:bg-red-600";
      break;
    default:
      badgeColor = "bg-gray-500 text-white hover:bg-gray-600";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor} transition-colors duration-300`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;