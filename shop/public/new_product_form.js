const newName = document.querySelector("#name");
const newType = document.querySelector("#type");
const newSubtype = document.querySelector("#subtype");
const newPhotoUrl = document.querySelector("#photoUrl");
const newPrice = document.querySelector("#price");
const newDescription = document.querySelector("#description");
const sendProduct = document.querySelector("#send-form");
const formInputs = [newName, newType, newSubtype, newPhotoUrl, newPrice, newDescription];


sendProduct.addEventListener("click", (e) => {
    e.preventDefault();

    let validated = true;
    formInputs.forEach(elem => {
        if (!elem.value) validated = false;
    });

    if (validated) {
        const newProduct = new Product(
            newName.value,
            newType.value,
            newSubtype.value,
            newPhotoUrl.value,
            newPrice.value,
            newDescription.value
        );

        postNewProduct(newProduct);

        formInputs.forEach(elem => elem.value = "");
    }
})