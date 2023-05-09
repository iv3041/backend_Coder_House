const express = require('express');
const app = express();
const Contenedor = require('./contenedor')
const contenedor = new Contenedor("productos.json", ["id_pro","title", "description", "code", "price", "status","stock", "category","thumbnails"]);
const carrito = new Contenedor("carrito.json", ["id", "products"])


const dotenv = require('dotenv');
dotenv.config();
console.log(`Port... ${process.env.TOKEN}`);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const authMiddleware = app.use((req, res, next) => {
    req.header('authorization') == process.env.TOKEN 
        ? next()
        : res.status(401).json({"error": "Unauthorized"})
})

const routerProducts = express.Router();
const routerCart = express.Router();

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCart);

/* ------------------------ Product Endpoints ------------------------ */

// GET api/products
routerProducts.get('/', async (req, res) => {
    const products = await contenedor.getAll();
    res.status(200).json(products);
})

// GET api/products/:id_pro
routerProducts.get('/:id_pro', async (req, res) => {
    const { id_pro } = req.params;
    const product = await contenedor.getById(id_pro);
    
    product
        ? res.status(200).json(product)
        : res.status(400).json({"error": "Product not found"})
})

// POST api/products
routerProducts.post('/',authMiddleware, async (req,res, next) => {
    const {body} = req;
    
    body.id_pro = Date.now();
    
    const newProductId = await contenedor.save(body);
    
    newProductId
        ? res.status(200).json({"success" : "Product added with ID: "+newProductId})
        : res.status(400).json({"error": "Invalid key. Please verify the body content"})
})

// PUT api/products/:id_pro
routerProducts.put('/:id_pro', authMiddleware ,async (req, res, next) => {
    const {id_pro} = req.params;
    const {body} = req;
    const wasUpdated = await contenedor.updateById(id_pro,body);
    
    wasUpdated
        ? res.status(200).json({"success" : "Product updated"})
        : res.status(404).json({"error": "Product not found"})
})


// DELETE /api/products/:id_pro
routerProducts.delete('/:id_pro', authMiddleware, async (req, res, next) => {
    const {id_pro} = req.params;
    const wasDeleted = await contenedor.deleteById(id_pro);
    
    wasDeleted 
        ? res.status(200).json({"success": "Product successfully removed"})
        : res.status(404).json({"error": "Product not found"})
})

/* ------------------------ Cart Endpoints ------------------------ */

// POST /api/carts

routerCart.post('/', async(req, res) => {
    const {body} = req;
    
    body.id = Date.now();
    body.products = [];
    const newCartId = await carrito.save(body);
    
    newCartId
        ? res.status(200).json({"success" : "Cart added with ID: "+newCartId})
        : res.status(400).json({"error": "Invalid key. Please verify the body content"})
    
})

// DELETE /api/carts/id
routerCart.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const wasDeleted = await carrito.deleteById(id);
    
    wasDeleted 
        ? res.status(200).json({"success": "Cart successfully removed"})
        : res.status(404).json({"error": "Cart not found"})
})

// POST /api/carts/:id/products
routerCart.post('/:id/products', async(req,res) => {
    const {id} = req.params;
    const { body } = req;
    
    const product = await contenedor.getById(body['id']);
    
    if (product) {
        const cartExist = await carrito.addToArrayById(id, {"Products": product});
        cartExist
            ? res.status(200).json({"success" : "Product added"})
            : res.status(404).json({"error": "Cart not found"})
    } else {
        res.status(404).json({"error": "Product not found, verify the ID in the body content is correct."})
    }
})

// GET /api/carts/:id/products
routerCart.get('/:id/products', async(req, res) => {
    const { id } = req.params;
    const cart = await carrito.getById(id)
    
    cart
        ? res.status(200).json(cart.products)
        : res.status(404).json({"error": "Cart not found"})
})

// DELETE /api/carts/:id/products/:id_prod
routerCart.delete('/:id/products/:id_prod', async(req, res) => {
    const {id, id_prod } = req.params;
    const productExists = await contenedor.getById(id_prod);
    if (productExists) {
        const cartExists = await carrito.removeFromArrayById(id, id_prod, 'products')
        cartExists
            ? res.status(200).json({"success" : "Product removed"})
            : res.status(404).json({"error": "Cart not found"})
    } else {
        res.status(404).json({"error": "Product not found"})
    }
})

const port = 3041;
const server = app.listen(port, () => {
console.log(`Server run on port ${port}`)
})

server.on('error', (err) => console.log(err));