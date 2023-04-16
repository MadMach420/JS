import fs from 'fs-extra';
import { argv, stdin as input, stdout as output } from 'node:process';
import { exec } from "child_process"
import { createInterface } from "readline"

function counter_sync() {
    let data = fs.readFileSync("./resources/counter.txt");
    data = parseInt(data.toString(), 10) + 1;
    console.log(`Liczba uruchomień: ${data}`);
    fs.writeFileSync("./resources/counter.txt", data.toString());
}


function counter_async() {
    fs.readFile("./resources/counter.txt", (err, data) => {
        if (err) throw err;
        data = parseInt(data.toString(), 10) + 1;
        console.log(`Liczba uruchomień: ${data}`);
        fs.writeFile("./resources/counter.txt", data.toString());
    });
}


if (argv[2] == "--sync") {
    counter_sync();
} else if (argv[2] == "--async") {
    counter_async();
} else if (!argv[2]) {
    console.log("Wprowadź komendy — naciśnięcie Ctrl+D kończy wprowadzanie danych");
    createInterface({ input, output }).question("> ", command => {
        exec(command, (err, result) => {
            if (err) throw err;
            console.log(result);
        });
    });
}
