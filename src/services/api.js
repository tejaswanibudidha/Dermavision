const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const ANALYSIS_STORAGE_KEY = 'dermavision.latestAnalysis';
const CURRENT_USER_STORAGE_KEY = 'dermavision.currentUser';

async function parseJsonResponse(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.detail || 'Request failed. Please try again.';
        throw new Error(message);
    }

    return data;
}

export async function createUser(payload) {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function loginUser(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function requestPasswordReset(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function resetPassword(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function verifyPasswordResetOtp(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function setNewPassword(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/set-new-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    return parseJsonResponse(response);
}

export async function getUserById(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return parseJsonResponse(response);
}

export async function updateUser(userId, payload) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response);
}

export async function uploadUserAvatar(userId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
    });

    return parseJsonResponse(response);
}

export async function removeUserAvatar(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
        method: 'DELETE',
    });

    return parseJsonResponse(response);
}

export function setCurrentUser(user) {
    try {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } catch {
        // Ignore localStorage write errors.
    }
}

export function getCurrentUser() {
    try {
        const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function clearCurrentUser() {
    try {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch {
        // Ignore localStorage remove errors.
    }
}

function setCachedAnalysis(analysis) {
    try {
        localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
    } catch {
        // Ignore localStorage write errors (private mode, quota, etc.)
    }
}

export function getCachedAnalysis() {
    try {
        const raw = localStorage.getItem(ANALYSIS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export async function analyzeImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
    });

    const analysis = await parseJsonResponse(response);
    setCachedAnalysis(analysis);
    return analysis;
}

export async function getLatestAnalysis() {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/latest`);
        const analysis = await parseJsonResponse(response);
        setCachedAnalysis(analysis);
        return analysis;
    } catch (error) {
        const cached = getCachedAnalysis();
        if (cached) {
            return cached;
        }

        throw error;
    }
}

export { API_BASE_URL };
