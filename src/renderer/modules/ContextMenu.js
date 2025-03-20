/**
 * ContextMenu.js - Funkcionalita kontextových menu
 */
import { positionElementInViewport, closeContextElements } from '../utils/DOMUtils.js';
import ProfileModal from './ProfileModal.js';

/**
 * Třída pro správu kontextových menu
 */
class ContextMenu {
    constructor() {
        this.contextMenuElement = null;
        this.currentContextType = null;
        
        // Definice ikon pro jednotlivé typy kontextových menu
        this.menuIcons = {
            message: {
                'reply': 'icons8-reply-100.png',
                'edit': 'icons8-edit-100.png',
                'delete': 'icons8-delete-100.png',
                'share': 'icons8-share-100.png'
            },
            user: {
                'message': 'icons8-message-100.png',
                'block': 'icons8-block-100.png',
                'remove': 'icons8-broken-heart-100.png',
                'profile': 'icons8-profile-100.png'
            }
        };
        
        // Definice položek pro jednotlivé typy menu
        this.menuItems = {
            message: ['Reply', 'Edit', 'Delete', 'Share'],
            user: ['Message', 'Block', 'Remove', 'Profile']
        };
    }
    
    /**
     * Inicializace kontextového menu
     */
    init() {
        this.contextMenuElement = document.getElementById('contextMenu');
        this.setupContextMenuHandlers();
        this.setupDocumentClickHandler();
    }
    
    /**
     * Nastavení obslužných funkcí pro kontextové menu
     */
    setupContextMenuHandlers() {
        // Obsluha kliknutí na prvky s atributem data-context
        document.addEventListener('contextmenu', (e) => {
            // Zkontrolovat, zda kliknul na avatar nebo jméno uživatele v zprávě
            const messageUserPart = e.target.closest('.message-avatar, .message-username');
            
            // Pokud kliknul na část uživatele v zprávě, použij kontext 'user' místo 'message'
            if (messageUserPart && messageUserPart.closest('.message')) {
                e.preventDefault();
                this.currentContextType = 'user';
                
                const message = messageUserPart.closest('.message');
                const username = message.querySelector('.message-username').textContent;
                
                this.contextMenuElement.innerHTML = this.getContextMenuItems(this.currentContextType);
                this.contextMenuElement.dataset.targetUsername = username;
                
                this.showContextMenu(e.pageX, e.pageY);
                return;
            }
            
            // Standardní zpracování kontextového menu
            const target = e.target.closest('[data-context]');
            if (!target) return;
            
            e.preventDefault();
            this.currentContextType = target.dataset.context;
            
            this.contextMenuElement.innerHTML = this.getContextMenuItems(this.currentContextType);
            
            if (target.dataset.username) {
                this.contextMenuElement.dataset.targetUsername = target.dataset.username;
            }
            
            this.showContextMenu(e.pageX, e.pageY);
        });
        
        // Obsluha kliknutí na položky kontextového menu
        this.contextMenuElement.addEventListener('click', (e) => {
            const actionItem = e.target.closest('.context-menu-item');
            if (!actionItem) return;
            
            const action = actionItem.dataset.action;
            const username = this.contextMenuElement.dataset.targetUsername;
            
            this.handleMenuAction(action, username, e);
        });
    }
    
    /**
     * Nastavení zavření kontextových menu při kliknutí mimo ně
     */
    setupDocumentClickHandler() {
        document.addEventListener('click', (e) => {
            // Zavření kontextového menu při kliknutí mimo něj
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });
    }
    
    /**
     * Zobrazení kontextového menu na zadaných souřadnicích
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     */
    showContextMenu(x, y) {
        this.contextMenuElement.style.display = 'block';
        positionElementInViewport(this.contextMenuElement, x, y);
    }
    
    /**
     * Skrytí kontextového menu
     */
    hideContextMenu() {
        this.contextMenuElement.style.display = 'none';
    }
    
    /**
     * Vytvoření HTML položek kontextového menu podle typu
     * @param {string} type - Typ kontextového menu (message/user)
     * @returns {string} - HTML kód položek menu
     */
    getContextMenuItems(type) {
        return this.menuItems[type].map(item => {
            const action = item.toLowerCase().replace(' ', '_');
            const icon = this.menuIcons[type][action];
            return `
                <div class="context-menu-item" data-action="${action}">
                    <img src="../../public/icons/${icon}" alt="${item}">
                    ${item}
                </div>
            `;
        }).join('');
    }
    
    /**
     * Zpracování akce z kontextového menu
     * @param {string} action - Akce k provedení
     * @param {string} username - Uživatelské jméno
     * @param {Event} event - Událost, která akci vyvolala
     */
    handleMenuAction(action, username, event) {
        // Zpracování jednotlivých akcí podle jejich typu
        switch (action) {
            case 'profile':
                this.handleProfileAction(username, event);
                break;
            case 'message':
                // Připraveno pro implementaci funkce odeslání zprávy
                this.handleMessageAction(username);
                break;
            case 'block':
                // Připraveno pro implementaci funkce blokování uživatele
                this.handleBlockAction(username);
                break;
            case 'remove':
                // Připraveno pro implementaci funkce nahlášení uživatele
                this.handleRemoveAction(username);
                break;
            case 'reply':
                // Připraveno pro implementaci funkce odpovědi na zprávu
                this.handleReplyAction();
                break;
            case 'edit':
                // Připraveno pro implementaci funkce úpravy zprávy
                this.handleEditAction();
                break;
            case 'delete':
                // Připraveno pro implementaci funkce smazání zprávy
                this.handleDeleteAction();
                break;
            case 'share':
                // Připraveno pro implementaci funkce sdílení zprávy
                this.handleShareAction();
                break;
            default:
                console.log(`${action} action triggered on ${this.currentContextType} for ${username}`);
        }
        
        this.hideContextMenu();
    }

    /**
     * Metoda pro obsluhu akce zobrazení profilu
     * @param {string} username - Uživatelské jméno
     * @param {Event} event - Událost, která akci vyvolala
     */
    handleProfileAction(username, event) {
        console.log(`Zobrazení profilu uživatele: ${username}`);
        // Implementace funkcionality zobrazení zprávy
        if (username) {
            // Použití ProfileModal pro zobrazení profilu uživatele
            ProfileModal.showUserProfile(username, event.clientX, event.clientY);
            console.log(`-Zobrazeno: ${username}`);
        }
    }
    
    /**
     * Metoda pro obsluhu akce odeslání zprávy
     * @param {string} username - Uživatelské jméno
     */
    handleMessageAction(username) {
        console.log(`Odesílání zprávy uživateli: ${username}`);
        // Implementace funkcionality odeslání zprávy
    }
    
    /**
     * Metoda pro obsluhu akce blokování uživatele
     * @param {string} username - Uživatelské jméno
     */
    handleBlockAction(username) {
        console.log(`Blokování uživatele: ${username}`);
        // Implementace funkcionality blokování uživatele
    }
    
    /**
     * Metoda pro obsluhu akce nahlášení uživatele
     * @param {string} username - Uživatelské jméno
     */
    handleRemoveAction(username) {
        console.log(`Odstranění uživatele: ${username}`);
        // Implementace funkcionality nahlášení uživatele
    }
    
    /**
     * Metoda pro obsluhu akce odpovědi na zprávu
     */
    handleReplyAction() {
        console.log('Odpověď na zprávu');
        // Implementace funkcionality odpovědi na zprávu
    }
    
    /**
     * Metoda pro obsluhu akce úpravy zprávy
     */
    handleEditAction() {
        console.log('Úprava zprávy');
        // Implementace funkcionality úpravy zprávy
    }
    
    /**
     * Metoda pro obsluhu akce smazání zprávy
     */
    handleDeleteAction() {
        console.log('Smazání zprávy');
        // Implementace funkcionality smazání zprávy
    }
    
    /**
     * Metoda pro obsluhu akce sdílení zprávy
     */
    handleShareAction() {
        console.log('Sdílení zprávy');
        // Implementace funkcionality sdílení zprávy
    }
}

export default new ContextMenu();