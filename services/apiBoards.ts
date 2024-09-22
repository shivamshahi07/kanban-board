import Board from "@/model/Board";
import Task from "@/model/Task";
const BASE_URL = "api/boards";
const getToken = () => localStorage.getItem('token');

export const getBoards = async () => {
  const res = await fetch(`${BASE_URL}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  console.log("getBoards res:", res);
  if (!res.ok) throw new Error("Failed to fetch boards");
  return res.json();
};

export const createBoardApi = async (board: Board) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(board),
  });
  if (!response.ok) throw new Error("Failed to create board");
  return response.json();
};

export const updateBoardApi = async (id: string, board: Board) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(board),
  });
  if (!response.ok) throw new Error("Failed to update board");
  return response.json();
};


export const deleteBoardApi = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};
// export const createTaskApi = async (boardId: string, columnName: string, task: Task) => {
//   const response = await fetch(`${BASE_URL}/${boardId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       'Authorization': `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify({
//       action: 'addTask',
//       columnName,
//       task,
//     }),
//   });
//   if (!response.ok) throw new Error("Failed to create task");
//   return response.json();
// };

export const createTaskApi = async (boardId: string, columnName: string, task: Task) => {
  const response = await fetch(`${BASE_URL}/${boardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      action: 'addTask',
      columnName,
      task,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create task");
  }
  return response.json();
};
export const updateTaskApi = async (boardId: string, task: Task, oldStatus: string, newStatus: string) => {
  const response = await fetch(`${BASE_URL}/${boardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      action: 'updateTask',
      task,
      oldStatus,
      newStatus,
    }),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
};
export const deleteTaskApi = async (boardId: string, columnName: string, taskId: string) => {
  const response = await fetch(`${BASE_URL}/${boardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      action: 'deleteTask',
      columnName,
      taskId,
    }),
  });
  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
};
// export const moveTaskApi = async (boardId: string, sourceColIndex: number, destColIndex: number, sourceIndex: number, destIndex: number) => {
//   const response = await fetch(`${BASE_URL}/${boardId}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       'Authorization': `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify({
//       action: 'moveTask',
//       sourceColIndex,
//       destColIndex,
//       sourceIndex,
//       destIndex,
//     }),
//   });
//   if (!response.ok) throw new Error("Failed to move task");
//   return response.json();
// };
export const moveTaskApi = async (boardId: string, sourceColIndex: number, destColIndex: number, sourceIndex: number, destIndex: number) => {
  const response = await fetch(`${BASE_URL}/${boardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      action: 'moveTask',
      sourceColIndex,
      destColIndex,
      sourceIndex,
      destIndex,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to move task");
  }
  return response.json();
};