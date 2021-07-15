const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = 5000

app.use(bodyParser.json());
app.use(cors());
const uri = "mongodb+srv://emaJhon:uwbnUSkllKXDqz9A@cluster0.nm9zd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJhonStore").collection("products");
    const ordersCollection = client.db("emaJhonStore").collection("orders");
    console.log('database connected');

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productsCollection.insertMany(product)
            .then(result => {
                res.send(result.insertCount > 0)
            })
    })
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })


    app.get('/product:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents)

            })

    })

    app.post('/addOrders', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })

});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)