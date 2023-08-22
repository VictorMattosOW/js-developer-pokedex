const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const modal = document.querySelector("dialog");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
            <a id="poke" class="pokemon ${
              pokemon.type
            }" data-pokemon='${JSON.stringify(pokemon)}'>
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types
                          .map(
                            (type) => `<li class="type ${type}">${type}</li>`
                          )
                          .join("")}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </a>
    `;
}

function convertPokemonDetailInModal(pokemon) {
  return `
        <div class="dialog">
            <div class="btn">
                <button onclick="closeModal()">x</button>
            </div>
            <div class="dialog_content">
                <img src=${pokemon.photo} class="img">
                <h3>${pokemon.name} nº ${pokemon.number}</h3>
                <div class="abilities_content">
                    <h3>Abilities</h3>
                    <div class="abilities">
                        <p>${pokemon.abilities[0].name}</p>
                        <p>${pokemon.abilities[1].name}</p>
                    </div>
                </div>
            </div>
        </div>
        `;
}

function closeModal() {
  modal.close();
}

function openModal(pokemon) {
  modal.innerHTML = convertPokemonDetailInModal(pokemon);
  modal.showModal();
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

pokemonList.addEventListener("click", (event) => {
  const clickedPokemon = event.target.closest("a.pokemon");
  if (clickedPokemon) {
    const pokemonData = clickedPokemon.getAttribute("data-pokemon");
    openModal(JSON.parse(pokemonData));
  }
});

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
