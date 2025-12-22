import {addTask,updateTaskStatus, deleteTask, getAllTasks } from '../services/task.services.js';

const getAllTasksController = async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.status(200).json(tasks);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addTaskController = async (req, res) => {
    try {
        const {taskName, description, remoteId, dueDate} = req.body;
        const result = await addTask(taskName, description, remoteId, dueDate);
        res.status(201).json({ id: result.id, remoteId: result.remoteId, dueDate: result.dueDate });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

const updateTaskStatusController = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;
        const result = await updateTaskStatus(id, status);
        res.status(200).json({ changes: result.changes });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

const deleteTaskController = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await deleteTask(id);
        res.status(200).json({ changes: result.changes });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

export {
    getAllTasksController,
    addTaskController,
    updateTaskStatusController,
    deleteTaskController
};
