import Subtask from "./Subtask";

interface Task {
  title: string;
  description: string;
  status: string;
  // subtasks: Subtask[];
  priority: string;
  duedate: string;
}
export default Task;
