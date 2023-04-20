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

    const transaction = db.transaction(["products"], "readwrite");
    transaction.objectStore("products").add(newProduct);

    console.log(newProduct);
}


function addExistingProduct(inputArray) {
    const name = inputArray[1];
    const quantity = inputArray[2];

    const productsStore = db.transaction(["products"], "readwrite").objectStore("products");

    productsStore.get(name).onsuccess = (e) => {
        const product = e.target.result;

        if (product) {
            product.quantity += parseInt(quantity);
            productsStore.put(product).onsuccess = (e) => {
                console.log(product);
            };
        } else {
            console.error("No existing product named " + name);
        }
    };
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
    let product;

    const transaction = db.transaction(["people", "products"], "readwrite")
    const peopleStore = transaction.objectStore("people");

    peopleStore.get(personName).onsuccess = (e) => {
        let person = e.target.result

        if (!person) {  // If person not in DB
            person = { name: personName, products: [] };
        }

        const productsStore = transaction.objectStore("products");
        productsStore.get(productName).onsuccess = (e) => {
            product = e.target.result;

            if (product && product.quantity > 0) {  // If product in DB and available (quantity > 0)
                product.quantity -= 1;
                productsStore.put(product);

                product.quantity = 1;
                person.products.push(product);

                peopleStore.put(person).onsuccess = (e) => {
                    console.log(person);
                };

            } else {
                console.error("No existing product named " + productName);
            }
        };
    };
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


function salesBreakdown() {
    const req = db.transaction(["people"], "readonly").objectStore("people").getAll();
    req.onsuccess = (e) => {
        const people = e.target.result;

        if (people.length <= 3) {
            drawChart(people);
        } else {
            drawChart(people.slice(-3));
        }
    };
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

function updateDevices() {
    const req = db.transaction(["products"], "readonly").objectStore("products").getAll();
    req.onsuccess = (e) => {
        window.dispatchEvent(new CustomEvent("updateDevices", { detail: e.target.result }))
    };
}


pc.addEventListener("click", () => {
    const newFilter = { type: "Komputer", subtype: "PC" };
    setNewFilter(newFilter);
});
laptops.addEventListener("click", () => {
    const newFilter = { type: "Komputer", subtype: "Laptop" };
    setNewFilter(newFilter);
});
mice.addEventListener("click", () => {
    const newFilter = { type: "Akcesoria", subtype: "Myszka" };
    setNewFilter(newFilter);
});
keyboards.addEventListener("click", () => {
    const newFilter = { type: "Akcesoria", subtype: "Klawiatura" };
    setNewFilter(newFilter);
});


function setNewFilter(newFilter) {
    if (currentFilter && currentFilter.type == newFilter.type && currentFilter.subtype == newFilter.subtype) {
        currentFilter = null;
    } else {
        currentFilter = newFilter;
    }

    window.dispatchEvent(new CustomEvent("setFilter", { detail: currentFilter }));
}