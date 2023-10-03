import {promises} from 'fs';

export default class CartManager {

    constructor(path){
        this.path=path;
    }

    getCarts = async () =>{
        try{
                const data = await promises.readFile(this.path, 'utf-8')
                const cart = JSON.parse(data);
                return cart;
        }
        catch(error){
            console.log(error);
            return [];
        }
    }

    addCart = async () => {
        try{
            const carts = await this.getCarts();

            if ( carts.length === 0 ){
                  carts.id = 1;
            }else{
                carts.id = carts[carts.length - 1].id + 1;
            }
            
            const products = [];
            
            carts.push({id:carts.id ,products});

            await promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

            return carts;
            
            }catch(error){
            console.log(error);
            return [];
            }  
        }

        getCartById = async (idCart) => {
            try{
                const carts = await this.getCarts()
                
                const cartIndex = carts.findIndex(cart => cart.id === idCart);
    
                if(cartIndex === -1){
                    console.log("Not Found");
                }else{
                    return carts[cartIndex];
                }
            }
    
            catch(error){
                console.log(error);
            }
            
        }

        addProductToCart = async (pId,cId) =>{
            try{
                const carts = await this.getCarts()
                
                const cartById = carts.find(item=> item.id === cId);
                if(!cartById){
                    console.log("Cart Not Found");
                }else{
                    const indexProductInCart = cartById.products.findIndex(product=> product.id === pId);
                if(indexProductInCart !== -1){
                    cartById.products[indexProductInCart].quantity = cartById.products[indexProductInCart].quantity+1;
                }else{
                    cartById.products.push({id: pId, quantity: 1});
                }

                await promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

                return cartById;
                }
                
            }
            catch(error){
                console.log(error);
            }
        }
}