 
import { map } from 'nanostores';

 
 
 
 
export const authStore = map({
    token: null,
    user: null,
});

 

 
export function initAuth() {
    const storedToken = localStorage.getItem('dungeon_token');
    const storedUser = localStorage.getItem('dungeon_username');

    if (storedToken && storedUser) {
        authStore.set({
            token: storedToken,
            user: { username: storedUser }
        });
        console.log("Auth: Utilisateur restauré depuis le stockage.");
    }
}

 
export function loginSuccess(token, username) {
    localStorage.setItem('dungeon_token', token);
    localStorage.setItem('dungeon_username', username);

    authStore.set({
        token: token,
        user: { username: username }
    });
    console.log(`Auth: ${username} connecté.`);
}

 
export function logout() {
    localStorage.removeItem('dungeon_token');
    localStorage.removeItem('dungeon_username');

    authStore.set({
        token: null,
        user: null
    });
    console.log("Auth: Déconnecté.");
}