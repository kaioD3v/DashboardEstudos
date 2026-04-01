/**
 * Adicionar-Materia.js - Gerenciamento de Matérias
 */

const STORAGE_KEY = 'materias';

// Elementos (serão carregados depois do DOM)
let formMateria;
let inputMateria;
let listaMateriasContainer;
let vazioMensagem;

/**
 * Inicializa a página
 */
function initAdicionarMateria() {

    formMateria = document.getElementById('form-materia');
    inputMateria = document.getElementById('materia');
    listaMateriasContainer = document.getElementById('lista-materias');
    vazioMensagem = document.getElementById('vazio-mensagem');

    if (!formMateria) return;

    carregarMaterias();
    setupFormListener();
}

/**
 * Listener do formulário
 */
function setupFormListener() {

    if (!formMateria) return;

    formMateria.addEventListener('submit', (e) => {

        e.preventDefault();

        adicionarMateria();

    });

}

/**
 * Adiciona matéria
 */
function adicionarMateria() {

    if (!inputMateria) return;

    const nome = inputMateria.value.trim();

    if (!nome) {

        alert('Digite o nome da matéria');

        return;

    }

    const materia = {

        id: Date.now(),
        nome: nome,
        dataCriacao: new Date().toLocaleDateString('pt-BR')

    };

    salvarMateria(materia);

    formMateria.reset();

    inputMateria.focus();

    carregarMaterias();

}

/**
 * Salvar
 */
function salvarMateria(materia) {

    const materias = obterMaterias();

    materias.push(materia);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));

}

/**
 * Obter
 */
function obterMaterias() {

    const dados = localStorage.getItem(STORAGE_KEY);

    return dados ? JSON.parse(dados) : [];

}

/**
 * Carregar lista
 */
function carregarMaterias() {

    if (!listaMateriasContainer) return;

    const materias = obterMaterias();

    listaMateriasContainer.innerHTML = '';

    if (materias.length === 0) {

        if (vazioMensagem) {

            vazioMensagem.style.display = 'block';

        }

        return;

    }

    if (vazioMensagem) {

        vazioMensagem.style.display = 'none';

    }

    materias.forEach(materia => {

        const card = criarCardMateria(materia);

        listaMateriasContainer.appendChild(card);

    });

}

/**
 * Card
 */
function criarCardMateria(materia) {

    const card = document.createElement('div');

    card.className =
        'bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition relative';

    card.innerHTML = `
    
    <div class="flex justify-between items-start mb-2">
    
        <h3 class="font-bold text-lg text-gray-800 flex-1">
        ${escaparHTML(materia.nome)}
        </h3>

        <button 
        class="text-red-500 hover:text-red-700 transition p-1"
        onclick="removerMateria(${materia.id})"
        >
        
        <i data-lucide="trash-2" class="w-5 h-5"></i>
        
        </button>

    </div>

    <div class="text-xs text-gray-400 pt-3 border-t">

    Adicionado em: ${materia.dataCriacao}

    </div>

    `;

    return card;

}

/**
 * Remover
 */
function removerMateria(id) {

    if (!confirm('Remover matéria?')) return;

    let materias = obterMaterias();

    materias = materias.filter(m => m.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));

    carregarMaterias();

}

/**
 * Escapar HTML
 */
function escaparHTML(text) {

    const div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

}

/**
 * Start
 */
document.addEventListener('DOMContentLoaded', () => {

    initAdicionarMateria();

});