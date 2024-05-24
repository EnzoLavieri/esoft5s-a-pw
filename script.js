function updateVisitCount() {
  let visitData = localStorage.getItem("visitData");

  if (!visitData) {
    visitData = { count: 0, lastVisit: new Date().toISOString() };
  } else {
    visitData = JSON.parse(visitData);
  }

  visitData.count++;
  visitData.lastVisit = new Date().toISOString();

  localStorage.setItem("visitData", JSON.stringify(visitData));
}

function getVisitInfo() {
  let visitData = localStorage.getItem("visitData");

  if (visitData) {
    visitData = JSON.parse(visitData);
    const lastVisitDate = new Date(visitData.lastVisit);
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const lastVisitFormatted = formatter.format(lastVisitDate);

    return `Esta página foi visitada ${visitData.count} vezes. A última visita foi: ${lastVisitFormatted}`;
  }

  return "Esta é a primeira visita a esta página.";
}

function addVisitInfoToFooter() {
  const footer = document.querySelector("footer");

  const visitInfoParagraph = document.createElement("p");
  visitInfoParagraph.textContent = getVisitInfo();

  footer.appendChild(visitInfoParagraph);
}

async function main() {
  let evolucaoPokemon = new URLSearchParams(document.location.search).get(
    "evolucao"
  );
  document.querySelector("#title").textContent = "Página do " + evolucaoPokemon;

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${evolucaoPokemon}`
  );
  const pokemonData = await res.json();

  const imageLinks = Object.values(pokemonData.sprites).filter(
    (url) => typeof url === "string"
  );

  const pokemonCard = document.querySelector("#pokemon-card");

  const image = document.createElement("img");
  image.src = imageLinks[0];
  image.alt = "Imagem do " + evolucaoPokemon;
  pokemonCard.appendChild(image);

  image.addEventListener("click", () => {
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
  alert("Formulário enviado");
}

function enviar(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  console.log(formData.get("nome"));
}

document.addEventListener("DOMContentLoaded", function () {
  const todoForm = document.getElementById("todo-form");
  const editDialog = document.getElementById("edit-dialog");
  const editForm = document.getElementById("edit-form");
  const cancelButton = document.getElementById("cancel-button");
  let currentEditIndex = null;

  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(todoForm);
    const title = formData.get("title");
    const description = formData.get("description");

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    todos.push({ title, description });

    localStorage.setItem("todos", JSON.stringify(todos));

    todoForm.reset();

    displayTodos();
  });

  cancelButton.addEventListener("click", function () {
    editDialog.close();
  });

  //   editForm.addEventListener("submit", function (event) {
  //     event.preventDefault();

  //     const formData = new FormData(editForm);
  //     const title = formData.get("edit-title");
  //     const description = formData.get("edit-description");

  //     let todos = JSON.parse(localStorage.getItem("todos")) || [];

  //     if (currentEditIndex !== null) {
  //       todos[currentEditIndex] = { title, description };
  //       localStorage.setItem("todos", JSON.stringify(todos));
  //       displayTodos();
  //       editDialog.close();
  //     }
  //   });
  // vai que voce pede na proxima aula, ja ta salvo o script de edit ;)

  function displayTodos() {
    const todoList = document.getElementById("todo-list");
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    todoList.innerHTML = "";

    todos.forEach((todo, index) => {
      const listItem = document.createElement("li");
      const titleHeading = document.createElement("h2");
      titleHeading.textContent = todo.title;
      const descriptionParagraph = document.createElement("p");
      descriptionParagraph.textContent = todo.description;
      const editButton = document.createElement("button");
      editButton.textContent = "✏️";
      editButton.classList.add("edit-button");
      editButton.title = "Editar tarefa";

      editButton.addEventListener("click", function () {
        currentEditIndex = index;
        editDialog.showModal();
        editForm.elements["edit-title"].value = todo.title;
        editForm.elements["edit-description"].value = todo.description;
      });

      listItem.appendChild(titleHeading);
      listItem.appendChild(descriptionParagraph);
      listItem.appendChild(editButton);

      todoList.appendChild(listItem);
    });
  }

  displayTodos();
});

window.addEventListener("beforeunload", () => {
  localStorage.removeItem("displayTodos");
});

main();
