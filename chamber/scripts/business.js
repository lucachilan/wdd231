const url = "data/members.json"

const gridButton = document.querySelector(".show-grid");
const listButton = document.querySelector(".show-list");


async function getMembers() {
    const response = await fetch(url);
    const data = await response.json();

    displayCompanies(data.members);
}

getMembers();

function displayCompanies(companies) {
    const container = document.querySelector("#display-companies");
    companies.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("business-card")

        const name = document.createElement("h3");
        const img = document.createElement("img");
        const address = document.createElement("p");
        const phone = document.createElement("p");
        const info = document.createElement("p");
        info.classList.add("info")
        const link = document.createElement("a");
        const infodiv = document.createElement("div");
        infodiv.classList.add("infolist");

        name.textContent = member.name;
        address.textContent = member.adresses;
        phone.textContent = member.phone;
        info.textContent = member.information;

        img.src = member.image_src;
        img.alt = `${member.name} logo`;
        img.loading = "lazy";

        link.href = member.website_url;
        link.textContent = "Visit Website";
        link.target = "_blank";

        card.appendChild(img);

        infodiv.appendChild(name);
        infodiv.appendChild(address);
        infodiv.appendChild(phone);
        infodiv.appendChild(info);
        infodiv.appendChild(link);
        card.appendChild(infodiv);
        container.appendChild(card);
    });
}
gridButton.addEventListener("click", () => {
    gridButton.classList.add("toggled");
    listButton.classList.remove("toggled");
});
listButton.addEventListener("click", () => {
    listButton.classList.add("toggled");
    gridButton.classList.remove("toggled");
});