import express from 'express';
import morgan from 'morgan';
import { buyerRouter } from './buyer.js';
import { sellerRouter } from './seller.js';


const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));

app.use("/buyer", buyerRouter);
app.use("/seller", sellerRouter);


app.get('/', (req, res) => {
    res.redirect('/buyer');
});


app.listen(8000);
