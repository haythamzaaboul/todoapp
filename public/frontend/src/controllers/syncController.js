import { tasksToBeSynced, upsertFromRemote, markTodosAsSynced } from "../services/sync.services.js";


export const listTodosToSync = async (req, res) => {
    try {
        const todos = await tasksToBeSynced();
        res.status(200).json({ todos });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const importRemoteTodos = async (req, res) => {
    try {
        const todos = Array.isArray(req.body.todos) ? req.body.todos : [];
        const result = await upsertFromRemote(todos);
        res.status(200).json({ status: "success", imported: result?.inserted || 0, updated: result?.updated || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const markSyncedTodos = async (req, res) => {
    try {
        const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
        const changes = await markTodosAsSynced(ids);
        res.status(200).json({ status: "success", updated: changes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default { listTodosToSync, importRemoteTodos, markSyncedTodos };
