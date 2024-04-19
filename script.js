function updateVisitCount() {
    let visitData = localStorage.getItem('visitData');

    if (!visitData) {
        visitData = { count: 0, lastVisit: new Date().toISOString() };
    } else {
        visitData = JSON.parse(visitData);
    }

    visitData.count++;
    visitData.lastVisit = new Date().toISOString();
    
    localStorage.setItem('visitData', JSON.stringify(visitData));
}

function getVisitInfo() {
    let visitData = localStorage.getItem('visitData');

    if (visitData) {
        visitData = JSON.parse(visitData);
        const lastVisitDate = new Date(visitData.lastVisit);
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const lastVisitFormatted = formatter.format(lastVisitDate);

        return `Esta página foi visitada ${visitData.count} vezes. A última visita foi: ${lastVisitFormatted}`;
    }

    return 'Esta é a primeira visita a esta página.';
}

function addVisitInfoToFooter() {
    const footer = document.querySelector('footer');

    const visitInfoParagraph = document.createElement('p');
    visitInfoParagraph.textContent = getVisitInfo();

    footer.appendChild(visitInfoParagraph);
}

async function main() {
    let evolucaoPokemon = new URLSearchParams(document.location.search).get("evolucao");
    document.querySelector("#title").textContent = "Página do " + evolucaoPokemon;

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolucaoPokemon}`);
    const pokemonData = await res.json();

    const imageLinks = Object.values(pokemonData.sprites)
        .filter(url => typeof url === 'string');

    const pokemonCard = document.querySelector("#pokemon-card");

    const image = document.createElement("img");
    image.src = imageLinks[0]; 
    image.alt = "Imagem do " + evolucaoPokemon;
    pokemonCard.appendChild(image);

    image.addEventListener('click', () => {
        const currentIndex = imageLinks.indexOf(image.src);
        const nextIndex = (currentIndex + 1) % imageLinks.length; 
        image.src = imageLinks[nextIndex];
    });

    const h3 = document.createElement("h3");
    h3.textContent = "Informações sobre o " + evolucaoPokemon;
    pokemonCard.appendChild(h3);

    updateVisitCount();
    addVisitInfoToFooter();
}

function enviar() {
    alert('Formulário enviado')
  }

  function enviar(e) {
    e.preventDefault()
  
    const form = e.target
    const formData = new FormData(form)
  
    console.log(formData.get('nome'))
      }
  

main();

