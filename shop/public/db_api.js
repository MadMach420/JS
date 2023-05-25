function postNewProduct(newProduct) {
    console.log(newProduct);
    fetch(`${document.URL}new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct)
    });
}


function updateProduct(name, quantity) {
    fetch(`${document.URL}update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, quantity: quantity })
    });
}


function sell(personName, productName) {
    fetch(`${document.URL}sell`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ personName: personName, productName: productName })
    });
}


async function getProducts() {
    return (await fetch(`${document.URL}data`)).json();
}


async function getPeople() {
    return (await fetch(`${document.URL}people`)).json();
}
