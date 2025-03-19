/**
 * UIManager.js - Správa základních UI prvků
 */

/**
 * Třída pro správu UI prvků
 */
class UIManager {
    constructor() {
        this.toggleSidebarButton = null;
        this.toggleRightPanelButton = null;
        this.body = document.body;
    }
    
    /**
     * Inicializace správce UI
     */
    init() {
        this.setupSidebarToggles();
        this.setupInputFocus();
        this.setupPreventDefaultContextMenus();
    }
    
    /**
     * Nastavení přepínačů pro boční panely
     */
    setupSidebarToggles() {
        this.toggleSidebarButton = document.querySelector('.toggle-sidebar');
        this.toggleRightPanelButton = document.querySelector('.toggle-right-panel');
        
        if (this.toggleSidebarButton) {
            this.toggleSidebarButton.addEventListener('click', () => {
                this.body.classList.toggle('sidebar-hidden');
            });
        }
        
        if (this.toggleRightPanelButton) {
            this.toggleRightPanelButton.addEventListener('click', () => {
                this.body.classList.toggle('right-panel-hidden');
            });
        }
    }
    
    /**
     * Nastavení reakcí na focus ve vstupním poli
     */
    setupInputFocus() {
        const messageInput = document.querySelector('.message-input-field');
        if (messageInput) {
            // Zde můžete přidat speciální efekty při zaměření na vstupní pole
        }
    }
    
    /**
     * Blokování systémového kontextového menu mimo textové prvky
     */
    setupPreventDefaultContextMenus() {
        document.addEventListener('contextmenu', (e) => {
            const hasSpecificContext = e.target.closest('[data-context]');
            const isMessageText = e.target.closest('.message-text');
            const isMessageInput = e.target.closest('.message-input-field');
            
            // Pokud není specifický kontext a není to text zprávy ani vstupní pole pro zprávu
            if (!hasSpecificContext && !isMessageText && !isMessageInput) {
                e.preventDefault();
                return;
            }
        });
    }
    
    /**
     * Přidání nové zprávy do chat okna
     * @param {Object} messageData - Data zprávy
     */
    addMessage(messageData) {
        const messagesContainer = document.querySelector('.messages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.dataset.context = 'message';
        
        const now = new Date();
        const timeString = `Today at ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <div class="avatar" data-username="${messageData.username}">
                    <img src="../../public/profilepic/default.png" alt="${messageData.username[0]}">
                </div>
            </div>
            <div class="message-body">
                <div class="message-header">
                    <span class="message-username">${messageData.username}</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <div class="message-text">${messageData.text}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * Nastavení zpracování zpráv při kliknutí na tlačítko odeslat
     * @param {Function} messageHandler - Funkce pro zpracování zprávy
     */
    setupMessageSending(messageHandler) {
        const inputField = document.querySelector('.message-input-field');
        const sendButton = document.querySelector('.send-button');
        
        if (inputField && sendButton) {
            // Funkce pro odeslání zprávy
            const sendMessage = () => {
                const text = inputField.value.trim();
                if (text) {
                    messageHandler(text);
                    inputField.value = '';
                }
            };
            
            // Nastavení událostí
            sendButton.addEventListener('click', sendMessage);
            
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
    }
}

export default new UIManager();