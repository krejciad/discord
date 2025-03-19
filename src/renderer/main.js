/**
 * main.js - Hlavní soubor aplikace
 * Inicializuje všechny moduly a spouští aplikaci
 */
import UserManager from './modules/UserManager.js';
import UIManager from './modules/UIManager.js';
import MessageManager from './modules/MessageManager.js';
import ContextMenu from './modules/ContextMenu.js';
import ProfileModal from './modules/ProfileModal.js';
import { closeContextElements } from './utils/DOMUtils.js';

/**
 * Hlavní inicializační funkce aplikace
 */
function initApp() {
    // Inicializace všech modulů
    UserManager.init();
    UIManager.init();
    MessageManager.init();
    ContextMenu.init();
    ProfileModal.init();
    
    // Nastavení globálního handleru pro zavření kontextových prvků při kliknutí mimo ně
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#contextMenu') && !e.target.closest('#profileModal')) {
            closeContextElements();
        }
    });
    
    // Nastavení posluchačů událostí pro interakce kanálů
    setupChannelInteractions();
    
    console.log('Aplikace byla inicializována.');
}

/**
 * Nastavení interakcí s kanály
 */
function setupChannelInteractions() {
    document.querySelectorAll('.channel-item').forEach(channel => {
        channel.addEventListener('click', () => {
            const channelName = channel.textContent.trim();
            MessageManager.changeChannel(channelName);
            
            // Aktualizace zobrazovaného názvu kanálu
            const channelHeader = document.querySelector('.chat-header h3');
            if (channelHeader) {
                channelHeader.textContent = channelName;
            }
        });
    });
}

// Čekat na načtení DOM před inicializací aplikace
document.addEventListener('DOMContentLoaded', initApp);