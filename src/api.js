 

 
const API_BASE_URL = 'http://127.0.0.1:8000/api';

 
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Une erreur est survenue');
    }
    return response.json();
}

 
 
 
function getAuthHeader() {
    const token = localStorage.getItem('dungeon_token');
    if (!token) return {};
     
    return { 'Authorization': `Bearer ${token}` };
}

 

export async function registerUser(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
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
        headers: {
             
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });
    return handleResponse(response);
}

 

 
export async function saveScoreApi(scoreValue, levelReached) {
    const response = await fetch(`${API_BASE_URL}/scores/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
             
            ...getAuthHeader()
        },
        body: JSON.stringify({
            score_value: scoreValue,
            level_reached: levelReached
        }),
    });
    return handleResponse(response);
}

 
export async function getLeaderboardApi(limit = 10) {
    const response = await fetch(`${API_BASE_URL}/scores/leaderboard?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return handleResponse(response);
}