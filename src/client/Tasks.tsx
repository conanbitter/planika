import { useState } from "react";
import type { Task } from "../common";

interface TaskItemParams {
    task: Task,
    id: number,
    onSetDone: (id: number, done: boolean) => void,
    onDelete: (id: number) => void
}

function TaskItem(params: TaskItemParams) {
    const toggleDone = () => {
        params.onSetDone(params.id, !params.task.done);
    }

    return <div>
        <span onClick={toggleDone}>{params.task.done ? "[X]" : "[ ]"}</span>
        <span>{params.task.title}</span>
        <span onClick={() => params.onDelete(params.id)}>[DEL]</span>
    </div>
}

interface TaskNewParams {
    onNewTask: (title: string) => void;
}

function TaskNew(params: TaskNewParams) {
    const [value, setValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            params.onNewTask(value);
            setValue("");
        }
    };

    return <div>
        <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="New task..."
        />
    </div>
}

export function TaskList(props: { tasks: Task[] }) {
    const [tasks, setTasks] = useState(props.tasks);

    const setDone = (id: number, done: boolean) => {
        const newTasks = tasks.map((task, index) => {
            if (index == id) {
                return { ...task, done };
            } else {
                return task;
            }
        })
        setTasks(newTasks);
    }

    const deleteItem = (id: number) => {
        const newTasks = tasks.filter((_, index) => index != id);
        setTasks(newTasks);
    }

    const addItem = (title: string) => {
        const newTasks = [
            ...tasks,
            { done: false, title }
        ];
        setTasks(newTasks);
    }

    const list = tasks.map((task, id) => <TaskItem
        task={task}
        key={id}
        id={id}
        onSetDone={setDone}
        onDelete={deleteItem}
    />);
    return <div>
        {list}
        <TaskNew onNewTask={addItem} />
    </div>
}