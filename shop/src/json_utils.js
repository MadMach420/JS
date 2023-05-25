import fs from 'fs-extra';


export function updateProduct(name, quantity) {
    fs.readdirSync("./resources/data").forEach(dir => {
        let dirPath = `./resources/data/${dir}`;

        fs.readdirSync(dirPath).forEach(jsonFile => {
            let jsonPath = `${dirPath}/${jsonFile}`;

            fs.readFile(jsonPath, (err, data) => {
                let jsonData = JSON.parse(data);

                jsonData.products = jsonData.products.map(elem => {
                    if (elem.name == name) {
                        elem.quantity = parseInt(elem.quantity) + parseInt(quantity);
                        console.log(quantity);
                        console.log(elem);
                    }
                    return elem;
                });

                fs.writeFile(jsonPath, JSON.stringify(jsonData));
            });
        });
    });
}


export function sellProduct(personName, productName) {
    fs.readdirSync("./resources/data").forEach(dir => {
        let dirPath = `./resources/data/${dir}`;

        fs.readdirSync(dirPath).forEach(jsonFile => {
            let jsonPath = `${dirPath}/${jsonFile}`;

            fs.readFile(jsonPath, (err, data) => {
                let jsonData = JSON.parse(data);

                jsonData.products = jsonData.products.map(elem => {
                    if (elem.name == productName) {
                        let quantity = parseInt(elem.quantity) - 1;
                        elem.quantity = 1;
                        findPersonAndSell(personName, elem);
                        elem.quantity = quantity;
                    }
                    return elem;
                });

                fs.writeFile(jsonPath, JSON.stringify(jsonData));
            });
        });
    });
}


function findPersonAndSell(personName, product) {
    fs.readFile("./resources/customers.json", (err, data) => {
        let customerFound = false;

        let jsonData = JSON.parse(data);
        jsonData.customers = jsonData.customers.map(elem => {
            if (elem.name = personName) {
                customerFound = true;
                elem.products.push(product);
            }
            return elem
        });

        if (!customerFound) {
            const newCustomer = { name: personName, products: [product] };
            jsonData.customers.push(newCustomer);
        }

        fs.writeFile("./resources/customers.json", JSON.stringify(jsonData));
    });
}


export function getProducts() {
    const data = [];
    const types = {};

    fs.readdirSync("./resources/data").forEach(dir => {
        let dirPath = `./resources/data/${dir}`;
        types[dir] = [];
        fs.readdirSync(dirPath).forEach(jsonFile => {
            let jsonPath = `${dirPath}/${jsonFile}`;
            types[dir].push(jsonFile.slice(0, -5));

            const jsonData = fs.readFileSync(jsonPath).toString();
            const products = JSON.parse(jsonData).products;
            data.push(...products);
        });
    });

    return { data: data, types: types };
}


export function getPeople() {
    const people = [];

    const jsonData = fs.readFileSync("./resources/customers.json");
    const customers = JSON.parse(jsonData).customers;
    people.push(...customers);

    return people;
}
