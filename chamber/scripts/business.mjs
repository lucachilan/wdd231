const url = "data/members.json"

const gridButton = document.querySelector(".show-grid");
const listButton = document.querySelector(".show-list");

function displayCompanies(companies) {
    const container = document.querySelector("#display-companies");
    gridButton.classList.add("toggled");

    companies.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("business-card");
        card.classList.add("grid-view");

        container.classList.add("grid-view");

        const name = document.createElement("h2");
        name.textContent = member.name;

        const address = document.createElement("p");
        address.textContent = member.address;


        const phone = document.createElement("p");
        phone.textContent = member.phone;

        const infodiv = document.createElement("div");
        infodiv.classList.add("infolist");

        const info = document.createElement("p");
        info.classList.add("info")
        info.textContent = member.information;

        const membership = document.createElement("p");
        membership.classList.add("membership")
        membership.textContent = `Membership level: ${member.membership_level}`;

        const img = document.createElement("img");
        img.src = member.image_src;
        img.alt = `${member.name} logo`;
        img.loading = "lazy";

        const link = document.createElement("a");
        link.href = member.website_url;
        link.textContent = "Visit Website";
        link.target = "_blank";


        card.appendChild(img);

        infodiv.appendChild(name);
        infodiv.appendChild(address);
        infodiv.appendChild(phone);
        infodiv.appendChild(info);
        infodiv.appendChild(link);
        infodiv.appendChild(membership);
        card.appendChild(infodiv);
        container.appendChild(card);

        gridButton.addEventListener("click", () => {
            gridButton.classList.add("toggled");
            listButton.classList.remove("toggled");
            card.classList.add("grid-view");
            card.classList.remove("list-view");
            container.classList.add("grid-view");
            container.classList.remove("list-view");
        });
        listButton.addEventListener("click", () => {
            listButton.classList.add("toggled");
            gridButton.classList.remove("toggled");
            card.classList.remove("grid-view");
            card.classList.add("list-view");
            container.classList.remove("grid-view");
            container.classList.add("list-view");
        });
    });
}

export async function getMembers() {
    const response = await fetch(url);
    const data = await response.json();

    displayCompanies(data.members);
}

export async function getMembersFiltered() {
    const response = await fetch(url);
    const data = await response.json();
    filterCompanies(data.members);
}

function filterCompanies(companies) {
    const compF = [];
    companies.forEach(member => {
        if (member.membership_level === "gold" || member.membership_level === "silver") {
            compF.push(member)
        }
    });
    const randomComps = compF.sort(() => 0.5 - Math.random()).slice(0, 3);
    displayCompaniesSpotligt(randomComps);
}

function displayCompaniesSpotligt(companies) {
    const container = document.querySelector(".bussiness-spotlights");

    companies.forEach(member => {
        const cardSpotlight = document.createElement("div");
        cardSpotlight.classList.add("card-spotlight");

        const name = document.createElement("h2");
        name.textContent = member.name;

        const tag = document.createElement("h3");
        tag.classList.add("tag");
        tag.textContent = member.information;

        const img = document.createElement("img");
        img.src = member.image_src;
        img.alt = `${member.name} logo`;
        img.loading = "lazy";

        const addresss = document.createElement("p");
        addresss.innerHTML = `<b>ADDRESS:</b> ${member.address}`;

        const phone = document.createElement("p");
        phone.innerHTML = `<b>PHONE:</b> ${member.phone}`;

        const membership = document.createElement("p");
        membership.classList.add("membership")
        membership.textContent = `Membership level: ${member.membership_level}`;

        const url = document.createElement("p");
        let cleanURL = member.website_url.replace("https://www.", "");
        cleanURL = cleanURL.split("/")[0];
        url.innerHTML = `<b>URL:</b> <a href="${member.website_url}" target="_blank">${cleanURL}</a>`;
        const organizationdiv = document.createElement("div");
        organizationdiv.classList.add("spotlight-info");


        cardSpotlight.appendChild(membership);
        cardSpotlight.appendChild(name);
        cardSpotlight.appendChild(tag);
        cardSpotlight.appendChild(img);
        organizationdiv.appendChild(addresss);
        organizationdiv.appendChild(phone);
        organizationdiv.appendChild(url);
        cardSpotlight.appendChild(organizationdiv);
        container.appendChild(cardSpotlight);
    });
}