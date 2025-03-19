/**
 * DOMUtils.js - Pomocné funkce pro práci s DOM elementy
 */

/**
 * Vytvoří DOM element podle zadaných parametrů
 * @param {string} tag - HTML tag prvku
 * @param {Object} attributes - Atributy prvku
 * @param {string|Node|Array} children - Obsah prvku (text, DOM Node nebo pole)
 * @returns {HTMLElement} - Vytvořený DOM element
 */
export function createElement(tag, attributes = {}, children = null) {
    const element = document.createElement(tag);
    
    // Přidání atributů
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Přidání obsahu
    if (children !== null) {
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof Node) {
                    element.appendChild(child);
                } else {
                    element.appendChild(document.createTextNode(String(child)));
                }
            });
        } else if (children instanceof Node) {
            element.appendChild(children);
        } else {
            element.textContent = String(children);
        }
    }
    
    return element;
}

/**
 * Bezpečně zavře všechny kontextové prvky (menu, modální okna)
 * @param {Array} exceptions - Seznam selektorů prvků, které nemají být zavřeny
 */
export function closeContextElements(exceptions = []) {
    const contextElements = [
        { selector: '#contextMenu', displayValue: 'none' },
        { selector: '#profileModal', displayValue: 'none' }
    ];
    
    contextElements.forEach(({ selector, displayValue }) => {
        if (!exceptions.includes(selector)) {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = displayValue;
            }
        }
    });
}

/**
 * Nastavení pozice prvku v rámci viewportu
 * @param {HTMLElement} element - Element k pozicování
 * @param {number} x - X souřadnice
 * @param {number} y - Y souřadnice
 */
export function positionElementInViewport(element, x, y) {
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const leftPos = Math.min(x, viewportWidth - elementWidth - 10);
    const topPos = Math.min(y, viewportHeight - elementHeight - 10);
    
    element.style.left = `${leftPos}px`;
    element.style.top = `${topPos}px`;
}