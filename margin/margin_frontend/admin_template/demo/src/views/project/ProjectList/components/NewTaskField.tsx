import { useState, useRef, useEffect, useMemo } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'

type Task = {
    label?: string
    checked: boolean
}

type NewTaskFieldProps = {
    onAddNewTask: (taskCount: {
        completedTask: number
        totalTask: number
    }) => void
}

const NewTaskField = ({ onAddNewTask }: NewTaskFieldProps) => {
    const [newTaskEdit, setNewTaskEdit] = useState(false)
    const [taskList, setTaskList] = useState<Task[]>([])

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (newTaskEdit) {
            inputRef?.current?.focus()
        }
    }, [newTaskEdit])

    const taskCount = useMemo(() => {
        let completedTask = 0
        const totalTask = taskList.length

        taskList.forEach((task) => {
            if (task.checked) {
                completedTask = completedTask + 1
            }
        })

        return {
            completedTask,
            totalTask,
        }
    }, [taskList])

    useEffect(() => {
        onAddNewTask(taskCount)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskList])

    const onNewTaskEdit = () => {
        setNewTaskEdit(true)
    }

    const onNewTaskAdd = () => {
        const newTask = {
            label: inputRef?.current?.value,
            checked: false,
        }
        setTaskList((prevTask) => [...prevTask, newTask])
        setNewTaskEdit(false)
    }

    const onTaskCheckChange = (checked: boolean, index: number) => {
        setTaskList((prevTask) => {
            const mutatedPrevTask = prevTask.map((task, taskIndex) => {
                if (index === taskIndex) {
                    task.checked = checked
                }
                return task
            })
            return [...mutatedPrevTask]
        })
    }

    return (
        <div className="mb-7">
            {taskList.length > 0 && (
                <div className="flex flex-col mb-5">
                    {taskList.map((task, index) => (
                        <Checkbox
                            key={index}
                            defaultChecked={task.checked}
                            onChange={(checked) =>
                                onTaskCheckChange(checked as boolean, index)
                            }
                        >
                            {task.label}
                        </Checkbox>
                    ))}
                </div>
            )}
            {newTaskEdit ? (
                <div className="flex items-center gap-2">
                    <Input ref={inputRef} placeholder="Add new task" />
                    <Button type="button" onClick={onNewTaskAdd}>
                        Add
                    </Button>
                </div>
            ) : (
                <Button block className="border-dashed" onClick={onNewTaskEdit}>
                    Create new task
                </Button>
            )}
        </div>
    )
}

export default NewTaskField
