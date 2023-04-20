class Product {
    constructor(name, type, subtype, photoUrl, price, description) {
        this.name = name;
        this.type = type;
        this.subtype = subtype;
        this.photoUrl = photoUrl;
        this.price = price;
        this.description = description;
        this.quantity = 1;
        // this.key;
    }

    static fromArray(args) {
        return new Product(
            args[1], args[2], args[3], args[4], parseInt(args[5]), args[6]
        );
    }
}
