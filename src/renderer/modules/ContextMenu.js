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
                'report': 'icons8-report-100.png',
                'view_profile': 'icons8-profile-100.png'
            }
        };
        
        // Definice položek pro jednotlivé typy menu
        this.menuItems = {
            message: ['Reply', 'Edit', 'Delete', 'Share'],
            user: ['Message', 'Block', 'Report', 'View Profile']
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
        if (action === 'view_profile' && username) {
            ProfileModal.showUserProfile(username, event.clientX, event.clientY);
        } else {
            console.log(`${action} action triggered on ${this.currentContextType} for ${username}`);
        }
        
        this.hideContextMenu();
    }
}

export default new ContextMenu();