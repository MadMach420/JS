"use strict";

const textArea = document.getElementById("text-area")
const textButton = document.getElementById("text-button")
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


class Product {
    constructor(name, type, subtype, photoUrl, price, description) {
        this.name = name;
        this.type = type;
        this.subtype = subtype;
        this.photoUrl = photoUrl;
        this.price = price;
        this.description = description;
        this.quantity = 1;
        this.key;
    }

    static fromArray(args) {
        return new Product(
            args[1], args[2], args[3], args[4], parseInt(args[5]), args[6]
        );
    }
}


function addNewProduct(inputArray) {
    const newProduct = Product.fromArray(inputArray);

    const transaction = db.transaction(["products"], "readwrite");
    transaction.objectStore("products").add(newProduct).onsuccess = (e) => {
        newProduct.key = e.target.result;
    };

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
            person = {name: personName, products: []};
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

    textArea.value = "";
}

function parseInput(e) {
    e.preventDefault();

    const lines = textArea.value.split("\n");
    lines.forEach(parseLine);

    textArea.value = "";
}

textButton.addEventListener("click", parseInput);
