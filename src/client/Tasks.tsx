import { useEffect, useRef, useState } from "react";
import type { Task } from "../common";

interface TaskItemProps {
    task: Task;
    id: number;
    onSetDone: (id: number, done: boolean) => void;
    onDelete: (id: number) => void;
    onBeginEdit: (id: number) => void;
}

function TaskItem(props: TaskItemProps) {
    const toggleDone = () => {
        props.onSetDone(props.id, !props.task.done);
    }

    return <div>
        <span onClick={toggleDone}>{props.task.done ? "[X]" : "[ ]"}</span>
        <span>{props.task.title}</span>
        <span onClick={() => props.onDelete(props.id)}>[DEL]</span>
        <span onClick={() => props.onBeginEdit(props.id)}>[EDIT]</span>
    </div>
}

interface TaskEditItemProps {
    task: Task;
    id: number;
    onFinishEdit: (id: number, title?: string) => void;
}

function TaskEditItem(props: TaskEditItemProps) {
    const [value, setValue] = useState(props.task.title);
    const componentRef = useRef<HTMLDivElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            props.onFinishEdit(props.id, value);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (componentRef.current && !componentRef.current.contains(event.target as HTMLElement)) {
            //console.log(value);
            props.onFinishEdit(props.id, value);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [value]);

    return <div ref={componentRef}>
        <span>{props.task.done ? "[X]" : "[ ]"}</span>
        <input
            autoFocus
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
        <span onClick={() => props.onFinishEdit(props.id, value)}>[OK]</span>
        <span onClick={() => props.onFinishEdit(props.id)}>[CANCEL]</span>
    </div>
}

interface TaskFixedProps {
    task: Task;
}

function TaskFixedItem(props: TaskFixedProps) {
    return <div>
        <span>{props.task.done ? "[X]" : "[ ]"}</span>
        <span>{props.task.title}</span>
    </div>
}

interface TaskNewProps {
    onNewTask: (title: string) => void;
    enabled: boolean;
}

function TaskNew(props: TaskNewProps) {
    const [value, setValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            props.onNewTask(value);
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
            disabled={!props.enabled}
        />
    </div>
}

export function TaskList(props: { tasks: Task[] }) {
    const [tasks, setTasks] = useState(props.tasks);
    const [editItem, setEditItem] = useState(-1);

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

    const beginEdit = (id: number) => {
        setEditItem(id);
    }

    const finishEdit = (id: number, title?: string) => {
        setEditItem(-1);
        if (title) {
            const newTasks = tasks.map((task, index) => {
                if (index == id) {
                    return { ...task, title };
                } else {
                    return task;
                }
            })
            setTasks(newTasks);
        }
    }

    const list = tasks.map((task, id) => {
        if (id == editItem) {
            return <TaskEditItem
                task={task}
                key={id}
                id={id}
                onFinishEdit={finishEdit}
            />
        } else if (editItem < 0) {
            return <TaskItem
                task={task}
                key={id}
                id={id}
                onSetDone={setDone}
                onDelete={deleteItem}
                onBeginEdit={beginEdit}
            />
        } else {
            return <TaskFixedItem task={task} key={id} />
        }
    });
    return <div>
        {list}
        <TaskNew onNewTask={addItem} enabled={editItem < 0} />
    </div>
}