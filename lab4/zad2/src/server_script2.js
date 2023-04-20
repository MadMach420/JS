import http from 'node:http';
import { URL } from 'node:url';
import fs from 'fs-extra';
import { exec } from "child_process"

/**
 * Serwer do zadania 2 na 4 laboratorium z JS
 * 
 * @param {IncomingMessage} request - Input stream — contains data received from the browser, e.g,. encoded contents of HTML form fields.
 * @param {ServerResponse} response - Output stream — put in it data that you want to send back to the browser.
 */
function requestListener(request, response) {
    console.log(`The relative URL of the current request: ${request.url}`);
    console.log(`Access method: ${request.method}`);

    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === '/' && request.method === 'GET') {
        response.write(fs.readFileSync("src/index.html").toString());
        response.end();
    }

    if (request.method === 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('close', () => {
            const params = new URLSearchParams(body);

            if (params.get("type") == "sync") {
                response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

                let data = fs.readFileSync("resources/counter.txt");
                data = parseInt(data.toString(), 10) + 1;
                fs.writeFileSync("resources/counter.txt", data.toString());
        
                response.end(`Liczba uruchomien: ${data}`);
            } else if (params.get("type") == "async") {
                response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                
                fs.readFile("./resources/counter.txt", (err, data) => {
                    if (err) throw err;
                    data = parseInt(data.toString(), 10) + 1;
                    fs.writeFile("./resources/counter.txt", data.toString());
        
                    response.end(`Liczba uruchomien: ${data}`);
                });
            } else if (params.get("type") == "—") {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

                exec(params.get("text"), (err, result) => {
                    if (err) {
                        response.end("Encountered an error while executing command.");
                    } else {
                        response.end(`<pre>${result}<pre>`);
                    }
                });
            }
        });
    }
}


const server = http.createServer(requestListener); 
server.listen(8000);
console.log('The server was started on port 8000');
console.log('To stop the server, press "CTRL + C"');
