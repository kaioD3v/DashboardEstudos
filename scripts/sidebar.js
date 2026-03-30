/**
 * Sidebar.js - Funcionalidades da Barra Lateral
 * Gerencia navegação, highlight da página ativa e responsividade da sidebar
 */

// Elementos da sidebar
const sidebar = document.getElementById('sidebar');
const sidebarNav = document.getElementById('sidebar-nav');
const menuToggle = document.getElementById('menu-toggle');

/**
 * Inicializa a sidebar e configura os eventos
 */
function initSidebar() {
    // Marca a página ativa na sidebar
    highlightActivePage();
    
    // Adiciona evento para toggle da sidebar em telas pequenas
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Adiciona responsividade ao redimensionar janela
    window.addEventListener('resize', handleWindowResize);
    
    // Adiciona eventos de clique aos itens da sidebar
    setupNavLinks();
}

/**
 * Destaca a página ativa na sidebar
 */
function highlightActivePage() {
    if (!sidebarNav) return;
    
    // Pega a página atual do arquivo HTML
    const currentPage = getCurentPageName();
    
    // Remove destaque de todos os links
    const navLinks = sidebarNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.classList.remove('text-white', 'bg-blue-600');
        link.classList.add('text-gray-400');
    });
    
    // Adiciona destaque ao link da página atual
    const activeLink = sidebarNav.querySelector(`a[data-page="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.remove('text-gray-400');
        activeLink.classList.add('text-white', 'bg-blue-600', 'rounded');
    }
}

/**
 * Obtém o nome da página atual
 * @returns {string} Nome da página (baseado no arquivo HTML)
 */
function getCurentPageName() {
    const currentFile = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Mapeia nomes de arquivos para dados-page
    const pageMap = {
        'index': 'dashboard',
        'adicionar-materia': 'adicionar-materia',
        'rotina': 'rotina',
        'questoes': 'questoes',
        'pendencias': 'pendencias',
        'conta': 'conta'
    };
    
    return pageMap[currentFile] || currentFile;
}

/**
 * Alterna a visibilidade da sidebar em telas pequenas
 */
function toggleSidebar() {
    if (sidebar) {
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('block');
    }
}

/**
 * Gerencia responsividade ao redimensionar a janela
 */
function handleWindowResize() {
    const width = window.innerWidth;
    
    // Em telas pequenas, esconde a sidebar por padrão
    if (width < 768) {
        if (!sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
        }
    } else {
        // Em telas grandes, sempre mostra a sidebar
        sidebar.classList.remove('hidden');
    }
}

/**
 * Configura eventos de clique nos links de navegação
 */
function setupNavLinks() {
    const navLinks = sidebarNav?.querySelectorAll('a');
    
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Se não for link externo, destaca como ativo
                if (!link.href.endsWith('#')) {
                    highlightActivePage();
                }
                
                // Em telas pequenas, fecha a sidebar ao clicar
                if (window.innerWidth < 768) {
                    sidebar.classList.add('hidden');
                }
            });
        });
    }
}

/**
 * Função para acessar elementos da sidebar de outras scripts
 * @param {string} selector - Seletor CSS
 * @returns {Element|null} Elemento encontrado
 */
function getSidebarElement(selector) {
    return sidebar?.querySelector(selector);
}

/**
 * Função para acessar múltiplos elementos da sidebar
 * @param {string} selector - Seletor CSS
 * @returns {NodeList} ElementoS encontrados
 */
function getSidebarElements(selector) {
    return sidebar?.querySelectorAll(selector);
}

/**
 * Adiciona um novo item à navbar (para uso futuro)
 * @param {string} href - URL do link
 * @param {string} icon - Nome do ícone (lucide)
 * @param {string} label - Texto do link
 * @param {string} dataPage - Atributo data-page
 */
function addNavItem(href, icon, label, dataPage) {
    if (!sidebarNav) return;
    
    const navItem = document.createElement('a');
    navItem.href = href;
    navItem.className = 'flex items-center gap-3 px-4 py-3 hover:text-white transition';
    navItem.setAttribute('data-page', dataPage);
    navItem.innerHTML = `
        <i data-lucide="${icon}" class="w-5 h-5"></i> ${label}
    `;
    
    sidebarNav.appendChild(navItem);
    
    // Recria os ícones do lucide
    lucide.createIcons();
    
    // Reaplica os eventos
    setupNavLinks();
}

/**
 * Remove um item da navbar (para uso futuro)
 * @param {string} dataPage - Atributo data-page do item a remover
 */
function removeNavItem(dataPage) {
    if (!sidebarNav) return;
    
    const item = sidebarNav.querySelector(`a[data-page="${dataPage}"]`);
    if (item) {
        item.remove();
    }
}

// Inicia a sidebar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
} else {
    initSidebar();
}
