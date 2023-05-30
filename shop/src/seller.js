import express from 'express';
import { getPeople, addProduct, updateProduct } from './mongo_utils.js';

export const sellerRouter = express.Router();

sellerRouter.get('/', (req, res) => {
    res.render('seller');
});


sellerRouter.get('/people', async (req, res) => {
    const data = await getPeople();
    res.json(data);
});


sellerRouter.post('/new', (req, res) => {
    const newProduct = req.body.product;
    addProduct(newProduct);
});


sellerRouter.post('/update', (req, res) => {
    updateProduct(req.body.name, req.body.quantity);
});
