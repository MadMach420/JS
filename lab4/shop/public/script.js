const textArea = document.getElementById("text-area");
const textButton = document.getElementById("text-button");
const pc = document.querySelector("#pc");
const laptops = document.querySelector("#laptops");
const mice = document.querySelector("#mice");
const keyboards = document.querySelector("#keyboards");
let currentFilter = null;

let db;
const dbPromise = window.indexedDB.open("myshop", 2);

dbPromise.onupgradeneeded = (e) => {
    db = e.target.result;

    if (!db.objectStoreNames.contains("products")) {
        const productsStore = db.createObjectStore("products", { keyPath: "name" });
        productsStore.createIndex("name", "name", { unique: false });
    }

    if (!db.objectStoreNames.contains("people")) {
        db.createObjectStore("people", { keyPath: "name" });
    }
};

dbPromise.onerror = (e) => {
    console.error("Database error");
};

dbPromise.onsuccess = (e) => {
    db = e.target.result;
    console.log(db);
};


function addNewProduct(inputArray) {
    const newProduct = Product.fromArray(inputArray);

    postNewProduct(newProduct);

    console.log(newProduct);
}


function addExistingProduct(inputArray) {
    const name = inputArray[1];
    const quantity = inputArray[2];

    updateProduct(name, quantity);
}


function addProduct(inputArray) {
    if (inputArray.length === 3) {
        addExistingProduct(inputArray);
    } else if (inputArray.length === 7) {
        addNewProduct(inputArray);
    } else {
        console.error("Wrong number of arguments!");
    }
}


function sellProduct(inputArray) {
    if (inputArray.length != 4) console.error("Wrong number of arguments!");

    const personName = inputArray[1] + " " + inputArray[2];
    const productName = inputArray[3];

    sell(personName, productName);
}


function drawChart(people) {
    const labels = [];
    const data = [];
    for (let i = 0; i < people.length; i++) {
        let sum = people[i].products.reduce((accumulator, product) => accumulator + product.price, 0);
        labels.push(people[i].name);
        data.push(sum);
    }

    const context = document.getElementById("chart");

    if (Chart.getChart("chart")) {
        Chart.getChart("chart").destroy();
    }

    new Chart(context, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total money spent by customers',
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


async function salesBreakdown() {
    const people = await getPeople();

    if (people.length <= 3) {
        drawChart(people);
    } else {
        drawChart(people.slice(-3));
    }
}


function parseLine(line) {
    const inputArray = line.split(" ");
    switch (inputArray[0]) {
        case "add":
            addProduct(inputArray);
            break;

        case "sell":
            sellProduct(inputArray);
            break;

        case "sales_breakdown":
            salesBreakdown();
            break;

        default:
            console.error("Invalid command!");
            break;
    }

    updateDevices();

    textArea.value = "";
}

function parseInput(e) {
    e.preventDefault();

    const lines = textArea.value.split("\n");
    lines.forEach(parseLine);
}

textButton.addEventListener("click", parseInput);
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
    selectTypes(products.types);
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
