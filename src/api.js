// src/api.js
const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[API ERROR]`, errorData);
        throw new Error(errorData.detail || `Erreur ${response.status}`);
    }
    return response.json();
}

function getAuthHeader() {
    const token = localStorage.getItem('dungeon_token');
    if (!token) {
        console.warn("[API WARNING] Pas de token trouvé !");
        return {};
    }
    return { 'Authorization': `Bearer ${token}` };
}

export async function registerUser(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
}

export async function loginUser(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });
    return handleResponse(response);
}

export async function saveScoreApi(scoreValue, levelReached) {
    console.log(`[API] Sauvegarde Score -> Val: ${scoreValue}, Lvl: ${levelReached}`);
    const response = await fetch(`${API_BASE_URL}/scores/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ score_value: scoreValue, level_reached: levelReached }),
    });
    return handleResponse(response);
}

export async function getLeaderboardApi(limit = 10) {
    const response = await fetch(`${API_BASE_URL}/scores/leaderboard?limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
}

export async function getMyProgressApi() {
    console.log("[API] Récupération progression...");
    const response = await fetch(`${API_BASE_URL}/progress/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
    const data = await handleResponse(response);
    console.log("[API] Progression reçue :", data.progression);
    return data;
}

// --- LE POINT CRITIQUE ---
export async function claimRewardApi(score, level) {
    console.log(`🚀 [API] ENVOI REWARD : Score=${score}, Level=${level}`);

    const response = await fetch(`${API_BASE_URL}/progress/claim-reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ score: score, level: level })
    });

    const data = await handleResponse(response);
    console.log("✅ [API] RÉPONSE REWARD :", data);
    return data;
}

export async function buyHpApi() {
    const response = await fetch(`${API_BASE_URL}/progress/buy-hp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
    return handleResponse(response);
}

export async function buyClassApi(classId) {
    const response = await fetch(`${API_BASE_URL}/progress/buy-class`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ class_id: classId })
    });
    return handleResponse(response);
}