const button = document.getElementById("addBtn");
const container = document.getElementById("peopleContainer");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeModal");

let people = [];

// Додавання нової людини
button.addEventListener("click", function() {
    const surname = document.getElementById("surnameInput").value;
    const name = document.getElementById("nameInput").value;
    const patronymic = document.getElementById("patronymicInput").value;
    const year = document.getElementById("yearInput").value;

    if (name === "" || surname === "") {
        alert("Будь ласка, введіть хоча б прізвище та ім'я");
        return;
    }

    const person = {
        id: Date.now(),
        firstName: name,
        lastName: surname,
        patronymic: patronymic,
        birthYear: year
    };

    people.push(person);
    renderPeople();

    // Очищення полів
    document.getElementById("surnameInput").value = "";
    document.getElementById("nameInput").value = "";
    document.getElementById("patronymicInput").value = "";
    document.getElementById("yearInput").value = "";
});

// Функція відображення карток
function renderPeople() {
    container.innerHTML = "";

    people.forEach(function(person) {
        const card = document.createElement("div");
        card.classList.add("person-card");

        // Відкриваємо модальне вікно при кліку на картку
        card.onclick = function() {
            openModal(person);
        };

        card.innerHTML = `
            <h3>${person.lastName} ${person.firstName}</h3>
            <p>Рік народження: ${person.birthYear}</p>
            <button class="delete-btn" onclick="event.stopPropagation(); deletePerson(${person.id})">Видалити</button>
        `;

        container.appendChild(card);
    });
}

// Видалення людини
function deletePerson(id) {
    people = people.filter(p => p.id !== id);
    renderPeople();
}

// Відкриття анкети
function openModal(person) {
    document.getElementById("modalName").innerText = `${person.lastName} ${person.firstName} ${person.patronymic}`;
    document.getElementById("modalInfo").innerText = `Детальна інформація: народився у ${person.birthYear} році.`;
    modal.classList.remove("modal-hidden");
}

// Закриття анкети
closeBtn.onclick = function() {
    modal.classList.add("modal-hidden");
};

// Закриття при кліку поза вікном
window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.add("modal-hidden");
    }
};