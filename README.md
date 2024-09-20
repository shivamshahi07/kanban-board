## Kanban Board

This is a simple Kanban board application built using React and Next.js. It allows you to create and manage tasks and boards, and provides a responsive UI for viewing and editing tasks.

## Features

- Create and manage tasks and boards
- View tasks in a Kanban board
- Edit tasks and boards
- Sort tasks by priority and due date
- Dark mode support

## Getting Started

To get started, follow these steps:

1. Clone the repository:

```bash
git clone git@github.com:shivamshahi07/kanban-board.git
```

2. Navigate to the project directory:

```bash
cd kanban-web-app-nextjs
```

3. Install the dependencies:

```bash
npm install
```

4. Create a .env file in the root directory and add the following content:

```
DB="mongodb+srv://your-username:your-password@cluster0.xxxx.mongodb.net/kanban?retryWrites=true&w=majority&appName=Cluster0"
```

Replace "your-username" and "your-password" with your MongoDB credentials.

5. Start the development server:

```bash
npm run dev
```

6. Open http://localhost:3000 in your browser to view the application.

    You should see a welcome message and a button to create a new board.

7. Click the "Create New Board" button to create a new board.

    You should see a form to enter the name of the board and a button to create the board.

8. Enter a name for the board and click the "Create" button.

    You should see the new board in the list of boards.

9. Click on the board name to view the tasks in the board.

    You should see a list of tasks in the board.

10. Click on a task to view the details of the task.

    You should see the task details, including the title, description, priority, due date, and subtasks.

11. Click on the "Edit Task" button to edit the task.

    You should see a form to edit the task details.

12. Enter the updated details and click the "Save Changes" button to save the changes.

    You should see the updated task details.
