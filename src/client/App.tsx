import type { Task } from "../common";
import { TaskList } from "./Tasks";

const mockTasks: Task[] = [
    { done: false, title: "Task 1" },
    { done: false, title: "Task 2" },
    { done: true, title: "Task 3" },
    { done: false, title: "Task 4" },
    { done: false, title: "Task 5" },
    { done: false, title: "Task 6" },
];

export function App() {
    return <>
        <h3>Hello App!</h3>
        <TaskList tasks={mockTasks} />
    </>
}