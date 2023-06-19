const textArea = document.getElementById("text-area");
const textButton = document.getElementById("text-button");
let currentFilter = null;


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
}


textButton.addEventListener("click", parseInput);
