import { getAccessToken } from './auth';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

export interface DriveFile {
	id: string;
	name: string;
	mimeType: string;
	modifiedTime: string;
}

/**
 * Find a file by name in appDataFolder.
 * Returns the file ID if found, null otherwise.
 */
export async function findAppFile(name: string): Promise<string | null> {
	const token = getAccessToken();
	if (!token) return null;

	const params = new URLSearchParams({
		spaces: 'appDataFolder',
		q: `name = '${name}' and trashed = false`,
		fields: 'files(id,name,modifiedTime)',
		pageSize: '1'
	});

	try {
		const res = await fetch(`${DRIVE_API}/files?${params}`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		if (!res.ok) {
			console.error('Drive API search error:', res.status, await res.text());
			return null;
		}

		const data = await res.json();
		return data.files?.[0]?.id || null;
	} catch (err) {
		console.error('Failed to search Drive files:', err);
		return null;
	}
}

/**
 * Read a JSON file from appDataFolder.
 * Returns parsed JSON or null if not found.
 */
export async function readAppFile<T = unknown>(name: string): Promise<T | null> {
	const token = getAccessToken();
	if (!token) return null;

	const fileId = await findAppFile(name);
	if (!fileId) return null;

	try {
		const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		if (!res.ok) {
			console.error('Drive API read error:', res.status, await res.text());
			return null;
		}

		return await res.json();
	} catch (err) {
		console.error('Failed to read Drive file:', err);
		return null;
	}
}

/**
 * Write a JSON file to appDataFolder.
 * Creates the file if it doesn't exist, updates it otherwise.
 * Returns the file ID.
 */
export async function writeAppFile(name: string, data: unknown): Promise<string | null> {
	const token = getAccessToken();
	if (!token) return null;

	const body = JSON.stringify(data);
	const existingId = await findAppFile(name);

	try {
		if (existingId) {
			// Update existing file
			const res = await fetch(
				`${UPLOAD_API}/files/${existingId}?uploadType=media`,
				{
					method: 'PATCH',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					},
					body
				}
			);

			if (!res.ok) {
				console.error('Drive API update error:', res.status, await res.text());
				return null;
			}

			const result = await res.json();
			return result.id;
		} else {
			// Create new file with multipart upload
			const metadata = {
				name,
				parents: ['appDataFolder'],
				mimeType: 'application/json'
			};

			const boundary = 'myp0_boundary';
			const multipart =
				`--${boundary}\r\n` +
				`Content-Type: application/json; charset=UTF-8\r\n\r\n` +
				`${JSON.stringify(metadata)}\r\n` +
				`--${boundary}\r\n` +
				`Content-Type: application/json\r\n\r\n` +
				`${body}\r\n` +
				`--${boundary}--`;

			const res = await fetch(
				`${UPLOAD_API}/files?uploadType=multipart`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': `multipart/related; boundary=${boundary}`
					},
					body: multipart
				}
			);

			if (!res.ok) {
				console.error('Drive API create error:', res.status, await res.text());
				return null;
			}

			const result = await res.json();
			return result.id;
		}
	} catch (err) {
		console.error('Failed to write Drive file:', err);
		return null;
	}
}

/**
 * Delete a file from appDataFolder by name.
 */
export async function deleteAppFile(name: string): Promise<boolean> {
	const token = getAccessToken();
	if (!token) return false;

	const fileId = await findAppFile(name);
	if (!fileId) return false;

	try {
		const res = await fetch(`${DRIVE_API}/files/${fileId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` }
		});

		if (!res.ok) {
			console.error('Drive API delete error:', res.status, await res.text());
			return false;
		}

		return true;
	} catch (err) {
		console.error('Failed to delete Drive file:', err);
		return false;
	}
}

/**
 * List all files in appDataFolder.
 */
export async function listAppFiles(): Promise<DriveFile[]> {
	const token = getAccessToken();
	if (!token) return [];

	const params = new URLSearchParams({
		spaces: 'appDataFolder',
		fields: 'files(id,name,mimeType,modifiedTime)',
		pageSize: '100',
		q: 'trashed = false'
	});

	try {
		const res = await fetch(`${DRIVE_API}/files?${params}`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		if (!res.ok) {
			console.error('Drive API list error:', res.status, await res.text());
			return [];
		}

		const data = await res.json();
		return data.files || [];
	} catch (err) {
		console.error('Failed to list Drive files:', err);
		return [];
	}
}
