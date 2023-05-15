import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', __dirname + '/views'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug'); // Use the 'Pug' template system
app.locals.pretty = app.get('env') === 'development'; // The resulting HTML code will be indented in the development environment
app.use(express.urlencoded({ extended: false }));

/* ************************************************ */

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

/* ******** */
/* "Routes" */
/* ******** */

app.get('*', async (request, response) => {
    const wydzial = request.originalUrl.slice(1);

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const collection = client.db('AGH').collection('students');
    const students = await collection.find({ wydzial: wydzial }).toArray();

    response.render('index', { students: students, mongo: true }); // Render the 'index' view
});


app.post('/', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(`Hello ${req.body.name}`);
});

/* ************************************************ */

app.listen(8000, function () {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
});          