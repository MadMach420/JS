import express from 'express';
import { sellProduct, getProducts } from './mongo_utils.js';

export const buyerRouter = express.Router();

buyerRouter.get('/', (req, res) => {
    res.render('buyer');
});


buyerRouter.get('/data', async (req, res) => {
    const data = await getProducts();
    res.json(data);
});


buyerRouter.post('/buy', (req, res) => {
    sellProduct(req.body.personName, req.body.productName);
});
