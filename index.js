const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//midleware
app.use(cors());
app.use(express.json());

//Database Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6rclh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//main funcationality
async function run(){

    try{

        await client.connect();
        const database = client.db('travelbooking')
        const bookingCollection = database.collection('booking');
        const ordersCollection = database.collection('orders')
        console.log('database is connected');

        //GET API
        app.get('/booking',async(req,res)=>{
            const cursor = bookingCollection.find({})
            const result = await cursor.toArray();
            res.json(result);
        });

        //POST API

        app.post('/booking',async(req,res)=>{
            const newService = req.body;
            const result = await bookingCollection.insertOne(newService)
            res.json(result);
        })

        //GET API (BY SINGLE ID)
        app.get('/booking/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id) }
            const booked = await bookingCollection.findOne(query);
            res.send(booked);
        });

        //order post method
        app.post('/orders',async(req,res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
           
        });

        //GET API for order mange
        app.get('/orders',async(req,res)=>{
            const cursor = ordersCollection.find({})
            const result = await cursor.toArray();
            res.json(result);
            
        });

        //FIND ORDER BY EMAIL
        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const result = await ordersCollection.find({ email: email }).toArray();
            res.json(result);
        });

        

    }
    finally{

    }

}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('This is Traveling-Vacation-website server');
});
app.listen(port,()=>{
    console.log('Server is Running',port);
});