import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

const cartManager = new CartManager('./Cart.json');
const productManager = new ProductManager('./Products.json');

router.post('/', async(req,res) => {
    const cart = await cartManager.addCart();
    res.send({ status: 'success', payload: cart });
})

router.get('/:cid', async (req,res) => {
    const cId = Number(req.params.cid);
    const cartById = await cartManager.getCartById(cId);
    if(cartById){
        return res.send({ status: 'success', payload: cartById });
    }else{
        res.status(404).send({ status: 'error', error: 'No existe el carrito para el id ingresado' });
    }
})

router.post('/:cid/products/:pid', async (req,res) => {
    const pId = Number(req.params.pid);
    const cId = Number(req.params.cid);

    const product = await productManager.getProductById(pId);

    if(product){    
    const prodAdd = await cartManager.addProductToCart(pId,cId);
    if(prodAdd){
        return res.send({ status: 'success', payload: prodAdd });
    }else{
        return res.status(404).send({ status: 'error', error: 'Cart not found'});
    }
    }else{
        res.status(404).send( {status: 'error', error: 'Product not found'});
    }
})

export default router;