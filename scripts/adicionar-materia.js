/**
 * Adicionar-Materia.js - Gerenciamento de Matérias
 * Adiciona, exibe e remove matériaS do dashboard
 */

const STORAGE_KEY = 'materias';

// Elementos do DOM
const formMateria = document.getElementById('form-materia');
const inputMateria = document.getElementById('materia');
const inputDescricao = document.getElementById('descricao');
const listaMateriasContainer = document.getElementById('lista-materias');
const vazioMensagem = document.getElementById('vazio-mensagem');

/**
 * Inicializa a página de adicionar matérias
 */
function initAdicionarMateria() {
    carregarMaterias();
    setupFormListener();
}

/**
 * Configura o listener do formulário
 */
function setupFormListener() {
    if (formMateria) {
        formMateria.addEventListener('submit', (e) => {
            e.preventDefault();
            adicionarMateria();
        });
    }
}

/**
 * Adiciona uma nova matéria
 */
function adicionarMateria() {
    const nome = inputMateria.value.trim();
    const descricao = inputDescricao.value.trim();

    if (!nome) {
        alert('Por favor, digite o nome da matéria!');
        return;
    }

    // Cria objeto da matéria
    const materia = {
        id: Date.now(),
        nome: nome,
        descricao: descricao,
        dataCriacao: new Date().toLocaleDateString('pt-BR')
    };

    // Salva no localStorage
    salvarMateria(materia);

    // Limpa o formulário
    formMateria.reset();
    inputMateria.focus();

    // Recarrega a lista
    carregarMaterias();
}

/**
 * Salva a matéria no localStorage
 * @param {Object} materia - Objeto da matéria a salvar
 */
function salvarMateria(materia) {
    const materias = obterMaterias();
    materias.push(materia);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
}

/**
 * Obtém todas as matérias do localStorage
 * @returns {Array} Array de matérias
 */
function obterMaterias() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

/**
 * Carrega e exibe todas as matérias
 */
function carregarMaterias() {
    const materias = obterMaterias();

    // Limpa a lista
    listaMateriasContainer.innerHTML = '';

    if (materias.length === 0) {
        vazioMensagem.style.display = 'block';
        return;
    }

    // Esconde a mensagem de vazio
    vazioMensagem.style.display = 'none';

    // Exibe cada matéria
    materias.forEach(materia => {
        const card = criarCardMateria(materia);
        listaMateriasContainer.appendChild(card);
    });

    // Recria os ícones do lucide para os novos elementos
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Cria um card para exibir uma matéria
 * @param {Object} materia - Matéria a exibir
 * @returns {Element} Card da matéria
 */
function criarCardMateria(materia) {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition relative';
    card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg text-gray-800 flex-1">${escaparHTML(materia.nome)}</h3>
            <button class="text-red-500 hover:text-red-700 transition p-1" onclick="removerMateria(${materia.id})" title="Remover">
                <i data-lucide="trash-2" class="w-5 h-5"></i>
            </button>
        </div>
        ${materia.descricao ? `<p class="text-gray-600 text-sm mb-3">${escaparHTML(materia.descricao)}</p>` : ''}
        <div class="text-xs text-gray-400 pt-3 border-t">
            Adicionado em: ${materia.dataCriacao}
        </div>
    `;

    return card;
}

/**
 * Remove uma matéria
 * @param {number} id - ID da matéria a remover
 */
function removerMateria(id) {
    if (confirm('Tem certeza que deseja remover esta matéria?')) {
        let materias = obterMaterias();
        materias = materias.filter(m => m.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
        carregarMaterias();
    }
}

/**
 * Remove todas as matérias (para uso futuro)
 */
function limparTodasAsMaterias() {
    if (confirm('Tem certeza que deseja remover TODAS as matérias? Esta ação não pode ser desfeita!')) {
        localStorage.removeItem(STORAGE_KEY);
        carregarMaterias();
    }
}

/**
 * Escapa caracteres HTML para evitar injeção
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
function escaparHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Exporta matérias como JSON (para backup)
 * @returns {string} JSON das matérias
 */
function exportarMaterias() {
    const materias = obterMaterias();
    return JSON.stringify(materias, null, 2);
}

/**
 * Importa matérias de um JSON
 * @param {string} jsonText - JSON com as matérias
 */
function importarMaterias(jsonText) {
    try {
        const materias = JSON.parse(jsonText);
        if (Array.isArray(materias)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
            carregarMaterias();
            alert('Matérias importadas com sucesso!');
        } else {
            alert('Formato inválido! Esperado um array.');
        }
    } catch (error) {
        alert('Erro ao importar: ' + error.message);
    }
}

// Inicia quando o DOM está pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAdicionarMateria();
        lucide.createIcons();
    });
} else {
    initAdicionarMateria();
    lucide.createIcons();
}
