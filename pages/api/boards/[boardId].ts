import connectMongo from "@/database/connectMongo";
import UserModel from "@/database/data";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "@/middleware/auth-middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Connecting to MongoDB...");
  await connectMongo();
  console.log("Connected to MongoDB");

  const userId = (req as any).userId;
  const boardId = req.query.boardId as string;

  try {
    console.log("Fetching user:", userId);
    const user = await UserModel.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const boardIndex = user.boards.findIndex(
      (board: any) => board._id.toString() === boardId
    );
    if (boardIndex === -1) {
      console.log("Board not found. BoardId:", boardId);
      console.log("Available board IDs:", user.boards.map((b: any) => b._id.toString()));
      return res.status(404).json({ message: "Board not found" });
    }

    if (req.method === "GET") {
      console.log("Fetching board:", boardId);
      res.status(200).json(user.boards[boardIndex]);
    }

    if (req.method === "DELETE") {
      console.log("Deleting board:", boardId);
      user.boards.splice(boardIndex, 1);
      await user.save();
      res.status(200).json({});
    }

    if (req.method === "PATCH") {
      console.log("Updating board:", boardId);
      const { action } = req.body;

      if (action === 'addTask') {
        const { columnName, task } = req.body;
        const column = user.boards[boardIndex].columns.find((col: any) => col.name === columnName);
        if (column) {
          column.tasks.push(task);
        }
      } else if (action === 'updateTask') {
        const { task, oldStatus, newStatus } = req.body;
        const oldColumn = user.boards[boardIndex].columns.find((col: any) => col.name === oldStatus);
        const newColumn = user.boards[boardIndex].columns.find((col: any) => col.name === newStatus);
        if (oldColumn && newColumn) {
          const taskIndex = oldColumn.tasks.findIndex((t: any) => t._id.toString() === task._id);
          if (taskIndex !== -1) {
            oldColumn.tasks.splice(taskIndex, 1);
            newColumn.tasks.push(task);
          }
        }
      } else if (action === 'deleteTask') {
        const { columnName, taskId } = req.body;
        const column = user.boards[boardIndex].columns.find((col: any) => col.name === columnName);
        if (column) {
          const taskIndex = column.tasks.findIndex((t: any) => t._id.toString() === taskId);
          if (taskIndex !== -1) {
            column.tasks.splice(taskIndex, 1);
          }
        }
      } else if (action === 'moveTask') {
        const { sourceColIndex, destColIndex, sourceIndex, destIndex } = req.body;
        const sourceColumn = user.boards[boardIndex].columns[sourceColIndex];
        const destColumn = user.boards[boardIndex].columns[destColIndex];
    
        if (sourceColumn && destColumn) {
          const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
          destColumn.tasks.splice(destIndex, 0, movedTask);
        }
      } else {
        user.boards[boardIndex] = req.body;
      }

      await user.save();
      res.status(200).json(user.boards[boardIndex]);
    }
  } catch (error) {
    console.error("Error in board API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default authMiddleware(handler);
