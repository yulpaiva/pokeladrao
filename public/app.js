// Função para alternar a exibição do formulário
document.getElementById('showFormButton').addEventListener('click', () => {
    const formContainer = document.getElementById('pokemonFormContainer');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block'; // Exibe o formulário
        document.getElementById('showFormButton').textContent = 'Cancelar Cadastro'; // Muda o texto do botão
    } else {
        formContainer.style.display = 'none'; // Esconde o formulário
        document.getElementById('showFormButton').textContent = 'Cadastrar Pokémon'; // Restaura o texto do botão
    }
});

// Função para cadastrar Pokémon
document.getElementById('pokemonForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('type', document.getElementById('type').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('image', document.getElementById('image').files[0]);
    formData.append('height', document.getElementById('height').value);
    formData.append('weight', document.getElementById('weight').value);
    formData.append('abilities', document.getElementById('abilities').value);
    formData.append('baseExperience', document.getElementById('baseExperience').value);

    try {
        const response = await fetch('/api/pokemons', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar Pokémon'); // Lança um erro se a resposta não for 2xx
        }

        const pokemon = await response.json();
        alert('Indivíduo cadastrado com sucesso!');
        loadPokemons();
    } catch (error) {
        console.error(error);
        alert('Erro ao cadastrar Pokémon: ' + error.message);
    }
});

// Função para carregar Pokémons cadastrados
async function loadPokemons() {
    try {
        const response = await fetch('/api/pokemons');
        if (!response.ok) {
            throw new Error('Erro ao carregar Pokémons'); // Lança um erro se a resposta não for 2xx
        }

        const pokemons = await response.json();
        const pokemonList = document.getElementById('pokemonList');
        pokemonList.innerHTML = '';

        pokemons.forEach((pokemon) => {
            console.log(pokemon); // Verifique a estrutura do objeto Pokémon
            const card = document.createElement('div');
            card.classList.add('pokemon-card');
            card.innerHTML = `
                <h3>${pokemon.name}</h3>
                <img src="${pokemon.imageUrl}" alt="${pokemon.name}" class="pokemon-image">
                <p><strong>Tipo:</strong> ${pokemon.type}</p>
                <p><strong>Descrição:</strong> ${pokemon.description}</p>
                <p><strong>Altura:</strong> ${pokemon.height} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight} kg</p>
                <p><strong>Habilidades:</strong> ${pokemon.abilities.join(', ')}</p>
                <p><strong>Experiência Base:</strong> ${pokemon.baseExperience}</p>
                <button class="delete-button" data-id="${pokemon._id}">Apagar</button>
            `;
            pokemonList.appendChild(card);
        });

        // Adiciona evento de clique a cada botão de apagar
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const pokemonId = event.target.getAttribute('data-id'); // Captura o _id do Pokémon
                console.log(`ID do Pokémon a ser apagado: ${pokemonId}`); // Adicione este log
                if (pokemonId) {
                    await deletePokemon(pokemonId); // Passa o ID corretamente para a função
                } else {
                    alert('ID do Pokémon não encontrado.');
                }
            });
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar Pokémons: ' + error.message);
    }
}

// Função para deletar Pokémon
async function deletePokemon(pokemonId) {
    try {
        const response = await fetch(`/api/pokemons/${pokemonId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Pokémon apagado com sucesso!');
            loadPokemons(); // Recarrega a lista de Pokémons
        } else {
            throw new Error('Erro ao apagar Pokémon'); // Lança um erro se a resposta não for 2xx
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao apagar Pokémon: ' + error.message);
    }
}

// Função para pesquisar Pokémons pelo nome
document.getElementById('searchInput').addEventListener('input', () => {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.pokemon-card');

    cards.forEach(card => {
        const pokemonName = card.querySelector('h3').textContent.toLowerCase();
        if (pokemonName.includes(searchValue)) {
            card.style.display = 'block'; // Exibe o card se o nome incluir o valor da pesquisa
        } else {
            card.style.display = 'none'; // Esconde o card se não incluir
        }
    });
});

// Alternância do modo escuro
const toggleDarkModeButton = document.getElementById('toggleDarkMode');

// Função para aplicar o modo escuro baseado no armazenamento local
function applyDarkMode() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        toggleDarkModeButton.textContent = 'Modo Claro';
    } else {
        document.body.classList.remove('dark-mode');
        toggleDarkModeButton.textContent = 'Modo Escuro';
    }
}

toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Salva o estado no armazenamento local
    localStorage.setItem('darkMode', isDarkMode);
    toggleDarkModeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Escuro';
});

// Aplicar o modo escuro ao carregar a página
applyDarkMode();

// Carrega os Pokémons ao iniciar
loadPokemons();
