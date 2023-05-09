//Desafio 3 BackEnd CoderHouse - Server con express
//Jorge Iván Mosquera Palacios
import {promises as fs} from "fs";

export default class ProductManager {

        constructor(){
            this.patch = "./productos.txt";
            this.products = []
        }
    
        static id = 0
    
        addProduct = async (title, description, price, thumbnail, code, stock) => {
            
    
                ProductManager.id++
            
                let newProduct = {
                    title, 
                    description, 
                    price, 
                    thumbnail, 
                    code, 
                    stock, 
                    id: ProductManager.id};
            
    
                    if (!Object.values(newProduct).includes(undefined)) {
                        //Autoincrementa el id del producto creado
                        this.products.push(newProduct)   
                        await fs.writeFile(this.patch, JSON.stringify(this.products));
                console.log("Added product")
                    }else{
                        console.log("Can not add the product, all the fields are requiered");
                    }
            };
        
    
        readProducts = async () => {
            let lectura = await fs.readFile(this.patch, "utf-8")
            return JSON.parse(lectura)
        };
    
        getProducts = async () => {
            let lectura2 = await this.readProducts()
            return console.log(lectura2)
        };
    
        getProductsById = async (id) => {
            let lectura3 = await this.readProducts()
            if(!lectura3.find((product) => product.id === id)) {
                console.log("Product no found");
            } else {
                console.log(lectura3.find((product) => product.id === id))
            }
        };
    
        updateProduct = async ({id,...productoUpd}) => {
            let lectura4 = await this.readProducts();
            let productFilter = lectura4.filter(products => products.id != id)
            await fs.writeFile(this.patch, JSON.stringify(productFilter));
            let firstProduct = await this.readProducts();
            let editProducts = [{...productoUpd, id}, ...firstProduct]; 
            await fs.writeFile(this.patch, JSON.stringify(editProducts));
            console.log ("Updated product")
        };
        
        deleteProductById = async (id) => {
            let lectura3 = await this.readProducts();
            let productFilter = lectura3.filter(products => products.id != id)
            await fs.writeFile(this.patch, JSON.stringify(productFilter));
            console.log ("Removed product")
        };
    
      
    }
    
    const productos = new ProductManager();

//Agregará el producto sin cuenta con todos los campos
/*productos.addProduct('iphone', '14 pro max', 5340000, 'https://example.com/producto1.jpg', 'apple1', 21);
productos.addProduct('iphone', '13 pro max', 4040000, 'https://example.com/producto2.jpg', 'apple2', 22);
productos.addProduct('ipad', '10 pro', 2740000, 'https://example.com/producto3.jpg', 'apple3', 43);
productos.addProduct('ipad', '12 pro', 4240000, 'https://example.com/producto4.jpg', 'apple4', 7);
productos.addProduct('imac', '24 M1', 3840000, 'https://example.com/producto4.jpg', 'apple5', 13);
productos.addProduct('imac', '27 M2', 4140000, 'https://example.com/producto6.jpg', 'apple6', 11);
productos.addProduct('airpod', 'Pro 3', 5540000, 'https://example.com/producto7.jpg', 'apple7', 27);
productos.addProduct('airpod', 'Pro', 6640000, 'https://example.com/producto8.jpg', 'apple8', 18);
productos.addProduct('macbook', '14 pro M1', 4840000, 'https://example.com/producto9.jpg', 'apple9', 53);
productos.addProduct('macbook', '16 pro M2', 5840000, 'https://example.com/producto10.jpg', 'apple10', 19);*/


//Llamado para leer productos en Array
//productos.getProducts()

//Buscamos para leer productos en Array por Id
//productos.getProductsById(2)

//Eliminamos por el ID del producto
//productos.deleteProductById(1)

//Actualizamos por el ID del producto
/*productos.updateProduct({
    title: 'iphone',
    description: '14 Pro max',
    price: 4800000,
    thumbnail: 'wwwasd',
    code: 'apple2',
    stock: 15,
    id: 2
  })*/
