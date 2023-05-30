let currentFilter = null;


window.addEventListener("devicesContainerLoaded", updateDevices);


function setTypes(types) {
    const ul = document.querySelector("#navbar-nav-ul");
    while (ul.firstChild) ul.removeChild(ul.lastChild);

    for (const [type, subtypes] of Object.entries(types)) {
        const li = document.createElement("li");
        li.classList.add("nav-item", "dropdown");

        li.innerHTML = `<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
        aria-expanded="false">
        ${type}
        </a>`

        const dropdown = document.createElement("ul");
        dropdown.classList.add("dropdown-menu");

        subtypes.forEach(subtype => {
            const dropdownLi = document.createElement("li");
            dropdownLi.classList.add("dropdown-item");
            const text = document.createTextNode(subtype);
            dropdownLi.appendChild(text);

            dropdownLi.addEventListener("click", () => {
                const newFilter = { type: type, subtype: subtype };
                setNewFilter(newFilter);
            });

            dropdown.appendChild(dropdownLi);
        });

        li.appendChild(dropdown);
        ul.appendChild(li);
    }
}


async function updateDevices() {
    const products = await getProducts();

    setTypes(products.types);
    window.dispatchEvent(new CustomEvent("updateDevices", { detail: products.data }));
}


function setNewFilter(newFilter) {
    if (currentFilter && currentFilter.type == newFilter.type && currentFilter.subtype == newFilter.subtype) {
        currentFilter = null;
    } else {
        currentFilter = newFilter;
    }

    window.dispatchEvent(new CustomEvent("setFilter", { detail: currentFilter }));
}
