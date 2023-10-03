import {promises} from 'fs';


export default class ProductManager {

    constructor(path){
        this.path=path;
    }

    getProducts = async () =>{
        try{
                const data = await promises.readFile(this.path, 'utf-8')
                const products = JSON.parse(data);
                return products;
        }
        catch(error){
            console.log(error);
            return [];
        }
    }

    addProducts = async (product) => {
        try{
            const products = await this.getProducts();

            if ( products.length === 0 ){
                product.id = 1;
            }else{
                product.id = products[products.length - 1].id + 1;
            }

            products.push(product);

                await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

                return product;
            
            }catch(error){
            console.log(error);
            return[];
            }  
        }

    getProductById = async (idProduct) => {
        try{
            const products = await this.getProducts()
            
            const productIndex = products.findIndex(product => product.id === idProduct);

            if(productIndex === -1){
                console.log("Not Found");
            }else{
                return products[productIndex];
            }
        }

        catch(error){
            console.log(error);
        }
        
    }

    deleteProduct = async (idProduct) => {
        try{
            let products = await this.getProducts();

            const productFilter = products.filter(product => product.id !== idProduct);

            products = productFilter;

            await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return(products);
        }

        catch(error){
            console.log(error);
        }
    }

    updateProduct = async (index, {id, ...product}) =>{
        try{
            let products = await this.getProducts();

            const updProduct = {id, ...product};

            products[index] = updProduct;
            
            await promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return(products);
        }
        catch(error){
            console.log(error);
        }
    }
}
