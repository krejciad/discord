/**
 * UserManager.js - Správa uživatelů a jejich stavů
 */

// Uživatelé aplikace a jejich stavy
const users = [
    { name: "John Doe", status: "online", username: "@john_doe" },
    { name: "Alice Smith", status: "offline", username: "@alice_smith" },
    { name: "Bob Johnson", status: "online", username: "@bob_j" }
];

/**
 * Třída pro správu uživatelů
 */
class UserManager {
    constructor() {
        this.users = users;
        this.onlineListElement = document.getElementById('onlineMembers');
        this.offlineListElement = document.getElementById('offlineMembers');
    }
    
    /**
     * Inicializace správce uživatelů
     */
    init() {
        this.populateMembers();
    }
    
    /**
     * Naplnění seznamů online a offline uživatelů
     */
    populateMembers() {
        this.onlineListElement.innerHTML = '';
        this.offlineListElement.innerHTML = '';
        
        this.users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'member-item';
            li.dataset.context = 'user';
            li.dataset.username = user.name;
            li.innerHTML = `
                <div class="avatar">
                    <img src="../../public/profilepic/default.png" alt="${user.name[0]}">
                </div>
                <div>
                    <div>${user.name}</div>
                    <div class="user-status">${user.status}</div>
                </div>
            `;
            
            user.status === 'online' 
                ? this.onlineListElement.appendChild(li) 
                : this.offlineListElement.appendChild(li);
        });
    }
    
    /**
     * Najde uživatele podle jména
     * @param {string} userName - Jméno hledaného uživatele
     * @returns {Object} - Nalezený uživatel nebo výchozí objekt
     */
    findUser(userName) {
        return this.users.find(u => u.name === userName) || {
            name: userName,
            username: `@${userName.toLowerCase().replace(/\s+/g, '_')}`,
            status: "unknown"
        };
    }
    
    /**
     * Přidá nového uživatele
     * @param {Object} user - Uživatelský objekt
     */
    addUser(user) {
        if (!this.users.some(u => u.name === user.name)) {
            this.users.push(user);
            this.populateMembers();
        }
    }
    
    /**
     * Změní stav uživatele
     * @param {string} userName - Jméno uživatele
     * @param {string} newStatus - Nový stav (online/offline)
     */
    updateUserStatus(userName, newStatus) {
        const user = this.users.find(u => u.name === userName);
        if (user) {
            user.status = newStatus;
            this.populateMembers();
        }
    }
}

export default new UserManager();