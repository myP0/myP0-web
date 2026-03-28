import { getAccessToken } from './auth';

const TASKS_API = 'https://www.googleapis.com/tasks/v1';

export interface TaskList {
	id: string;
	title: string;
	updatedAt: string;
}

export interface Task {
	id: string;
	title: string;
	notes: string;
	status: 'needsAction' | 'completed';
	due: string | null;
	completed: string | null;
	parent: string | null;
	position: string;
	updated: string;
}

interface GoogleTask {
	id: string;
	title?: string;
	notes?: string;
	status?: string;
	due?: string;
	completed?: string;
	parent?: string;
	position?: string;
	updated?: string;
}

interface GoogleTaskList {
	id: string;
	title?: string;
	updated?: string;
}

function mapTask(t: GoogleTask): Task {
	return {
		id: t.id,
		title: t.title || '',
		notes: t.notes || '',
		status: t.status === 'completed' ? 'completed' : 'needsAction',
		due: t.due || null,
		completed: t.completed || null,
		parent: t.parent || null,
		position: t.position || '',
		updated: t.updated || ''
	};
}

/**
 * Fetch all task lists for the user.
 */
export async function fetchTaskLists(): Promise<TaskList[]> {
	const token = getAccessToken();
	if (!token) return [];

	try {
		const res = await fetch(`${TASKS_API}/users/@me/lists?maxResults=100`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		if (!res.ok) {
			console.error('Tasks API list error:', res.status, await res.text());
			return [];
		}

		const data = await res.json();
		return (data.items || []).map((l: GoogleTaskList) => ({
			id: l.id,
			title: l.title || '',
			updatedAt: l.updated || ''
		}));
	} catch (err) {
		console.error('Failed to fetch task lists:', err);
		return [];
	}
}

/**
 * Fetch all tasks in a task list.
 * Includes completed tasks by default.
 */
export async function fetchTasks(
	taskListId: string = '@default',
	showCompleted: boolean = true
): Promise<Task[]> {
	const token = getAccessToken();
	if (!token) return [];

	const params = new URLSearchParams({
		maxResults: '100',
		showCompleted: showCompleted.toString(),
		showHidden: showCompleted.toString()
	});

	try {
		const res = await fetch(
			`${TASKS_API}/lists/${taskListId}/tasks?${params}`,
			{ headers: { Authorization: `Bearer ${token}` } }
		);

		if (!res.ok) {
			console.error('Tasks API fetch error:', res.status, await res.text());
			return [];
		}

		const data = await res.json();
		return (data.items || []).map(mapTask);
	} catch (err) {
		console.error('Failed to fetch tasks:', err);
		return [];
	}
}

/**
 * Create a new task in a task list.
 */
export async function createTask(
	taskListId: string = '@default',
	task: { title: string; notes?: string; due?: string }
): Promise<Task | null> {
	const token = getAccessToken();
	if (!token) return null;

	try {
		const res = await fetch(`${TASKS_API}/lists/${taskListId}/tasks`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: task.title,
				notes: task.notes,
				due: task.due ? new Date(task.due).toISOString() : undefined
			})
		});

		if (!res.ok) {
			console.error('Tasks API create error:', res.status, await res.text());
			return null;
		}

		return mapTask(await res.json());
	} catch (err) {
		console.error('Failed to create task:', err);
		return null;
	}
}

/**
 * Update an existing task.
 */
export async function updateTask(
	taskListId: string = '@default',
	taskId: string,
	updates: { title?: string; notes?: string; due?: string; status?: 'needsAction' | 'completed' }
): Promise<Task | null> {
	const token = getAccessToken();
	if (!token) return null;

	try {
		const res = await fetch(`${TASKS_API}/lists/${taskListId}/tasks/${taskId}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: updates.title,
				notes: updates.notes,
				due: updates.due ? new Date(updates.due).toISOString() : undefined,
				status: updates.status
			})
		});

		if (!res.ok) {
			console.error('Tasks API update error:', res.status, await res.text());
			return null;
		}

		return mapTask(await res.json());
	} catch (err) {
		console.error('Failed to update task:', err);
		return null;
	}
}

/**
 * Delete a task from a task list.
 */
export async function deleteTask(
	taskListId: string = '@default',
	taskId: string
): Promise<boolean> {
	const token = getAccessToken();
	if (!token) return false;

	try {
		const res = await fetch(`${TASKS_API}/lists/${taskListId}/tasks/${taskId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` }
		});

		if (!res.ok) {
			console.error('Tasks API delete error:', res.status, await res.text());
			return false;
		}

		return true;
	} catch (err) {
		console.error('Failed to delete task:', err);
		return false;
	}
}

/**
 * Toggle a task's completion status.
 */
export async function toggleTask(
	taskListId: string = '@default',
	taskId: string,
	currentStatus: 'needsAction' | 'completed'
): Promise<Task | null> {
	const newStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';
	return updateTask(taskListId, taskId, { status: newStatus });
}
