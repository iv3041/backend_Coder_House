import fs from 'fs';
import express from 'express';
import ProductManager from './src/app.js';

const app = express()


let item = new ProductManager();

//info consigna
app.get('/', (req,res) => {
    res.send(`<div style="background: #210062;"><h1 style="text-align: center; color: white;">Desafio 3 - Server con express</h1>
    <h2 style="text-align: center; color: white;">Jorge Iván Mosquera palacios - Backend Coderhouse</h2></div>
    <h2>Consigna</h2>
    <p>Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.
    </p>
    <ul>
    <li>Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos.</li>
    <li>Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.</li>
    <li>El servidor debe contar con los siguientes endpoints:
    ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto.</li> 
    <li>Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
    Si no se recibe query de límite, se devolverán todos los productos
    Si se recibe un límite, sólo devolver el número de productos solicitados</li>
    <li>ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos.</li>
    </ul> <br>` )
})

//Lista productos según el id.
app.get('/products/:pid', (req, res) => {
    let productId = parseInt(req.params.pid);
    let products = JSON.parse(fs.readFileSync('productos.txt'));

    let product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});


//Lista los productos segun la cantidad solicitado por el limit
app.get('/products', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
  
  fs.readFile(`./productos.txt`, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server internal error');
      return;
    }
    
    const productos = JSON.parse(data);
    
    if (limit) {
      res.send(productos.slice(0, limit));
    } else {
      res.send(productos);
    }
  });
});


app.listen(3041, () => console.log('Server run on port 3041'))