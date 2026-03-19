const url = "data/members.json"

const gridButton = document.querySelector(".show-grid");
const listButton = document.querySelector(".show-list");

function displayCompanies(companies) {
    const container = document.querySelector("#display-companies");
    gridButton.classList.add("toggled");

    companies.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("business-card");
        container.classList.add("grid-view");
        card.classList.add("grid-view");

        const name = document.createElement("h2");
        const img = document.createElement("img");
        const address = document.createElement("p");
        const phone = document.createElement("p");
        const info = document.createElement("p");
        info.classList.add("info")
        const membership = document.createElement("p");
        membership.classList.add("membership")
        const link = document.createElement("a");
        const infodiv = document.createElement("div");
        infodiv.classList.add("infolist");

        name.textContent = member.name;
        address.textContent = member.address;
        phone.textContent = member.phone;
        info.textContent = member.information;
        membership.textContent = `Membership level: ${member.membership_level}`;

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