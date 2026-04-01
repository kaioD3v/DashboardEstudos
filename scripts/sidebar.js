/**
 * Sidebar.js - Funcionalidades da Barra Lateral
 * Gerencia navegação, highlight da página ativa e responsividade da sidebar
 */

// Elementos da sidebar
let sidebar;
let sidebarNav;
let menuToggle;

/**
 * Inicializa a sidebar e configura os eventos
 */
function initSidebar() {

    // Pega elementos somente depois do DOM existir
    sidebar = document.getElementById('sidebar');
    sidebarNav = document.getElementById('sidebar-nav');
    menuToggle = document.getElementById('menu-toggle');

    if (!sidebar) return;

    // Marca a página ativa
    highlightActivePage();
    
    // Toggle menu
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Responsividade
    window.addEventListener('resize', handleWindowResize);

    // Estado inicial responsivo
    handleWindowResize();
    
    // Eventos nav
    setupNavLinks();
}

/**
 * Destaca a página ativa na sidebar
 */
function highlightActivePage() {

    if (!sidebarNav) return;
    
    const currentPage = getCurentPageName();
    
    const navLinks = sidebarNav.querySelectorAll('a');

    navLinks.forEach(link => {

        link.classList.remove(
            'text-white',
            'bg-blue-600',
            'rounded'
        );

        link.classList.add('text-gray-400');

    });
    
    const activeLink = sidebarNav.querySelector(`a[data-page="${currentPage}"]`);

    if (activeLink) {

        activeLink.classList.remove('text-gray-400');

        activeLink.classList.add(
            'text-white',
            'bg-blue-600',
            'rounded'
        );

    }
}

/**
 * Obtém o nome da página atual
 */
function getCurentPageName() {

    const currentFile =
    window.location.pathname
    .split('/')
    .pop()
    .replace('.html','');
    
    const pageMap = {

        'index':'dashboard',
        'adicionar-materia':'adicionar-materia',
        'rotina':'rotina',
        'questoes':'questoes',
        'pendencias':'pendencias',
        'conta':'conta'

    };
    
    return pageMap[currentFile] || currentFile;
}

/**
 * Toggle sidebar
 */
function toggleSidebar() {

    if (!sidebar) return;

    sidebar.classList.toggle('closed');
}

/**
 * Responsividade
 */
function handleWindowResize() {

    if (!sidebar) return;

    if (window.innerWidth < 768) {

        sidebar.classList.add('closed');

    } else {

        sidebar.classList.remove('closed');

    }
}

/**
 * Eventos nav
 */
function setupNavLinks() {

    if (!sidebarNav) return;

    const navLinks =
    sidebarNav.querySelectorAll('a');
    
    navLinks.forEach(link => {

        link.addEventListener('click', () => {
            
            highlightActivePage();
                
            if (window.innerWidth < 768) {

                sidebar.classList.add('closed');

            }

        });

    });
}

/**
 * Helpers externos
 */
function getSidebarElement(selector) {

    return sidebar?.querySelector(selector);

}

function getSidebarElements(selector) {

    return sidebar?.querySelectorAll(selector);

}

/**
 * Add item nav
 */
function addNavItem(href,icon,label,dataPage){

    if(!sidebarNav) return;
    
    const navItem =
    document.createElement('a');

    navItem.href = href;

    navItem.className =
    'flex items-center gap-3 px-4 py-3 hover:text-white transition';

    navItem.setAttribute(
        'data-page',
        dataPage
    );

    navItem.innerHTML=
    `
    <i data-lucide="${icon}" class="w-5 h-5"></i>
    ${label}
    `;
    
    sidebarNav.appendChild(navItem);
    
    if(typeof lucide !== 'undefined'){

        lucide.createIcons();

    }
    
    setupNavLinks();
}

/**
 * Remove item nav
 */
function removeNavItem(dataPage){

    if(!sidebarNav) return;
    
    const item =
    sidebarNav.querySelector(
        `a[data-page="${dataPage}"]`
    );

    if(item){

        item.remove();

    }
}

// Init
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initSidebar
    );

} else {

    initSidebar();

}