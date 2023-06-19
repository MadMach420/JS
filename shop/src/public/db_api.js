function postNewProduct(newProduct) {
    console.log(newProduct);
    fetch(`${window.location.href}/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ product: newProduct })
    });
}


function updateProduct(name, quantity) {
    fetch(`${window.location.href}/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, quantity: quantity })
    });
}


function sell(personName, productName) {
    fetch(`${window.location.href}/buy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ personName: personName, productName: productName })
    });
}


async function getProducts() {
    // return (await fetch(`http://${window.location.host}/data`)).json();
    return (await fetch(`${window.location.href}/data`)).json();
}


async function getPeople() {
    return (await fetch(`${window.location.href}/people`)).json();
}
