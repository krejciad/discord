/**
 * ProfileModal.js - Správa profilového modálního okna
 */
import UserManager from './UserManager.js';
import { positionElementInViewport, closeContextElements } from '../utils/DOMUtils.js';

/**
 * Třída pro správu profilového modálního okna
 */
class ProfileModal {
    constructor() {
        this.profileModalElement = null;
    }
    
    /**
     * Inicializace modálního okna profilu
     */
    init() {
        this.profileModalElement = document.getElementById('profileModal');
        this.setupProfileModalHandlers();
        this.setupProfileActionsHandlers();
    }
    
    /**
     * Nastavení obslužných funkcí pro kliknutí na avatary a jména uživatelů
     */
    setupProfileModalHandlers() {
        document.addEventListener('click', (e) => {
            const avatar = e.target.closest('.avatar');
            const messageUsername = e.target.closest('.message-username');
            
            // Pokud kliknul na avatar nebo jméno uživatele
            if ((avatar && !e.target.closest('.profile-modal') && !avatar.closest('.member-item')) || messageUsername) {
                const userName = messageUsername 
                    ? messageUsername.textContent 
                    : avatar.dataset.username || avatar.closest('[data-username]')?.dataset.username || "Unknown User";
                
                this.showUserProfile(userName, e.clientX, e.clientY);
                e.stopPropagation();
            }
        });
        
        // Zavření modálního okna profilu při kliknutí mimo něj
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-modal') && this.profileModalElement.style.display === 'block') {
                this.hideProfileModal();
            }
        });
        
        // Obsluha kliknutí na položky v seznamu členů
        document.querySelectorAll('.member-list').forEach(list => {
            list.addEventListener('click', (e) => {
                const memberItem = e.target.closest('.member-item');
                if (memberItem) {
                    const userName = memberItem.dataset.username;
                    this.showUserProfile(userName, e.clientX, e.clientY);
                    e.stopPropagation();
                }
            });
        });
    }
    
    /**
     * Nastavení obslužných funkcí pro tlačítka v profilu
     */
    setupProfileActionsHandlers() {
        // Zde můžete přidat obslužné funkce pro tlačítka v profilu
        const profileButtons = this.profileModalElement.querySelectorAll('.profile-action, .block-button');
        
        profileButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.classList.contains('block-button') ? 'block' : 'message';
                const username = this.profileModalElement.querySelector('.profile-name').textContent;
                
                console.log(`Profil: Akce ${action} pro uživatele ${username}`);
                this.hideProfileModal();
            });
        });
    }
    
    /**
     * Zobrazení modálního okna profilu uživatele
     * @param {string} userName - Jméno uživatele
     * @param {number} x - X souřadnice
     * @param {number} y - Y souřadnice
     */
    showUserProfile(userName, x, y) {
        const user = UserManager.findUser(userName);
        
        // Aktualizace obsahu modálního okna
        this.profileModalElement.querySelector('.profile-name').textContent = user.name;
        this.profileModalElement.querySelector('.profile-username').textContent = user.username;
        
        // Zobrazení a pozicování modálního okna
        this.profileModalElement.style.display = 'block';
        positionElementInViewport(this.profileModalElement, x, y);
    }
    
    /**
     * Skrytí modálního okna profilu
     */
    hideProfileModal() {
        this.profileModalElement.style.display = 'none';
    }
}

export default new ProfileModal();