const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    // console.table(data);
    displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        let card = document.createElement("section");
        let fullName = document.createElement('h2');
        let portrait = document.createElement('img');
        let birthInfo = document.createElement('div');
        let birthDate = document.createElement('p');
        let birthPlace = document.createElement('p');

        fullName.textContent = `${prophet.name} ${prophet.lastname}`
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', 'Portrait of ${prophet.name} ${prophet.lastname}');
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;
        birthInfo.appendChild(birthDate);
        birthInfo.appendChild(birthPlace);
        card.appendChild(fullName);
        card.appendChild(birthInfo);
        card.appendChild(portrait);

        card.classList.add("prophet-card");

        cards.appendChild(card);
    })
}

getProphetData()