/**
 * MessageManager.js - Práce se zprávami
 */
import UIManager from './UIManager.js';

/**
 * Třída pro správu zpráv
 */
class MessageManager {
    constructor() {
        this.messages = [];
        this.currentChannel = '#general';
    }
    
    /**
     * Inicializace správce zpráv
     */
    init() {
        this.setupMessageHandling();
    }
    
    /**
     * Nastavení zpracování zpráv
     */
    setupMessageHandling() {
        UIManager.setupMessageSending((text) => {
            this.sendMessage(text);
        });
    }
    
    /**
     * Odeslání zprávy
     * @param {string} text - Text zprávy
     */
    sendMessage(text) {
        // V této demo verzi přidáváme zprávu pouze do UI
        // V reálné aplikaci by zde bylo volání API nebo P2P komunikace
        
        const message = {
            id: Date.now(),
            username: 'You',  // V reálné aplikaci by zde bylo jméno přihlášeného uživatele
            text: text,
            timestamp: new Date(),
            channel: this.currentChannel
        };
        
        this.messages.push(message);
        UIManager.addMessage(message);
    }
    
    /**
     * Změna aktivního kanálu
     * @param {string} channelName - Název kanálu
     */
    changeChannel(channelName) {
        this.currentChannel = channelName;
        this.loadChannelMessages(channelName);
    }
    
    /**
     * Načtení zpráv pro daný kanál
     * @param {string} channelName - Název kanálu
     */
    loadChannelMessages(channelName) {
        // Zde by bylo načítání zpráv z úložiště nebo serveru
        // Pro demo pouze aktualizujeme nadpis
        const channelHeader = document.querySelector('.chat-header h3');
        if (channelHeader) {
            channelHeader.textContent = channelName;
        }
    }
    
    /**
     * Přidání zprávy přijaté od jiného uživatele
     * @param {Object} messageData - Data zprávy
     */
    receiveMessage(messageData) {
        this.messages.push(messageData);
        
        // Přidání zprávy do UI, pouze pokud jsme v odpovídajícím kanálu
        if (messageData.channel === this.currentChannel) {
            UIManager.addMessage(messageData);
        }
    }
}

export default new MessageManager();