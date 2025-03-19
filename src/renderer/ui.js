document.addEventListener('DOMContentLoaded', () => {
    // Initialize users
    const users = [
        { name: "John Doe", status: "online", username: "@john_doe" },
        { name: "Alice Smith", status: "offline", username: "@alice_smith" },
        { name: "Bob Johnson", status: "online", username: "@bob_j" }
    ];

    // Populate member lists
    const populateMembers = () => {
        const onlineList = document.getElementById('onlineMembers');
        const offlineList = document.getElementById('offlineMembers');
        
        onlineList.innerHTML = '';
        offlineList.innerHTML = '';

        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'member-item';
            li.dataset.context = 'user';
            li.dataset.username = user.name;
            li.innerHTML = `
                <div class="avatar">
                    <img src="profilepic/default.png" alt="${user.name[0]}">
                </div>
                <div>
                    <div>${user.name}</div>
                    <div class="user-status">${user.status}</div>
                </div>
            `;
            
            user.status === 'online' 
                ? onlineList.appendChild(li) 
                : offlineList.appendChild(li);
        });
    };

    // Setup sidebar toggles
    const toggleSidebar = document.querySelector('.toggle-sidebar');
    const toggleRightPanel = document.querySelector('.toggle-right-panel');
    const body = document.body;

    toggleSidebar.addEventListener('click', () => {
        body.classList.toggle('sidebar-hidden');
    });

    toggleRightPanel.addEventListener('click', () => {
        body.classList.toggle('right-panel-hidden');
    });

    // Blokovat systémové kontextové menu tam, kde nemá být žádné menu
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

    // Context menu handling
    let currentContextType = null;
    
    document.addEventListener('contextmenu', (e) => {
        // Zkontrolovat, zda kliknul na avatar nebo jméno uživatele v zprávě
        const messageUserPart = e.target.closest('.message-avatar, .message-username');
        
        // Pokud kliknul na část uživatele v zprávě, použij kontext 'user' místo 'message'
        if (messageUserPart && messageUserPart.closest('.message')) {
            e.preventDefault();
            currentContextType = 'user';
            
            const message = messageUserPart.closest('.message');
            const username = message.querySelector('.message-username').textContent;
            
            const contextMenu = document.getElementById('contextMenu');
            contextMenu.innerHTML = getContextMenuItems(currentContextType);
            contextMenu.dataset.targetUsername = username;
            
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;
            return;
        }
        
        // Standardní zpracování kontextového menu
        const target = e.target.closest('[data-context]');
        if (!target) return;
        
        e.preventDefault();
        currentContextType = target.dataset.context;
        
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.innerHTML = getContextMenuItems(currentContextType);
        
        if (target.dataset.username) {
            contextMenu.dataset.targetUsername = target.dataset.username;
        }
        
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    });

    const getContextMenuItems = (type) => {
        const icons = {
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
        
        const items = {
            message: ['Reply', 'Edit', 'Delete', 'Share'],
            user: ['Message', 'Block', 'Report', 'View Profile']
        };
        
        return items[type].map(item => {
            const action = item.toLowerCase().replace(' ', '_');
            const icon = icons[type][action];
            return `
                <div class="context-menu-item" data-action="${action}">
                    <img src="icons/${icon}" alt="${item}">
                    ${item}
                </div>
            `;
        }).join('');
    };

    // Profile modal handling
    const profileModal = document.getElementById('profileModal');
    
    const showProfile = (user, x, y) => {
        // Update profile content
        profileModal.querySelector('.profile-name').textContent = user.name;
        profileModal.querySelector('.profile-username').textContent = user.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`;
        
        // Position the modal
        profileModal.style.display = 'block';
        
        // Calculate position to ensure modal stays within viewport
        const modalWidth = profileModal.offsetWidth;
        const modalHeight = profileModal.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const leftPos = Math.min(x, viewportWidth - modalWidth - 10);
        const topPos = Math.min(y, viewportHeight - modalHeight - 10);
        
        profileModal.style.left = `${leftPos}px`;
        profileModal.style.top = `${topPos}px`;
    };

    // Close contexts on outside click but don't clear text selection
    document.addEventListener('click', (e) => {
        // Close context menu
        if (!e.target.closest('.context-menu')) {
            document.getElementById('contextMenu').style.display = 'none';
        }
        
        // Close profile modal if clicking outside
        if (!e.target.closest('.profile-modal') && document.getElementById('profileModal').style.display === 'block') {
            document.getElementById('profileModal').style.display = 'none';
        }
        
        // Odstraněno: Už ne odoznačování textu při kliknutí
    });

    // Show profile when clicking on any avatar (except in member list)
    document.addEventListener('click', (e) => {
        const avatar = e.target.closest('.avatar');
        const messageUsername = e.target.closest('.message-username');
        
        // Pokud kliknul na avatar nebo jméno uživatele v zprávě
        if ((avatar && !e.target.closest('.profile-modal') && !avatar.closest('.member-item')) || 
            messageUsername) {
            const userName = messageUsername ? messageUsername.textContent :
                           avatar.dataset.username || 
                           avatar.closest('[data-username]')?.dataset.username ||
                           "Unknown User";
            
            const user = users.find(u => u.name === userName) || {
                name: userName,
                username: `@${userName.toLowerCase().replace(/\s+/g, '_')}`,
                status: "unknown"
            };
            
            showProfile(user, e.clientX, e.clientY);
            e.stopPropagation();
        }
    });

    // Handle member list clicks (whole item triggers profile)
    document.querySelectorAll('.member-list').forEach(list => {
        list.addEventListener('click', (e) => {
            const memberItem = e.target.closest('.member-item');
            if (memberItem) {
                const userName = memberItem.dataset.username;
                const user = users.find(u => u.name === userName) || {
                    name: userName,
                    username: `@${userName.toLowerCase().replace(/\s+/g, '_')}`,
                    status: "unknown"
                };
                
                showProfile(user, e.clientX, e.clientY);
                e.stopPropagation();
            }
        });
    });

    // Handle context menu actions
    document.getElementById('contextMenu').addEventListener('click', (e) => {
        const actionItem = e.target.closest('.context-menu-item');
        if (!actionItem) return;
        
        const action = actionItem.dataset.action;
        const contextMenu = document.getElementById('contextMenu');
        const userName = contextMenu.dataset.targetUsername;

        if (action === 'view_profile' && userName) {
            const user = users.find(u => u.name === userName) || {
                name: userName,
                username: `@${userName.toLowerCase().replace(/\s+/g, '_')}`,
                status: "unknown"
            };
            
            showProfile(user, e.clientX, e.clientY);
        }
        
        console.log(`${action} action triggered on ${currentContextType}`);
        document.getElementById('contextMenu').style.display = 'none';
    });

    // Initialize members list
    populateMembers();
});