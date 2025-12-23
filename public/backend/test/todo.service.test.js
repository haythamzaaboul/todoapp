import { test } from 'node:test';
import assert from 'node:assert/strict';
import todoService from '../services/todo.service.js';
import { upsertTodo } from '../services/sync.service.js';

class MockDb {
    constructor() {
        this.calls = [];
    }

    async query(sql, values) {
        const normalizedSql = sql.trim();
        this.calls.push({ sql: normalizedSql, values });

        // Simulate row returned only when user matches the allowed combination.
        if (normalizedSql.startsWith('UPDATE todos') && values[4] === 1 && values[5] === 10) {
            return { rows: [{ id: 1, user_id: 10, title: 'updated' }] };
        }
        if (normalizedSql.startsWith('DELETE FROM todos') && values[0] === 1 && values[1] === 10) {
            return { rows: [{ id: 1, user_id: 10 }] };
        }
        if (normalizedSql.startsWith('INSERT INTO todos (id')) {
            return { rows: [{ id: values[0], user_id: values[1], title: values[2] }] };
        }
        if (normalizedSql.startsWith('INSERT INTO todos (user_id')) {
            return { rows: [{ id: 99, user_id: values[0], title: values[1] }] };
        }

        return { rows: [] };
    }
}

test('updateTodo is scoped by user_id', async () => {
    const db = new MockDb();
    const found = await todoService.updateTodo(1, 10, 'new title', null, true, null, db);
    assert.equal(found.user_id, 10);
    assert.ok(db.calls[0].sql.includes('user_id = $6'));

    const missing = await todoService.updateTodo(1, 99, 'new title', null, true, null, db);
    assert.equal(missing, undefined);
});

test('deleteTodo is scoped by user_id', async () => {
    const db = new MockDb();
    const deleted = await todoService.deleteTodo(1, 10, db);
    assert.equal(deleted.user_id, 10);
    assert.ok(db.calls[0].sql.includes('user_id = $2'));

    const missing = await todoService.deleteTodo(1, 99, db);
    assert.equal(missing, undefined);
});

test('upsertTodo includes user_id on conflict paths', async () => {
    const db = new MockDb();
    const existing = await upsertTodo(10, { id: 5, title: 'hello' }, db);
    assert.equal(existing.user_id, 10);
    const insertCall = db.calls.find((c) => c.sql.startsWith('INSERT INTO todos (id'));
    assert.ok(insertCall);
    assert.equal(insertCall.values[1], 10);

    const created = await upsertTodo(11, { title: 'new one' }, db);
    assert.equal(created.user_id, 11);
    const insertNewCall = db.calls.find((c) => c.sql.startsWith('INSERT INTO todos (user_id'));
    assert.ok(insertNewCall);
    assert.equal(insertNewCall.values[0], 11);
});
