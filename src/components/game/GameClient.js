import { uiStore } from "../../store.js";
import { authStore } from "../../authStore.js";
import { saveScoreApi, claimRewardApi, buyHpApi, buyClassApi } from "../../api.js";

function createCardHTML(card) {
    let icon = "❓", stats = "", borderColor = "border-stone-600 bg-stone-900/80", iconColor = "text-stone-400", valueColor = "text-stone-100";
    const value = card.effects[0].value;
    if (card.type === "monster") { icon = "👹"; borderColor = "border-red-900/60 bg-gradient-to-b from-stone-900/90 to-red-950/90"; iconColor = "text-red-700"; valueColor = "text-red-500"; stats = `ATK <span class="font-gothic text-3xl ${valueColor}">${value}</span>`; }
    else if (card.type === "weapon") { icon = "⚔️"; borderColor = "border-slate-700 bg-gradient-to-b from-stone-900/90 to-slate-900/90"; iconColor = "text-slate-400"; valueColor = "text-blue-400"; stats = `PWR <span class="font-gothic text-3xl ${valueColor}">${value.power}</span>`; }
    else if (card.type === "potion") { icon = "⚗️"; borderColor = "border-emerald-900/60 bg-gradient-to-b from-stone-900/90 to-emerald-950/90"; iconColor = "text-emerald-600"; valueColor = "text-emerald-400"; stats = `HEAL <span class="font-gothic text-3xl ${valueColor}">${value}</span>`; }
    return `<div class="${borderColor} w-40 h-60 border-[3px] rounded-md flex flex-col items-center p-2 transition-all duration-300 cursor-pointer shadow-lg relative group select-none backdrop-blur-sm"><div class="text-sm font-bold text-center h-10 flex items-center justify-center w-full border-b border-white/10 font-gothic text-stone-300">${card.name}</div><div class="flex-grow flex items-center justify-center text-6xl drop-shadow-md ${iconColor} opacity-90 group-hover:scale-110 transition-transform">${icon}</div><div class="w-full border-t border-white/10 pt-2 text-center text-xs uppercase tracking-widest text-stone-400">${stats}</div><div class="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-md"></div></div>`;
}

export class GameClient extends HTMLElement {
    constructor() {
        super();
        this.bgDoor = document.getElementById("bg-door");
        this.bgHall = document.getElementById("bg-hall");
        this.bgMort = document.getElementById("bg-mort");
        this.hasSavedScore = false;
        this.hasClaimedReward = false;

        this.unsubscribeUI = uiStore.subscribe(($store) => {
            this.updateBackground($store.currentScreen);
            this.handleGameOverProcesses($store, authStore.get());
            this.render($store, authStore.get());
        });

        this.unsubscribeAuth = authStore.subscribe(($auth) => {
            this.handleGameOverProcesses(uiStore.get(), $auth);
            this.render(uiStore.get(), $auth);
        });
    }

    disconnectedCallback() {
        this.unsubscribeUI();
        this.unsubscribeAuth();
    }

    async handleGameOverProcesses($store, $auth) {
        if ($store.currentScreen !== "GameOver") {
            this.hasSavedScore = false;
            this.hasClaimedReward = false;
            this.rewardMessage = null;
            return;
        }

        if (!$auth.user) return;

        if (!this.hasSavedScore && $store.finalScore > 0) {
            console.log("[UI] Sauvegarde du score...");
            this.hasSavedScore = true;
            try { await saveScoreApi($store.finalScore, $store.level); } catch (e) { console.error(e); }
        }

        if (!this.hasClaimedReward) {
            console.log("[UI] Demande de récompense...");
            this.hasClaimedReward = true;
            this.rewardMessage = "Calcul des âmes...";
            this.render($store, $auth);

            try {
                const reward = await claimRewardApi($store.finalScore, $store.level);
                console.log("[UI] Récompense reçue :", reward);
                this.rewardMessage = `🔮 ${reward.message}`;
                if (window.loadPlayerProgress) await window.loadPlayerProgress();
            } catch (e) {
                console.error("[UI] ERREUR Récompense :", e);
                this.rewardMessage = "Erreur récompense";
                this.hasClaimedReward = false;
            }
            this.render($store, $auth);
        }
    }

    updateBackground(screen) {
        const setV = (el, vis) => {
            if (el) {
                el.classList.toggle("bg-visible", vis);
                el.classList.toggle("bg-hidden", !vis);
            }
        };
        setV(this.bgDoor, ["MainMenu", "ClassSelection"].includes(screen));
        setV(this.bgHall, !["MainMenu", "ClassSelection", "GameOver"].includes(screen));
        setV(this.bgMort, screen === "GameOver");
    }

    render($store, $auth) {
        const screens = { Main: $store.currentScreen === "MainMenu", Class: $store.currentScreen === "ClassSelection", Over: $store.currentScreen === "GameOver", Game: !["MainMenu", "ClassSelection", "GameOver"].includes($store.currentScreen) };
        const btnStyle = "font-gothic px-8 py-3 bg-stone-800/90 border-2 border-stone-600 text-stone-300 text-xl hover:bg-stone-700 hover:border-stone-400 hover:text-white transition-all shadow-lg cursor-pointer backdrop-blur-sm";
        const shopBtnStyle = "shop-btn text-stone-300";
        const shopBtnDisabled = "shop-btn opacity-50 cursor-not-allowed";

        let gameOverHtml = $auth.user ? (this.hasSavedScore ? `<p class="text-emerald-500 mb-4 font-gothic text-sm">Score Sauvegardé</p>` : "") + (this.rewardMessage ? `<div class="mt-4 p-4 bg-purple-900/40 border border-purple-700 rounded"><p class="text-purple-200 font-gothic text-lg">${this.rewardMessage}</p></div>` : "") : `<button class="${btnStyle}" onclick="window.showLoginModal()">Se connecter</button>`;

        this.innerHTML = `
        <div class="${screens.Main ? "" : "hidden"} text-center p-8 max-w-2xl mx-auto mt-10">
            <h1 class="font-title text-7xl md:text-8xl mb-4 text-stone-200">SCOUNDREL</h1>
            <div class="w-32 h-1 bg-stone-700 mx-auto mb-12"></div>
            
            ${$auth.user ? `
                <div class="mb-8 p-6 bg-stone-900/80 border-2 border-stone-700 rounded-lg">
                    <div class="flex justify-between items-center mb-4 border-b border-stone-700 pb-2">
                        <span class="text-purple-400 font-gothic text-xl">🔮 ${$store.souls} Âmes</span>
                        <span class="text-red-400 font-gothic text-xl">❤️ ${$store.maxHealth} PV</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-left">
                        <div>
                            <div class="text-stone-400 text-sm mb-1">Améliorations</div>
                            <button class="${$store.souls < 100 ? shopBtnDisabled : shopBtnStyle}" 
                                onclick="window.buyHp()" ${$store.souls < 100 ? "disabled" : ""}>
                                +1 PV Max <span class="text-purple-400 float-right">100 🔮</span>
                            </button>
                        </div>
                        <div>
                            <div class="text-stone-400 text-sm mb-1">Classes (500 🔮)</div>
                            ${['tank', 'warlock', 'berserk', 'hunter'].map(c => {
            const unlocked = ($store.unlockedClasses || []).includes(c);
            if (unlocked) { return `<div class="class-owned">✅ ${c.charAt(0).toUpperCase() + c.slice(1)}</div>`; }
            return `<button class="${$store.souls < 500 ? shopBtnDisabled : shopBtnStyle}" 
                                    onclick="window.buyClass('${c}')" ${$store.souls < 500 ? "disabled" : ""}>
                                    ${c.charAt(0).toUpperCase() + c.slice(1)}
                                </button>`
        }).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="flex flex-col gap-4 items-center">
                <button class="${btnStyle} text-2xl px-12 py-4 border-4 double" onclick="window.game.currentState.onStartGame()">Entrer dans le Donjon</button>
                <button class="${btnStyle} text-lg px-8 py-2 border-amber-800 text-amber-500" onclick="window.showLeaderboardModal()">Classement 🏆</button>
            </div>
        </div>

        <div class="${screens.Class ? "" : "hidden"} text-center p-8 max-w-4xl">
            <h1 class="text-4xl mb-8 text-stone-200 font-gothic">Destinée</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${$store.classChoices.map(c => `<button class="p-6 bg-stone-900/80 border-2 border-stone-700 text-left hover:border-amber-600 transition-all group relative overflow-hidden cursor-pointer" onclick="window.game.currentState.onSelectClass('${c.id}')"><div class="absolute top-0 left-0 w-1 h-full bg-stone-700 group-hover:bg-amber-600 transition-colors"></div><div class="pl-4"><div class="text-2xl font-gothic text-amber-500 mb-2">${c.name}</div><div class="text-stone-300 text-sm">${c.description}</div></div></button>`).join("")}
            </div>
        </div>

        <div class="${screens.Over ? "" : "hidden"} fixed inset-0 z-50 flex flex-col items-center justify-center text-center backdrop-blur-sm">
            <h2 class="font-title text-9xl mb-4 text-red-700 tracking-widest scale-y-110">MORT</h2>
            <div class="mb-8 p-6 border-2 double border-stone-800 bg-stone-950/80 rounded-lg"><span class="text-stone-600 uppercase text-sm">Score</span><br><span class="text-5xl text-amber-600 font-title block">${$store.finalScore}</span></div>
            ${gameOverHtml}
            <button class="${btnStyle} mt-8" onclick="window.location.reload()">Nouvelle Vie</button>
        </div>
        
        <div class="${screens.Game ? "" : "hidden"} w-full max-w-5xl">
            <div class="stone-panel p-4 mb-8 flex flex-col md:flex-row justify-between items-center rounded-lg gap-4">
                <div class="flex items-center gap-6"><div class="text-center"><div class="text-xs text-stone-500 uppercase">Santé</div><div class="text-3xl font-gothic text-red-500">${$store.health} <span class="text-stone-600 text-lg">/ ${$store.maxHealth}</span></div></div><div class="w-px h-10 bg-stone-700 hidden md:block"></div><div class="text-center"><div class="text-xs text-stone-500 uppercase">Arme</div><div class="text-xl font-gothic ${$store.weapon ? "text-blue-400" : "text-stone-600"}">${$store.weapon ? `${$store.weapon.name} (${$store.weapon.power})` : "Mains nues"}</div></div></div>
                <div class="flex gap-6"><div class="text-right"><div class="text-xs text-stone-500 uppercase">Score</div><div class="text-2xl font-gothic text-amber-500">${$store.score}</div></div><div class="text-right"><div class="text-xs text-stone-500 uppercase">Salle</div><div class="text-2xl font-gothic text-purple-400">${$store.level}</div></div></div>
            </div>
            <div class="min-h-[350px] flex items-center justify-center"><div class="flex flex-wrap justify-center gap-6 perspective-1000">${this.renderRoom($store)}</div></div>
            <div class="mt-12 h-24 flex items-center justify-center gap-4">${this.renderActions($store, btnStyle, btnStyle)}</div>
        </div>`;
    }

    renderRoom($store) {
        if ($store.currentScreen === "RoomDecision") return $store.roomCards.map(c => `<div class="opacity-40 grayscale scale-90 pointer-events-none">${createCardHTML(c)}</div>`).join("");
        if ($store.currentScreen === "RoomPlaying") return $store.roomCards.map((c, i) => `<div class="card-hover" onclick="window.game.currentState.onSelectCard(window.game.roomAvailableCards[${i}])">${createCardHTML(c)}</div>`).join("");
        if ($store.currentScreen === "WeaponDecision") return `<div class="flex flex-col items-center animate-pulse"><div class="text-red-500 font-gothic text-xl mb-4 tracking-widest">CIBLE VERROUILLÉE</div>${createCardHTML($store.weaponDecision.monster)}</div>`;
        return "";
    }

    renderActions($store, btn, safe) {
        if ($store.currentScreen === "RoomDecision") return `<button class="font-gothic px-8 py-3 border-2 text-lg rounded bg-blue-950/80 border-blue-800 text-blue-200 hover:bg-blue-900" onclick="window.game.currentState.onFlee()" ${$store.isFleeDisabled ? "disabled" : ""}>Fuir</button><button class="font-gothic px-8 py-3 bg-red-950/80 border-2 border-red-800 text-red-100 text-lg rounded hover:bg-red-900" onclick="window.game.currentState.onFight()">COMBATTRE</button>`;
        if ($store.currentScreen === "RoomPlaying") return `<div class="text-xl text-stone-400 font-gothic bg-black/40 rounded px-4 py-2">Piochez encore <span class="text-stone-200 font-bold">${$store.roomPicksLeft}</span></div>`;
        if ($store.currentScreen === "WeaponDecision") return `<div class="flex flex-col items-center gap-4 p-6 stone-panel rounded-lg"><p class="text-lg text-stone-300">Utiliser Arme ?</p><div class="flex gap-4"><button class="font-gothic px-6 py-2 bg-emerald-950/80 border-2 border-emerald-800 text-emerald-200" onclick="window.game.currentState.onConfirmWeaponUse(true)">OUI</button><button class="font-gothic px-6 py-2 bg-red-950/80 border-2 border-red-800 text-red-200" onclick="window.game.currentState.onConfirmWeaponUse(false)">NON</button></div></div>`;
        return "";
    }
}

customElements.define("game-client", GameClient);