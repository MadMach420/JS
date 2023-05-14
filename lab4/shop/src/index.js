import http from 'node:http';
import { URL } from 'node:url';
import fs from 'fs-extra';
import { extname } from 'node:path';
import { getProducts, sellProduct, updateProduct, getPeople } from './json_utils.js';


http.createServer((request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method == 'POST') {
        let body = '';

        request.on('data', chunk => {
            body += chunk.toString();
        });

        request.on('close', () => {
            if (request.url == '/new') {
                const newProduct = JSON.parse(body);
                const filePath = `./resources/data/${newProduct.type}/${newProduct.subtype}.json`;

                if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({ products: [] }));

                fs.readFile(filePath, (err, data) => {
                    const content = JSON.parse(data);
                    content.products.push(newProduct);

                    fs.writeFile(filePath, JSON.stringify(content));
                });
            } 
            
            else if (request.url == '/update') {
                const params = JSON.parse(body);

                updateProduct(params.name, params.quantity);
            } 
            
            else if (request.url == '/sell') {
                const params = JSON.parse(body);
                
                sellProduct(params.personName, params.productName);
            }
        });
        response.statusCode = 200;
        response.end("ok");
    } 
    
    
    else if (request.method == 'GET') {
        console.log('request ', request.url);

        if (request.url == '/data') {
            const data = getProducts();

            response.statusCode = 200;
            response.end(JSON.stringify(data));
        }
        
        else if (request.url == '/people') {
            const data = getPeople();

            response.statusCode = 200;
            response.end(JSON.stringify(data));
        } 
        
        else {
            let filePath = request.url;

            if (filePath == '/') {
                filePath = 'public/index.html';
            }

            else {
                filePath = 'public' + request.url;
            }

            let ext = String(extname(filePath)).toLowerCase();
            let mimeTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpg',
                '.ico': 'image/x-icon'
            };
            let contentType = mimeTypes[ext] || 'text/html';

            fs.readFile(filePath, function (err, data) {
                if (err == null) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.write(data);
                    response.end();
                }
            });
        }
    }
}).listen(8000);