import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

const productManager = new ProductManager('./Products.json');

router.get('/', async (req,res) => {
    
    const products = await productManager.getProducts();
    
    if(products.length === 0){
        res.status(404).send({ status: 'error', error: 'File not found' });
    }else{
        const productLimit = [];
        const limit = req.query.limit;
        if(!limit){
            return res.send({ status: 'success', payload: products });
        }
        else if(limit <= products.length){
            for (let i = 0; i < limit; i++) {
                const product = products[i];
                productLimit.push(product);
            }
            return res.send({ status: 'success', payload: productLimit });
        }
        else{
            res.status(400).send({ status: 'error', error: 'Ha superado el limite de productos' });
        }
    }
    
});

router.get('/:pid', async (req,res) => {
    const pId = Number(req.params.pid);
    const productById = await productManager.getProductById(pId);
    if(productById){
        return res.send({ status: 'success', payload: productById });
    }else{
        res.status(404).send({ status: 'error', error: 'No existe el producto para el id ingresado' });
    }
});

router.post('/',async (req,res) => {
    const product = req.body;
    if( !product.title || !product.description || !product.code || !product.price || !product.status ||
        !product.stock || !product.category ){
        return res.status(400).send({ status: 'error', error: 'Some fields are missing' });
    }else{
        const products = await productManager.getProducts();
        const productCode = products.find ( products => products.code === product.code)
        if(productCode){
            return res.status(400).send( { status: 'error', error: `The code ${product.code} already exists`});
        }
    }
    await productManager.addProducts(product);
    res.send({ status: 'success', payload: product });
});

router.put('/:pid', async (req,res) => {
    const product = req.body;
    const pId = Number(req.params.pid);

    if( !product.title || !product.description || !product.code || !product.price || !product.status ||
        !product.stock || !product.category ){
        return res.status(400).send({ status: 'error', error: 'Some fields are missing' });
    }

    const products = await productManager.getProducts();

    const index = products.findIndex(product=> product.id === pId);

    if(index !== -1){
        await productManager.updateProduct(index, { id: pId, ...product });
        res.send({ status: 'success', message: 'Product Updated' });
    } else{
        res.status(404).send({ status: 'error', error: 'Product not  found' });
    }

});

router.delete('/:pid', async (req,res) => {
    const pId = Number(req.params.pid);

    const products = await productManager.getProducts();

    const index = products.findIndex(product=> product.id === pId);

    if (index !== -1){
        await productManager.deleteProduct(pId);
        res.send({ status: 'success', payload: products });
    }else{
        res.status(404).send({ status: 'error', error: 'Product not found' });
    }
});

export default router;