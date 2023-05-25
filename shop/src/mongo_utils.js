import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();


export async function addProduct(newProduct) {
    const collection = client.db('shop').collection('products');
    collection.insertOne(newProduct);
}


export async function updateProduct(name, quantity) {
    const collection = client.db('shop').collection('products');
    const products = await collection.find({ name: name }).toArray();

    if (products.length != 1) {
        return 400;
    }

    const product = products[0];
    product.quantity = Math.max(0, product.quantity + quantity);
    collection.replaceOne({ _id: product._id }, product);
    return 200;
}


export async function sellProduct(personName, productName) {
    const productCollection = client.db('shop').collection('products');
    const products = await productCollection.find({ name: productName }).toArray();
    if (products.length != 1) {
        return 400;
    }
    const product = products[0];
    product.quantity = Math.max(0, product.quantity - 1);
    productCollection.replaceOne({ _id: product._id }, product);

    delete product._id;
    
    const peopleCollection = client.db('shop').collection('people');
    const people = await peopleCollection.find({ name: personName }).toArray();
    if (people.length != 1) {
        return 400;
    }
    const person = people[0];
    person.products.push(product);
    peopleCollection.replaceOne({ _id: person._id }, person);
}


export async function getProducts() {
    const collection = client.db('shop').collection('products');
    const products = await collection.find({}).toArray();
    const types = {};
    products.forEach(elem => {
        if (!(elem.type in Object.keys(types))) {
            types[elem.type] = [];
        }
        types[elem.type].push(elem.subtype);
    });
    return { data: products, types: types };
}


export async function getPeople() {
    const collection = client.db('shop').collection('people');
    const people = await collection.find({}).toArray();
    return people
}