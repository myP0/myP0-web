import { writable } from 'svelte/store';

const CLIENT_ID = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || '';
const SCOPES = [
	'https://www.googleapis.com/auth/calendar.readonly',
	'https://www.googleapis.com/auth/drive.appdata',
	'https://www.googleapis.com/auth/tasks'
].join(' ');

export interface GoogleUser {
	name: string;
	email: string;
	picture: string;
}

export interface AuthState {
	isSignedIn: boolean;
	user: GoogleUser | null;
	accessToken: string | null;
	loading: boolean;
}

const initialState: AuthState = {
	isSignedIn: false,
	user: null,
	accessToken: null,
	loading: true
};

export const authStore = writable<AuthState>(initialState);

let tokenClient: google.accounts.oauth2.TokenClient | null = null;

function parseJwt(token: string): Record<string, string> {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const json = decodeURIComponent(
		atob(base64)
			.split('')
			.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join('')
	);
	return JSON.parse(json);
}

function loadScript(src: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			resolve();
			return;
		}
		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`Failed to load ${src}`));
		document.head.appendChild(script);
	});
}

export async function initAuth(): Promise<void> {
	if (!CLIENT_ID) {
		authStore.set({ ...initialState, loading: false });
		console.warn('PUBLIC_GOOGLE_CLIENT_ID not set. Google SSO disabled.');
		return;
	}

	try {
		await loadScript('https://accounts.google.com/gsi/client');

		// Check for existing session
		const savedToken = sessionStorage.getItem('google_access_token');
		const savedUser = sessionStorage.getItem('google_user');
		const savedExpiry = sessionStorage.getItem('google_token_expiry');

		if (savedToken && savedUser && savedExpiry) {
			const expiry = parseInt(savedExpiry, 10);
			if (Date.now() < expiry) {
				authStore.set({
					isSignedIn: true,
					user: JSON.parse(savedUser),
					accessToken: savedToken,
					loading: false
				});
				initTokenClient();
				return;
			}
			// Token expired, clear stored data
			sessionStorage.removeItem('google_access_token');
			sessionStorage.removeItem('google_user');
			sessionStorage.removeItem('google_token_expiry');
		}

		initTokenClient();
		authStore.update((s) => ({ ...s, loading: false }));
	} catch (err) {
		console.error('Failed to initialize Google auth:', err);
		authStore.set({ ...initialState, loading: false });
	}
}

function initTokenClient() {
	tokenClient = google.accounts.oauth2.initTokenClient({
		client_id: CLIENT_ID,
		scope: SCOPES,
		callback: handleTokenResponse
	});
}

async function handleTokenResponse(response: google.accounts.oauth2.TokenResponse) {
	if (response.error) {
		console.error('Token error:', response.error);
		return;
	}

	const accessToken = response.access_token;
	const expiresIn = parseInt(response.expires_in, 10);
	const expiry = Date.now() + expiresIn * 1000;

	// Fetch user info
	try {
		const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		const info = await res.json();

		const user: GoogleUser = {
			name: info.name || info.email,
			email: info.email,
			picture: info.picture || ''
		};

		sessionStorage.setItem('google_access_token', accessToken);
		sessionStorage.setItem('google_user', JSON.stringify(user));
		sessionStorage.setItem('google_token_expiry', expiry.toString());

		authStore.set({
			isSignedIn: true,
			user,
			accessToken,
			loading: false
		});
	} catch (err) {
		console.error('Failed to fetch user info:', err);
	}
}

export function signIn() {
	if (tokenClient) {
		tokenClient.requestAccessToken({ prompt: 'consent' });
	}
}

export function signOut() {
	const token = sessionStorage.getItem('google_access_token');
	if (token) {
		google.accounts.oauth2.revoke(token, () => {});
	}

	sessionStorage.removeItem('google_access_token');
	sessionStorage.removeItem('google_user');
	sessionStorage.removeItem('google_token_expiry');

	authStore.set({
		isSignedIn: false,
		user: null,
		accessToken: null,
		loading: false
	});
}

export function getAccessToken(): string | null {
	return sessionStorage.getItem('google_access_token');
}
