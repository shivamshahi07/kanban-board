import { useEffect, useState } from "react";
import Header from "@/layout/Header";
import Sidebar from "@/layout/Sidebar";
import Tasks from "@/layout/Tasks";
import Board from "@/model/Board";
import { getData } from "@/utils/boards-fs";
import { useBoard } from "@/hooks/useBoard";
import TaskList from "@/components/TaskList"; 

import { useDispatch, useSelector } from "react-redux";
import {
  selectBoard,
  selectModal,
  selectSidebar,
  selectTask,
  setActiveModal,
  setOpenedTask,
} from "@/store/uiSlice";

import CreateBoard from "@/components/CreateBoard";
import CreateTask from "@/components/CreateTask";
import Delete from "@/components/Delete";
import EditBoard from "@/components/EditBoard";
import Modal from "@/components/UI/Modal";
import ViewTask from "@/components/ViewTask";
import { useCreateBoard } from "@/hooks/useCreateBoard";
import { useDeleteBoard } from "@/hooks/useDeleteBoard";
import { useUpdateBoard } from "@/hooks/useUpdateBoard";

import ModalEnum from "@/model/ModalEnum";
import Task from "@/model/Task";
import EditTask from "@/components/EditTask";
import { DropResult, resetServerContext } from "react-beautiful-dnd";
import MobileBoards from "@/components/MobileBoards";
import connectMongo from "@/database/connectMongo";
import BoardsModel from "@/database/data";
import Spinner from "@/components/UI/Spinner";
import Head from "next/head";
import { useRouter } from "next/router";

interface HomeProps {
  prefetchedData: { boards: Board[] };
}
import {
  setActiveBoard,
} from "@/store/uiSlice";
import { createTaskApi, deleteTaskApi, moveTaskApi, updateBoardApi, updateTaskApi } from "@/services/apiBoards";
import { QueryClient,useQueryClient } from "@tanstack/react-query";
const Home: React.FC = () => {
  const { boards, isLoading, error } = useBoard();
  const queryClient = useQueryClient();
  const { createBoard, isCreating } = useCreateBoard();
  const { deleteBoard, isDeleting } = useDeleteBoard();
  const { updateBoard, isUpdating } = useUpdateBoard();
  const activeBoard = useSelector(selectBoard);
  const activeModal = useSelector(selectModal);
  const openedTask = useSelector(selectTask);
  const sidebarIsOpen = useSelector(selectSidebar);
  const router = useRouter();
  const [isListView, setIsListView] = useState(false); // Track the view mode

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const html = document.querySelector("html");
    html?.classList.add(localStorage.getItem("theme") || "light");
  }, []);

  useEffect(() => {
    if (boards && boards.length > 0 && activeBoard === -1) {
      dispatch(setActiveBoard(0));
    }
  }, [boards, activeBoard, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading boards</div>;
  if (!boards || boards.length === 0) return <div>No boards found</div>;
  const toggleView = () => {
    setIsListView(!isListView); // Toggle between board and list view
  };


  const handleAddNewTask = async (task: Task) => {
    try {
      queryClient.setQueryData(['boards'], (oldData: any) => {
        if (!oldData || !Array.isArray(oldData) || oldData.length <= activeBoard) {
          console.error("Invalid boards data in cache", oldData);
          return oldData;
        }

        const newBoards = JSON.parse(JSON.stringify(oldData));
        const board = newBoards[activeBoard];

        if (!board || !board.columns) {
          console.error("Invalid board structure", board);
          return oldData;
        }

        const targetColumn = board.columns.find(col => col.name === task.status);
        if (!targetColumn) {
          console.error("Target column not found", task.status);
          return oldData;
        }

        targetColumn.tasks.push(task);
        return newBoards;
      });

      // Update the server
      const updatedBoard = await createTaskApi(boards[activeBoard]._id, task.status, task);

      // Update the cache with the server response
      queryClient.setQueryData(['boards'], (oldData: any) => {
        const newBoards = [...oldData];
        newBoards[activeBoard] = updatedBoard;
        return newBoards;
      });

      dispatch(setActiveModal(undefined));
      dispatch(setOpenedTask(undefined));
    } catch (error) {
      console.error("Error adding new task:", error);
      // Revert the change in case of an error
      queryClient.invalidateQueries(['boards']);
      // Handle error (e.g., show an error message to the user)
    }
  };

  // ... (rest o

 
  const handleDeleteTask = async () => {
  try {
    if (!boards || activeBoard === -1 || !openedTask) {
      console.error("Invalid board or task data");
      return;
    }

    const task = boards[activeBoard].columns[openedTask.colIndex].tasks[openedTask.taskIndex];

    // Optimistic update to remove the task from the UI before hitting the server
    queryClient.setQueryData(['boards'], (oldData: any) => {
      if (!oldData || !Array.isArray(oldData) || oldData.length <= activeBoard) {
        console.error("Invalid boards data in cache", oldData);
        return oldData;
      }

      const newBoards = JSON.parse(JSON.stringify(oldData)); // Deep clone the boards
      const board = newBoards[activeBoard];

      if (!board || !board.columns || board.columns.length <= openedTask.colIndex) {
        console.error("Invalid board structure", board);
        return oldData;
      }

      const column = board.columns[openedTask.colIndex];
      if (!column || !column.tasks) {
        console.error("Invalid column structure", column);
        return oldData;
      }

      // Remove the task from the column
      column.tasks.splice(openedTask.taskIndex, 1);

      return newBoards;
    });

    // Call the API to delete the task on the server
    await deleteTaskApi(boards[activeBoard]._id, task.status, task._id);

    // Sync the local state with the server (optional, as the optimistic update is already done)
    queryClient.invalidateQueries(['boards']); // Ensure consistency by refetching the latest data from the server

    // Close the modal and clear the opened task
    dispatch(setActiveModal(undefined));
    dispatch(setOpenedTask(undefined));

  } catch (error) {
    console.error("Error deleting task:", error);
    // Revert the optimistic update in case of an error
    queryClient.invalidateQueries(['boards']);
  }
};



  const handleChangeTask = (task: Task) => {
    const board = { ...boards[activeBoard] };
    if (openedTask) {
      board.columns[openedTask.colIndex].tasks[openedTask.taskIndex] = task;
      updateBoard({ id: activeBoard.toString(), board });
    }
  };

  const handleEditTask = async (task: Task) => {
    try {
      if (boards && activeBoard !== -1 && openedTask) {
        const oldTask = boards[activeBoard].columns[openedTask.colIndex].tasks[openedTask.taskIndex];
        const updatedBoard = await updateTaskApi(boards[activeBoard]._id, task, oldTask.status, task.status);
        // Update local state
        const newBoards = [...boards];
        newBoards[activeBoard] = updatedBoard;
        // Update your Redux store or state management with the new boards array
        dispatch(setActiveModal(undefined));
        dispatch(setOpenedTask(undefined));
      }
    } catch (error) {
      console.error("Error editing task:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };
  const handleChangeTaskStatus = (status: string) => {
    const board = { ...boards[activeBoard] };
    if (openedTask) {
      //first of all get a copy of the task.
      const updatedTask =
        board.columns[openedTask.colIndex].tasks[openedTask.taskIndex];
      updatedTask.status = status;

      //delete task from current column
      board.columns[openedTask.colIndex].tasks.splice(openedTask.taskIndex, 1);

      //add the task to target column. first find it's index
      const targetColIndex = board.columns.findIndex(
        (el: { name: string; tasks: Task[] }) => el.name === status
      );

      if (targetColIndex > -1) {
        board.columns[targetColIndex].tasks.push(updatedTask);
      }
      const openedTaskOld = { ...openedTask };

      dispatch(
        setOpenedTask({
          taskIndex:
            boards[activeBoard].columns[targetColIndex].tasks.length - 1,
          colIndex: targetColIndex,
        })
      );

      //finally update global state of boards
      updateBoard(
        { id: activeBoard.toString(), board },
        {
          onError: () => {
            dispatch(setOpenedTask(openedTaskOld));
          },
        }
      );
    }
  };

  const reorder = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // const handleDragEnd = ({ source, destination }: DropResult) => {
  //   if (!destination) {
  //     return;
  //   }

  //   const board = { ...boards[activeBoard] };

  //   const srcCol = parseInt(source.droppableId);
  //   const desCol = parseInt(destination.droppableId);

  //   if (srcCol === desCol) {
  //     const updatedTasks = reorder(
  //       [...board.columns[srcCol].tasks],
  //       source.index,
  //       destination.index
  //     );
  //     board.columns[srcCol].tasks = updatedTasks;
  //     updateBoard({ id: activeBoard.toString(), board });

  //     return;
  //   }

  //   //add to destionation col
  //   board.columns[desCol].tasks.splice(
  //     destination.index,
  //     0,
  //     board.columns[srcCol].tasks[source.index]
  //   );

  //   //remove task from src
  //   board.columns[srcCol].tasks.splice(source.index, 1);
  //   updateBoard({ id: activeBoard.toString(), board });
  // };
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || !boards || boards.length === 0) {
      console.log("Drag aborted: No destination or no boards available");
      return;
    }

    const srcCol = parseInt(source.droppableId);
    const desCol = parseInt(destination.droppableId);

    queryClient.setQueryData(['boards'], (oldData: any) => {
      if (!oldData || !Array.isArray(oldData) || oldData.length <= activeBoard) {
        console.error("Invalid boards data in cache", oldData);
        return oldData;
      }

      const newBoards = JSON.parse(JSON.stringify(oldData));
      const board = newBoards[activeBoard];

      if (!board || !board.columns || board.columns.length <= srcCol || board.columns.length <= desCol) {
        console.error("Invalid board structure", board);
        return oldData;
      }

      const sourceColumn = board.columns[srcCol];
      const destColumn = board.columns[desCol];

      if (!sourceColumn.tasks || !destColumn.tasks) {
        console.error("Invalid column structure", sourceColumn, destColumn);
        return oldData;
      }

      const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
      destColumn.tasks.splice(destination.index, 0, movedTask);

      return newBoards;
    });

    try {
      if (!boards[activeBoard] || !boards[activeBoard]._id) {
        throw new Error("Invalid board data");
      }
      // Update the server
      await moveTaskApi(
        boards[activeBoard]._id,
        srcCol,
        desCol,
        source.index,
        destination.index
      );

      // Refetch to ensure consistency
      queryClient.invalidateQueries(['boards']);
    } catch (error) {
      console.error("Error moving task:", error);
      // Revert the change in case of an error
      queryClient.invalidateQueries(['boards']);
    }
  };

  return (
    <>
      <Head>
        <title>Kanban Application</title>
      </Head>
      <main className="text-black dark:text-white bg-white dark:bg-black2 h-screen flex">
        <div className="flex flex-col overflow-hidden w-full">
        <Header isListView={isListView} toggleView={toggleView} />
          <div
            className={`app-container  ${
              sidebarIsOpen ? "app-container--visible" : "app-container--hidden"
            }`}
          >
            
            <Sidebar />
            
            <div className=" mx-auto">
            {isListView ? (
                <TaskList
                  tasks={boards[activeBoard]?.columns.flatMap(col => col.tasks) || []}
                  
                />
              ) : (
                <Tasks onDragEnd={handleDragEnd} />
              )}
            </div>
          </div>
          {/* liading spinner */}
          {(isDeleting || isUpdating || isCreating) && <Spinner />}
        </div>
        {activeModal === ModalEnum.CREATE_BOARD && (
          <Modal onClickBackdrop={() => dispatch(setActiveModal(undefined))}>
            <CreateBoard onCreateBoard={(board: Board) => createBoard(board)} />
          </Modal>
        )}

        {activeModal === ModalEnum.EDIT_BOARD && (
          <Modal onClickBackdrop={() => dispatch(setActiveModal(undefined))}>
            <EditBoard
              board={boards?.[activeBoard]}
              onEditBoard={(board: Board) =>
                updateBoard({ id: activeBoard.toString(), board })
              }
            />
          </Modal>
        )}

        {activeModal === ModalEnum.DELETE_BOARD && (
          <Modal onClickBackdrop={() => dispatch(setActiveModal(undefined))}>
            <Delete
              title="Delete this board?"
              description={`Are you sure you want to delete the ‘${boards[activeBoard].name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
              onCancel={() => dispatch(setActiveModal(undefined))}
              onConfirm={() => deleteBoard(activeBoard.toString())}
            />
          </Modal>
        )}

        {activeModal === ModalEnum.CREATE_TASK && (
          <Modal
            onClickBackdrop={() => {
              dispatch(setActiveModal(undefined));
            }}
          >
            <CreateTask
              columns={boards[activeBoard]?.columns?.map(
                (col: { name: string; tasks: Task[] }) => {
                  return { label: col.name, value: col.name };
                }
              )}
              onCreateTask={handleAddNewTask}
            />
          </Modal>
        )}

        {openedTask && activeModal === ModalEnum.EDIT_TASK && (
          <Modal
            onClickBackdrop={() => {
              dispatch(setActiveModal(undefined));
              dispatch(setOpenedTask(undefined));
            }}
          >
            <EditTask
              task={
                boards[activeBoard].columns[openedTask.colIndex].tasks[
                  openedTask.taskIndex
                ]
              }
              columns={boards[activeBoard].columns.map(
                (col: { name: string; tasks: Task[] }) => {
                  return { label: col.name, value: col.name };
                }
              )}
              onEditTask={handleEditTask}
            />
          </Modal>
        )}

        {openedTask && activeModal === ModalEnum.VIEW_TASK && (
          <Modal
            onClickBackdrop={() => {
              dispatch(setActiveModal(undefined));
              dispatch(setOpenedTask(undefined));
            }}
          >
            <ViewTask
              task={
                boards[activeBoard].columns[openedTask.colIndex].tasks[
                  openedTask.taskIndex
                ]
              }
              columns={boards[activeBoard].columns.map(
                (col: { name: string; tasks: Task[] }) => {
                  return { label: col.name, value: col.name };
                }
              )}
              onChangeTask={handleChangeTask}
              handleChangeTaskStatus={handleChangeTaskStatus}
              onDeleteTask={() =>
                dispatch(setActiveModal(ModalEnum.DELETE_TASK))
              }
            />
          </Modal>
        )}

        {openedTask && activeModal === ModalEnum.DELETE_TASK && (
          <Modal onClickBackdrop={() => dispatch(setOpenedTask(undefined))}>
            <Delete
              title="Delete this task?"
              description={`Are you sure you want to delete the ‘${
                boards[activeBoard].columns[openedTask.colIndex].tasks[
                  openedTask.taskIndex
                ].title
              }’ task ? This action cannot be reversed.`}
              onCancel={() => {
                dispatch(setActiveModal(undefined));
                dispatch(setOpenedTask(undefined));
              }}
              onConfirm={handleDeleteTask}
            />
          </Modal>
        )}

        {activeModal === ModalEnum.MOBILE_MENU && (
          <Modal
            center={false}
            onClickBackdrop={() => dispatch(setActiveModal(undefined))}
          >
            <MobileBoards />
          </Modal>
        )}
      </main>
    </>
  );
};

export default Home;


