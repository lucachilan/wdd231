import { dateFooter } from './date.mjs';
dateFooter();
import { dislpayNavigation } from './navigation.mjs';
dislpayNavigation();

import { discoverPlaces } from '../data/discover_data.mjs';

// Visitor message logic
const visitMessage = document.getElementById("visit-message");
const msToDays = 86400000;
const today = Date.now();
const lastVisit = localStorage.getItem("lastVisitDiscover");

if (!lastVisit) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const timeDiff = today - parseInt(lastVisit);
    if (timeDiff < msToDays) {
        visitMessage.textContent = "Back so soon! Awesome!";
    } else {
        const days = Math.floor(timeDiff / msToDays);
        visitMessage.textContent = `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
    }
}
localStorage.setItem("lastVisitDiscover", today);


// cards
const gridArea = document.querySelector(".area-grid");
discoverPlaces.forEach(place => {
    const card = document.createElement("div");
    card.classList.add("discover-card");
    const name = document.createElement("h2");
    name.textContent = place.name;
    card.appendChild(name);

    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = `images/places/${place.photo_url}`;
    // chamber\images\places\Sineriz_Shopping_Rivera.webp
    img.alt = `${place.name} logo`;
    img.loading = "lazy";
    figure.appendChild(img);
    card.appendChild(figure);

    const description = document.createElement("p");
    description.textContent = place.description;
    card.appendChild(description);

    const address = document.createElement("address");
    address.textContent = place.address;
    card.appendChild(address);

    const btn = document.createElement("button");
    btn.textContent = "Learn more";
    card.appendChild(btn);

    gridArea.appendChild(card);
})