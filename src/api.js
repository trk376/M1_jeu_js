// src/api.js

// L'adresse de ton backend FastAPI
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Fonction d'aide pour gérer les erreurs HTTP
async function handleResponse(response) {
    if (!response.ok) {
        // On essaie de lire le message d'erreur JSON renvoyé par FastAPI
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur ${response.status}`);
    }
    // Si tout va bien, on renvoie les données JSON
    return response.json();
}

// Fonction utilitaire pour récupérer le token et créer l'en-tête d'autorisation
function getAuthHeader() {
    const token = localStorage.getItem('dungeon_token');
    if (!token) {
        // Si pas de token, on ne met pas d'en-tête Authorization
        return {};
    }
    // Si un token existe, on le prépare selon le standard Bearer
    return { 'Authorization': `Bearer ${token}` };
}

// ==========================================
// SECTION AUTHENTIFICATION
// ==========================================

// Inscription
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

// Connexion (Format OAuth2 standard : form-data)
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

// ==========================================
// SECTION SCORES & LEADERBOARD
// ==========================================

// Sauvegarder le score (Nécessite d'être connecté)
export async function saveScoreApi(scoreValue, levelReached) {
    const response = await fetch(`${API_BASE_URL}/scores/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader() // On ajoute le token ici
        },
        body: JSON.stringify({
            score_value: scoreValue,
            level_reached: levelReached
        }),
    });
    return handleResponse(response);
}

// Récupérer le leaderboard (Public)
export async function getLeaderboardApi(limit = 10) {
    const response = await fetch(`${API_BASE_URL}/scores/leaderboard?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return handleResponse(response);
}

// ==========================================
// SECTION PROGRESSION & RÉCOMPENSES (NOUVEAU)
// ==========================================

// Récupérer les infos de progression du joueur (PV max, classes...)
// C'est cette fonction qui manquait peut-être
export async function getMyProgressApi() {
    const response = await fetch(`${API_BASE_URL}/progress/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        }
    });
    return handleResponse(response);
}

// Réclamer la récompense de fin de partie
// ET CELLE-CI AUSSI (la cause de votre erreur)
export async function claimRewardApi() {
    const response = await fetch(`${API_BASE_URL}/progress/claim-reward`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        }
    });
    return handleResponse(response);
}